/**
 * 如果输入的路径是文件
 * 则，返回对象，{ type:'Object', filePath: 'xxxxxxx' }
 *
 * 如果输入的路径是目录，则返回数组
 */

const fs = require("fs/promises");
const path = require("path");
const dirTree = require("directory-tree");
const join = (...args) => {
  return path.resolve(__dirname, ...args);
};

const tree = dirTree(
  join("../a"),
  {
    attributes: ["type", "size", "extension"],
    extensions: /css/,
  },
  (item, path, state) => {
    // console.log(item, path, state);
  }
);

console.log(tree);
