import { spawn as nodeSpawn } from "child_process";
import "core-js/actual";
import fs from "fs-extra";
import path from "upath";
import git from "./git";

/**
 * do clone when destination folder not exist
 */
async function clone(options: { cwd: string; remote: string; branch: string; token?: string }) {
  // if (existsSync(TestConfig.cwd)) await rm(TestConfig.cwd, { recursive: true, force: true });
  //const cfg = structuredClone(options);
  //delete cfg.token;

  let doClone = false;
  if (!fs.existsSync(options.cwd)) {
    doClone = true;
  } else if (fs.existsSync(options.cwd) && fs.readdirSync(options.cwd).length === 1) {
    doClone = true;
    await fs.rm(options.cwd, { recursive: true, force: true });
  }

  if (doClone) {
    // console.log('cloning', cfg);
    const targetPath = path.toUnix(options.cwd);
    const processCwd = path.dirname(targetPath);
    fs.ensureDirSync(processCwd);
    console.log({ processCwd, relative: path.basename(targetPath) });
    await new Promise<void>((resolve, reject) => {
      const child = nodeSpawn("git", ["clone", "-b", options.branch, options.remote, targetPath], {
        cwd: processCwd,
        stdio: git.isGithubCI ? "pipe" : "inherit"
      });

      child.on("error", reject);
      child.on("close", (code) => {
        if (code) return reject(new Error(`git clone failed with exit code ${code}`));
        resolve();
      });
    });
  }
}

export default clone;
