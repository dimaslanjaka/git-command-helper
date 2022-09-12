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
  shell = shell;
  helper = helper;
  static helper = helper;

  constructor(dir: string) {
    this.cwd = dir;
    this.submodule = new submodule(dir);
    helper.suppress(() => this.isExist());
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
   * @param options
   * @returns
   */
  commits(options: { path: string; msg?: string; [key: string]: any }[]) {
    const self = this;
    function run() {
      if (options.length > 0) {
        self
          .addAndCommit(
            options[0].path,
            options[0].msg || 'update ' + new Date()
          )
          .finally(() => {
            options.shift();
            run();
          });
      }
    }
    return run();
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
      status: await this.status()
    };
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

  public setbranch(v: string) {
    this.branch = v;
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
