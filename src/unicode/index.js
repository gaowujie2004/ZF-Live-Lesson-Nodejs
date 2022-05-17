/**================================== URL链接缩短 **/

const lodash = require('lodash');

console.log('\n\n\n\n\n\n\n\n\n--------');
const inputStr = '高武杰';

// '高' 对应的 Unicode 码，转成二进制
// 将每个字符补全，2字节，即16位
const binaryUnicodeArray = [...inputStr].map((str) =>
  str.codePointAt(0).toString(2).padStart(16, '0')
);

// binaryStr -> '1111000000xxx'   16位

const binaryToKongMap = {
  0: '\u200B',
  1: '\u200C',
};
const kongToBinaryMap = {
  [binaryToKongMap[0]]: '0',
  [binaryToKongMap[1]]: '1',
};

/**================================== 'http://gaowujie.top/' + kongStr 最后结果  **/
// 让用户复制这字符串
const kongStr = binaryUnicodeArray
  .map((binaryStr) => {
    return binaryStr.replace(/0/g, binaryToKongMap[0]).replace(/1/g, binaryToKongMap[1]);
  })
  .join('');
console.log('空白字符长度: ', kongStr.length);
console.log('空白字符:', kongStr, '|');

/**================================== 空的str咱48个长度，传到服务器端了 **/
const urlStr = encodeURI(kongStr);
const utf16SpaceStr = decodeURI(urlStr);

// ''  \u200b..........
const originStrBinaryStr = [...utf16SpaceStr].map(
  (spaceChar) => kongToBinaryMap[spaceChar]
);

// 现在是连在一起的，我想16位一组，
const origin16UniArray = lodash.chunk(originStrBinaryStr, 16).map((arr) => arr.join(''));

const originValue = origin16UniArray.reduce(
  // item ->  11111000000 string
  (memo, item) => memo + String.fromCodePoint(parseInt(item, 2)),
  ''
);

// console.log(originValue);

// console.log('----原始:\n', binaryUnicodeArray);
