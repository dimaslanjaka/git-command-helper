#!/usr/bin/env node
/**
 * Build and pack CLI script.
 * Checks file checksums to determine if a build is necessary,
 * executes build/pack commands, and updates the checksum file.
 *
 * Usage:
 *   node build.cjs         # build + pack only if checksum changed
 *   node build.cjs --force # always build + pack (skip checksum check)
 *   node build.cjs -f      # shorthand
 */

const path = require("upath");
const fs = require("fs-extra");
const { createHash } = require("crypto");
const { execSync } = require("child_process");
const minimist = require("minimist");
const glob = require("glob");

const rootDir = __dirname;

/**
 * Computes a SHA-256 checksum of the given file/glob patterns.
 * Preserves original file path casing.
 */
function computeChecksum(...patterns) {
  const fileSet = new Set();
  for (const pattern of patterns) {
    if (fs.existsSync(pattern) && fs.statSync(pattern).isFile()) {
      fileSet.add(path.resolve(pattern));
    } else {
      const matches = glob.sync(pattern, { nodir: true, absolute: true, dot: true });
      for (const f of matches) fileSet.add(path.resolve(f));
    }
  }

  const sortedFiles = Array.from(fileSet).sort((a, b) => a.localeCompare(b));
  const hash = createHash("sha256");

  for (const file of sortedFiles) {
    hash.update(file);
    const content = fs.readFileSync(file, "utf-8");
    hash.update(content.replace(/\r\n/g, "\n"));
  }

  return hash.digest("hex");
}

function buildAndPack(force = false) {
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
  const newChecksum = computeChecksum(
    path.join(rootDir, "src/**/*.{ts,js,cjs,mjs}"),
    path.join(rootDir, "package.json"),
    path.join(rootDir, "tsconfig*.json"),
    path.join(rootDir, "rollup.config.js")
  );

  const isChecksumChanged = oldChecksum !== newChecksum || !fs.existsSync(path.join(rootDir, "dist"));

  console.log(`[BUILD] Old checksum: ${oldChecksum}`);
  console.log(`[BUILD] New checksum: ${newChecksum}`);
  console.log(`[BUILD] Checksum changed: ${isChecksumChanged ? "YES" : "NO"}`);

  if (force || isChecksumChanged) {
    if (force) console.log("[BUILD] --force flag detected. Forcing build...");
    else console.log("[BUILD] Detected changes in source or config files. Triggering build...");

    execSync("npm run build:exports", { stdio: "inherit", cwd: rootDir });
    execSync("npm run build:tsc", { stdio: "inherit", cwd: rootDir });
    execSync("npm run build:rollup", { stdio: "inherit", cwd: rootDir });
    execSync("npm run pack", { stdio: "inherit", cwd: rootDir });
    console.log("[BUILD] Build completed and checksum updated.");

    fs.writeFileSync(checksumFile, newChecksum);
  } else {
    console.log("[BUILD] No changes detected. Skipping build.");
  }
}

// CLI entry point
const argv = minimist(process.argv.slice(2), {
  boolean: ["force"],
  alias: { f: "force" }
});

buildAndPack(argv.force);
