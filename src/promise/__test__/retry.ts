import { _Promise } from '../index';

function getUserName() {
  return new _Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() <= 0.7) {
        reject(null);
      } else {
        resolve(null);
      }
    }, 400);
  });
}

let globalCount = 0;
const GlobalResolveNumber = 2;
function getUserNameGlobalCount() {
  return new _Promise((resolve, reject) => {
    setTimeout(() => {
      globalCount++;

      if (globalCount <= GlobalResolveNumber) {
        reject('error');
      } else {
        resolve('yes');
        console.log(11);
      }
    }, 400);
  });
}

_Promise
  .retry(getUserNameGlobalCount, { count: 5 }, () => {
    console.log('重试--');
  })
  .then(() => {
    console.log('--resolve');
  })
  .catch(() => {
    console.log('---- reject');
  });
