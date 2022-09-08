import { SpawnOptions } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import extractSubmodule from './extract-submodule';
import { spawn } from './spawner';

export class submodule {
  cwd: string;
  hasConfig: boolean;
  constructor(cwd: string) {
    this.cwd = cwd;
    this.hasConfig = existsSync(join(this.cwd, '.gitmodules'));
  }

  private spawnOpt(opt: SpawnOptions = {}) {
    return Object.assign({ cwd: this.cwd, stdio: 'pipe' } as SpawnOptions, opt);
  }

  /**
   * git submodule update
   * @param optionSpawn
   * @returns
   */
  update(optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    return spawn(
      'git',
      ['submodule', 'update', '-i', '-r'],
      this.spawnOpt(optionSpawn)
    );
  }
  status(optionSpawn: SpawnOptions = { stdio: 'inherit' }) {
    return spawn('git', ['submodule', 'status'], this.spawnOpt(optionSpawn));
  }

  /**
   * get submodule informations
   * @returns
   */
  async get() {
    const extract = extractSubmodule(join(this.cwd, '.gitmodules'));
    return extract;
  }
}

export default submodule;
export const gitSubmodule = submodule;
