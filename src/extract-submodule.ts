import fs from 'fs';
import ini from 'ini';
import { dirname, join } from 'path';
import git from './git';

/**
 * extract submodule to object
 * @param gitmodulesPath
 */
function extractSubmodule(gitmodulesPath: string) {
  const config = ini.parse(fs.readFileSync(gitmodulesPath).toString());
  return Object.keys(config).map((key) => {
    if (key.startsWith('submodule')) {
      const submodule: Submodule = config[key];
      submodule.root = join(dirname(String(gitmodulesPath)), submodule.path);
      //submodule.github = new git(submodule.root);
      /*if (submodule.url)
				submodule.github
					.setremote(submodule.url, "origin", { stdio: "pipe" })
					.catch(() => {
						//
					});
			if (submodule.branch)
				submodule.github
					.setbranch(submodule.branch, { stdio: "pipe" })
					.catch(() => {
						//
					});*/

      return submodule;
    }
  });
}

export interface Submodule {
  root: string;
  path: string;
  url: string;
  branch?: string;
  github?: git;
}

export default extractSubmodule;
