require("ts-node").register();
const Bluebird = require("bluebird");
const { spawnAsync } = require("./src/spawn");
const glob = require("glob");

/** execute all *.builder.{ts,js} */

const files = Bluebird.all(
  glob.glob("**/*.builder.{ts,js,cjs,mjs}", {
    cwd: __dirname,
    ignore: ["**/node_modules/**", "**/dist/**", "**/tmp/**"]
  })
);
files.each((file) => spawnAsync("node", ["-r", "ts-node/register", file], { cwd: __dirname, stdio: "inherit" }));
