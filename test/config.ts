import { join } from 'path';

export const configTest = {
  /**
   * Git directory
   */
  cwd: join(__dirname, '../tmp/project-test'),
  branch: 'master',
  remote: 'https://github.com/dimaslanjaka/dimaslanjaka.github.io.git',
  username: 'dimaslanjaka',
  email: 'dimaslanjaka@gmail.com',
  password: process.env.GITHUB_TOKEN
};
