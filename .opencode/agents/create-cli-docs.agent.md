---
name: "Create CLI Documentation"
description: >-
  Use this agent when you need to create a documentation for command/sub command binary-collections project.
mode: all
---

User should provide input file for documentation, otherwise ask user back.

1. Run build `yarn run build`
2. read aliases `build.config.cjs` and `tmp/bin-mapping.json`
3. read another markdown files on folder `docs-src` to computing documentation structure.
4. Analyze them and create the documentation to folder `docs-src`

Documentation structure:

```markdown
# Title

description

# Usage

the usage description, including aliases

# Source

the link to source file on folder `src` (not folder `lib`).
```

> the folder `lib` structure is same with `src`, `lib` equivalent dist folder (auto generated)