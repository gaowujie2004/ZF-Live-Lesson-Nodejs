用 gen 函数配合 yield 也可以，但是每一次需要自己引入 co 包，
才能想 async 函数那样，很麻烦。

于是有了 async 函数，他就是帮我们引入 co 模块，即 co + gen（函数编译）仅此而已。

regeneratorRuntime API
https://gist.github.com/paraself/6ab01551bd645a23b9bcb203bc99ef48
