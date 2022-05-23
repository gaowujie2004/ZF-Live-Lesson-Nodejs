// 实现一个简易版的 utf-8 编码解码器？

// 字符 和 Unicode 码点值（采用16进制表示）的映射Map
// 编码，即把当前字节根据 utf-8 算法，得到对应的二进制存入计算机中。 utf-8 ，字符的 Unicode 码点值 和 二进制数据不一样
export {};

const CHAR_UNICODE_MAP = {
  高: 0x9ad8, // __10_01101 0110_11000
  A: 0x0041, // _100_0001
};

/**
 * 1、判断字符对应的 Unicode 码点值， 属于4个范围中的哪一个
 * 0x_0000 - 0x007F   —— 当前字符编码后占，一字节
 * 0x_0080 - 0x07FF   —— 当前字符编码后占，两字节
 * 0x_0800 - 0xFFFF   —— 当前字符编码后占，三字节
 * 0x1_0000 - 0x10_FFFF —— 当前字符编码后，占四字节
 */

function encoding(str: string) {
  const unicodeValue = str.codePointAt(0);
  let binaryRes: number[];

  if (unicodeValue >= 0 && unicodeValue <= 0x007f) {
    console.log('编码后占1字节');
    binaryRes = [unicodeValue];
  }

  if (unicodeValue >= 0x0080 && unicodeValue <= 0x07ff) {
    console.log('编码后占2字节');

    // 010100110
    const unicodeValueBit = unicodeValue.toString(2);

    // 110xxxxx 10xxxxxx - 110 10 是前缀码
    let temp = '110XXXXX10XXXXXX';
    [...unicodeValueBit].reverse().forEach((binaryBit) => {
      temp = temp.replace(/X(?=\d*?$)/, binaryBit);
    });

    console.log('utf-8 二进制', temp);
  }

  if (unicodeValue >= 0x0800 && unicodeValue <= 0xffff) {
    console.log('编码后占，3字节');

    // 010100110
    const unicodeValueBit = unicodeValue.toString(2);

    // 110xxxxx 10xxxxxx - 110 10 是前缀码
    let temp = '1110XXXX10XXXXXX10XXXXXX';
    [...unicodeValueBit].reverse().forEach((binaryBit) => {
      temp = temp.replace(/X(?=\d*?$)/, binaryBit);
    });
    const resBinary = temp.replace(/X/g, '0');
    const resUint8ArrayStr = chunkString(resBinary, 8);
    const resUint8Array = resUint8ArrayStr.map((binaryStr) => parseInt(binaryStr, 2));

    console.log('utf-8 —— 3字节', resUint8Array);
  }

  if (unicodeValue >= 0x01_ffff && unicodeValue <= 0x10_ffff) {
    console.log('编码后占，4字节');

    // 010100110
    const unicodeValueBit = unicodeValue.toString(2);

    // 110xxxxx 10xxxxxx - 110 10 是前缀码
    let temp = '11110XXX10XXXXXX10XXXXXX10XXXXXX';
    [...unicodeValueBit].reverse().forEach((binaryBit) => {
      temp = temp.replace(/X(?=\d*?$)/, binaryBit);
    });
    const resBinary = temp.replace(/X/g, '0');
    const resUint8ArrayStr = chunkString(resBinary, 8);
    const resUint8Array = resUint8ArrayStr.map((binaryStr) => parseInt(binaryStr, 2));

    console.log('utf-8 —— 4字节', resUint8Array, Buffer.from(resUint8Array));
    console.log(Buffer.from('𠮷'));
  }

  return binaryRes;
}

/**
 *
 * @param str
 * @param chunkLength
 * @returns
 *
 *
 * "abdef"  2
 * [ "ab",  "de",  "f" ]
 */
function chunkString(str: string, chunkLength) {
  const groupCount = Math.ceil(str.length / chunkLength);
  let offset = 0;
  let resArr = new Array(groupCount);

  for (let i = 0; i < groupCount; i++) {
    resArr[i] = str.slice(offset, offset + chunkLength);
    offset += chunkLength;
  }

  return resArr;
}

encoding('𠮷');
