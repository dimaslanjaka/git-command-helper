/** synchronous function type */
export type syncFunc = (...args: any[]) => any;
/** asynchronous function type */
export type asyncFunc = (...args: any[]) => Promise<any>;
/** mixed function type */
export type typeFunc = syncFunc | asyncFunc;
export default class helper {
    /**
     * Suppress Catch of async function or catch of errors
     * @param cb
     * @returns null = failed (catch caught)
     */
    static suppress(cb: typeFunc): Promise<any | Error>;
    /**
     * is variable promise function?
     * @param p
     * @returns
     */
    static isPromise(p: typeFunc): boolean;
}
