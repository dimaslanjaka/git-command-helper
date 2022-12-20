"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubRemote = exports.getGithubRootDir = void 0;
const noop_1 = __importDefault(require("./noop"));
const spawn_1 = require("./spawn");
/**
 * get root directory of local repository
 * * see {@link https://stackoverflow.com/a/957978}
 * @returns
 */
async function getGithubRootDir() {
    try {
        const result = await (0, spawn_1.spawnAsync)('git', 'rev-parse --show-toplevel'.split(' '));
        return result.stdout.trim();
    }
    catch (_) {
        return (0, noop_1.default)(_);
    }
}
exports.getGithubRootDir = getGithubRootDir;
/**
 * get origin url
 * * see {@link https://stackoverflow.com/a/4090938}
 * @param name remote name in config, default `origin`
 * @returns
 */
async function getGithubRemote(name = 'origin') {
    try {
        const result = await (0, spawn_1.spawnAsync)('git', `config --get remote.${name}.url`.split(' '));
        return result.stdout.trim();
    }
    catch (_) {
        return (0, noop_1.default)(_);
    }
}
exports.getGithubRemote = getGithubRemote;
