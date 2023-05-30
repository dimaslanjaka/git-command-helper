/** git config */

import { git } from '..';

export class gitConfig {
  cwd: string;
  git: git;
  constructor(opt: { cwd: string } | git) {
    this.cwd = opt.cwd;
    this.git = opt instanceof git ? opt : new git(opt.cwd);
  }

  /**
   * custom spawn
   * @param args cli argument without `git config`
   */
  custom(...args: string[]) {
    return this.git.spawn('git', [...args]);
  }

  ignoreCase(toBe: boolean | string) {
    return this.custom('core.ignorecase', String(toBe));
  }
}
