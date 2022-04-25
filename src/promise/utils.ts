// 负责解析 x 和 promise2 之间的关系 ， p1.then(oncallback)， oncallback 函数调用后的返回值是 x
// 解析 promise2 和 x之间的关系 来判断promise2 走 resolve 还是  reject
// resolve、reject 和 promise2 是一起的。
export function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    /**
     * 就像下面这种：.then callback 是异步执行，能拿到 p
     * let p = Promise.resolve().then((val) => p);
     */
    throw new TypeError('hh');
  }

  // x 可能是个promise, 引用类型
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false;

    // x.then 可能是个 getter 那就可能会报错
    try {
      let then = x.then; // 缓存出来，因为 x.then 可能是个 getter 可能会耗性能
      // x is promise
      if (typeof then === 'function') {
        // todo: 费脑筋 start
        then.call(
          x, // then 内部有 this
          (y) => {
            // y 的类型是啥？ x promise 的值作为 promise2 的值
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
        // todo: 费脑筋 end
      } else {
        resolve(x);
      }
    } catch (err) {
      if (called) return;
      called = true;
      reject(err);
    }
  } else {
    // 基本值
    resolve(x);
  }
}

export function asyncSleep() {}
