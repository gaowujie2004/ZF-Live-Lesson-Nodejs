# 柯里化

函数的参数列表要确定，即 length !== 0，也不能出现 ... 剩余运算符

# 扁函数

# 更灵活的

```js
function add(...params) {
  return params.reduce((v, temp) => v + temp);
}

+add(1, 2, 3)(4);
// print 10
```
