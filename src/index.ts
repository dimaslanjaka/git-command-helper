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

  pull(arg?: string[], optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = [];
    if (Array.isArray(arg)) args = args.concat(arg);
    if (args.length === 0) {
      args.push('origin', this.branch);
    }
    return spawn('git', ['pull'].concat(args), this.spawnOpt(optionSpawn));
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

  push(force = false, optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = ['push'];
    if (force) args = args.concat('-f');
    return spawn('git', args, this.spawnOpt(optionSpawn));
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

  /**
   * git status
   * @returns
   */
  status() {
    return new Bluebird((resolve: (result: StatusResult[]) => any, reject) => {
      spawn('git', ['status'], this.spawnOpt({ stdio: 'pipe' }))
        .then((response) => {
          const result = response
            .split('\n')
            .map((str) => str.trim())
            .filter((str_1) =>
              /^(modified|added|deleted|untracked):/.test(str_1)
            )
            .map((str) => {
              const split = str.split(/:\s+/);
              return {
                changes: split[0],
                path: split[1].replace(/\(.*\)$/, '').trim()
              };
            });
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
  public setremote(v: string | URL, name?: string) {
    this.remote = v instanceof URL ? v.toString() : v;
    try {
      return spawn(
        'git',
        ['remote', 'add', name || 'origin', this.remote],
        this.spawnOpt()
      );
    } catch (_) {
      return spawn(
        'git',
        ['remote', 'set-url', name || 'origin', this.remote],
        this.spawnOpt()
      );
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
