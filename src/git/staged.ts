import { toUnix } from 'upath';
import promiseSpawn, { SpawnOptions } from '../spawn';

/**
 * Checks if the specified file path is staged in the current Git repository.
 *
 * Executes `git diff --cached --name-only -- <path>` to determine if the file is staged.
 *
 * @param path - The file path to check for staged status.
 * @param spawnOpt - Options to pass to the process spawn function.
 * @returns A promise that resolves to `true` if the file is staged, otherwise `false`.
 */
export async function isStaged(path: string, spawnOpt: SpawnOptions) {
  const unixPath = toUnix(path);
  const output = await promiseSpawn('git', ['diff', '--cached', '--name-only', '--', unixPath], {
    stdio: 'pipe',
    ...spawnOpt
  });
  const files = output
    .split('\n')
    .map((f) => toUnix(f.trim()))
    .filter(Boolean);
  console.log(files);
  return files.includes(unixPath);
}
