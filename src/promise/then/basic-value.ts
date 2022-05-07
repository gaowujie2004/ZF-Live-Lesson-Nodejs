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
      if (this.state !== State.Pending) {
        return;
      }
      this.state = State.Fulfilled;
      this.result = value;

      this.onFulfillCallbacks.forEach((fn) => fn(this.result));
    };
    const reject = (reason: any) => {
      if (this.state !== State.Pending) {
        return;
      }
      this.state = State.Rejected;
      this.result = reason;

      this.onRejectCallbacks.forEach((fn) => fn(this.result));
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
   * 由 then(onFulfill, onReject) onFulfill onReject 返回值决定
   * @return Promise
   */
  then(onFulfill?: (val: any) => any, onReject?: (reason: any) => any) {
    // this -> promise1
    const promise2 = new _Promise((resolve, reject) => {
      if (this.state === State.Pending) {
        this.onFulfillCallbacks.push((val) => {
          try {
            const fn = onFulfill || noop;
            const res = fn(val);
            resolve(res);
          } catch (err) {
            reject(err);
          }
        });
        this.onRejectCallbacks.push((reason) => {
          try {
            const fn = onReject || noop;
            const res = fn(reason);
            resolve(res);
          } catch (err) {
            reject(err);
          }
        });
      }

      if (this.state === State.Fulfilled) {
        try {
          const res = onFulfill(this.result);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      }
      if (this.state === State.Rejected) {
        try {
          const res = onReject(this.result);
          reject(res);
        } catch (err) {
          reject(err);
        }
      }
    });

    return promise2;
  }
}

new _Promise((resolve, reject) => {});
