const fs = require('fs');
const path = require('path');
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

/**
 * ================================== 复制大文件功能
 * 64k 以下的文件，用这种方式可以
 * 不用 fs.readFile 是因为这是一下子全部读到内存中了，如果文件很大，
 * 内存就爆炸了。
 *
 * fs.open()  fs.read()  fs.write()  fs.close()  也有同步的但是主要应用还是异步api
 * fs.read / fs.write / fs.close()   接收的都是 fd（文件描述符）
 *
 * 缺点：
 * 1、嵌套的太狠了；
 * 2、不能统一处理错误；
 * 3、读写不能分离，读和写太耦合了。
 */

const BUFFER_SIZE = 3; // 3 byte
const buf = Buffer.alloc(BUFFER_SIZE);

fs.open(join('./test/cn'), 'r', (err, fd) => {
  // fd 文件描述符，一个整数，记录如何操作这个文件的
  if (err) {
    console.log('fs.open ERROR', err);
    return;
  }

  // 根据 fd 找到文件，然后读取指定位置的二进制数据，放到哪个 Buffer（内存） 中？
  /**
   * fd: number,
   * buffer: TBuffer,
   * offset: number,       buf的开始
   * length: number,       从文件中读取多少字节的数据，放入 buf 中，最后真实读取的不一定是指定的
   * position: ReadPosition | null,  从文件数据哪个位置开始读数据
   * callback
   */

  // 所谓的读取都是写入（是把文件中的数据，写入到内存中，放到buf中）
  fs.read(fd, buf, 0, BUFFER_SIZE, 0, (err, bytesRead) => {
    // bytesRead 写入 buf的字节数
    if (err) {
      console.log('fs.read ERROR', err);
      return;
    }
    console.log('读取成功, 已读取字节：', bytesRead);
    console.log('看看BUF', buf);

    // 也是需要 fs.open 获取一个文件描述符
    // 如果这个文件不存在，那就会创建一个文件描述符
    fs.open(join('./test/cn-copy'), 'w', (err, wfd) => {
      if (err) {
        console.log('write fs.open', err);
        return;
      }
      // wfd 新文件的文件描述符
      // 将内存二进制数据，写入文件中

      /**
       * fd,
       * buffer,
       * offset
       * length
       * position  文件中的位置
       * encoding (buffer is string，则需要指定编码，不指定则是utf8)
       * callback
       */

      /**
       * w - 覆盖性的
       * a - 追加
       */
      fs.write(wfd, buf, 0, buf.byteLength, 3, (err, written, newBuf) => {
        // written 成功文件的数据，字节个数
        if (err) {
          console.log('fs.write ERROR', err);
          return;
        }

        // copy 完成，关闭文件描述符
        fs.close(wfd);
        fs.close(fd);
        console.log('fs.write 个数', written, newBuf === buf, true);
      });
    });
  });
});
