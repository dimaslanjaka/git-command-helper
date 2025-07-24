import whyIsNodeRunning from "why-is-node-running";
// should be imported before any other modules

import { noop } from "sbg-utility";
import src from "../src/index.js";
import { repoDir, repoUrl } from "./env.cjs";

(async () => {
  const gh = new src({ remote: repoUrl, cwd: repoDir });
  console.log("github root dir:", gh.cwd);
  await gh.clone().catch(noop);
})();

// logs out active handles that are keeping node running
setImmediate(() => whyIsNodeRunning());
