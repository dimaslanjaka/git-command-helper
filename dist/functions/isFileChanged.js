"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUntracked = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
/**
 * check file is untracked
 * @param filePath
 */
async function isUntracked(filePath, opt) {
    const defaults = {
        cwd: process.cwd()
    };
    opt = Object.assign(defaults, opt || {});
    const untrack = (await cross_spawn_1.default.async('git', ['diff', '--no-index', '--numstat', '/dev/null', filePath], opt)).stdout
        .split(/\r?\n/)
        .filter((str) => str.length > 0);
    return untrack.length === 1;
}
exports.isUntracked = isUntracked;
