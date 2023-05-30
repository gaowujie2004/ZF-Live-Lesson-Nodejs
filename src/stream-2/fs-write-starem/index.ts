import fs from 'fs';
import path from 'path';

import { createWriteStream } from 'fs';
// import { createWriteStream } from './impl-base';

const ws = createWriteStream(path.join(__dirname, 'mock.txt'), {
  flags: 'w', // 覆盖写入
  highWaterMark: 3, // byte
});

let idx = 0;
let flag = false;
function write() {
  if (idx < 10) {
    flag = ws.write(Buffer.from('1\n')); // 每次写入 1 byte
    console.log(flag, idx);

    idx += 1;

    write();

    // if (flag) {
    //   // true：还没达到预期
    //   write();
    // }
  }
}

write();

ws.on('drain', () => {
  console.log('------drain');
  // write();
});

import { Readable, Writable } from 'stream';
