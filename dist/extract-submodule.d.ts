/// <reference types="node" />
import fs from 'fs';
/**
 * extract submodule to object
 * @param path
 */
declare function extractSubmodule(path: fs.PathOrFileDescriptor): Submodule[];
export interface Submodule {
    root: string;
    path: string;
    url: string;
    branch?: string;
}
export default extractSubmodule;
