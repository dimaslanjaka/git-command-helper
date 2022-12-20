import { join } from 'path';
import { getGithubRepoUrl } from '../src/git-info';

getGithubRepoUrl(join(__dirname, 'config.ts')).then(console.log);
