import ansi from "ansi-colors";
import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import gitHelper, { GitOpt } from "../src";
import clone from "../src/clone";
import { TestConfig } from "./config";

function getChecksum(...targetPaths: string[]): string {
  const hash = crypto.createHash("sha256");
  const addFile = (file: string) => {
    hash.update(file);
    hash.update(fs.readFileSync(file));
  };
  const walk = (dir: string, files: string[] = []): string[] => {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) walk(p, files);
      else files.push(p);
    }
    return files;
  };
  for (const targetPath of targetPaths) {
    if (fs.statSync(targetPath).isDirectory()) {
      walk(targetPath).sort().forEach(addFile);
    } else {
      addFile(targetPath);
    }
  }
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
  console.log(ansi.yellow("src folder or package.json changed, running build..."));
  execSync("npm run build", { stdio: "inherit", cwd: rootDir });
  fs.writeFileSync(checksumFile, newChecksum);
} else {
  console.log(ansi.green("src folder and package.json unchanged, skipping build."));
}

process.env.ACCESS_TOKEN ||= "token_" + Math.random();

(async () => {
  const init = async (cfg: GitOpt) => {
    const git = new gitHelper(cfg.cwd);
    await git.setremote(cfg.remote);
    if (cfg.branch) await git.setbranch(cfg.branch);
    if (cfg.user) await git.setuser(cfg.user);
    if (cfg.email) await git.setemail(cfg.email);
    await git.fetch(["--all"], { stdio: "pipe" }).then((out) => console.log(ansi.cyan(out)));
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
