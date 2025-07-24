import git from "../src/index.js";
import { TestConfig, myGithubPages } from "./config";

console.log(new git(TestConfig).cwd);
console.log(new git(myGithubPages).cwd);
