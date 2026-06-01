import path from "path";
import { fileURLToPath } from "url";
import extractSubmodule from "../../dist/utils/extract-submodule.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gitmodulesPath = path.join(__dirname, "../fixtures/.gitmodules-sample");
const submodules = extractSubmodule(gitmodulesPath);
console.log(submodules);
