"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyPath = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 * copy file/folder recursively
 * @param src
 * @param dest
 * @param options
 * @returns
 */
function copyPath(src, dest, options) {
    if (!fs_extra_1.default.existsSync(path_1.default.dirname(dest))) {
        fs_extra_1.default.mkdirSync(path_1.default.dirname(dest), { recursive: true });
    }
    return fs_extra_1.default.copy(src, dest, Object.assign({ overwrite: true, dereference: true, errorOnExist: false }, options || {}));
}
exports.copyPath = copyPath;
