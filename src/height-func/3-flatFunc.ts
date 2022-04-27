// 不是根据函数的 参数列表判断
export {};

function flatFunc(fn: Function) {
  let cacheParams = []; // 队列

  const returnFn = (...params) => {
    cacheParams.push(...params);
    if (cacheParams.length >= fn.length) {
      const res = fn(...cacheParams);
      cacheParams = [];
      return res;
    }
    return returnFn;
  };

  return returnFn;
}

function add(a1, a2, a3, a4) {
  return a1 + a2 + a3 + a4;
}

const addFlatFunc = flatFunc(add);
let addCallbackRes = addFlatFunc(1, 2)(3, 4);
console.log('--结果', addCallbackRes);
