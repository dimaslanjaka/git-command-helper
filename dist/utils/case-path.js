'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.trueCasePath = exports.trueCasePathSync = void 0;
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const util_1 = require("util");
const readdir = (0, util_1.promisify)(fs_1.readdir);
const isWindows = (0, os_1.platform)() === 'win32';
const delimiter = isWindows ? '\\' : '/';
exports.trueCasePathSync = _trueCasePath({ sync: true });
exports.trueCasePath = _trueCasePath({ sync: false });
function getRelevantFilePathSegments(filePath) {
    return filePath.split(delimiter).filter((s) => s !== '');
}
function escapeString(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function matchCaseInsensitive(fileOrDirectory, directoryContents, filePath) {
    const caseInsensitiveRegex = new RegExp(`^${escapeString(fileOrDirectory)}$`, 'i');
    for (const file of directoryContents) {
        if (caseInsensitiveRegex.test(file))
            return file;
    }
    throw new Error(`[true-case-path]: Called with ${filePath}, but no matching file exists`);
}
function _trueCasePath({ sync }) {
    return (filePath, basePath) => {
        var _a;
        if (!(0, fs_1.existsSync)(filePath))
            return basePath ? (0, path_1.join)(basePath, filePath) : filePath;
        if (basePath) {
            if (!(0, path_1.isAbsolute)(basePath)) {
                throw new Error(`[true-case-path]: basePath argument must be absolute. Received "${basePath}"`);
            }
            basePath = (0, path_1.normalize)(basePath);
        }
        filePath = (0, path_1.normalize)(filePath);
        const segments = getRelevantFilePathSegments(filePath);
        if ((0, path_1.isAbsolute)(filePath)) {
            if (basePath) {
                throw new Error('[true-case-path]: filePath must be relative when used with basePath');
            }
            basePath = isWindows
                ? (_a = segments.shift()) === null || _a === void 0 ? void 0 : _a.toUpperCase() // drive letter
                : '';
        }
        else if (!basePath) {
            basePath = process.cwd();
        }
        return sync ? iterateSync(basePath, filePath, segments) : iterateAsync(basePath, filePath, segments);
    };
}
function iterateSync(basePath, filePath, segments) {
    return segments.reduce((realPath, fileOrDirectory) => realPath + delimiter + matchCaseInsensitive(fileOrDirectory, (0, fs_1.readdirSync)(realPath + delimiter), filePath), basePath);
}
async function iterateAsync(basePath, filePath, segments) {
    return await segments.reduce(async (realPathPromise, fileOrDirectory) => (await realPathPromise) +
        delimiter +
        matchCaseInsensitive(fileOrDirectory, await readdir((await realPathPromise) + delimiter), filePath), basePath);
}
