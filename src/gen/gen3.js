/**
 * gennerator 函数有等待的感觉
 * yield 产出的结果，可以等待产出的结果执行完毕后，再继续向下执行
 */

/**================================== 让异步代码，更像同步 **/
const fs = require('fs/promises');
const path = require('path');

function* read() {
  // try {
  let name = yield fs.readFile(path.join(__dirname, './file/name'), 'utf-8');
  xxxxxxxx()();

  let userInfo = yield fs.readFile(path.join(__dirname, './file/', name), 'utf-8');

  // console.log('用户信息--', userInfo);
  return userInfo;
  // } catch (err) {
  //   console.log('dao 这里来', err);
  //   return 9090;
  // }
}

var it = read();

// var { value, done } = it.next(); // value 是第一个yield产出的 promise
// it.throw('hhhhh');
try {
  it.next();
  it.next(); // 👈🏻 抛出的错误
  console.log('-- 不执行');
  it.throw();
} catch (err) {
  console.log('居然进来了', err);
}
// console.log('会到这里吗', value, done);

// value
//   .then((res) => {
//     // 现在是第二次调用 it.next 所以把 res 传递给上一次 yield 表达式
//     var { value, done } = it.next(res);

//     // value 是第二次 yield 产出的 promise
//     value
//       .then((res) => {
//         console.log(res, done);

//         var { value, done } = it.next(res);
//         // 完成
//         console.log(value, done);
//       })
//       .catch((err) => {
//         it.throw(err);
//       });
//   })
//   .catch((err) => {
//     it.throw(err);
//   });
