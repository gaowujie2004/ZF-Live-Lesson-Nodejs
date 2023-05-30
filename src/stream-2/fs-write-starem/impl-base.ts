import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';
import type { T } from '../lib';

class FSWriteStream extends EventEmitter {
  public path: string;
  private options: Required<T.WriteStreamOptions>;
  private fd: number;
  private offset: number; // 从文件的何处开始写入
  private notWrittenSize: number; // 未写入文件中的字节数
  /** 每轮是否写入数据到硬盘 */
  private writing: boolean;
  private needDrain: boolean;
  private cache: T.FIFOCacheItem[]; // TODO: 替换链式FIFO队列

  constructor(path: string, options?: T.WriteStreamOptions) {
    super();

    console.log('my ws');

    this.path = path;
    this.options = {
      highWaterMark: 16 * 1024,
      start: 0,
      // end 不需要
      autoClose: true,
      emitClose: true,
      encoding: 'utf-8', // 用户调用ws.write()传入字符串时，解码字符串
      fd: undefined,
      flags: 'r',
      mode: undefined,
      ...options,
    };
    this.fd = typeof options.fd === 'object' ? options.fd.fd : options.fd;
    this.offset = this.options.start; // 从文件那个位置写入
    this.notWrittenSize = 0;
    this.writing = false;
    this.needDrain = false;
    this.cache = [];

    // 2. open文件
    this.open();
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

  // 刚调用 createWriteStream后，就开始 write ，此时文件还没有 open，因为这是异步的。
  // 那该怎么办？ write 还需要返回值呢
  public write(chunk: Buffer, callback?: () => void) {
    this.notWrittenSize += chunk.byteLength;
    this.needDrain = this.notWrittenSize >= this.options.highWaterMark;

    const wrapCallbackClearCache = () => {
      callback?.();

      // 开始清空缓存，以下是缓存中的 chunk、callback
      const cacheObj = this.cache.shift();
      if (cacheObj) {
        const { chunk, callback } = cacheObj;
        this._write(chunk, callback);
      } else {
        this.writing = false; // TODO: 缓存队列清空完毕，新的一轮开始
        if (this.needDrain) {
          // 触发drain需要满足：1）未写入的字节数>=highWaterMark；2）缓存队列清空完毕
          // TODO 下面两行代码的顺序很重要。！！！ 原因是 Event 在node.js是同步触发的。
          this.needDrain = false;
          this.emit('drain');
        }
      }
    };

    if (this.writing) {
      // 每一轮已经有写入了，开始放入缓存队列
      this.cache.push({
        chunk,
        callback: wrapCallbackClearCache,
      });
    } else {
      /**
       * 有fd
       * fd: number,
       * buffer: TBuffer,
       * offset: number | undefined | null,    buffer偏移量
       * length: number | undefined | null,    写入多少字节数据
       * position: number | undefined | null,  从文件何处写入
       * callback: (err: NodeJS.ErrnoException | null, written: number, buffer: TBuffer) => void
       */
      this.writing = true;
      this._write(chunk, wrapCallbackClearCache);
    }

    // 什么时候开始清空
    return this.notWrittenSize < this.options.highWaterMark;
  }

  // 真正的写入，this.write 已经将 notWriteSize、.... 维护好了
  // 所以写完后，取缓冲区的，让this._write负责再次写入
  private _write(chunk: Buffer, callback?: () => void) {
    if (!this.fd) {
      this.once('open', () => {
        this._write(chunk, callback);
      });

      return;
    }

    fs.write(this.fd, chunk, 0, chunk.byteLength, this.offset, (err, written) => {
      // written 成功写入字节数
      if (err) {
        this.destroy(err);
        return;
      }
      this.offset += written;
      this.notWrittenSize -= written; // TODO 不太好理解
      callback?.();

      // 清空缓存操作  放在这里不合适
      // 将缓存区遗留的 取出来写入
    });
  }

  public close() {
    if (this.fd) {
      fs.close(this.fd, () => {
        this.emit('close');
      });
    }
  }
}

export function createWriteStream(path: string, options?: T.WriteStreamOptions) {
  return new FSWriteStream(path, options);
}
