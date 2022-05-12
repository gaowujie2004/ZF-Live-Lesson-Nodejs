/**
 * 目标：实现删除一个深文件夹，即删除 a 文件夹，但 a 有还有文件夹和文件。
 *
 * 使用 promise 改造，fs-callback-forEach，不使用回调函数形式
 */

const fs = require("fs");
const path = require("path");
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

// 删除深文件夹 —— Promise
function rmdir(rootPath) {
  return new Promise((resolve, reject) => {
    fs.stat(rootPath, (err, state) => {
      if (err) {
        reject(err);
        return;
      }

      // 当前叶子节点删除完成
      if (state.isFile()) {
        fs.unlink(rootPath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        // rootPath 子树，子文件夹了。
        // 1. 读取这个根的一级内容，根的直接子节点们，[b, d, f.js]
        fs.readdir(rootPath, (err, dirs) => {
          if (err) {
            reject(err);
            return;
          }

          // [ rootPath+'', ..... ] 子节点路径
          const childrenPaths = dirs.map((dir) => join(rootPath, dir));
          // console.log(childrenPaths);

          // 2. 异步删除兄弟节点
          // 已经包含了，根没有子节点的情况
          // 异步并行， IO多线程
          let resList = childrenPaths.map((childPath) => rmdir(childPath));
          Promise.all(resList)
            .then(() => {
              // 子节点都删除完了，或没有子节点
              fs.rmdir(rootPath, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            })
            .catch(reject);
        });
      }
    });
  });
}

rmdir(join("a"))
  .then((val) => {
    console.log("--删除成功");
  })
  .catch((err) => {
    console.log("--删除失败！！", err);
  });
