import { async as spawnAsync } from "cross-spawn";

/**
 * Performs a git dry-run for the specified commands to check if there are changes to push.
 * @param cwd - The working directory where the git command should be executed.
 * @param commands - The git command arguments (e.g., ["push", origin, branch]).
 */
export async function dryRun({ cwd, commands }: { cwd: string; commands: string[] }) {
  const dry = await spawnAsync("git", [...commands, "--dry-run"], { stdio: "pipe", cwd });
  return dry.output.trim() != "Everything up-to-date";
}

/**
 * Checks if the current branch can be pushed to the specified origin and branch.
 * @param cwd - The working directory where the git command should be executed.
 * @param origin - The name of the remote origin.
 * @param branch - The name of the branch to push.
 */
export async function isCanPush({ cwd, origin, branch }: { cwd: string; origin: string; branch: string }) {
  try {
    const can = await dryRun({ cwd, commands: ["push", origin, branch] });
    return can ? true : false;
  } catch {
    return false;
  }
}
