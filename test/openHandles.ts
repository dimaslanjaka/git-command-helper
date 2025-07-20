import whyIsNodeRunning from "why-is-node-running";
// should be imported before any other modules

import src from "../src";
import { repoDir, repoUrl } from "./env.cjs";

(async () => {
  const gh = new src({ remote: repoUrl, cwd: repoDir });
  console.log("github root dir:", gh.cwd);
  await gh.clone().catch(console.error);
})();

// logs out active handles that are keeping node running
setImmediate(() => whyIsNodeRunning());
