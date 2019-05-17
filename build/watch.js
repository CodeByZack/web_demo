const watch = require("watch");
const path  = require("path");  // 引入 path 路径模块
const lessc = require("./lessc");
console.log(lessc);

const lessPath = path.join(__dirname, '../less')

watch.watchTree(lessPath, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
      // Finished walking the tree
      console.log("--walking-")
    } else if (prev === null) {
      // f is a new file
      console.log("--new-")
    } else if (curr.nlink === 0) {
      // f was removed
      console.log("--removed-")
    } else {
      // f was changed
      console.log("-changed--")
      lessc.build(lessPath)
    }
  })