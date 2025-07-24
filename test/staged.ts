import { writefile } from "sbg-utility";
import path from "upath";
import { gitCommandHelper } from "../src/index";
import { testcfg } from "./config";

const gh = new gitCommandHelper(testcfg.cwd, testcfg.branch);

async function isStagedTest() {
  const relativePath = "sample/test_is_staged.js";
  const absolutePath = path.join(testcfg.cwd, relativePath);
  writefile(absolutePath, new Date().toISOString());
  const isStaged = await gh.isStaged(relativePath);
  return isStaged;
}

isStagedTest().catch(console.error);
