import path from "path";
import gitCmdHelper from "../src/git.es";

const git = new gitCmdHelper.git({
  cwd: path.join(__dirname, "/../tmp/dimaslanjaka_github_io"),
  url: "https://github.com/dimaslanjaka/dimaslanjaka.github.io",
  ref: "master",
  remote: "origin"
});
console.log(git.submodules);
