require("ts-node").register();
const Bluebird = require("bluebird");
const { spawnAsync } = require("./src/spawn");
const glob = require("glob");
const packageJson = require("./package.json");
const fs = require("fs");

(async () => {
  const ignore = ["**/node_modules/**", "**/dist/**", "**/tmp/**"];
  // Build exports field for package.json
  const defaultExport = {
    ".": {
      import: "./dist/index.mjs",
      require: "./dist/index.js",
      types: "./dist/index.d.ts"
    },
    "./package.json": "./package.json"
  };
  packageJson.exports = defaultExport;
  // Find all .ts files in src directory
  const srcFiles = glob.sync("src/**/*.ts", { cwd: __dirname, ignore: [...ignore, "**/*.builder.{ts,js,cjs,mjs}"] });
  for (let file of srcFiles) {
    file = file.replace(/\\/g, "/"); // Normalize path for Windows
    const relPath = file.replace("src/", "");
    const withoutExt = relPath.replace(/\.ts$/, "").replace(/\.js$/, "");
    defaultExport[`./dist/${withoutExt}`] = {
      import: `./dist/${withoutExt}.mjs`,
      require: `./dist/${withoutExt}.js`,
      types: `./dist/${withoutExt}.d.ts`
    };
  }
  fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(packageJson, null, 2) + "\n");

  // Execute all *.builder.{ts,js,cjs,mjs} files in src directory
  const files = await Bluebird.all(
    glob.glob("src/**/*.builder.{ts,js,cjs,mjs}", {
      cwd: __dirname,
      ignore
    })
  );
  await Bluebird.each(files, (file) => {
    console.log("Executing builder file:", file);
    if (file.endsWith(".ts")) {
      return spawnAsync("node", ["-r", "ts-node/register", file], { cwd: __dirname, stdio: "inherit" });
    }
    return spawnAsync("node", [file], { cwd: __dirname, stdio: "inherit" });
  });
})();
