"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getGithubBranches_1 = require("./functions/getGithubBranches");
const getGithubCurrentBranch_1 = require("./functions/getGithubCurrentBranch");
const getGithubRemote_1 = require("./functions/getGithubRemote");
const getGithubRepoUrl_1 = require("./functions/getGithubRepoUrl");
const getGithubRootDir_1 = require("./functions/getGithubRootDir");
const GithubInfo = {
    getGithubCurrentBranch: getGithubCurrentBranch_1.getGithubCurrentBranch,
    getGithubRemote: getGithubRemote_1.getGithubRemote,
    getGithubRepoUrl: getGithubRepoUrl_1.getGithubRepoUrl,
    getGithubRootDir: getGithubRootDir_1.getGithubRootDir,
    getGithubBranches: getGithubBranches_1.getGithubBranches
};
exports.default = GithubInfo;
