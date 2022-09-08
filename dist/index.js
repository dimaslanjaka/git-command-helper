"use strict";
/* eslint-disable no-control-regex */
/**
 * NodeJS GitHub Helper
 * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitCommandHelper = exports.gitHelper = exports.git = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const latestCommit_1 = require("./latestCommit");
const shell_1 = require("./shell");
const spawner_1 = require("./spawner");
const submodule_1 = __importDefault(require("./submodule"));
// module 'git-command-helper';
/**
 * GitHub Command Helper For NodeJS
 */
class git {
    constructor(dir) {
        this.latestCommit = latestCommit_1.latestCommit;
        this.cwd = dir;
        this.submodule = new submodule_1.default(dir);
        this.isExist();
    }
    fetch(arg, optionSpawn = { stdio: 'inherit' }) {
        let args = [];
        if (Array.isArray(arg))
            args = args.concat(arg);
        return (0, spawner_1.spawn)('git', ['fetch'].concat(args), this.spawnOpt(optionSpawn));
    }
    pull(arg, optionSpawn = { stdio: 'inherit' }) {
        let args = [];
        if (Array.isArray(arg))
            args = args.concat(arg);
        if (args.length === 0) {
            args.push('origin', this.branch);
        }
        return (0, spawner_1.spawn)('git', ['pull'].concat(args), this.spawnOpt(optionSpawn));
    }
    /**
     * git commit
     * @param msg commit messages
     * @param optionSpawn
     * @returns
     */
    commit(msg, optionSpawn = { stdio: 'inherit' }) {
        return (0, spawner_1.spawn)('git', ['commit', '-m', msg], this.spawnOpt(optionSpawn));
    }
    push(force = false, optionSpawn = { stdio: 'inherit' }) {
        let args = ['push'];
        if (force)
            args = args.concat('-f');
        return (0, spawner_1.spawn)('git', args, this.spawnOpt(optionSpawn));
    }
    spawnOpt(opt = {}) {
        return Object.assign({ cwd: this.cwd }, opt);
    }
    /**
     * git add
     * @param path specific path or argument -A
     * @param optionSpawn
     * @returns
     */
    add(path, optionSpawn = { stdio: 'inherit' }) {
        return (0, spawner_1.spawn)('git', ['add', path], this.spawnOpt(optionSpawn));
    }
    /**
     * git init
     * @returns
     */
    async init() {
        return (0, spawner_1.spawn)('git', ['init'], this.spawnOpt());
    }
    async isExist() {
        const folderExist = (0, fs_1.existsSync)((0, path_1.join)(this.cwd, '.git'));
        const result = await (0, spawner_1.spawn)('git', ['status'], this.spawnOpt({ stdio: 'pipe' }));
        const match1 = /changes not staged for commit/gim.test(result);
        this.exist = match1 && folderExist;
        return this.exist;
    }
    setcwd(v) {
        this.cwd = v;
    }
    setemail(v) {
        this.email = v;
        (0, shell_1.shell)('git', ['config', 'user.email', this.email], this.spawnOpt());
    }
    setuser(v) {
        this.user = v;
        (0, shell_1.shell)('git', ['config', 'user.name', this.user], this.spawnOpt());
    }
    setremote(v) {
        this.remote = v instanceof URL ? v.toString() : v;
        return (0, shell_1.shell)('git', ['remote', 'add', 'origin', this.remote], this.spawnOpt());
    }
    setbranch(v) {
        this.branch = v;
    }
    /**
     * Reset to latest commit of remote branch
     * @param branch
     */
    reset(branch = this.branch) {
        (0, shell_1.shell)('git', ['reset', '--hard', 'origin/' + branch || this.branch], {
            stdio: 'inherit',
            cwd: this.cwd
        });
    }
}
exports.git = git;
exports.default = git;
exports.gitHelper = git;
exports.gitCommandHelper = git;
