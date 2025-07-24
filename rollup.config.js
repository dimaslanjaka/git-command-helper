const babel = require("@rollup/plugin-babel").default;
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve").nodeResolve;
const json = require("@rollup/plugin-json");
const packageJson = require("./package.json");
const path = require("upath");
const fs = require("fs");

const { author, dependencies = {}, devDependencies = {}, name, version } = packageJson;

// Packages that should be bundled
const bundledPackages = [
  "p-limit",
  "deepmerge-ts",
  "is-stream",
  "markdown-it",
  "node-cache",
  "chalk",
  "@expo/spawn-async",
  "glob"
];

// List external dependencies, excluding specific packages that should be bundled
const external = [...Object.keys(dependencies), ...Object.keys(devDependencies)].filter(
  (pkgName) => !bundledPackages.includes(pkgName)
);

const banner = `// ${name} ${version} by ${author.name} <${author.email}> (${author.url})`.trim();

const plugins = [
  nodeResolve({ extensions: [".js", ".ts"] }),
  commonjs(),
  json(),
  babel({
    babelHelpers: "bundled",
    extensions: [".js", ".ts"],
    exclude: "node_modules/**",
    presets: [
      [
        require.resolve("@babel/preset-env"),
        {
          targets: {
            node: "14"
          }
        }
      ]
    ]
  })
];

/**
 * Returns a function to generate entry file names with the given extension for Rollup output.
 * For node_modules, places in dependencies folder and logs the mapping.
 * @param {string} ext - The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { facadeModuleId: string }) => string}
 */
export function entryFileNamesWithExt(ext) {
  // Ensure the extension does not start with a dot
  if (ext.startsWith(".")) {
    ext = ext.slice(1);
  }
  return function ({ facadeModuleId }) {
    facadeModuleId = path.toUnix(facadeModuleId);
    if (!facadeModuleId.includes("node_modules")) {
      return `[name].${ext}`;
    }
    // Find the first occurrence of 'node_modules' and slice from there
    const nodeModulesIdx = facadeModuleId.indexOf("node_modules");
    let rel = facadeModuleId.slice(nodeModulesIdx);
    rel = rel.replace("node_modules", "dependencies");
    // Remove extension using upath.extname
    rel = rel.slice(0, -path.extname(rel).length) + `.${ext}`;
    // Remove any null bytes (\x00) that may be present (Rollup sometimes injects these)
    rel = rel.replace(/\0/g, "");
    // Remove any leading slashes
    rel = rel.replace(/^\/\/+/, "");

    fs.appendFileSync(
      "tmp/rollup.log",
      `entryFileNamesWithExt:\n  [facadeModuleId] ${facadeModuleId}\n  [rel] ${rel}\n`
    );
    return rel;
  };
}

/**
 * Returns a function to generate chunk file names with the given extension for Rollup output.
 * For node_modules chunks, places in dependencies folder and removes extension.
 * @param {string} ext - The file extension (e.g. 'js', 'cjs', 'mjs').
 * @returns {(info: { name: string }) => string}
 */
export function chunkFileNamesWithExt(ext) {
  return function ({ name }) {
    // For node_modules chunks, place in dependencies folder
    if (name && name.includes("node_modules")) {
      const nodeModulesIdx = name.indexOf("node_modules");
      let rel = name.slice(nodeModulesIdx);
      rel = rel.replace("node_modules", "dependencies");
      // Remove extension using upath.extname
      rel = rel.slice(0, -path.extname(rel).length);
      // Remove any null bytes (\x00) that may be present
      rel = rel.replace(/\0/g, "");
      // Remove any leading slashes
      rel = rel.replace(/^\/\/+/, "");
      return `${rel}-[hash].${ext}`;
    }
    // For local chunks, keep the default pattern
    return `[name]-[hash].${ext}`;
  };
}

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "tmp/dist/index.js",
  output: [
    {
      dir: "dist",
      format: "cjs",
      preserveModules: true,
      preserveModulesRoot: "tmp/dist",
      entryFileNames: entryFileNamesWithExt("js"),
      entryChunkFileNames: chunkFileNamesWithExt("js"),
      banner
    },
    {
      dir: "dist",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "tmp/dist",
      entryFileNames: entryFileNamesWithExt("mjs"),
      entryChunkFileNames: chunkFileNamesWithExt("mjs"),
      banner
    }
  ],
  plugins,
  external
};

module.exports = config; // Export the Rollup configuration
