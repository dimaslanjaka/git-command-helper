import { spawnAsync } from "cross-spawn";
import fs from "fs-extra";
import { glob } from "glob";
import path from "path";
import { getBinaryPath, normalizePathUnix } from "sbg-utility";

// index.ts exports builder
// this only for development and excluded from build config

// create export
glob("**/*.{ts,js,jsx,tsx,cjs,mjs}", {
  ignore: ["**/*.builder.*", "**/*.test.*", "**/*.spec*.*", "**/*.runner.*", "**/_*test"],
  cwd: __dirname,
  absolute: true
}).then(async (files) => {
  const map = files
    .map((f) => normalizePathUnix(f))
    .filter((file) => {
      const isFile = fs.statSync(file).isFile();
      const currentIndex = normalizePathUnix(__dirname, "index.ts");
      const currentIndexExports = normalizePathUnix(__dirname, "index-exports.ts");
      return isFile && file !== currentIndex && file !== currentIndexExports;
    })
    .map((file) => normalizePathUnix(file).replace(normalizePathUnix(__dirname), ""))
    .map((file) => {
      const fileId =
        "_" +
        normalizePathUnix(file)
          .replace(normalizePathUnix(__dirname), "")
          .replace(/.(ts|js|tsx|jsx|cjs)$/, "");
      const importName = fileId
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric characters
        .split(" ") // Split by spaces
        .filter(Boolean) // Remove empty strings
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(" "); // Join the words back into a string
      return {
        file,
        name: importName,
        import: `import * as ${importName} from '.${file.replace(/.(ts|js|tsx|jsx|cjs)$/, "")}';`,
        export: `export * from '.${file.replace(/.(ts|js|tsx|jsx|cjs)$/, "")}';`
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(path.join(__dirname, "index-exports.ts"), map.map((o) => o.export).join("\n"));

  fs.writeFileSync(
    path.join(__dirname, "index.ts"),
    [`export * from './index-exports'`, `import * as lib from './index-exports'`, "export default lib"].join("\n")
  );

  await spawnAsync(getBinaryPath("eslint"), ["--fix", "--ext", ".ts,.js,.jsx,.tsx,.cjs,.mjs", __dirname]);
});
