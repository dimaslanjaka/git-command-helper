const { spawnSync } = require('child_process');
const glob = require('glob');

/** execute all *.builder.{ts,js} */

const files = glob.sync('**/*.builder.{ts,js}', { cwd: __dirname });
files
  .map((file) => `node -r ts-node/register ${file}`)
  .forEach((cmd) => {
    spawnSync(cmd);
  });
