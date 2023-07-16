import git from '../src';
import { TestConfig, myGithubPages } from './config';

console.log(new git(TestConfig).cwd);
console.log(new git(myGithubPages).cwd);
