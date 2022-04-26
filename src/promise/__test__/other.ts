import { _Promise } from '../index';

let p = _Promise.resolve(_Promise.resolve(_Promise.resolve(9000)));

//从右往左，执行的。
// 打印 9000
p.then((val) => {
  console.log(val);
});

let p2 = _Promise.resolve(_Promise.reject(11111));
p2.then(null, (reason) => {
  console.log('p2-- reject', reason);
});

_Promise
  .reject(55555)
  .finally(() => {
    return new _Promise((r) => {
      setTimeout(r, 4000);
    });
  })
  .catch((reason) => console.log('catch --', reason)); // 输出 5555
