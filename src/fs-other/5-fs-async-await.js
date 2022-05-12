/**
 * 目标：实现删除一个深文件夹，即删除 a 文件夹，但 a 有还有文件夹和文件。
 *
 * 使用 async-await，以及 fs/promise 文件系统，最终形态
 * 好处：
 * 1、统一处理错误（也能够针对某个处理）
 * 2、很简洁，易懂
 */

const fs = require("fs/promises");
const path = require("path");
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

// 删除深文件夹 —— Promise
async function rmdir(rootPath) {
  const rootState = await fs.stat(rootPath);

  // rootPath，是叶子节点，是文件
  if (rootState.isFile()) {
    return fs.unlink(rootPath);
  }

  // rootPath，是父节点，是文件夹
  let childrenPaths = await fs.readdir(rootPath);
  childrenPaths = childrenPaths.map((dir) => join(rootPath, dir));

  // 并行删除兄弟节点，IO是多线程的
  let resList = childrenPaths.map((childPath) => rmdir(childPath));
  await Promise.all(resList);

  // 子节点全部删除完，再删除自身
  await fs.rmdir(rootPath);
}

rmdir(join("a"))
  .then((val) => {
    console.log("--删除成功");
  })
  .catch((err) => {
    console.log("--删除失败！！", err);
  });
