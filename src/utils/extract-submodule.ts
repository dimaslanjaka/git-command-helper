import fs from 'fs';
import ini from 'ini';
import { dirname, join } from 'upath';
import git, { GitOpt } from '../git';

export interface Submodule extends GitOpt {
  github?: git;
}

/**
 * extract submodule to object
 * @param gitmodulesPath
 */
function extractSubmodule(gitmodulesPath: string) {
  const config = ini.parse(fs.readFileSync(gitmodulesPath).toString());
  return Object.keys(config).map((key) => {
    if (key.startsWith('submodule')) {
      const submodule = config[key];
      submodule.cwd = join(dirname(String(gitmodulesPath)), submodule.path);
      submodule.github = new git(submodule.cwd);
      console.log(submodule);
      return submodule;
    }
  });
}

export default extractSubmodule;
