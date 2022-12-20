"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubRootDir = exports.getGithubRemote = exports.setupGit = exports.gitHelper = exports.gitCommandHelper = void 0;
const git_1 = __importDefault(require("./git"));
var git_2 = require("./git");
Object.defineProperty(exports, "gitCommandHelper", { enumerable: true, get: function () { return git_2.gitCommandHelper; } });
Object.defineProperty(exports, "gitHelper", { enumerable: true, get: function () { return git_2.gitHelper; } });
Object.defineProperty(exports, "setupGit", { enumerable: true, get: function () { return git_2.setupGit; } });
var git_info_1 = require("./git-info");
Object.defineProperty(exports, "getGithubRemote", { enumerable: true, get: function () { return git_info_1.getGithubRemote; } });
Object.defineProperty(exports, "getGithubRootDir", { enumerable: true, get: function () { return git_info_1.getGithubRootDir; } });
exports.default = git_1.default;
