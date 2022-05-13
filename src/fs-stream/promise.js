// 与 all，对立。
// 有一个成功，any() 就返回成功的 promise，
// 反之，有失败的，全部为失败 any() 才返回失败的 promise，
// any([])  失败的

// 利用 all 反向实现
Promise.any = (promises) =>
  Promise.all(
    promises.map((p) =>
      p.then(
        (val) => Promise.reject(val),
        (err) => err
      )
    )
  ).then(
    (errs) => Promise.reject(errs),
    (val) => val
  );

// 编写原生
// 有一个成功，则成功
Promise.any = (promises) =>
  new Promise((resolve, reject) => {
    let count = 0;
    let len = promises.length;
    let errs = [];

    if (promises.length === 0) {
      reject('不能是空的');
      return;
    }

    for (let i = 0; i < len; i++) {
      promises[i].then(
        (val) => resolve(val),
        (err) => {
          errs[i] = err;
          if (++count >= len) {
            reject(errs);
          }
        }
      );
    }
  });

function asyncSleep(delay, isResolve = true, resultValue = null) {
  return new Promise((resolve, reject) => {
    let execute;

    if (typeof isResolve === 'function') {
      execute = isResolve;
    } else {
      execute = isResolve ? resolve : reject;
    }

    setTimeout(() => {
      execute(resultValue);
    }, delay);
  });
}

// const p1 = asyncSleep(1000, true, 'ok1');
// const p2 = asyncSleep(2000, true, 'ok2');
const e1 = asyncSleep(500, false, 'err1');
const e2 = asyncSleep(900, false, 'err2');

Promise.any([e1, e2]).then(
  (val) => {
    console.log('成功', val);
  },
  (errs) => {
    console.log('失败---', errs);
  }
);
