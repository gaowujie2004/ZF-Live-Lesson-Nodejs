// co 就是迭代 gen 函数的

const fs = require('fs/promises');
const path = require('path');

function* read() {
  let name = yield fs.readFile(path.join(__dirname, './file/name'), 'utf-8');

  xxxxxxxx();
  let userInfo = yield fs.readFile(path.join(__dirname, './file', name), 'utf-8');
  // xxxx();
  let ret = yield `${name} -- ${userInfo}`;

  // console.log('用户信息--', userInfo);
  return ret;
}

function co(it) {
  // it 遍历器对象
  return new Promise((resolve, reject) => {
    // Promise 执行器内 throw，会被捕获的，不用担心

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
          // next() 调用报错的话，不用担心，then() 后面的 catch
        })
        .catch((reason) => {
          // todo: 费脑筋
          console.log('--到这里了', reason);
          try {
            // 为什么用 try 包裹，因为 read 生成器函数内部可以没有 try catch
            const okRes = it.throw(reason);
            console.log('-- 不会');
            next(okRes);
          } catch (err) {
            console.log('--继续被 catch', err);
            reject(err);
          }

          // let ret;
          // try {
          //   ret = it.catch(reason);
          // } catch (err) {
          //   return reject(err);
          // }
          // next(ret);
        });
    }

    next();
  });
}

// read 生成器函数
co(read())
  .then((val) => {
    console.log('遍历器 OK ---', val);
  })
  .catch((reason) => {
    console.log('--遍历器 ERR', reason);
  });

// todo: 缺点，还得用 co 嵌套一下

// const it = read();
// console.log('--第一次', it.next());
// console.log('--第二次', it.next());

// console.log('-- buhui');

// new Promise((resolve, reject) => {
//   function ERR() {
//     xxxx()()();
//   }

//   Promise.resolve(1).then((val) => {
//     ERR();
//   });

//   ERR();
// })
//   .then((val) => {
//     console.log('最终成功', val);
//   })
//   .catch((err) => {
//     console.log('--最终失败', err);
//   });
