# 4-23

主要是手写 Promise

# 高阶组件

利用闭包，缓存变量

# 柯里化

# 作业 1：实现一个通用的 合理化函数，

# 作业 2：反柯里化，借助 call、apply

# 异步并行：回调 + 计算器

可以用发布订阅，解耦合。
观察者模式，被观察者比较主动。发布订阅，发布者比较主动

观察者模式 ，观察者 + 被观察者，emit 由 被观察者触发。被观察者提供订阅， 被观察者提供发布。

# promise

then() 调用时，分两种情况：
1、pending ， 这就是没有调用 resolve、reject 函数，入队
2、非 pending，将执行回调函数（异步）

resolve/reject 调用，判断状态，执行队列暂存的

## 1 单个 then，同一个 promise 多个 then

支持异步调用 resolve, reject

## 2 then 链（为什么需要 then callback 是异步调用）

## 3 then 穿透

resolve 具备等待功能 Promise.resolve( 又是 promise ), 解析里面的
reject 直接失败，不继续解析。

## 4 other api 实现

race 超时处理
withAbort (模拟 promise 中断，并不是真正的中断)

# 代码仓库

https://gitee.com/jw-speed/jiagouke4-23-node
