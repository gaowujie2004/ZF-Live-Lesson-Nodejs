import { _Promise } from './promise';

Promise.resolve().then(
  (val) => {},
  (reason) => {}
);

let pSync = new _Promise((resolve, reject) => {
  resolve('pSync-val');
});

pSync.then((val) => {
  console.log(val, 'pSync-1');
});

pSync.then((val) => {
  console.log(val, 'pSync-2');
});

let pAsync = new _Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('pAsync-val-setTimeout');
  }, 2000);
});
pAsync.then((val) => {
  console.log(val, 'pAsync-1');
});

pAsync.then((val) => {
  console.log(val, 'pAsync-2');
});
