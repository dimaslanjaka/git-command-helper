import dotenv from "dotenv";
import path from "upath";

dotenv.config({ path: path.join(__dirname, "../.env") });

export const token = process.env.ACCESS_TOKEN || process.env.GITHUB_TOKEN || "token_" + Math.random();

export const TestConfig = {
  /**
   * Git directory
   */
  cwd: path.join(__dirname, "../tmp/project-test"),
  branch: "test",
  remote: "https://github.com/dimaslanjaka/test-repo.git",
  user: "github-actions[bot]",
  email: "41898282+github-actions[bot]@users.noreply.github.com",
  token,
  originName: "origin"
};

// Mock process.cwd for testing purposes
process.cwd = () => TestConfig.cwd;

export const testcfg = TestConfig;

/**
 * Check current instance is jest
 * @returns
 */
export function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}

export const myGithubPages = {
  cwd: path.join(__dirname, "../tmp", ".deploy_git"),
  branch: "master",
  remote: `https://${token}@github.com/dimaslanjaka/dimaslanjaka.github.io.git`,
  user: "dimaslanjaka",
  email: "dimaslanjaka@gmail.com",
  token
};
