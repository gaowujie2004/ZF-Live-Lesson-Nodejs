# 遍历器函数统一遍历

提供统一的遍历机制，无论什么样的数据结构：数组、字符串、关联数组、Set、Map、DOM 集合 等等
给他们提供统一的遍历能力。

主要通过，Symbol.iterator 和 for of 来实现，很显然 for of 是消费者。而 Symbol.iterator 是提供者

类数组：有可遍历属性，有索引，有 length

如果一个值有 [Symbol.iterator] ，并且是函数，那么 for of 会自动帮我们调用这个迭代器函数

可以通过元编程，修改语言的默认底层行为。比如 Symbol.iterator、Symbol.toStringTag。

当一个数据类型，有 Symbol.iterator 属性，并且值是一个函数，一个 it 遍历器对象，有 next 方法，next 方法返回 { value: any, done: boolean }
那么这个数据结构，就具备迭代器。

如果是一个生成器函数，那么则会帮我们调用。
如果是迭代对象，那么消耗完就没了。

# yield fs.readFile() ...... 手动

# gen 函数

还能解决 Promise 不优雅的问题，但使用起来还是有些不舒服：

# 根据上面的，封装写一个 CO 模块

# 状态机，不停地修改状态。

# async = CO + Promise

co 就是 遍历器语法脚本腻子，async 和 遍历器函数都需要在编译时期
先转换一次。

当然，gen 函数，还是需要在本地编译阶段，依赖 babel 将其转换，运行时再依赖 co 第三方模块
