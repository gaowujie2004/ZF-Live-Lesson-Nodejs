const fs = require('fs');
const path = require('path');
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

/**
 * ================== 封装 fs.open 底层API，完成 copy 功能，不一下子放到 Buffer ================
 * 对 1-fs.js 封装
 *
 * 缺点还是：
 * 1、读写不能分离，太耦合。
 * 2、从代码可读性上来说:
 *    回调地域，可读性太低、
 *    并且错误还不能统一处理。
 * 3、没法控制暂停，读写的打开顺序（从使用上不应该有顺序）
 */

function copy(sourcePath, targetPath, callback) {
  const BUFFER_SIZE = 3; // 3 byte
  // 每一次复用这个内存空间，写入buf，重复buf重新写入数据 ...... 如此循环
  const buf = Buffer.alloc(BUFFER_SIZE);

  fs.open(sourcePath, 'r', (err, rfd) => {
    if (err) {
      callback(err);
      return;
    }
    fs.open(targetPath, 'w', (err, wfd) => {
      if (err) {
        callback(err);
        return;
      }

      let readOffset = 0;
      let writeOffset = 0;
      function next() {
        /**
         * fd
         * buffer
         * offset    buf偏移量，以 buf 数组哪个位置开始放读取的数据
         * -----------------------------------
         * length    从文件数据中，读取 length 个字节数据，但真实的不一定是指定的，可能文件数据没那么多
         * position  从文件数据中，指定位置开始读取数据
         * callback
         */
        // 把文件数据，写入内存，放入 buf
        fs.read(rfd, buf, 0, BUFFER_SIZE, readOffset, (err, byteRead) => {
          if (err) {
            callback(err);
            return;
          }
          console.log('成功读取字节数', byteRead);
          if (byteRead === 0) {
            // 文件读取完毕
            fs.close(rfd, (err) => {
              if (err) {
                callback(err);
                return;
              }
            });

            fs.close(wfd, (err) => {
              if (err) {
                callback(err);
                return;
              }
            });

            callback(null);
            return;
          }

          /**
           * fd
           * buffer
           * offset   buffer 偏移量
           * length   buffer 写入长度  👈🏻
           * 在 buffer 中，从 offset 到 length(不包括)的数据写入到文件中
           * ----------------------------
           * position 文件开始写入位置
           * callback
           */
          fs.write(wfd, buf, 0, byteRead, writeOffset, (err, written) => {
            //                    👆🏻
            if (err) {
              callback(err);
              return;
            }
            readOffset += written;
            writeOffset = readOffset; //todo: 不好理解
            console.log('成功写入字节数--', written);
            next();
          });
        });
      }
      next();
    });
  });
}

copy(join('./test/cn'), join('./test/cn-copy'), (err) => {
  if (err) {
    console.log('------ERROR', err);
  } else {
    console.log('-------SUCCESS');
  }
});

setTimeout(() => {
  copy(join('./test/cn'), join('./test/cn-copy'), (err) => {
    if (err) {
      console.log('------ERROR', err);
    } else {
      console.log('-------SUCCESS');
    }
  });
}, 2000);

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
