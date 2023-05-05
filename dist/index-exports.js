"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitSubmodule = exports.GithubInfo = exports.getGithubRootDir = exports.getGithubRepoUrl = exports.getGithubRemote = exports.getGithubCurrentBranch = exports.getGithubBranches = void 0;
var getGithubBranches_1 = require("./functions/getGithubBranches");
Object.defineProperty(exports, "getGithubBranches", { enumerable: true, get: function () { return getGithubBranches_1.getGithubBranches; } });
var getGithubCurrentBranch_1 = require("./functions/getGithubCurrentBranch");
Object.defineProperty(exports, "getGithubCurrentBranch", { enumerable: true, get: function () { return getGithubCurrentBranch_1.getGithubCurrentBranch; } });
var getGithubRemote_1 = require("./functions/getGithubRemote");
Object.defineProperty(exports, "getGithubRemote", { enumerable: true, get: function () { return getGithubRemote_1.getGithubRemote; } });
var getGithubRepoUrl_1 = require("./functions/getGithubRepoUrl");
Object.defineProperty(exports, "getGithubRepoUrl", { enumerable: true, get: function () { return getGithubRepoUrl_1.getGithubRepoUrl; } });
var getGithubRootDir_1 = require("./functions/getGithubRootDir");
Object.defineProperty(exports, "getGithubRootDir", { enumerable: true, get: function () { return getGithubRootDir_1.getGithubRootDir; } });
__exportStar(require("./git"), exports);
var git_info_1 = require("./git-info");
Object.defineProperty(exports, "GithubInfo", { enumerable: true, get: function () { return __importDefault(git_info_1).default; } });
__exportStar(require("./spawn"), exports);
var submodule_1 = require("./submodule");
Object.defineProperty(exports, "gitSubmodule", { enumerable: true, get: function () { return __importDefault(submodule_1).default; } });
//
