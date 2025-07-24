import ansi from "ansi-colors";
import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
import * as glob from "glob";
import path from "path";
import gitHelper, { GitOpt } from "../src";
import clone from "../src/clone";
import { TestConfig } from "./config";

/**
 * Calculate a checksum for the given target paths.
 * This checksum is used to determine if the source files have changed
 * and whether a build is necessary.
 *
 * @param targetPaths - An array of file or directory paths to include in the checksum.
 * @returns A SHA-256 hash of the contents of the specified files and directories.
 */
function getChecksum(...targetPaths: string[]): string {
  const hash = crypto.createHash("sha256");
  const addFile = (file: string) => {
    hash.update(file);
    hash.update(fs.readFileSync(file));
  };
  let files: string[] = [];
  for (const pattern of targetPaths) {
    // Use glob to expand patterns, including directories and files
    const matches = glob.sync(pattern, { nodir: true, absolute: true });
    files.push(...matches);
  }
  files = Array.from(new Set(files)).sort();
  files.forEach(addFile);
  return hash.digest("hex");
}

const rootDir = path.join(__dirname, "..");
const tmpDir = path.join(rootDir, "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
const checksumFile = path.join(tmpDir, ".checksum");
const oldChecksum = fs.existsSync(checksumFile) ? fs.readFileSync(checksumFile, "utf8") : "";
const newChecksum = getChecksum(
  path.join(rootDir, "src"),
  path.join(rootDir, "package.json"),
  path.join(rootDir, "tsconfig.json"),
  path.join(rootDir, "rollup.config.js")
);
if (newChecksum !== oldChecksum) {
  console.log(ansi.yellow("[PRETEST] Detected changes in source or config files. Triggering build..."));
  execSync("npm run build", { stdio: "inherit", cwd: rootDir });
  fs.writeFileSync(checksumFile, newChecksum);
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
      .then((out) => console.log(ansi.cyan("[PRETEST] git fetch output:\n" + out)));
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
})();
