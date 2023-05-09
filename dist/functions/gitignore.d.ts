import * as glob from 'glob';
import { infoOptions } from './infoOptions';
/**
 * get all ignored files by .gitignore
 * @param param0
 * @returns
 */
export declare const getIgnores: ({ cwd }: {
    cwd?: string;
}) => Promise<string[]>;
export type Return = {
    filter: {
        str: string;
        relativePath: string;
        matched: boolean;
    }[];
    result: boolean;
    /**
     * root directory of git
     */
    root: string;
};
export type isIgnoredOpt = infoOptions & Parameters<typeof getAllIgnoresConfig>[0];
export declare function isIgnored(filePath: string): Promise<boolean>;
export declare function isIgnored(filePath: string, opt?: isIgnoredOpt): Promise<boolean | Return>;
export declare function isIgnored(filePath: string, opt: {
    verbose: true;
}): Promise<Return>;
export declare function isIgnored(filePath: string, opt: {
    verbose: false;
}): Promise<boolean>;
/**
 * get and parse all `.gitignore` files
 */
export declare function getAllIgnoresConfig(options: glob.GlobOptionsWithFileTypesFalse): string[];
