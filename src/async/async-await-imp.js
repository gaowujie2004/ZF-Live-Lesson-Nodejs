const fs = require('fs/promises');
const path = require('path');

// co
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg); // it.next(arg) || it.throw(arg)
    var value = info.value; // info -> { value:xxx, done:boolean }
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

// co
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args); // gen 就是 it 迭代器对象
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function read() {
  return _read.apply(this, arguments);
}

function _read() {
  _read = _asyncToGenerator(
    regeneratorRuntime.mark(function _callee() {
      var name, userInfo;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return fs.readFile(path.join(__dirname, './file/name'), 'utf-8');

            case 2:
              name = _context.sent;
              _context.next = 5;
              return fs.readFile(path.join(__dirname, './file', name), 'utf-8');

            case 5:
              userInfo = _context.sent;
              return _context.abrupt('return', userInfo);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _read.apply(this, arguments);
}

/**
 * async + await = generator + co(包裹gen函数生成 promise)
 * async 函数返回的是 promise
 *
 * generator 可以配合 promise 实现异步流控制，但是需要 co 模块，得手动引入很麻烦。
 *
 * 于是有了 async，底层会帮我们手动引入 co + generator
 *
 * 异步的发展流程：
 * 回调嵌套 （发布订阅，高阶函数等） -> promise -> generator + promise + co -> async-await
 */

read().then();
