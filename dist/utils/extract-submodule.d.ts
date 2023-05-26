import git, { GitOpt } from '../git';
export interface Submodule extends GitOpt {
  github?: git;
  path?: string;
}
/**
 * extract submodule to object
 * @param gitmodulesPath
 */
declare function extractSubmodule(gitmodulesPath: string): Submodule[];
export default extractSubmodule;
