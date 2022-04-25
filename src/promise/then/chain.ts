const enum State {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

const noop = (() => {}) as (val: any) => any;

// 负责解析 x 和 promise2 之间的关系 ， p1.then(oncallback)， oncallback 函数调用后的返回值是 x
// 解析 promise2 和 x之间的关系 来判断promise2 走 resolve 还是  reject
// resolve、reject 和 promise2 是一起的。
function resolvePromise(promise2, x, resolve, reject) {
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
            // y 的类型是啥？
            // p.then(val => {}, reason => {}) y 是 p或者说是x(promise) 的result
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

export class _Promise {
  protected state = State.Pending;
  protected result: any = undefined;

  protected onFulfillCallbacks: Function[] = [];
  protected onRejectCallbacks: Function[] = [];

  constructor(execute: (resolve: (v: any) => void, reject: (r: any) => void) => void) {
    const resolve = (value: any) => {
      if (value instanceof _Promise) {
        // todo: 费脑筋
        return value.then(resolve, reject);
        // 向下面这样
        value.then(
          (val) => {
            resolve(val);
          },
          (reason) => {
            reject(reason);
          }
        );
      }
      if (this.state === State.Pending) {
        this.state = State.Fulfilled;
        this.result = value;
        this.onFulfillCallbacks.forEach((fn) => fn(this.result));
      }
    };
    const reject = (reason: any) => {
      // 调用失败，直接失败
      if (this.state === State.Pending) {
        this.state = State.Rejected;
        this.result = reason;
        this.onRejectCallbacks.forEach((fn) => fn(this.result));
      }
    };

    try {
      execute(resolve, reject);
    } catch (err) {
      reject(err);
      console.log('--execute error', err);
    }
  }

  /**
   * then() 返回 Promise 实例，实例的状态和结果，
   * let p = new Promise((resolve, reject) => {.....})
   * let p2 = p.then( val => {...} )
   *  p2 的状态由 回调函数返回值决定，回调函数返回值：
   *    1、基本知识
   *    2、promise 实例
   * @return Promise
   */
  then(onFulfill?: (val: any) => any, onReject?: (reason: any) => any) {
    // this -> promise1
    const promise2 = new _Promise((resolve, reject) => {
      if (this.state === State.Pending) {
        // todo: 这里是使用 val 还是 this.result
        this.onFulfillCallbacks.push((val) => {
          setTimeout(() => {
            try {
              const fn = onFulfill || noop;
              const x = fn(val);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
        this.onRejectCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const fn = onReject || noop;
              const x = fn(reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
      }

      /**
       * p.then(val => {})，val 是 p.result
       */
      if (this.state === State.Fulfilled) {
        setTimeout(() => {
          try {
            const x = onFulfill(this.result);
            // 放入异步，因为 promise2
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
      if (this.state === State.Rejected) {
        setTimeout(() => {
          try {
            const x = onReject(this.result);
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);
      }
    });

    return promise2;
  }
}

/**================================== Test **/
let p = new _Promise((resolve, reject) => {
  resolve(111);
});

p = p
  .then((val) => {
    console.log('--', val);

    return new _Promise((resolve, reject) => {
      reject(22222);
    });
  })
  .then(
    (val) => {
      console.log('----2', val);
    },
    (reason) => {
      console.log(reason);
    }
  )
  .then(undefined, (reason) => {
    console.log('err', reason);
  });
