// gen 函数，是语法层面的，怎么用 babel 降级呢？
// gen 函数如何去实现呢？
function* read() {
  let a = yield 'vue';

  console.log(a, 'a');
  let b = yield 'vite';

  console.log(b, 'b');
  let c = yield 'node';

  console.log(c, 'c');
}

// 这是生成器函数的调用方式，用户和JS引擎都已这种方式调用
var it = read();
console.log('--第一次', it.next());
console.log('--第二次', it.next('第二次'));
console.log('--第三次', it.next());
console.log('--第四次', it.next());

/**================================== gen函数 Babel 实现 **/
var regeneratorRuntime = {
  mark(read) {
    return read;
  },
  wrap(iteratorFn) {
    // _context 闭包，参数缓存起来了
    const _context = {
      prev: 0,
      next: 0,
      sent: undefined,
      done: false,
      stop() {
        _context.done = true;
        return undefined;
      },
    };

    // it
    return {
      /**
       * @param {*} value 接收的值，传递给上一次 yield 表达式；
       * @return - { value: yield value, done: boolean }
       */
      next(value) {
        _context.sent = value;
        const yieldValue = iteratorFn(_context);

        // todo: done 如何判断？
        return { value: yieldValue, done: _context.done };
      },
    };
  },
};

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(read);

function read() {
  var a, b, c; // 用户代码中用，接收 yield 表达式值的变量
  return regeneratorRuntime.wrap(function read$(_context) {
    //  read$ iteratorFn

    // 下面看上去很像无限循环，但不是。
    // 要表达的意思是：read$ 函数会调用多次，表示一个有限状态机
    while (1) {
      switch ((_context.prev = _context.next)) {
        case 0:
          _context.next = 2;
          return 'vue'; // 用户代码 yield 值

        case 2:
          a = _context.sent;
          console.log(a, 'a'); // 用户代码
          _context.next = 6;
          return 'vite'; // 用户代码 yield 值

        case 6:
          b = _context.sent;
          console.log(b, 'b'); // 用户代码
          _context.next = 10;
          return 'node'; // 用户代码 yield 值

        case 10:
          c = _context.sent;
          console.log(c, 'c'); // 用户代码

        case 12:
        case 'end':
          return _context.stop(); // 用户代码没有 return，那就默认 return undefined
      }
    }
  }, _marked);
}
// wrap 的使用会传入编译后的函数（变成了switch case的模式将用户gen函数进行拆分，根据_context.next 来决定执行对应的逻辑）
// wrap函数的返回结果是迭代器迭代器要有next方法 （next函数）
// 每次用户会调用next方法，传入对应的值， 这个值会被保留在_context.sent上， 走下一次调用函数的时候将其取出赋值给变量

// 这是生成器函数的调用方式，用户和JS引擎都已这种方式调用
var it = read(); // 返回迭代器对象
console.log('--第一次', it.next());
console.log('--第二次', it.next('第二次'));
console.log('--第三次', it.next());
console.log('--第四次', it.next());
