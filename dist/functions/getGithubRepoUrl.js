"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubRepoUrl = void 0;
const true_case_path_1 = require("true-case-path");
const getGithubCurrentBranch_1 = require("./getGithubCurrentBranch");
const getGithubRemote_1 = require("./getGithubRemote");
const getGithubRootDir_1 = require("./getGithubRootDir");
/**
 * Get github url for single file or folder
 * @param path path subfolder or file
 */
async function getGithubRepoUrl(path, opt = {}) {
    path = (0, true_case_path_1.trueCasePathSync)(path);
    const root = (0, true_case_path_1.trueCasePathSync)((await (0, getGithubRootDir_1.getGithubRootDir)(opt)) || '');
    const remote = ((await (0, getGithubRemote_1.getGithubRemote)(null, opt)) || '').replace(/(.git|\/)$/i, '');
    let url = new URL(remote);
    url.pathname += '/tree/' + (await (0, getGithubCurrentBranch_1.getGithubCurrentBranch)(opt)) + path.replace(root, '');
    const remoteURL = url.toString();
    url = new URL(remote);
    url.pathname += '/raw/' + (await (0, getGithubCurrentBranch_1.getGithubCurrentBranch)(opt)) + path.replace(root, '');
    const rawURL = url.toString();
    return {
        remoteURL,
        rawURL
    };
}
exports.getGithubRepoUrl = getGithubRepoUrl;
