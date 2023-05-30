const gao = Buffer.from([0x41, 0xe9, 0xab, 0x98]); // A高
const wu = Buffer.from([0xe6, 0xad, 0xa6]); // 武

const chunk1 = Buffer.from([0x41, 0xe9]);
const chunk2 = Buffer.from([0xab, 0x98]);
const chunk3 = Buffer.from([0xe6, 0xad]);
const chunk4 = Buffer.from([0xa6]);

// 把 chunk1、chunk2 ... chunk4 toString() 是乱码的

const { StringDecoder } = require('string_decoder');

const stringDecoder = new StringDecoder();

const chunk1Res = stringDecoder.write(chunk1);
const chunk1ResEnd = stringDecoder.end(chunk2);
// const chunk2Res = stringDecoder.write(chunk2);
// const chunk3Res = stringDecoder.write(chunk3);

console.log('chunk1 RES: ', chunk1Res);
// console.log('chunk2 RES: ', chunk2Res);
// console.log('chunk3 RES: ', chunk3Res);
console.log('chunk2 RES end: ', chunk1ResEnd, Buffer.from(chunk1ResEnd));
