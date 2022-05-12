/**
 * 目标：实现删除一个深文件夹，即删除 a 文件夹，但 a 有还有文件夹和文件。
 *
 * 类似于一颗树结构，假如用 C 去实现，那必须得遍历每个节点，手动释放，因为没有GC
 * 如果是 JS 则直接删除根引用即可，其他的交给垃圾回收器。
 *
 * 删除，类似于后序遍历。
 */

const fs = require("fs");
const path = require("path");
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

// 删除深文件夹 —— 异步迭代，类似 co
function rmdir(rootPath, callback) {
  fs.stat(rootPath, (err, state) => {
    if (err) {
      callback(err);
      return;
    }

    if (state.isFile()) {
      fs.unlink(rootPath, callback);
    } else {
      // rootPath 子树，子文件夹了。
      // 1. 读取这个根的一级内容，[b, d, f.js]
      fs.readdir(rootPath, (err, dirs) => {
        if (err) {
          callback(err);
          return;
        }

        // [ rootPath+'', ..... ] 子节点路径
        const childrenPaths = dirs.map((dir) => join(rootPath, dir));
        // console.log(childrenPaths);

        // 2. 空文件夹，空树
        if (childrenPaths.length === 0) {
          fs.rmdir(rootPath, callback);
          return;
        }

        // 3. 注意，这里是串行的
        /**
         * 比如 a/b  a/d  删除完b，才能去删除d
         * 很明显，对于同一个父节点的子节点们，他们并行就行，只要子树都删除完了就行。
         */

        let childRemoveCount = 0;
        // next 形成一个闭包函数,
        function next() {
          // 进行什么操作？
          // todo: 孩子删除后在删除自己
          if (childRemoveCount === childrenPaths.length) {
            fs.rmdir(rootPath, callback);
            return;
          }
          const currentDeletePath = childrenPaths[childRemoveCount++];
          rmdir(currentDeletePath, next);
        }
        next();
        // todo: 又涉及到了异步迭代问题，串行，等他们删除了再来通知我。
      });
    }
  });
}

rmdir(join("a"), (err) => {
  console.log("ERROR", err);
});
