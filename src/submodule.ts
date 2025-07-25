import Bluebird from "bluebird";
import { SpawnOptions } from "child_process";
import fs from "fs-extra";
import path from "upath";
import git from "./git";
import { spawn } from "./spawner";
import extractSubmodule from "./utils/extract-submodule";

// Use path.join and path.toUnix directly throughout the file

export class submodule {
  /** current working directory */
  cwd: string;
  /** .gitmodules exist */
  hasConfig: boolean;
  /** git-command-helper class */
  github: Record<string, git> = {};

  constructor(cwd: string) {
    this.cwd = cwd;
    this.hasConfig = fs.existsSync(path.join(this.cwd, ".gitmodules"));
  }

  private spawnOpt(opt: SpawnOptions = {}) {
    return Object.assign({ cwd: this.cwd, stdio: "pipe" } as SpawnOptions, opt);
  }

  /**
   * add submodule
   */
  async add(opt: { remote: string; branch?: string; dest: string }) {
    if (!opt.remote) throw new Error("submodule remote url required");
    if (!opt.dest) throw new Error("submodule destination required");

    const args = ["submodule", "add"];
    if (opt.branch) args.push("-b", opt.branch);
    args.push(opt.remote);
    args.push(opt.dest);
    await spawn("git", args, { cwd: this.cwd, stdio: "pipe" });
  }

  /**
   * remove submodule
   * @param submodulePath path to submodule
   */
  async remove(submodulePath: string) {
    await spawn("git", ["submodule", "deinit", "-f", path.toUnix(submodulePath)], { cwd: this.cwd, stdio: "pipe" });
    await fs.rm(path.join(this.cwd, ".git/modules", path.toUnix(submodulePath)), { recursive: true, force: true });
    await spawn("git", ["rm", "-f", path.toUnix(submodulePath)], { cwd: this.cwd, stdio: "pipe" });
  }

  /**
   * check has submodule
   * @returns
   */
  hasSubmodule() {
    const gitmodules = path.join(this.cwd, ".gitmodules");
    const exist = fs.existsSync(gitmodules);
    // check empty .gitmodules
    if (exist) {
      const size = fs.statSync(gitmodules).size;
      return size > 0;
    }
    return exist;
  }

  /**
   * git submodule update
   * @param args custom arguments
   * @param optionSpawn
   * @returns
   */
  update(args: string[] = [], optionSpawn: SpawnOptions = { stdio: "inherit" }) {
    const arg = ["submodule", "update"];
    if (Array.isArray(args)) {
      args.forEach((str) => arg.push(str));
    } else {
      arg.push("-i", "-r");
    }
    return spawn("git", arg, this.spawnOpt(optionSpawn));
  }

  /**
   * Update all submodule with cd method
   * @param reset do git reset --hard origin/branch ?
   */
  safeUpdate(reset = false) {
    return new Bluebird((resolve) => {
      const infos = this.get();
      const doUp = () => {
        return new Bluebird((resolveDoUp: (...v: any[]) => any) => {
          if (!infos[0]) return;
          const github = infos[0];
          const { branch, remote } = infos[0].github;
          const doReset = () => github.reset(branch);
          const doPull = () => github.pull(["origin", branch, "--recurse-submodule"]);
          // update from remote name origin
          if (typeof remote === "string") {
            github.setremote(remote, "origin").then(() => {
              // force checkout branch instead commit hash
              github.setbranch(branch, true).then(() => {
                if (reset) {
                  // reset then pull
                  doReset().then(doPull).then(resolveDoUp);
                } else {
                  // pull
                  doPull().then(resolveDoUp);
                }
              });
            });
          }
        });
      };
      const iterate = () => {
        return new Bluebird((resolveIt: (...v: any[]) => any) => {
          doUp()
            .then(() => {
              infos.shift();
            })
            .then(() => {
              if (infos.length > 0) {
                return iterate().then(resolveIt);
              } else {
                resolveIt();
              }
            });
        });
      };
      if (infos.length > 0) {
        resolve(iterate());
      }
    });
  }

  /**
   * git submodule status
   * @param optionSpawn
   * @returns
   */
  status(optionSpawn: SpawnOptions = { stdio: "inherit" }) {
    return spawn("git", ["submodule", "status"], this.spawnOpt(optionSpawn));
  }

  /**
   * git add all each submodule
   * @param pathOrArg ex: `-A`
   * @returns
   */
  addAll(pathOrArg: string) {
    return spawn("git", ["submodule", "foreach", "git", "add", pathOrArg]);
  }

  commitAll(msg: string) {
    return spawn("git", ["submodule", "foreach", "git", "commit", "-am", msg]);
  }

  /**
   * get submodule informations
   * @returns
   */
  get() {
    if (!this.hasSubmodule()) return []; //throw new Error('This directory not have submodule installed');

    const extract = extractSubmodule(path.join(this.cwd, ".gitmodules"));
    for (let i = 0; i < extract.length; i++) {
      const item = extract[i];
      if (!item) continue;
      this.github[item.cwd] = item.github;
    }
    return extract;
  }
}

export default submodule;
export { submodule as gitSubmodule };
