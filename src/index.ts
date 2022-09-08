/* eslint-disable no-control-regex */
/**
 * NodeJS GitHub Helper
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 */

import { SpawnOptions } from 'child_process';
import { existsSync } from 'fs';
import { spawn } from 'hexo-util';
import { join } from 'path';
import { latestCommit } from './latestCommit';
import { shell } from './shell';
import submodule from './submodule';

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

  constructor(dir: string) {
    this.cwd = dir;
    this.submodule = new submodule(dir);
    this.isExist();
  }

  fetch(arg?: string[], optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = [];
    if (Array.isArray(arg)) args = args.concat(arg);
    return spawn('git', ['fetch'].concat(args), this.spawnOpt(optionSpawn));
  }

  pull(arg?: string[], optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = [];
    if (Array.isArray(arg)) args = args.concat(arg);
    return spawn('git', ['pull'].concat(args), this.spawnOpt(optionSpawn));
  }

  /**
   * git commit
   * @param msg commit messages
   * @param optionSpawn
   * @returns
   */
  commit(msg: string, optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    return spawn('git', ['commit', '-m', msg], this.spawnOpt(optionSpawn));
  }

  push(force = false, optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    let args = ['push'];
    if (force) args = args.concat('-f');
    return spawn('git', args, this.spawnOpt(optionSpawn));
  }

  private spawnOpt(opt: SpawnOptions = {}) {
    return Object.assign({ cwd: this.cwd }, opt);
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
   * git init
   * @returns
   */
  async init() {
    return spawn('git', ['init'], this.spawnOpt({ stdio: 'ignore' }));
  }

  async isExist() {
    const folderExist = existsSync(join(this.cwd, '.git'));
    const result = await spawn(
      'git',
      ['status'],
      this.spawnOpt({ stdio: 'pipe' })
    );
    const match1 = /changes not staged for commit/gim.test(result);
    this.exist = match1 && folderExist;
    return this.exist;
  }

  public setcwd(v: string) {
    this.cwd = v;
  }

  public setemail(v: string) {
    this.email = v;
    shell('git', ['config', 'user.email', this.email], this.spawnOpt());
  }

  public setuser(v: string) {
    this.user = v;
    shell('git', ['config', 'user.name', this.user], this.spawnOpt());
  }

  public setremote(v: string | URL) {
    this.remote = v instanceof URL ? v.toString() : v;
  }

  public setbranch(v: string) {
    this.branch = v;
  }

  /**
   * Reset to latest commit of remote branch
   * @param branch
   */
  reset(branch = this.branch) {
    shell('git', ['reset', '--hard', 'origin/' + branch || this.branch], {
      stdio: 'inherit',
      cwd: this.cwd
    });
  }
}

export default git;
export const gitHelper = git;
export const gitCommandHelper = git;
