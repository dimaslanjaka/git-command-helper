const cp = require("child_process");
const path = require("path");
const gchjson = require("./lib/package.json");
const fs = require("fs");

const resolutions = {
	"cross-spawn":
		"https://github.com/dimaslanjaka/node-cross-spawn/raw/bf2d8bb/release/cross-spawn.tgz",
	"sbg-utility":
		"https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/sbg-utility/release/sbg-utility.tgz",
};

const csp = cp.spawnSync('git log --pretty=tformat:"%h" -n1 release/cross-spawn.tgz', {
	cwd: path.join(__dirname, "packages/cross-spawn"),
	shell: true,
});

resolutions[
	"cross-spawn"
] = `https://github.com/dimaslanjaka/node-cross-spawn/raw/${csp.stdout
	.toString()
	.trim()}/release/cross-spawn.tgz`;

const sbu = cp.spawnSync('git log --pretty=tformat:"%h" -n1 packages/sbg-utility/release/sbg-utility.tgz', {
	cwd: path.join(__dirname, "packages/sbg-utility"),
	shell: true,
});
resolutions[
	"sbg-utility"
] = `https://github.com/dimaslanjaka/static-blog-generator/raw/${sbu.stdout
	.toString()
	.trim()}/packages/sbg-utility/release/sbg-utility.tgz`;

// merge resolutions
gchjson.resolutions = Object.assign(gchjson.resolutions, resolutions);
gchjson.overrides = Object.assign(gchjson.overrides, resolutions);
// write modified package
fs.writeFileSync(
	path.join(__dirname, "lib/package.json"),
	JSON.stringify(gchjson, null, 2) + "\n"
);
