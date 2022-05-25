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

  // todo: YYDS
  static resolve(val: any) {
    if (val instanceof _Promise) {
      return val;
    }

    return new _Promise((resolve) => {
      resolve(val);
    });
  }

  static reject(reason: any) {
    return new _Promise((_, reject) => {
      reject(reason);
    });
  }

  static resolveSleep(val?: any, duration = 1500) {
    return new _Promise((r) => {
      setTimeout(() => {
        r(val);
      }, duration);
    });
  }

  static rejectSleep(val?: any, duration = 1500) {
    return new _Promise((_, reject) => {
      setTimeout(() => {
        reject(val);
      }, duration);
    });
  }

  // 只要有一个 reject，则 all() 返回 这个失败的promise
  // 都为成功，all() 返回成功的，val 是数组按照顺序的 val
  static all(promiseList: _Promise[]) {
    return new _Promise((resolve, reject) => {
      const resList = [];
      let count = 0;
      promiseList.forEach((p, pIndex) => {
        // then callback 是异步的
        Promise.resolve(p).then(
          (val) => {
            resList[pIndex] = val;
            if (++count >= promiseList.length) {
              // todo: 不能使用 resList.length
              // 所以 let count 一个计数器
              resolve(resList);
            }
          },
          reject
          // (reason) => {
          //   reject(reason);
          // }
        );
      });
    });
  }

  static allSettled(promiseList: _Promise[]) {
    return new _Promise((resolve) => {
      const resList = [];
      let count = 0;

      function processMap(key, val) {
        resList[key] = val;
        if (++count >= promiseList.length) {
          resolve(resList);
        }
      }

      promiseList.forEach((p, pIndex) => {
        Promise.resolve(p).then(
          (value) => {
            processMap(pIndex, {
              value,
              status: State.Fulfilled,
            });
          },
          (reason) => {
            processMap(pIndex, {
              reason,
              status: State.Rejected,
            });
          }
        );
      });
    });
  }

  /**
   * then() 返回 Promise 实例，实例的状态和结果，
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
        this.onFulfillCallbacks.push((val) => {
          setTimeout(() => {
            try {
              const x = onFulfill(val);
              resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          }, 0);
        });
        this.onRejectCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              const x = onReject(reason);
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

  /**
   * @return Promise 实例
   * return Promise 状态由 onReject 决定，和 then 一样
   */
  catch(onReject: (reason: any) => any) {
    // 不用再判断非法值，因为 then 内部会做处理
    return this.then(undefined, onReject);
  }

  /**
   * todo: 坑
   * p.finally(......) 返回的是 p
   * 如果这样那就有问题了，正确的 Promise，是会等待 finally callback 的promise
   * 只不过不使用 finally callback return 的值
   *
   * Promise
   *  .reject(55555)
   *  .finally(() => {
   *     return new Promise(r => {
   *        setTimeout(r, 4000)
   *     })
   *   })
   *  .catch(reason => console.log('catch --', reason))  // 输出 5555
   */
  finallyError(callback: () => void) {
    this.then(
      () => {
        callback();
      },
      () => {
        callback();
      }
    );

    return this;
  }

  // p.finally(......) 返回的是 p
  // this -> p
  finally(callback: () => void) {
    return this.then(
      (val) => {
        return Promise.resolve(callback()).then(() => val);
      },
      (reason) => {
        return Promise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }
}
