// 实现一个简易版的 utf-8 编码解码器？

// 字符 和 Unicode 码点值（采用16进制表示）的映射Map
// 编码，即把当前字节根据 utf-8 算法，得到对应的二进制存入计算机中。 utf-8 ，字符的 Unicode 码点值 和 二进制数据不一样
export {};

/**
 * 1、判断字符对应的 Unicode 码点值， 属于4个范围中的哪一个
 * 0x_0000 - 0x007F   —— 当前字符编码后占，一字节
 * 0x_0080 - 0x07FF   —— 当前字符编码后占，两字节
 * 0x_0800 - 0xFFFF   —— 当前字符编码后占，三字节
 * 0x1_0000 - 0x10_FFFF —— 当前字符编码后，占四字节
 */

const TEMPLATE = {
  twoByte: '110XXXXX10XXXXXX',
  threeByte: '1110XXXX10XXXXXX10XXXXXX',
  fourByte: '11110XXX10XXXXXX10XXXXXX10XXXXXX',

  unicodeToByte: (unicodeValue: number) => {
    if (unicodeValue >= 0x0080 && unicodeValue <= 0x07ff) {
      return TEMPLATE.twoByte;
    }
    if (unicodeValue >= 0x0800 && unicodeValue <= 0xffff) {
      return TEMPLATE.threeByte;
    }
    if (unicodeValue >= 0x01_ffff && unicodeValue <= 0x10_ffff) {
      return TEMPLATE.fourByte;
    }
  },
};

function encoding(str: string) {
  const unicodeValue = str.codePointAt(0);
  let unicodeBitStr = unicodeValue.toString(2); // "0101010"
  let template = TEMPLATE.unicodeToByte(unicodeValue);

  if (unicodeValue >= 0 && unicodeValue <= 0x007f) {
    return [unicodeValue];
  }

  [...unicodeBitStr].reverse().forEach((binaryBit) => {
    template = template.replace(/X(?=\d*?$)/, binaryBit);
  });
  const resBinary = template.replace(/X/g, '0');
  const resUint8ArrayStr = chunkString(resBinary, 8);

  return resUint8ArrayStr.map((binaryStr) => parseInt(binaryStr, 2));
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
function chunkString(str: string, chunkLength: number) {
  if (chunkLength < str.length) {
    return [];
  }

  const groupCount = Math.ceil(str.length / chunkLength);
  let offset = 0;
  let resArr = new Array(groupCount);

  for (let i = 0; i < groupCount; i++) {
    resArr[i] = str.slice(offset, offset + chunkLength);
    offset += chunkLength;
  }

  return resArr;
}

const res = encoding('𠮷');
console.log('res--', res);
console.log('res buffer--');
