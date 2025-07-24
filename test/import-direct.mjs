import util from "util";
import { isClass } from "./import-direct.cjs";

async function main() {
  const gchCJS = await import("../dist/index.js");
  console.log(isClass(gchCJS));
  console.log(isClass(gchCJS.gitCommandHelper));
  console.log(isClass(gchCJS.gitHelper));
  console.log(util.inspect(gchCJS, { depth: 0, colors: true }));
  console.log("======================");
  const gchMjs = await import("../dist/index.mjs");
  console.log(isClass(gchMjs));
  console.log(isClass(gchMjs.gitCommandHelper));
  console.log(isClass(gchMjs.gitHelper));
  console.log(util.inspect(gchMjs, { depth: 0, colors: true }));
}

main();
