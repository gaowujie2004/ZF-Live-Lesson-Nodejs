# 柯里化

add(1)(2)(3)，每一次只能传一个
函数的参数列表要确定，即 length !== 0，也不能出现 ... 剩余运算符

# 扁函数

是一种特殊的柯里化，可以传多个，add(2,3)(1)

# 更灵活的

```js
function add(...params) {
  return params.reduce((v, temp) => v + temp);
}

+add(1, 2, 3)(4);
// print 10
```
