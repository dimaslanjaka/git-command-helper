import fs from "fs-extra";
import ini from "ini";
import path from "upath";
import git, { GitOpt } from "../git";

export interface SubmoduleEntry extends GitOpt {
  [key: string]: any;
  github: git;
  path: string;
  url: string;
  branch: string;
  cwd: string;
}

/**
 * Class representing a collection of git submodules parsed from a .gitmodules file.
 */
class Submodule {
  /**
   * The list of submodules extracted from the .gitmodules file.
   */
  submodules: (SubmoduleEntry | undefined)[] = [];

  /**
   * The path to the .gitmodules file.
   */
  gitmodulesPath: string;

  /**
   * Create a Submodule instance and extract submodules from the given .gitmodules file.
   * @param gitmodulesPath Path to the .gitmodules file.
   */
  constructor(gitmodulesPath) {
    this.gitmodulesPath = gitmodulesPath;
    this.extract();
  }

  /**
   * Extract submodules from the .gitmodules file and populate the submodules array.
   * @returns Array of submodule entries or undefined for non-submodule keys.
   */
  extract() {
    const config = ini.parse(fs.readFileSync(this.gitmodulesPath).toString());
    this.submodules = Object.keys(config).map((key) => {
      if (key.startsWith("submodule")) {
        const submodule = config[key] as SubmoduleEntry;
        if (!submodule.path || typeof submodule.path !== 'string') return undefined;
        submodule.cwd = path.join(path.dirname(String(this.gitmodulesPath)), submodule.path);
        const github = new git(submodule);
        submodule.github = github;
        return submodule;
      }
    });
    return this.submodules;
  }

  /**
   * Remove a submodule from the submodules array by its path.
   * @param submodulePath Path of the submodule to remove.
   */
  remove(submodulePath: string) {
    this.submodules = this.submodules.filter((sub) => sub?.path !== submodulePath);
  }

  /**
   * Save the current submodules array back to the .gitmodules file.
   */
  save() {
    const config: Record<string, any> = {};
    for (let index = 0; index < this.submodules.length; index++) {
      const sub = this.submodules[index];
      if (!sub) continue;
      const key = `submodule "${sub.path}"`;
      config[key] = {
        path: sub.path,
        url: sub.url,
        branch: sub.branch,
        cwd: sub.cwd
      };
    }
    fs.writeFileSync(this.gitmodulesPath, ini.stringify(config));
  }
}

/**
 * extract submodule to object
 * @param gitmodulesPath
 */
function extractSubmodule(gitmodulesPath: string) {
  const submodule = new Submodule(gitmodulesPath);
  return submodule.extract();
}

export default extractSubmodule;
export { extractSubmodule, Submodule };
