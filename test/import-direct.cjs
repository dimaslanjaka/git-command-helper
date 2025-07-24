const gch = require("../dist/index.js");

function isClass(obj) {
  return typeof obj === "function" && /^class\s/.test(Function.prototype.toString.call(obj));
}
module.exports.isClass = isClass;

if (require.main === module) {
  console.log(isClass(gch));
  console.log(isClass(gch.gitCommandHelper));
  console.log(isClass(gch.gitHelper));
}
