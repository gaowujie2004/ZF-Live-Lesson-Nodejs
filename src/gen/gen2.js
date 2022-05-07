/**================================== gen 函数详解 **/

// 生成器 gen 函数，next() 传参
// 迭代器对象.next() 碰到 yield 就暂停了。

// 生成器函数
function* read() {
  try {
    let a = yield 'a';
    console.log('read--a', a);

    // xxxxx();

    let b = yield 'bbb';
    console.log('read--b', b);

    let c = yield 'cccccc';

    console.log('read--c', c);

    return '生成器函数返回值';
  } catch (e) {
    console.log('---- ERROR Catch', e);
    xxxxx();

    yield 909090;
    // return 90;
  }
}

// it 迭代器对象
var it = read();

// next(实参)，实参传递给上一个 yield 表达式
// next() 从上一次暂停的地方开发，再次遇到 yield 就暂停
console.log('--第一次', it.next('vue'));
console.log('----第二次', it.next('react'));

console.log('it.throw()', it.throw('throw'));
// console.log('it.return()', it.return(9090));

console.log('------第三次', it.next('node'));
console.log('--------第四次', it.next('returnValue'));
console.log('--------第四次', it.next('returnValue'));
