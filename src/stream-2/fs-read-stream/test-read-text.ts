import fs from 'fs';
import path from 'path';

import { createReadStream } from 'fs';

const fsReadStreamZH = createReadStream(path.join(__dirname, './mock-zh.txt'), {
  flags: 'r',
  highWaterMark: 3, // 每次最多读取的字节数

  /**
   * text: A高武杰
   * 若指定了编码，则内部会使用 string_decoder 来解码
   * 没有指定编码，则就是二进制原始数据
   *
   * 同理，fs.createWriteStream 也是一样的
   */
  // encoding: 'utf8',
});

fsReadStreamZH.on('data', (chunk: string) => {
  console.log('--中文', chunk);
});
