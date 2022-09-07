import { SpawnOptions } from 'child_process';
import { spawn } from 'hexo-util';

/**
 * asynchronous spawner
 * @param cmd
 * @param args
 * @param opt
 * @returns
 */
export async function shell(
  cmd: string,
  args: string[],
  opt: SpawnOptions = null
) {
  let useOpt = {
    cwd: __dirname
  };
  if (opt) {
    useOpt = Object.assign(useOpt, opt);
  }
  try {
    return await spawn(cmd, args, useOpt);
  } catch (e) {
    if (e instanceof Error) console.log(e.message);
    return console.trace(e);
  }
}
