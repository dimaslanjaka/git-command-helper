import { SpawnOptions } from '../spawn';
/**
 * Checks if the specified file path is staged in the current Git repository.
 *
 * Executes `git diff --cached --name-only -- <path>` to determine if the file is staged.
 *
 * @param path - The file path to check for staged status.
 * @param spawnOpt - Options to pass to the process spawn function.
 * @returns A promise that resolves to `true` if the file is staged, otherwise `false`.
 */
export declare function isStaged(path: string, spawnOpt: SpawnOptions): Promise<boolean>;
