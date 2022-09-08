"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitSubmodule = exports.submodule = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const extract_submodule_1 = __importDefault(require("./extract-submodule"));
const spawner_1 = require("./spawner");
class submodule {
    constructor(cwd) {
        this.cwd = cwd;
        this.hasConfig = (0, fs_1.existsSync)((0, path_1.join)(this.cwd, '.gitmodules'));
    }
    spawnOpt(opt = {}) {
        return Object.assign({ cwd: this.cwd, stdio: 'pipe' }, opt);
    }
    /**
     * git submodule update
     * @param optionSpawn
     * @returns
     */
    update(optionSpawn = { stdio: 'inherit' }) {
        return (0, spawner_1.spawn)('git', ['submodule', 'update', '-i', '-r'], this.spawnOpt(optionSpawn));
    }
    status(optionSpawn = { stdio: 'inherit' }) {
        return (0, spawner_1.spawn)('git', ['submodule', 'status'], this.spawnOpt(optionSpawn));
    }
    /**
     * get submodule informations
     * @returns
     */
    async get() {
        const extract = (0, extract_submodule_1.default)((0, path_1.join)(this.cwd, '.gitmodules'));
        return extract;
    }
}
exports.submodule = submodule;
exports.default = submodule;
exports.gitSubmodule = submodule;
