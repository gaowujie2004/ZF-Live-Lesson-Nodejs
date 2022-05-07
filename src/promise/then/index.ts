import { _Promise } from './basic-value';
// then 链

Promise.resolve().then(
  (val) => {},
  (reason) => {}
);

let pAsync = new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('pAsync-val-setTimeout');
  }, 2000);
  resolve('ok');
});

let promise2 = pAsync.then((val) => {
  console.log(val, 'promise 1');
  return 90;
});

promise2.then((val) => {
  console.log('promise2', val);
});

// pAsync.then((val) => {
//   console.log(val, 'pAsync-2');
// });

/**
 * let promise2 = Promise
  .resolve(11)
  .then(val => {
    return Promise.resolve(222);
  })
 */

/**
 * p.then(val => {}, reason => {})
 */

Promise.resolve(111)
  .then()
  .then((val) => console.log(val));
