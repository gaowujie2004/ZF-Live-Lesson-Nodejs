const b1 = Buffer.from([1, 2]);
const b2 = Buffer.from([3, 4]);

const bigBuf = Buffer.alloc(b1.byteLength + b2.byteLength);
b1.copy(bigBuf, 0);
b2.copy(bigBuf, 2);

console.log(typeof b1[0]);

console.log(bigBuf);
