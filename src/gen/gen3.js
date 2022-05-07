/**
 * gennerator 函数有等待的感觉
 * yield 产出的结果，可以等待产出的结果执行完毕后，再继续向下执行
 */

/**================================== 让异步代码，更像同步 **/
const fs = require('fs/promises');
const path = require('path');

function* read() {
  let name = yield fs.readFile(path.join(__dirname, './file/name'), 'utf-8');
  let userInfo = yield fs.readFile(path.join(__dirname, './file/', name), 'utf-8');

  // console.log('用户信息--', userInfo);
  return userInfo;
}

var it = read();

var { value, done } = it.next(); // value 是第一个yield产出的 promise

value
  .then((res) => {
    // 现在是第二次调用 it.next 所以把 res 传递给上一次 yield 表达式
    var { value, done } = it.next(res);

    // value 是第二次 yield 产出的 promise
    value
      .then((res) => {
        console.log(res, done);

        var { value, done } = it.next(res);
        // 完成
        console.log(value, done);
      })
      .catch((err) => {
        it.throw(err);
      });
  })
  .catch((err) => {
    it.throw(err);
  });
