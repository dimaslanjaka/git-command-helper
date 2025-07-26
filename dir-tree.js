const minimatch = require("minimatch");
const path = require("upath");
const fs = require("fs-extra");
const crypto = require("crypto");

const targets = [path.join(__dirname, "dist"), path.join(__dirname, "release")];

function humanFileSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  const units = ["KB", "MB", "GB", "TB"];
  let i = -1;
  do {
    bytes = bytes / 1024;
    i++;
  } while (bytes >= 1024 && i < units.length - 1);
  return bytes.toFixed(1) + " " + units[i];
}

function printTree(dir, options = {}, prefix = "") {
  const { include = ["**"], exclude = ["**/.git"] } = options;
  const items = fs.readdirSync(dir, { withFileTypes: true });

  // Helper to check if a file/dir matches include/exclude
  function matches(absPath, relPath, isDir) {
    for (const pattern of exclude) {
      if (path.isAbsolute(pattern)) {
        if (absPath === pattern) return false;
      } else {
        if (minimatch.minimatch(relPath, pattern)) return false;
      }
    }
    if (isDir) {
      // If the directory itself is included by absolute path, include it and all children
      for (const pattern of include) {
        if (path.isAbsolute(pattern) && absPath === pattern) return true;
      }
      return undefined; // don't decide yet for dirs
    }
    for (const pattern of include) {
      if (path.isAbsolute(pattern)) {
        if (absPath === pattern) return true;
      } else {
        if (minimatch.minimatch(relPath, pattern)) return true;
      }
    }
    return false;
  }

  // Recursively filter items: only show dirs if they or their children match
  function filterItems(items, dir, prefix) {
    let result = [];
    items.forEach((item) => {
      const absPath = path.join(dir, item.name);
      const relPath = path.relative(__dirname, absPath).replace(/\\/g, "/");
      const isDir = item.isDirectory();
      const match = matches(absPath, relPath, isDir);
      if (match === false) return;
      if (!isDir && match === true) {
        result.push(item);
        return;
      }
      if (isDir) {
        // If this directory is matched by absolute path, include all children
        let dirMatched = false;
        for (const pattern of include) {
          if (path.isAbsolute(pattern) && absPath === pattern) {
            dirMatched = true;
            break;
          }
        }
        if (dirMatched) {
          result.push(item);
          return;
        }
        const subItems = fs.readdirSync(absPath, { withFileTypes: true });
        const filteredSub = filterItems(subItems, absPath, prefix);
        if (filteredSub.length > 0) {
          result.push(item);
        }
      }
    });
    return result;
  }

  const filtered = filterItems(items, dir, prefix);
  filtered.forEach((item, idx) => {
    const isLast = idx === filtered.length - 1;
    const pointer = isLast ? "└── " : "├── ";
    let display = prefix + pointer + item.name;
    const fullPath = path.join(dir, item.name);
    if (item.isFile()) {
      const stats = fs.statSync(fullPath);
      const fileBuffer = fs.readFileSync(fullPath);
      const hash = crypto.createHash("md5").update(fileBuffer).digest("hex").slice(0, 8);
      display += ` (${humanFileSize(stats.size)}, ${hash})`;
    }
    console.log(display);
    if (item.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      printTree(fullPath, options, newPrefix);
    }
  });
}

function printTrees(dirs, options = {}) {
  dirs.forEach((dir) => {
    if (fs.existsSync(dir)) {
      const rel = path.relative(process.cwd(), dir);
      console.log(rel || ".");
      printTree(dir, options);
      console.log(""); // blank line between roots
    } else {
      console.error("Target directory does not exist:", dir);
    }
  });
}
module.exports.printTrees = printTrees;

printTrees(targets, {
  include: ["**"]
});
// printTrees(targets, {
//   include: ["**/*.js", "**/*.tgz"],
//   exclude: ["**/node_modules/**", "**/__*", "**/tmp/**"]
// });
