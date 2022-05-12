// 递归删除文件夹中的文件/文件夹

const fs = require("fs");
const path = require("path");

const join = (...args) => {
  return path.join(__dirname, ...args);
};

/**
 * fs.unlink 删文件，不存在则报错
 * fs.rmdir  (****) 删除文件夹，不存在则报错，如果有子文件夹/子文件，不能从根删除。
 * fs.stat   查看文件/文件夹状态，不存在则报错
 * fs.access 查看文件/文件夹可方文星，不存在则报错
 *
 * fs.readdir  读取当前文件夹的内容，返回的是数组路径，当前文件夹不存在则报错
 */

/**================================== 不存在则有错误 **/
// console.log(join("./a"));
// fs.stat(join("./a"), (err, state) => {
//   console.log(err, state);
// });

// fs.rmdir(join("0"), (err) => {
//   console.log(err);
// });

// fs.unlink(join("0"), (err) => {
//   console.log(err);
// });

// fs.access(join("0"), (err) => {
//   console.log(err);
// });

fs.readdir(join("a"), (err, dirs) => {
  console.log(err, dirs);
});
