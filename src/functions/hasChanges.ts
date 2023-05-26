'use strict';

import { gitStatus } from './status';

/**
 * check any files changed
 * @param opt
 */
export function gitHasChanges(opt: { [key: string]: any; cwd: string }) {
  // git status --porcelain
  const get = gitStatus(opt);
  return get.length > 0;
}

/*
function convertArr2Obj<T extends any[]>(data: T) {
  return Array.isArray(data) ? data.reduce((obj, el, i) => (el && (obj[i] = convert(el)), obj), {}) : data;
}
*/
