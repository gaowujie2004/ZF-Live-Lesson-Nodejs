import { _Promise } from '.';

/**
 * ``` js
 * const promise2 = p1.then(
 *    function onFulfillCallbacks(val) { return 'x' },
 *    function onRejectCallbacks(reason) { throw 'x'  }
 * );
 * ```
 * @param promise2  如上所示
 * @param x         onFulfillCallbacks/onRejectCallbacks 回调函数的返回值；是 promise2 的结果值
 * @param resolve   与 promise2 关联的，调用后改变 promise2 的状态
 * @param reject    与 promise2 关联的，调用改改变 promise2 的状态
 * 
 * @description     若 x 还是一个 Promise 实例，则 promise2 的状态和值将和 x 保持一致，但 x !== promise2
 * @description     若 x 非 Promise 实例，则 promise2 的状态是成功的，且 promise2 结果值是 x
 * @description     若 onFulfillCallbacks/onRejectCallbacks throw Error，则 promise2 是失败的，且值是 Error value
 * 
 
 * 废话版：负责解析 x 和 promise2 之间的关系 ， p1.then(onCallback, onCallback)， onCallback 函数调用后的返回值是 x
 * 解析 promise2 和 x之间的关系 来判断promise2 走 resolve 还是  reject
 * resolve、reject 和 promise2 是一起的。
 */
export function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    /**
     * 就像下面这种：.then callback 是异步执行，能拿到 p
     * let promise2 = Promise.resolve().then((val) => promise2);
     */
    throw new TypeError('hh');
  }

  // x 可能是个promise，引用类型
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // promise 的实例可能是别人的 API 生成的。
    // 也就是 _Promise.resolve(1).then( val => Promise.resolve(90999999)  )
    /**
     * ```js
     * _Promise
     *  .resolve(1)
     *  .then(val => {
     *    return new Promise((resolve, reject) => {
     *      resolve(1);
     *      reject(2222);
     *    })
     *  })
     * ```
     */
    // todo: ！！！！！！！！！ 不懂
    let called = false;

    // x.then 可能是个 getter 那就可能会报错
    try {
      let then = x.then; // 缓存出来，因为 x.then 可能是个 getter 可能会耗性能
      if (typeof then === 'function') {
        // x is Promise instance,
        // todo: 费脑筋 start  ————————————————
        // 相当于 x.then(....)，但为了使用缓存下来的 then 函数，只能这样做了
        then.call(
          x, // then 内部有 this
          (y) => {
            // y 啥？ x promise 的结果值。
            // x promise 的结果值作为 promise2 的值
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            // 同理 r，和 y 是一样的道理
            if (called) return;
            called = true;
            // todo: 遇到错误直接改变状态，不像 resolve 那样，深度解析
            reject(r);
          }
        );
        // todo: 费脑筋 end ————————————————————
      } else {
        // 结论：x 是引用值，但不是 Promise 实例.
        // 详细：如果 x 是 Promise 实例，那么就必须要有 then 属性
        //      但走到这里说明，x 没有 then 属性
        resolve(x);
      }
    } catch (err) {
      // x.then getter 报错，可能用的是别人的 promise 实例
      if (called) return;
      called = true;
      reject(err);
    }
  } else {
    // 非 Promise 实例值
    resolve(x);
  }
}

export function asyncSleep() {}
