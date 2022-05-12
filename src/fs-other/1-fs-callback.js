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

// 删除深文件夹
function rmdir(rootPath, callback) {
  // 1. 读取这个根的一级内容，[b, d, f.js]
  fs.readdir(rootPath, (err, dirs) => {
    if (err) {
      callback(err);
      return;
    }

    // [ rootPath, ..... ] 子节点路径
    const deepPaths = dirs.map((dir) => join(rootPath, dir));
    // console.log(deepPaths);

    // 2. 空文件夹，空树
    if (deepPaths.length === 0) {
      fs.rmdir(rootPath, (err) => {
        if (err) {
          callback(err);
          return;
        }
      });
      return;
    }

    // 2. 判断一级内容，是文件还是文件夹
    // 若是文件则删除，反之递归调用 rmdir
    deepPaths.forEach((_path) => {
      fs.stat(_path, (err, state) => {
        if (err) {
          callback(err);
          return;
        }
        if (state.isFile()) {
          fs.unlink(_path, callback);
          return;
        } else {
          // 又是一个文件夹，似曾相识的感觉，那就递归 rmdir。
          // 相当于递归子树了
          rmdir(_path, callback);
          return;
        }
      });
    });

    // 走到这里说明？
    // deepPaths.forEach 删除完了，即根的直接子节点删除完了
    // 但是，不对，上面是异步代码，怎么等到他们删除完了，再来通知我呢？
    // todo: 又涉及到了异步迭代问题，串行，等他们删除了再来通知我。
    // todo: 孩子删除后在删除自己
  });
}

rmdir(join("a"), (err) => {
  console.log("ERROR", err);
});
