// 像数组那样分割

let buf = Buffer.from('1---GG---name=zf---');

Buffer.prototype.split = function (sep) {
  sep = Buffer.isBuffer(sep) ? sep : Buffer.from(sep);
  let len = sep.byteLength; // 是对应分割符的长度 是以字节为单位的
  let retArr = [];
  let offset = 0;
  let idx = 0;

  while (-1 !== (idx = this.indexOf(sep, offset))) {
    console.log(idx);
    // 注意：slice 返回的buf，和源buf共享内存
    retArr.push(this.slice(offset, idx));
    offset = idx + len;
  }

  // 处理尾部的
  retArr.push(this.slice(offset));
  return retArr;
};

let arr = buf.split('--');

console.log(arr.map((buf) => buf.toString()));
