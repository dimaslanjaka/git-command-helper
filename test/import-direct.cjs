const gch = require("../dist/index.js");
const util = require("util");

function isClass(obj) {
  return (
    typeof obj === "function" &&
    (/^class\s/.test(Function.prototype.toString.call(obj)) || Object.getOwnPropertyNames(obj.prototype).length > 1)
  );
}
module.exports.isClass = isClass;

if (require.main === module) {
  console.log(isClass(gch));
  console.log(isClass(gch.gitCommandHelper));
  console.log(isClass(gch.gitHelper));
  console.log(util.inspect(gch, { depth: 1, colors: true }));
}
