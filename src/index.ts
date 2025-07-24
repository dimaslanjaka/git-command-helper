export * from "./index-exports";
export * as ext from "./index-exports";

// separate index file for exporting the git module
import { git } from "./git";
// Exporting the git module as both a named and default export
export { git, git as gitCommandHelper, git as gitHelper };
export default git;

// The above exports allow for both named and default imports of the git module, enabling flexibility in how the module is consumed by other parts of the application.
