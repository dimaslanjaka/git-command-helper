# git-command-helper
GitHub CLI Helper For NodeJS

[Main Class](https://github.com/dimaslanjaka/git-command-helper/blob/master/src/index.ts)

Example
```js
import git from 'git-command-helper' // const git = require('git-command-helper').default
// start current dir
const github = new git(__dirname)
// get current status
git.status().then(console.log)
// get submodule informations
if (git.submodule.hasSubmodule()) console.log(git.submodule.get());
```

## Custom Command
```js
github.spawn('git', ['fetch'], { stdio: 'pipe' }).then(console.log)
```
