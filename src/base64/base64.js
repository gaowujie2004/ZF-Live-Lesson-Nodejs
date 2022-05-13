/**
 * 目标 1️⃣：编写 base64 算法
 *
 * 比如一个中文字符 —— 高
 * 假设使用 UTF8 去存储到计算机中，对应的二进制数据，用16进制表示。
 * [ 0xe9  0xab  0x98,  0xe6 0xad 0xa6,  0xe6 0x9d 0xb0 ]
 */
const b1 = Buffer.from("高武杰", "utf8");
console.log("高武杰", b1);

/**
 * 2、base64的概念就是，把一串二进制，原先是8位1组，1个字节。
 *    现在变成，每6位一组；如果凑不满比如原先是 8位空间，现在用base64表示，前6位一组，还剩下2位
 */

let codeMap = "ABCDEFJHIJKLMNOPQRSTUVWXYZ";
codeMap += codeMap.toLocaleLowerCase();
codeMap += "0123456789";
codeMap += "+/";
