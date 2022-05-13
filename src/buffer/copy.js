// copy 是复制一份，不和源内存共享
// slice 会和源内存共享

// 假设使用 UTF8 去存储到计算机中，对应的二进制数据，用16进制表示。
// [ 0xe9  0xab  0x98,  0xe6 0xad 0xa6,  0xe6 0x9d 0xb0 ]
const b1 = Buffer.from('高武杰', 'utf8');
const b2 = Buffer.from('秦蓓蕾', 'utf8');

const bigBuf = Buffer.alloc(b1.byteLength + b2.byteLength);

/**================================== 实现 **/
Buffer.prototype.copy = function (
  target,
  targetStart,
  sourceStart = 0,
  sourceEnd = this.length
) {
  console.log('自己的');
  for (let i = 0; i < sourceEnd - sourceStart; i++) {
    target[targetStart + i] = this[sourceStart + i];
  }
};

// end不包括
b1.copy(bigBuf, 0, 0, b1.byteLength);
b2.copy(bigBuf, 9, 0, b2.byteLength); // 不包括 b1.byteLength 结尾部分

console.log(bigBuf.toString());
