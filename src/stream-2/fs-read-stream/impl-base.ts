import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import type { T } from '../lib';

class FSReadStream extends EventEmitter {
  public flowing: boolean;
  public path: string;
  private options: Required<T.ReadStreamOptions>;
  private fd: number;
  private offset: number; // 从文件的何处开始读取

  constructor(path: string, options?: T.ReadStreamOptions) {
    super();

    this.flowing = false;
    this.path = path;
    this.options = {
      highWaterMark: 64 * 1024,
      start: 0,
      autoClose: true,
      emitClose: true,
      encoding: 'binary',
      end: undefined,
      fd: undefined,
      flags: 'r',
      mode: 667,
      ...options,
    };
    this.fd = typeof options.fd === 'object' ? options.fd.fd : options.fd;
    // TODO 后续要修改
    this.offset = this.options.start;

    // 2. open文件
    this.open();

    // this.buf
    // 不这样使用是因为：每一次this.emit(data, chunk) 这个chunk都要是新的内存，如果是实例内就一份的话，用户恰巧又将chunk都存起来了，对其中一份chunk修改，那就全修改了
    // 如果传给使用方chunk没有使用，那就被GC回收

    // 3. read文件。调用方是否监听data事件，监听后才进行流式读取文件
    this.on('newListener', (eventName) => {
      if (eventName !== 'data') return;
      // 这样不好，如果 this.open 先打开，客户端后注册data，就不行了
      // this.on('read', () => {
      //   this.read();
      // });
      this.flowing = true; // 流动模式
      this.read();
    });
  }

  private destroy(err?: unknown) {
    if (err) {
      this.emit('error', err);
    }
    fs.close(this.fd, (err) => {
      this.emit('close');
    });
  }

  private open() {
    if (this.fd) {
      this.emit('open', this.fd);
      return;
    }

    fs.open(this.path, this.options.flags, this.options.mode, (err, fd) => {
      if (err) {
        this.destroy(err);
        return;
      }
      this.fd = fd;
      this.emit('open', fd);
    });
  }

  /** 流式读取到缓冲区 */
  // fs.open  fs.read 依赖先后关系，现在把这两个分开了，就要注意异步的问题了。分开是使用的发布-订阅者
  private read() {
    const fd = this.fd;
    if (!fd) {
      // 无论是open先执行，还是data先注册，都没事
      // once 也行？
      this.on('open', () => {
        // open以后
        this.read();
      });
      return;
    }

    // TODO
    if (!this.flowing) {
      return;
    }

    const { highWaterMark, end } = this.options;
    const shouldReadSize = end ? Math.min(end - this.offset + 1, highWaterMark) : highWaterMark;
    const buf = Buffer.alloc(shouldReadSize);

    // TODO  this.offset 后续要更新
    fs.read(fd, buf, 0, shouldReadSize, this.offset, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
        return;
      }

      // 读取到了数据，说明文件数据还有剩余
      // 最后一次成功读取的数据，可能不会达到highWaterMark
      if (bytesRead > 0) {
        // bytedsRead 成功读取的字节数
        // TODO： 刚开始 fs.read 后，就暂停了。那这部分的数据将不触发，偏移量也要回归旧值
        if (!this.flowing) {
          this.offset -= bytesRead;
          return;
        }

        this.offset += bytesRead;
        this.emit('data', buf.slice(0, bytesRead)); // slice不包括结尾，所以不用-1
        this.read();
      } else {
        // 读取完毕
        this.emit('end');
        this.destroy();
      }
    });
  }

  public pause() {
    this.flowing = false;
  }

  public resume() {
    if (!this.flowing) {
      this.flowing = true;
      this.read();
    }
  }

  public pipe(ws: fs.WriteStream) {
    this.on('data', (chunk) => {
      const res = ws.write(chunk);
      // 慢了，别再写了
      if (!res) {
        this.pause();
      }
    });

    this.on('close', () => {
      ws.close();
    });

    ws.on('drain', () => {
      this.resume();
    });
  }
}

export function createReadStream(path: string, options?: T.ReadStreamOptions) {
  return new FSReadStream(path, options);
}
