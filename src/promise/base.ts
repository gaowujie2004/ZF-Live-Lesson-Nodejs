import { resolvePromise } from './utils';

const enum State {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
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

        // 详细版
        return value.then(
          (val) => {
            resolve(val);
          },
          (reason) => {
            reject(reason);
          }
        );
      }

      if (this.state !== State.Pending) {
        return;
      }

      this.state = State.Fulfilled;
      this.result = value;
      this.onFulfillCallbacks.forEach((fn) => fn());
    };

    const reject = (reason: any) => {
      // 调用失败，直接失败
      if (this.state !== State.Pending) {
        return;
      }

      this.state = State.Rejected;
      this.result = reason;
      this.onRejectCallbacks.forEach((fn) => fn());
    };

    try {
      // 同步执行
      execute(resolve, reject);
    } catch (err) {
      reject(err);
      console.log('--execute error', err);
    }
  }

  /**
   * then() 返回 Promise 实例，实例的状态和结果
   * let p = new Promise((resolve, reject) => {.....})
   * let p2 = p.then( val => {...} )
   *  p2 的状态由 回调函数返回值决定，回调函数返回值：
   *    1、基本类型
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
        // 都可以，如果使用 this.result  那就没必要写形参
        this.onFulfillCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfill(this.result);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });

        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onReject(this.result);
              // 放入异步，因为 promise2
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });

        // todo: 可以吗
        return;
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

        // todo: 可以吗
        return;
      }

      if (this.state === State.Rejected) {
        setTimeout(() => {
          try {
            const x = onReject(this.result);
            // 放入异步，因为 promise2
            resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        }, 0);

        // todo: 可以吗
        return;
      }
    });

    return promise2;
  }

  // todo: YYDS
  static resolve(val?: any) {
    if (val instanceof _Promise) {
      return val;
    }

    return new _Promise((resolve) => {
      resolve(val);
    });
  }

  static resolveSleep(val?: any, duration = 1500) {
    return new _Promise((r) => {
      setTimeout(() => {
        r(val);
      }, duration);
    });
  }
}
