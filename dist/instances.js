"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstance = getInstance;
exports.setInstance = setInstance;
exports.hasInstance = hasInstance;
const instances = {};
/**
 * get git instance
 * @param key
 * @returns
 */
function getInstance(key) {
    return instances[key];
}
/**
 * set git instance
 * @param key
 * @param instance
 */
function setInstance(key, instance) {
    instances[key] = instance;
}
/**
 * check git instance
 * @param key
 * @returns
 */
function hasInstance(key) {
    return typeof instances[key] !== 'undefined';
}
