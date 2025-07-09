"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaged = isStaged;
const upath_1 = require("upath");
const spawn_1 = __importDefault(require("../spawn"));
/**
 * Checks if the specified file path is staged in the current Git repository.
 *
 * Executes `git diff --cached --name-only -- <path>` to determine if the file is staged.
 *
 * @param path - The file path to check for staged status.
 * @param spawnOpt - Options to pass to the process spawn function.
 * @returns A promise that resolves to `true` if the file is staged, otherwise `false`.
 */
async function isStaged(path, spawnOpt) {
    const unixPath = (0, upath_1.toUnix)(path);
    const output = await (0, spawn_1.default)('git', ['diff', '--cached', '--name-only', '--', unixPath], {
        stdio: 'pipe',
        ...spawnOpt
    });
    const files = output
        .split('\n')
        .map((f) => (0, upath_1.toUnix)(f.trim()))
        .filter(Boolean);
    console.log(files);
    return files.includes(unixPath);
}
