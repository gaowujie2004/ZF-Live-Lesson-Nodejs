const fs = require("fs");
const path = require("path");

fs.readFile(path.join(__dirname, "./1.js"), "utf8", (err, data) => {
  console.log(data);
});
