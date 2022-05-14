const fs = require('fs');
const path = require('path');
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};
// const WriteStream = require('./6-my-read-stream');
const ws = fs.createWriteStream(join('./test/write'), {
  start: undefined, // 默认0，fs.open w 模式每打开一次文件，就会清空
  encoding: undefined, // 默认utf8，如果写入的数据是 string, 则会按照指定编码规则，转成对应的 二进制数据
  highWaterMark: 3, // 默认 16kb，和 readStream 不太一样，期望使用的内存大小
});

const flag = ws.write('abc');

ws.write('12');

// 触发阈值，清空后才触发，就比如 flag 一直是 true，一直是能放下的情况，就不会触发。
// 当 flag -> false，并且清空了，就会触发。
ws.on('drain', () => {
  console.log('写入完毕');
});

ws.on('finish', () => {
  console.log('完成了？');
});

// ws.end() 立即写入，并关闭，如果此时缓冲区还有数据呢？ 是里面写入，然后再写入 ws.end() 还是，把缓冲区数据清空呢。
// 还是加入到缓冲区 ？
// todo: 先暂时设计成：立即把缓冲区数据，以及end数据，写入文件中，不触发 drain 事件
// 调用 writable.end() 方法表示不再有数据写入 Writable。
