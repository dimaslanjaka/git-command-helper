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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIgnoresConfig = exports.isIgnored = exports.getIgnores = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const glob = __importStar(require("glob"));
const minimatch_1 = require("minimatch");
const upath_1 = __importDefault(require("upath"));
const case_path_1 = require("../utils/case-path");
const getGithubRootDir_1 = require("./getGithubRootDir");
/**
 * get all ignored files by .gitignore
 * @param param0
 * @returns
 */
const getIgnores = async ({ cwd = process.cwd() }) => (await cross_spawn_1.default.async('git', 'status --porcelain --ignored'.split(' '), { cwd })).output
    .split(/\r?\n/)
    .map((str) => str.trim())
    .filter((str) => str.startsWith('!!'))
    .map((str) => str.replace(/!!\s+/, ''));
exports.getIgnores = getIgnores;
async function isIgnored(filePath, options = {}) {
    let cwd = (await (0, getGithubRootDir_1.getGithubRootDir)({ cwd: upath_1.default.dirname(filePath) })) || '';
    if (cwd.length === 0) {
        const err = new Error(upath_1.default.toUnix(filePath) + ' is not inside git repository');
        if (options.throwable) {
            throw err;
        }
        else {
            console.log({ error: err, cwd: upath_1.default.dirname(filePath) });
        }
        // cwd fallback to process.cwd
        cwd = process.cwd();
    }
    const ignores = await (0, exports.getIgnores)({ cwd });
    const filter = ignores.map((str) => {
        const unixPath = upath_1.default.toUnix((0, case_path_1.trueCasePathSync)(filePath));
        let relativePath = unixPath;
        if (fs_extra_1.default.existsSync(unixPath)) {
            relativePath = unixPath.replace(cwd, '');
        }
        relativePath = relativePath.replace(/^\/+/, '');
        const matches = [];
        const patterns = getAllIgnoresConfig(options);
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            if (pattern === '*')
                continue;
            const matched = (0, minimatch_1.minimatch)(relativePath, pattern, { nonegate: true });
            if (matched && options.verbose)
                console.log(pattern, matched);
            matches.push(matched);
        }
        return {
            str,
            relativePath,
            matched: str === relativePath || matches.some((b) => b === true)
        };
    });
    const result = filter.some((o) => o.matched);
    if (options.verbose) {
        return {
            root: cwd,
            filter,
            result
        };
    }
    return result;
}
exports.isIgnored = isIgnored;
/**
 * get and parse all `.gitignore` files
 */
function getAllIgnoresConfig(options) {
    const files = glob
        .globSync('**/.gitignore', options)
        .filter((str) => typeof str === 'string')
        .map((file) => upath_1.default.toUnix(options.cwd ? (0, case_path_1.trueCasePathSync)(file, String(options.cwd)) : (0, case_path_1.trueCasePathSync)(file)));
    const lines = files
        .map((file) => fs_extra_1.default
        .readFileSync(file, 'utf-8')
        .split(/\r?\n/gm)
        .map((str) => str.trim()))
        .flat()
        .filter((str) => str.length > 0 && !str.startsWith('#'));
    return lines;
}
exports.getAllIgnoresConfig = getAllIgnoresConfig;
