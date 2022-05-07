function* read() {}

function co(it) {
  // it 遍历器对象
  return new Promise((resolve, reject) => {
    function next(yieldValue) {
      const { value, done } = it.next(yieldValue);
      if (done) {
        return resolve(value);
      }

      // done === false
      Promise.resolve(value)
        .then((res) => {
          // res: yield Promise 的结果值
          next(res);
        })
        .catch((reason) => {
          // todo: 费脑筋
          try {
            const okRes = it.catch(reason);
            next(okRes);
          } catch (err) {
            reject(err);
          }

          let ret;
          try {
            ret = it.catch(reason);
          } catch (err) {
            return reject(err);
          }
          next(ret);
        });
    }

    next();
  });
}

// read 生成器函数
co(read()).then((val) => {});
