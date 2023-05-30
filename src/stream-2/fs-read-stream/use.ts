import fs from 'fs';
import path from 'path';

import { createReadStream } from 'fs';
// import { createReadStream } from '../fs-read-stream/impl-base';

const fsReadStreamZH = createReadStream(path.join(__dirname, './mock-zh.txt'), {
  flags: 'r',
  highWaterMark: 3, // 每次最多读取的字节数
});

fsReadStreamZH.on('data', (chunk) => {
  console.log('--中文', chunk.toString());
});
