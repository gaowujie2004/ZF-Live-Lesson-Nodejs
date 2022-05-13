const fs = require('fs');
const path = require('path');
const EventEmit = require('events');
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

class ReadStream extends EventEmit {
  constructor(path, options = {}) {
    super();

    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || null;
    this.emitClose = options.emitClose || false;
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
    this.open();
    this.on('newListener', (eventName) => {
      if (eventName === 'data') {
        this.read();
      }
    });
  }

  // open 和 read 之前是耦合嵌套的，现在分开了，解耦了。
  // 因为 open 和 read 分开了，所以要处理一下依赖，read 依赖 open 的 fd
  open() {
    fs.open(this.path, (err, fd) => {
      if (err) {
        this.destroy(err);
        return;
      }
      this.fd = fd;
      this.emit('open', fd);
    });
  }

  read() {
    // todo: 怎么保证，文件打开了，再去读呢？
    // open 和 read 之前是耦合嵌套的，现在分开了，解耦了。
    // 因为 open 和 read 分开了，所以要处理一下依赖，read 依赖 open 的 fd
    if (typeof this.fd !== 'number') {
      this.once('open', () => this.read());
      return;
    }

    const buffer = Buffer.alloc(this.highWaterMark);
    fs.read(this.fd, buffer, 0, buffer.byteLength, this._offset, (err, byteRead) => {
      if (byteRead) {
        this.emit('data', buffer.slice(0, byteRead));
        this._offset += byteRead;
        this.read();
      } else {
        this.emit('end');
        this.destroy();
      }
    });
  }

  destroy(err) {
    if (err) {
      this.emit('error', err);
    }

    if (this.fd) {
      fs.close(this.fd, () => {
        this.emitClose && this.emit('close');
      });
    }
  }
}

module.exports = ReadStream;
