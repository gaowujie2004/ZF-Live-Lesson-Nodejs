export {};
function add(a1, a2, a3, a4) {
  return a1 + a2 + a3 + a4;
}

add(1, 2, 3, 4);

// 现在对 add 柯里化，意味着可以这样调用
// add(1)(2)(3)(4);

// 也可以这样，不过这就叫做 —— 扁函数，是更为特殊的柯里化
// add(1,2)(3,4);
// add(1)(2,3,4);
// ......

function currying(fn: Function) {
  let cacheParams = []; // 队列

  const returnFn = (param) => {
    cacheParams.push(param);

    if (cacheParams.length >= fn.length) {
      const res = fn(...cacheParams);
      cacheParams = [];
      return res;
    } else {
      return returnFn;
    }
  };

  return returnFn;
}

// const addCurrying = currying(add);
// let addCallbackRes = addCurrying(2)(0)(0);
// console.log('--结果', addCallbackRes);
