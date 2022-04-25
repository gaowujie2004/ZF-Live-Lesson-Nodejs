// 穿透 - resolve
// 输出 111
// Promise.resolve(111)
//   .then()
//   .then((val) => console.log(val));

// 失败的promise，第一个 then 没有对应的 callback 那就继续 throw error
// 让第一个 then() 返回失败的promise
// Promise.reject(222)
//   .then()
//   .then(undefined, (reason) => {});
import { resolvePromise } from '../utils';

const enum State {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

const noop = (() => {}) as (val: any) => any;

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
    // 穿透
    onFulfill = typeof onFulfill === 'function' ? onFulfill : (v) => v;
    onReject =
      typeof onReject === 'function'
        ? onReject
        : (r) => {
            throw r;
          };
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

p.then().then((val) => {
  console.log('----', val);
});
