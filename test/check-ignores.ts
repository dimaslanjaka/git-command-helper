import fs from "fs";
import path from "upath";
import { isIgnored } from "../src/functions/gitignore";
import clone from "./clone";
import { testcfg } from "./config";

// clone expects: { cwd: string; remote: string; branch: string; token?: string }
(async function () {
  await clone({
    cwd: testcfg.cwd,
    remote: testcfg.remote,
    branch: testcfg.branch,
    token: testcfg.token // optional, only if present in testcfg
  });
  const ignoredFile = path.join(testcfg.cwd, "file-ignore.txt");
  const ignoredFile2 = path.join(testcfg.cwd, "file-ignore-another.txt");
  fs.writeFileSync(ignoredFile, "");
  fs.writeFileSync(ignoredFile2, "");
  // relative
  console.log([
    await isIgnored("file-ignore.txt", { cwd: testcfg.cwd }),
    await isIgnored("/file-ignore.txt", { cwd: testcfg.cwd }),
    await isIgnored("file-ignore.txt"),
    await isIgnored("/file-ignore.txt")
  ]);
})();
