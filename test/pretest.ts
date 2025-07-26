import ansi from "ansi-colors";
import { execSync } from "child_process";
import fs from "fs";
import { getChecksum } from "sbg-utility";
import path from "upath";
import gitHelper, { GitOpt } from "../src";
import clone from "../src/clone";
import { TestConfig } from "./config";

const rootDir = path.join(__dirname, "..");
const tmpDir = path.join(rootDir, "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
const checksumFile = path.join(tmpDir, ".checksum");
const oldChecksum = fs.existsSync(checksumFile) ? fs.readFileSync(checksumFile, "utf8") : "";
const newChecksum = getChecksum(
  path.join(rootDir, "src/**/*.{ts,js,cjs,mjs}"),
  path.join(rootDir, "package.json"),
  path.join(rootDir, "tsconfig*.json"),
  path.join(rootDir, "rollup.config.js")
);
const isChecksumChanged = oldChecksum !== newChecksum;

if (isChecksumChanged) {
  console.log(ansi.yellow("[PRETEST] Detected changes in source or config files. Triggering build..."));
  execSync("npm run build", { stdio: "inherit", cwd: rootDir });
  execSync("npm run pack", { stdio: "inherit", cwd: rootDir });
  console.log(ansi.green("[PRETEST] Build completed and checksum updated."));
} else {
  console.log(ansi.green("[PRETEST] No changes detected. Skipping build."));
}

process.env.ACCESS_TOKEN ||= "token_" + Math.random();

(async () => {
  const init = async (cfg: GitOpt) => {
    const git = new gitHelper(cfg.cwd);
    await git.setremote(cfg.remote);
    if (cfg.branch) await git.setbranch(cfg.branch);
    if (cfg.user) await git.setuser(cfg.user);
    if (cfg.email) await git.setemail(cfg.email);
    await git
      .fetch(["--all"], { stdio: "pipe" })
      .then((out) => out.length > 0 && console.log(ansi.cyan("[PRETEST] git fetch output:\n" + out)));
  };

  // clone test repo and initialize
  await clone(TestConfig);
  await init(TestConfig);

  // clone and initialize github pages repo
  const obj = {
    cwd: path.join(tmpDir, ".deploy_git"),
    branch: "master",
    remote: `https://${process.env.ACCESS_TOKEN}@github.com/dimaslanjaka/dimaslanjaka.github.io.git`,
    user: "dimaslanjaka",
    email: "dimaslanjaka@gmail.com",
    token: process.env.ACCESS_TOKEN
  };
  await clone(obj);
  await init(obj);

  // Write checksum if it has changed at end of the process
  if (isChecksumChanged) {
    fs.writeFileSync(checksumFile, newChecksum);
  }
})();
