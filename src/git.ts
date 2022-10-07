/* eslint-disable no-control-regex */
/**
 * NodeJS GitHub Helper
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 */

import Bluebird from 'bluebird';
import { existsSync } from 'fs';
import { join } from 'path';
import helper from './helper';
import { latestCommit } from './latestCommit';
import { shell } from './shell';
import { spawn, SpawnOptions } from './spawn';
import submodule from './submodule';
import { StatusResult } from './types';

// module 'git-command-helper';

/**
 * GitHub Command Helper For NodeJS
 */
export class git {
  submodule: submodule;
  user: string;
  email: string;
  remote: string;
  branch: string;
  private exist: boolean;
  cwd: string;
  latestCommit = latestCommit;
  static shell = shell;
  helper = helper;
  static helper = helper;

  constructor(dir: string) {
    this.cwd = dir;
    this.submodule = new submodule(dir);
    helper.suppress(() => this.isExist());
  }
  
  // setup merge on pull strategy
  setAutoRebase() {
    return spawn('git', ['config', 'pull.rebase', 'false']);
  }
  
  // setup end of line LF
  // https://stackoverflow.com/a/13154031
  setForceLF(){
    return spawn('git', ['config', 'core.autocrlf', 'false']);
  }

  /**
   * git fetch
   * @param arg argument git-fetch, ex ['--all']
   * @param optionSpawn
   * @returns
   */
  fetch(arg?: string[], optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = [];
    if (Array.isArray(arg)) args = args.concat(arg);
    if (args.length === 0) {
      args.push('origin', this.branch);
    }
    return spawn('git', ['fetch'].concat(args), this.spawnOpt(optionSpawn));
  }

  async pull(arg?: string[], optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = [];
    if (Array.isArray(arg)) args = args.concat(arg);
    if (args.length === 0) {
      args.push('origin', this.branch);
    }
    const opt = this.spawnOpt(optionSpawn || { stdio: 'inherit' });
    try {
      return await spawn('git', ['pull'].concat(args), opt);
    } catch (e) {
      if (e instanceof Error) {
        if (opt.stdio === 'inherit') console.log(e.message);
        return e.message;
      }
    }
  }

  /**
   * git commit
   * @param mode -am, -m, etc
   * @param msg commit messages
   * @param optionSpawn
   * @returns
   */
  commit(
    msg: string,
    mode: 'am' | 'm' | string = 'm',
    optionSpawn: SpawnOptions = { stdio: 'inherit' }
  ) {
    if (!mode.startsWith('-')) mode = '-' + mode;
    return new Bluebird((resolve: (result?: string) => any, reject) => {
      const opt = this.spawnOpt(optionSpawn);
      const child = spawn('git', ['commit', mode, msg], opt);
      if (opt.stdio !== 'inherit') {
        child.then((str) => {
          resolve(str);
        });
      } else {
        resolve();
      }
      child.catch(reject);
    });
  }

  addAndCommit(path: string, msg: string) {
    return new Bluebird((resolve, reject) => {
      this.add(path, { stdio: 'pipe' }).then((_) =>
        this.commit(msg, 'm', { stdio: 'pipe' }).then(resolve).catch(reject)
      );
    });
  }

  /**
   * bulk add and commit
   * @param options array of `path` and `msg` commit message
   * @returns
   */
  commits(options: { path: string; msg?: string;[key: string]: any }[]) {
    const self = this;
    const errors: Error[] = []
    async function run(): Promise<any> {
      if (options.length > 0) {
        try {
          try {
            return await self
              .addAndCommit(
                options[0].path,
                options[0].msg || 'update ' + options[0].path + ' ' + new Date()
              );
          } catch (e) {
            errors.push(e);
          }
        } finally {
          options.shift();
          return await run();
        }
      }
    }
    return new Bluebird((resolve: (arg: typeof errors) => any) => {
      run().then(() => resolve(errors))
    })
  }

  /**
   * git push
   * @param force
   * @param optionSpawn
   * @returns
   */
  async push(force = false, optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = ['push'];
    if (force) args = args.concat('-f');
    const opt = this.spawnOpt(optionSpawn);
    try {
      return await spawn('git', args, opt);
    } catch (e) {
      if (e instanceof Error) {
        if (opt.stdio === 'inherit') {
          console.log(e.message);
        }
        //console.log(e.message);
        if (/^error: failed to push some refs to/gim.test(e.message)) {
          if (/the tip of your current branch is behind/gim.test(e.message)) {
            return await this.push(true, opt);
          }
        }
      }
    }
  }

  private spawnOpt(opt: SpawnOptions = {}) {
    return Object.assign({ cwd: this.cwd, stdio: 'pipe' }, opt);
  }

  /**
   * git add
   * @param path specific path or argument -A
   * @param optionSpawn
   * @returns
   */
  add(path: string, optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    return spawn('git', ['add', path], this.spawnOpt(optionSpawn));
  }

  async info() {
    const opt = this.spawnOpt({ stdio: 'pipe' });
    return {
      opt,
      remote: await this.getremote(['-v']),
      branch: await this.getbranch(),
      status: await this.status()
    };
  }

  /**
   * git checkout
   * @param branchName
   * @param optionSpawn
   * @returns
   */
  async checkout(
    branchName: string,
    optionSpawn: SpawnOptions = { stdio: 'inherit' }
  ) {
    return await spawn(
      'git',
      ['checkout', branchName],
      this.spawnOpt(optionSpawn || {})
    );
  }

  /**
   * get current branch informations
   * @returns
   */
  async getbranch() {
    return await spawn('git', ['branch']).then((str) =>
      str
        .split(/\n/)
        .map((str) => str.split(/\s/).map((str) => str.trim()))
        .filter((str) => str.length > 0)
        .map((item) => {
          return {
            active: item.length > 1,
            branch: item[1]
          };
        })
        .filter((item) => typeof item.branch === 'string')
    );
  }

  /**
   * git status
   * @returns
   */
  status() {
    const rgMod = /^(modified|added|deleted):/gim;
    const rgUntracked = /^untracked files:([\s\S]*?)\n\n/gim;
    return new Bluebird((resolve: (result: StatusResult[]) => any, reject) => {
      spawn('git', ['status'], this.spawnOpt({ stdio: 'pipe' }))
        .then((response) => {
          const isMod = rgMod.test(response);
          if (isMod) {
            // modded, added, deleted
            const result = response
              .split('\n')
              .map((str) => str.trim())
              .filter((str) => rgMod.test(str))
              .map((str) => {
                const split = str.split(/:\s+/);
                return {
                  changes: split[0],
                  path: (split[1] || '').replace(/\(.*\)$/, '').trim()
                };
              });
            resolve(result);
          }
          // untracked
          const result = (
            Array.from(response.match(rgUntracked) || [])[0] || ''
          )
            .split(/\n/)
            .map((str) => str.trim())
            .filter((str) => {
              return !/^\(use/gim.test(str) && str.length > 0;
            })
            .map((str) => {
              if (!str.includes(':'))
                return {
                  changes: 'untracked',
                  path: str
                };
            })
            .filter((str) => typeof str === 'object');
          resolve(result);
        })
        .catch(reject);
    });
  }

  /**
   * git init
   * @returns
   */
  async init() {
    return spawn('git', ['init'], this.spawnOpt());
  }

  isExist() {
    return new Bluebird((resolve: (exists: boolean) => any, reject) => {
      const folderExist = existsSync(join(this.cwd, '.git'));
      spawn('git', ['status'], this.spawnOpt({ stdio: 'pipe' }))
        .then((result) => {
          const match1 = /changes not staged for commit/gim.test(result);
          this.exist = match1 && folderExist;
          resolve(this.exist);
        })
        .catch(reject);
    });
  }

  public setcwd(v: string) {
    this.cwd = v;
  }

  public setemail(v: string) {
    this.email = v;
    spawn('git', ['config', 'user.email', this.email], this.spawnOpt());
  }

  public setuser(v: string) {
    this.user = v;
    spawn('git', ['config', 'user.name', this.user], this.spawnOpt());
  }

  /**
   * set remote url
   * @param v
   * @param name custom object name
   * @returns
   * @example
   * // default
   * git add remote origin https://
   * // custom name
   * git add remote customName https://
   */
  public async setremote(
    v: string | URL,
    name?: string,
    spawnOpt: SpawnOptions = {}
  ) {
    this.remote = v instanceof URL ? v.toString() : v;
    const opt = this.spawnOpt(Object.assign({ stdio: 'pipe' }, spawnOpt || {}));
    try {
      return await spawn(
        'git',
        ['remote', 'add', name || 'origin', this.remote],
        opt
      );
    } catch {
      return await helper.suppress(() =>
        spawn('git', ['remote', 'set-url', name || 'origin', this.remote], opt)
      );
    }
  }

  /**
   * get remote information
   * @param args
   * @returns
   */
  public async getremote(args?: string[]) {
    try {
      const res = await spawn(
        'git',
        ['remote'].concat(args || ['-v']),
        this.spawnOpt({ stdio: 'pipe' })
      );
      const result = {
        fetch: {
          origin: '',
          url: ''
        },
        push: {
          origin: '',
          url: ''
        }
      };
      res
        .split(/\n/gm)
        .filter((split) => split.length > 0)
        .map((splitted) => {
          let key: string;
          const nameUrl = splitted.split(/\t/).map((str) => {
            const rg = /\((.*)\)/gm;
            if (rg.test(str))
              return str
                .replace(rg, (whole, v1) => {
                  key = v1;
                  return '';
                })
                .trim();
            return str.trim();
          });
          result[key] = {
            origin: nameUrl[0],
            url: nameUrl[1]
          };
        });
      return result;
    } catch {
      //
    }
  }

  checkLock() {
    return existsSync(join(this.cwd, '.git/index.lock'))
  }

  /**
   * set branch (git checkout branchName)
   * @param branchName
   * @returns
   */
  async setbranch(branchName: string) {
    this.branch = branchName;
    const _checkout = await spawn(
      "git",
      ["checkout", this.branch],
      this.spawnOpt({ stdio: "pipe" })
    ).catch((e) => console.log("cannot checkout", this.branch, e.message));
    // git branch --set-upstream-to=origin/<branch> gh-pages
    const _setUpstream = await spawn(
      "git",
      ["branch", "--set-upstream-to=origin/" + this.branch, this.branch],
      this.spawnOpt({ stdio: "pipe" })
    ).catch((e) => console.log("cannot set upstream", this.branch, e.message));
    //
    return _checkout;
  }

  /**
   * Reset to latest commit of remote branch
   * @param branch
   */
  reset(branch = this.branch) {
    return spawn(
      'git',
      ['reset', '--hard', 'origin/' + branch || this.branch],
      {
        stdio: 'inherit',
        cwd: this.cwd
      }
    );
  }
}

export default git;
export const gitHelper = git;
export const gitCommandHelper = git;
