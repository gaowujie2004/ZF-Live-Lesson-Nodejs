import { OtherPromise } from './base_err';

const promise = new Promise((resolve, reject) => {
  resolve('success');
});

promise.then((value) => {
  // 别人家错误的promise ,是指 resolve、reject 内部没有做判断
  let p = new OtherPromise((resolve, reject) => {
    setTimeout(() => {
      resolve(123);
      reject(456); // 如果不屏蔽 会先后触发 后续的 成功和失败
    });
  });

  p.then(
    (data) => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    }
  );

  return p;
});
