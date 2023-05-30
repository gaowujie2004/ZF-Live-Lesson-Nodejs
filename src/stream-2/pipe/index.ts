import fs from 'fs';
import path from 'path';

// import { createWriteStream, createReadStream } from 'fs';
import { createReadStream } from '../fs-read-stream/impl-base';
import { createWriteStream } from '../fs-write-starem/impl-base';

const rs = createReadStream(path.join(__dirname, './mock-source.txt'), {
  highWaterMark: 4,
});
const ws = createWriteStream(path.join(__dirname, './mock-copy.txt'), {
  flags: 'w',
  highWaterMark: 1,
});

rs.on('data', (chunk) => {
  console.log('--data', chunk);
  const res = ws.write(chunk);
  // if (!res) {
  //   rs.pause();
  // }
});

ws.on('drain', () => {
  // 可写流缓冲区已清空
  console.log('drain');
  // rs.resume();
});
