const fs = require('fs');
const EventEmitter = require('events');
class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.start = options.start || 0;
    this.autoClose = options.autoClose || true;
    this.emitClose = options.emitClose || true;
    this.len = 0; // 记录当前写入的个数

    // 等会写入的内容 都写入完毕了 是否要触发drain事件
    this.needDrain = false;
    this.cache = [];
    this._writing = false;
    this.offset = 0;
    this.open();
  }
  destroy(err) {
    if (err) {
      this.emit('error', err);
    }
  }
  _write(chunk, callback) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, callback));
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
      this.len -= written;
      this.offset += written;
      callback(); // 这里执行完自己的回调应该清空缓存区
    });
  }
  clearCache() {
    let cacheObj = this.cache.shift();
    // 在缓存中取出第一个来写入
    if (cacheObj) {
      let { chunk, callback } = cacheObj;
      this._write(chunk, callback);
    } else {
      this._writing = false;

      if (this.needDrain) {
        this.needDrain = false;
        this.emit('drain');
      }
    }
  }
  write(chunk, callback = () => {}) {
    // 我需要根据写入的数据 和 highWaterMark比较
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    //
    this.needDrain = this.len >= this.highWaterMark;
    // write方法第一次是真正像文件中写入
    const clearBuffer = () => {
      // aop 切片
      callback();
      this.clearCache();
    };
    if (!this._writing) {
      this._writing = true;
      this._write(chunk, clearBuffer); // 真正的写入操作
    } else {
      this.cache.push({
        chunk,
        callback: clearBuffer,
      });
    }
    // 后续的写入要排队
    // 最终返回一个boolean值
    return this.len < this.highWaterMark;
  }
  open() {
    // 异步的
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        // 打开失败了
        return this.destroy(err);
      }
      this.fd = fd;
      this.emit('open', fd); // 触发这个事件 就表示打开文件成功
    });
  }
}

export function createWriteStream(path, options) {
  return new WriteStream(path, options);
}

// 1m
// 我一次读取64  假如说我写入的时候 我能期望300b来存储
// 64 直接写入  【64,64，、、】
