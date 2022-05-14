const fs = require('fs/promises');
const path = require('path');
const EventEmit = require('events');

// read 更换 async + await，不采用递归

class ReadStream extends EventEmit {
  constructor(path, options = {}) {
    super();

    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || null;
    this.emitClose = options.emitClose || true;
    this.start = options.start || 0;
    this.end = options.end; // todo: 重点去弄
    this.highWaterMark = options.highWaterMark || 64 * 1024;

    // this.buf = Buffer.alloc(this.highWaterMark)
    // 不能这样写，因为每一次 this.emit('data', buf)
    // 如果写到这里，那么 buf 就是全局一份共享空间了，多次弹出的 buf 是同一个buf，
    // 后面的 buf 会去修改，那么修改是全局一份的 buf

    this.fd = null;
    // todo: mode, fd,
    this._offset = this.start;
    this.flowing = false;
    this._close = null;
    this._read = null;

    this.open();
    this.on('newListener', (eventName) => {
      if (eventName === 'data') {
        this.flowing = true;
        this.read();
      }
    });
  }

  // open 和 read 之前是耦合嵌套的，现在分开了，解耦了。
  // 因为 open 和 read 分开了，所以要处理一下依赖，read 依赖 open 的 fd
  async open() {
    try {
      const FileHandle = await fs.open(this.path);
      this.fd = FileHandle.fd;
      this._close = FileHandle.close.bind(FileHandle);
      this._read = FileHandle.read.bind(FileHandle);
      this.emit('open', FileHandle.fd);
    } catch (err) {
      this.destroy(err);
    }
  }

  async read() {
    if (typeof this.fd !== 'number') {
      this.once('open', () => this.read());
      return;
    }

    const read = this._read;
    let byteRead = 1;
    try {
      while (byteRead && this.flowing) {
        const howMou = this.end
          ? Math.min(this.end - this._offset + 1, this.highWaterMark)
          : this.highWaterMark;
        const buffer = Buffer.alloc(howMou);
        // todo: buffer 不能写在while外面

        const { bytesRead } = await read(buffer, 0, buffer.byteLength, this._offset);
        this._offset += bytesRead;
        byteRead = bytesRead;

        if (bytesRead) {
          this.emit('data', buffer.slice(0, bytesRead));
        } else {
          this.emit('end');
          this.destroy();
        }
      }
    } catch (err) {
      this.destroy(err);
    }
  }

  pause() {
    this.flowing = false;
  }

  resume() {
    if (this.flowing) {
      return;
    }
    // this.flowing -> false
    this.flowing = true;
    this.read();
  }

  async destroy(err) {
    // 销毁，fd
    this.fd = undefined;

    if (err) {
      this.emit('error', err);
    }

    try {
      await this._close();
    } catch (err) {
      this.emit('error', err);
    } finally {
      this.emitClose && this.emit('close');
    }
  }
}

module.exports = ReadStream;
