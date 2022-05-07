var obj = {
  name: 'Gwj',
  age: 21,
  sex: 1,
};

console.log('\n\n\n\n\n\n\n');

function* read() {
  // 将函数分割
  // 遇到 yield 就暂停，并返回 yield 右侧的表达式
  yield 1;
  yield 2;
  yield 3;
  return 4; // 走到 return， done: true
}

// it 迭代器，迭代器有个特点：迭代完了游标不会复原
var it = read();

// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log('会执行？');

/**================================== 类数组 **/
// console.log('\n\n\n\n\n\n\n');
// let arr = [1, 2, 3, 4];
// let it2 = arr[Symbol.iterator]();

// for (let item of arr[Symbol.iterator]()) {
//   console.log(item, '--1');
// }

// for (let item of arr[Symbol.iterator]()) {
//   console.log(item, '--2');
// }

/**================================== 迭代器 - 非 gen 函数**/
var obj = {};
obj[Symbol.iterator] = function () {
  const Total = 4;
  let i = 0;

  return {
    next() {
      return { value: i++, done: i > Total };
      // { value: 4, done: true }  当 done === true 时，不会输出
    },
  };
};

console.log([...obj]);

/**================================== 迭代器 - 非 gen 函数**/
var obj = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
obj[Symbol.iterator] = function () {
  const _this = this;
  let i = 0;
  // closure

  // 会自动循环调用 xx.next()
  return {
    next() {
      return { value: _this[i], done: i++ === _this.length };
    },
  };
};

console.log('-- 类数组 非gen', [...obj]);

var it = obj[Symbol.iterator]();
// Error 说 it 不是一个迭代器对象
// console.log('-- 类数组 迭代对象', [...it]);
// console.log('-- 类数组 迭代对象', [...it]);

/**================================== 迭代器 - gen 函数 **/
var obj = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
obj[Symbol.iterator] = function* read() {
  for (let i = 0; i < this.length; i++) {
    yield this[i];
  }
};

// read 是生成器函数， read() 返回的是 迭代器对象
console.log('-- 类数组 gen 函数', [...obj]);

var it = obj[Symbol.iterator]();
console.log('-- 类数组 gen 迭代对象', [...it]);
console.log('-- 类数组 gen 迭代对象', [...it]);
