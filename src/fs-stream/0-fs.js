// 底层 API
const fs = require('fs');
const path = require('path');
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

function testWrite() {
  const buf = Buffer.alloc(10);
  fs.open(join('./test/temp'), 'w', (err, fd) => {
    /**
     * fd
     * buffer
     * offset   buffer 偏移量
     * length   buffer 写入长度
     * -------------------------
     * position 文件开始写入位置
     * callback
     */
    fs.write(fd, Buffer.from('abc'), 0, 3, 0, () => {
      fs.write(fd, Buffer.from('def'), 0, 3, 3, () => {});
    });
  });
}
// testWrite();

function testRead() {
  const buf = Buffer.alloc(10);

  fs.open(join('./test/temp'), 'r', (err, fd) => {
    /**
     * fd
     * buffer
     * offset    buf偏移量，以 buf 数组哪个位置开始放读取的数据
     * -----------------------------------
     * length    从文件数据中，读取 length 个字节数据，但真实的不一定是指定的，可能文件数据没那么多
     * position  从文件数据中，指定位置开始读取数据
     * callback
     */
    fs.read(
      fd,
      buf,
      0, // buf start
      6, //file length
      2, // file position
      (err, byteRead) => {
        console.log('真实读取到的字节数', byteRead);
        console.log(buf);
      }
    );
  });
}

testRead();
