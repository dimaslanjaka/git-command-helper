'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitHasChanges = gitHasChanges;
const status_1 = require("./status");
/**
 * check any files changed
 * @param opt
 */
function gitHasChanges(opt) {
    // git status --porcelain
    const get = (0, status_1.gitStatus)(opt);
    return get.length > 0;
}
