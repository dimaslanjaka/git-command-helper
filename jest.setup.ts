import ansi from "ansi-colors";
import { execSync } from "child_process";
import fs from "fs-extra";
import { getChecksum } from "sbg-utility";
import path from "upath";
import gitHelper, { GitOpt } from "./src";
import clone from "./src/clone";
import { TestConfig } from "./test/config";

const rootDir = __dirname;

/**
 * Handles the build and packaging logic.
 * Checks file checksums to determine if a build is necessary,
 * executes build/pack commands, and updates the checksum file.
 */
async function builderAndPacker() {
  const tmpDir = path.join(rootDir, "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const checksumFile = path.join(tmpDir, "jest/.checksum");
  if (!fs.existsSync(checksumFile)) {
    fs.ensureDirSync(path.dirname(checksumFile));
    fs.writeFileSync(checksumFile, "");
  } else if (!fs.statSync(checksumFile).isFile()) {
    fs.rmSync(checksumFile, { force: true, recursive: true });
    fs.ensureDirSync(path.dirname(checksumFile));
    fs.writeFileSync(checksumFile, "");
  }

  const oldChecksum = fs.readFileSync(checksumFile, "utf-8");
  const newChecksum = getChecksum(
    path.join(rootDir, "src/**/*.{ts,js,cjs,mjs}"),
    path.join(rootDir, "package.json"),
    path.join(rootDir, "tsconfig*.json"),
    path.join(rootDir, "rollup.config.js")
  );

  const isChecksumChanged = oldChecksum !== newChecksum || !fs.existsSync(path.join(rootDir, "dist"));

  console.log(`[PRETEST] Old checksum: ${ansi.blue(oldChecksum)}`);
  console.log(`[PRETEST] New checksum: ${ansi.blue(newChecksum)}`);
  console.log(`[PRETEST] Checksum changed: ${isChecksumChanged ? ansi.red("YES") : ansi.green("NO")}`);

  if (isChecksumChanged) {
    console.log(ansi.yellow("[PRETEST] Detected changes in source or config files. Triggering build..."));
    execSync("npm run build", { stdio: "inherit", cwd: rootDir });
    execSync("npm run pack", { stdio: "inherit", cwd: rootDir });
    console.log(ansi.green("[PRETEST] Build completed and checksum updated."));

    // Update checksum file immediately after successful build
    fs.writeFileSync(checksumFile, newChecksum);
  } else {
    console.log(ansi.green("[PRETEST] No changes detected. Skipping build."));
  }
}

/**
 * Handles the cloning and initialization of git repositories.
 * Sets up environment tokens, clones repositories, and configures git settings.
 */
async function cloner() {
  // Set default access token if not exists
  process.env.ACCESS_TOKEN ||= "token_" + Math.random();

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

  const tmpDir = path.join(rootDir, "tmp");

  // 1. Clone and initialize test repo
  await clone(TestConfig);
  await init(TestConfig);

  // 2. Clone and initialize github pages repo
  const githubPagesConfig = {
    cwd: path.join(tmpDir, ".deploy_git"),
    branch: "master",
    remote: `https://${process.env.ACCESS_TOKEN}@github.com/dimaslanjaka/dimaslanjaka.github.io.git`,
    user: "dimaslanjaka",
    email: "dimaslanjaka@gmail.com",
    token: process.env.ACCESS_TOKEN
  };
  await clone(githubPagesConfig);
  await init(githubPagesConfig);
}

// Main Execution
(async () => {
  await builderAndPacker();
  await cloner();
})();
