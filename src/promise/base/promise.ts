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
      console.log('--exce error', err);
    }
  }

  /**
   * 1、this 的 state 可能改变，也可能未改变
   * 2、只考虑 onFulfill、onReject 执行返回非 promise 的情况
   * @return Promise
   */
  then(onFulfill?: (val: any) => any, onReject?: (reason: any) => any) {
    if (this.state === State.Pending) {
      // 需要
      this.onFulfillCallbacks.push(onFulfill || noop);
      this.onRejectCallbacks.push(onReject || noop);
    }

    if (this.state === State.Fulfilled) {
      onFulfill(this.result);
    }
    if (this.state === State.Rejected) {
      onReject(this.result);
    }
  }
}

new _Promise((resolve, reject) => {});
