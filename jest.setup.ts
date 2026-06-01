import ansi from "ansi-colors";
import * as cp from "cross-spawn";
import { execSync } from "child_process";
import fs from "fs-extra";
import { getChecksum } from "sbg-utility";
import path from "upath";
import { TestConfig } from "./test/config";
import dotenv from "dotenv";

const rootDir = __dirname;
dotenv.config({ path: path.join(__dirname, ".env"), override: true, quiet: true });

type SetupGitConfig = {
  cwd: string;
  remote: string;
  branch?: string;
  user?: string;
  email?: string;
};

async function runGit(cwd: string, args: string[], stdio: "pipe" | "inherit" = "pipe") {
  const result = await cp.async("git", args, { cwd, stdio });
  return (result as { stdout?: string }).stdout || "";
}

async function cloneRepo(cfg: SetupGitConfig) {
  const targetPath = path.toUnix(cfg.cwd);
  const processCwd = path.dirname(targetPath);
  fs.ensureDirSync(processCwd);

  let shouldClone = false;
  if (!fs.existsSync(cfg.cwd)) {
    shouldClone = true;
  } else if (fs.existsSync(cfg.cwd) && fs.readdirSync(cfg.cwd).length === 1) {
    shouldClone = true;
    await fs.rm(cfg.cwd, { recursive: true, force: true });
  }

  if (!shouldClone) return;

  const output = await cp.async("git", ["clone", "-b", cfg.branch || "master", cfg.remote, targetPath], {
    cwd: processCwd,
    stdio: "pipe"
  });

  if ((output as { stdout?: string }).stdout) {
    console.log(ansi.cyan("[PRETEST] git clone output:\n" + (output as { stdout: string }).stdout));
  }
}

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
  const newChecksum = await getChecksum(
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
  process.env.ACCESS_TOKEN ||= process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "token_" + Math.random();

  const accessToken = process.env.ACCESS_TOKEN || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

  const init = async (cfg: SetupGitConfig) => {
    await runGit(cfg.cwd, ["remote", "set-url", "origin", cfg.remote]);
    if (cfg.branch) await runGit(cfg.cwd, ["checkout", cfg.branch]);
    if (cfg.user) await runGit(cfg.cwd, ["config", "user.name", cfg.user]);
    if (cfg.email) await runGit(cfg.cwd, ["config", "user.email", cfg.email]);

    const output = await runGit(cfg.cwd, ["fetch", "--all"]);
    if (output.length > 0) console.log(ansi.cyan("[PRETEST] git fetch output:\n" + output));
  };

  const tmpDir = path.join(rootDir, "tmp");

  // 1. Clone and initialize test repo
  await cloneRepo(TestConfig);
  await init(TestConfig);

  // 2. Clone and initialize github pages repo
  const githubPagesConfig = {
    cwd: path.join(tmpDir, ".deploy_git"),
    branch: "master",
    remote: `https://${accessToken}@github.com/dimaslanjaka/dimaslanjaka.github.io.git`,
    user: "dimaslanjaka",
    email: "dimaslanjaka@gmail.com",
    token: accessToken
  };
  await cloneRepo(githubPagesConfig);
  await init(githubPagesConfig);
}

export default async function globalSetup() {
  await builderAndPacker();
  await cloner();
}
