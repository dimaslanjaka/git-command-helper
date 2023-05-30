import { join } from 'path';

export const TestConfig = {
  /**
   * Git directory
   */
  cwd: join(__dirname, '../tmp/project-test'),
  branch: 'test',
  remote: 'https://github.com/dimaslanjaka/test-repo.git',
  user: 'dimaslanjaka',
  email: 'dimaslanjaka@gmail.com',
  token: process.env.GITHUB_TOKEN
};

export const testcfg = TestConfig;

/**
 * Check current instance is jest
 * @returns
 */
export function areWeTestingWithJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}
