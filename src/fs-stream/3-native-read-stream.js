const fs = require('fs');
const path = require('path');
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};
const ReadStream = require('./6-my-read-stream');

/**
 * 可读流，基于发布订阅模式
 */
// new ReadStream
// fs.createReadStream
const rs = new ReadStream(join('./test/cn'), {
  start: 0,
  end: 6, // 包后0-5，6字节，省略就是到文件末尾
  flags: 'r', // default, 读取操作
  highWaterMark: 2, // 默认64kb，每次读取文件的字节数
  encoding: null, // 默认是二进制数据，如果要读取文本数据，可以指定解码
  mode: undefined, // 文件权限
  emitClose: true,
  // rwx_rwx_rwx
  // 0x777
  // r -> 4
  // w -> 2
  // x -> 1
});

// 文件的可读流才具备open事件
rs.on('open', (fd) => {
  console.log('--open fd: ', fd);
});

// 绑定了 data 才开始读
rs.on('data', (dataByte) => {
  console.log('--data: ', dataByte.toString());
});

rs.on('error', (err) => {
  console.log('ERROR', err);
});

// 只有文件流才有关闭，对应 fs.close(fd) ?
rs.on('close', () => {
  console.log('--close: 文件描述符关闭');
});

// 对应 读取完毕
rs.on('end', () => {
  console.log('--end: 读取完毕');
});

setTimeout(() => {
  rs.resume(); // 恢复 data 事件的触发
  console.log('-- 开始');
}, 400);

setTimeout(() => {
  rs.pause();
  console.log('-- 暂停');
}, 200);
