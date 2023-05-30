import fs from 'fs';
import path from 'path';

const buf1 = Buffer.alloc(3);
buf1[0] = 0x1;
buf1[1] = 0x2;
buf1[2] = 0x3;

const buf2 = buf1.slice;
buf2[0] = 0x11;
buf2[1] = 0x12;
buf2[2] = 0x13;

console.log('--Buffer 111', buf1);

console.log('--Buffer 2222', buf2);

const buffer1 = Buffer.from('hello, world!');
const buffer2 = buffer1.slice();

console.log(buffer1.toString()); // 输出: hello, world!
console.log(buffer2.toString()); // 输出: hello, world!

buffer1[0] = 90; // 修改 buffer1 的第一个字节为 ASCII 码 72，即字符 'H'

console.log(buffer1.toString()); // 输出: Hello, world!
console.log(buffer2.toString()); // 输出: hello, world!
