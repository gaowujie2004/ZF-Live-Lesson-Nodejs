// concat 是 copy 的封装，故新内存和源内存不共享空间。

// [ 0xe9  0xab  0x98,  0xe6 0xad 0xa6,  0xe6 0x9d 0xb0 ]
const b1 = Buffer.from('高武杰', 'utf8');
const b2 = Buffer.from('秦蓓蕾哈哈', 'utf8');

Buffer.concat = function (list, totalLength) {
  totalLength = totalLength || list.reduce((memo, item) => memo + item.byteLength, 0);
  const retBuf = Buffer.alloc(totalLength);

  let currentBuf;
  let offset = 0;
  for (let i = 0; i < list.length; i++) {
    currentBuf = list[i];
    currentBuf.copy(retBuf, offset);

    offset += currentBuf.byteLength;
  }

  return retBuf;
};

const bigBuf = Buffer.concat([b1, b2]);
console.log(bigBuf.toString());
