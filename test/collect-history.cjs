const { spawnSync } = require("child_process");

/**
 * Returns the commit history (hash and date) for a branch, from the first to the most recent commit.
 *
 * @param {string} repoPath Path to the git repository.
 * @param {string} branch Branch name (e.g., 'main', 'custom-branch').
 * @param {string|null} [remote=null] Optional remote name (e.g., 'origin'). If provided, uses remote/branch.
 * @returns {Array<{hash: string, date: string}>} Array of commit objects with `hash` and ISO `date`.
 * @throws {Error} If the git command fails.
 */
function getBranchHistory(repoPath, branch, remote = null) {
  // If remote is provided, use remote/branch, else just branch
  const branchRef = remote ? `${remote}/${branch}` : branch;
  const gitArgs = [
    "log",
    "--reverse", // from oldest to newest
    branchRef,
    "--pretty=format:%H|%cI|%s"
  ];
  const result = spawnSync("git", gitArgs, {
    cwd: repoPath,
    encoding: "utf-8"
  });

  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr);

  return result.stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, date, ...messageParts] = line.split("|");
      const message = messageParts.join("|");
      return { hash, date, message };
    });
}

module.exports = { getBranchHistory };

if (require.main === module) {
  const history = getBranchHistory(process.cwd(), "python", "private");
  console.log(history);
}
