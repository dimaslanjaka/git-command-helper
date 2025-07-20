const path = require("upath");
const fs = require("fs-extra");
const { spawnSync } = require("child_process");
const os = require("os");
const dotenv = require("dotenv");
const envPath = path.join(__dirname, "../.env");

if (fs.existsSync(envPath)) dotenv.config({ path: envPath });

const originalCwd = process.cwd();
module.exports.originalCwd = originalCwd;
const repoDir = path.join(__dirname, "../tmp/test-repo");
module.exports.repoDir = repoDir;
process.cwd = () => repoDir;
const nonGitDir = path.join(os.tmpdir(), "non-git-dir");
if (!fs.existsSync(nonGitDir)) {
  fs.mkdirSync(nonGitDir, { recursive: true });
}
module.exports.nonGitDir = nonGitDir;

module.exports.repoUrl = "https://github.com/dimaslanjaka/test-repo.git";

/**
 * Ensure yarn project is initialized in the test repo directory.
 * If package.json exists but yarn.lock does not, restore yarn.lock from backup or create empty.
 */
function ensureYarnProject() {
  const pkgJson = path.join(repoDir, "package.json");
  const yarnLock = path.join(repoDir, "yarn.lock");
  const yarnLockBak = path.join(repoDir, "yarn.lock.bak");
  if (!fs.existsSync(pkgJson) && !fs.existsSync(yarnLock)) {
    // Initialize yarn project if package.json does not exist
    const result = spawnSync("yarn", ["init", "-y"], { cwd: repoDir, stdio: "inherit", shell: true });
    if (!result || typeof result.status !== "number" || result.status !== 0) {
      throw new Error(
        `yarn init failed with code ${result && typeof result.status === "number" ? result.status : "unknown"}`
      );
    }
  } else if (fs.existsSync(pkgJson) && !fs.existsSync(yarnLock)) {
    if (fs.existsSync(yarnLockBak)) {
      // Restore yarn.lock from backup if it exists
      fs.renameSync(yarnLockBak, yarnLock);
    } else {
      // Create an empty yarn.lock if no backup exists
      fs.writeFileSync(yarnLock, "");
    }
  }
}
module.exports.ensureYarnProject = ensureYarnProject;

const TGZ_PATH = path.resolve(__dirname, "../releases/bin.tgz");
function installYarnPackage() {
  const TEST_REPO = repoDir;
  if (!fs.existsSync(TGZ_PATH)) {
    throw new Error(`tgz file not found: ${TGZ_PATH}`);
  }
  const result = spawnSync("yarn", ["add", `binary-collections@${TGZ_PATH}`], {
    cwd: TEST_REPO,
    stdio: "inherit",
    shell: true
  });
  if (!result || typeof result.status !== "number" || result.status !== 0) {
    const stdout = result && typeof result.stdout !== "undefined" ? result.stdout.toString() : "";
    const stderr = result && typeof result.stderr !== "undefined" ? result.stderr.toString() : "";
    throw new Error(
      `yarn add failed with code ${result && typeof result.status === "number" ? result.status : "unknown"}\n` +
        `stdout: ${stdout}\n` +
        `stderr: ${stderr}`
    );
  }
}
module.exports.installYarnPackage = installYarnPackage;
