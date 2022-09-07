import fs from 'fs';
import ini from 'ini';
import { dirname, join } from 'path';

/**
 * extract submodule to object
 * @param path
 */
function extractSubmodule(path: fs.PathOrFileDescriptor) {
  const config = ini.parse(fs.readFileSync(path).toString());
  return Object.keys(config).map((key) => {
    if (key.startsWith('submodule')) {
      const submodule: Submodule = config[key];
      submodule.root = join(dirname(String(path)), submodule.path);
      return submodule;
    }
  });
}

export interface Submodule {
  root: string;
  path: string;
  url: string;
  branch?: string;
}

export default extractSubmodule;
