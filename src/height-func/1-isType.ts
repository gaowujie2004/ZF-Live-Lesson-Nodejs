export {};

// 高阶函数就是 一个函数返回一个函数，利用闭包特性做一些事情
// 比如参数缓存。

function isType(type: string) {
  return function (val) {
    // 将 type 缓存起来
    return Object.prototype.toString.call(val) === `[object ${type}]`;
  };
}

const isString = isType('String');
const isNumber = isType('Number');
const isObject = isType('Object');

let utils = {};
['String', 'Number'].forEach((typeStr) => {
  utils[`is${typeStr}`] = isType(typeStr);
});
