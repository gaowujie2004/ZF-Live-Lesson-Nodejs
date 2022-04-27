export {};

function isType(val, type: string) {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
}

function isString(val) {
  return isType(val, 'String');
}

function isNumber(val) {
  return isType(val, 'Number');
}

function isObject(val) {
  return isType(val, 'Object');
}

// 可以看到，用这种方式，调用 isType 函数， 都有一个 val 是固定的，只有 typeStr 需要根据情况指定。
let utils = {};
['String', 'Number'].forEach((typeStr) => {
  utils[`is${typeStr}`] = function (val) {
    return isType(val, typeStr);
  };
});
