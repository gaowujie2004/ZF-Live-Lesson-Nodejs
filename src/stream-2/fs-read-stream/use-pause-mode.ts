import fs from 'fs';
import path from 'path';
const rs = fs.createReadStream(path.join(__dirname, './mock-en.txt'), {
  highWaterMark: 7,
});

// 如果可读流第一次全部读下来并且小于 highWaterMark，就会再读一次（再触发一次 readable 事件）
// 如果 rs.read() 不加参数，一次性读完，会从缓存区再读一次，为 null
// 如果 readable 每次都刚好读完（即 rs.read() 的参数刚好和 highWaterMark 相等），就会一直触发 readable 事件，如果最后不足读取的数，就会先触发一次 null，最后吧剩下的读完
// 一开始缓存区为 0 的时候
rs.on('readable', () => {
  let result = rs.read(7);
  console.log(result?.toString());
});
