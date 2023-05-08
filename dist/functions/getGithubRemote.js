"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubRemote = void 0;
const noop_1 = __importDefault(require("../noop"));
const spawn_1 = require("../spawn");
/**
 * get origin url
 * * see {@link https://stackoverflow.com/a/4090938}
 * @param name remote name in config, default `origin`
 * @returns
 */
async function getGithubRemote(name = 'origin', opt = {}) {
    try {
        if (!name)
            name = 'origin';
        const result = await (0, spawn_1.spawnAsync)('git', `config --get remote.${name}.url`.split(' '), opt);
        return result.stdout.trim();
    }
    catch (err) {
        if (opt.throwable)
            throw err;
        return (0, noop_1.default)(err);
    }
}
exports.getGithubRemote = getGithubRemote;
