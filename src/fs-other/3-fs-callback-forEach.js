/**
 * 目标：实现删除一个深文件夹，即删除 a 文件夹，但 a 有还有文件夹和文件。
 *
 * fs-callback-co.js 的问题是，递归是串行的。
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

        // 3. 异步删除兄弟节点
        let count = 0;
        function done() {
          // 等孩子节点都删除完了，再删除自己
          if (++count === childrenPaths.length) {
            fs.rmdir(rootPath, callback);
          }
        }

        // 异步并行 for循环是并行的  递归是串行的
        childrenPaths.forEach((childPath) => {
          rmdir(childPath, done);
        });
      });
    }
  });
}

rmdir(join("a"), (err) => {
  console.log("ERROR", err);
});
