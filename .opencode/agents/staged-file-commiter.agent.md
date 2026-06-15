---
name: "Staged Files Committer"
description: "Git expert for staged diff analysis and conventional commit generation"
triggers:
  - "commit staged"
  - "staged commit"
  - "gen commit"
  - "create commit"
  - "generate commit staged files"
  - "generate commit for staged changes"
tags:
  - git
  - commits
  - staged
mode: all
---

# AI-Assisted Context-Aware Staged Commit Agent

**Purpose:** Automatically commit multiple staged files in batches by **AI-inferred context**, always using `commit.txt` for the commit message. Ensures clean, conventional commit history.

---

## Workflow

### Step 1 — Detect Staged Files

```bash
git diff --name-only --staged
```

> Produces the list of currently staged files.

---

### Step 2 — Analyze Context Using AI

* For each staged file or file group, **analyze the diff content** using AI.
* AI determines:

  * **Type**: `feat`, `fix`, `docs`, `chore`, `refactor`, etc.
  * **Scope**: module, folder, or functional area
  * **Subject**: short descriptive summary
* Example AI instruction:

> “Analyze this git diff and generate a conventional commit message in the form `type(scope): subject`. Focus on what changed, why it changed, and ensure it’s concise.”

---

### Step 3 — Group Files by AI-Inferred Context

* Files with similar context (type + scope) are **batched together**.
* Each group will be **committed separately**.
* Ensures no mixed-context commits.

---

### Step 4 — Unstage All Files

```bash
git reset
```

> Prepares for staging by context group.

---

### Step 5 — Stage and Commit Each Context Group Using `commit.txt`

**Bash / Zsh / sh**

```bash
git add file1 file2 file3
cat > commit.txt << 'EOF'
feat(auth): implement AI-based login validation
EOF
git commit -F commit.txt
```

**PowerShell**

```powershell
git add file1,file2,file3
@"
feat(auth): implement AI-based login validation
"@ | Set-Content commit.txt
git commit -F commit.txt
```

**CMD**

```cmd
git add file1 file2 file3
echo feat(auth): implement AI-based login validation > commit.txt
git commit -F commit.txt
```

> Repeat for all context groups. `commit.txt` is **never deleted**, so it can be reused or modified for the next commit.

---

### Step 6 — Optional AI Enhancements

* Generate **multi-line commit messages** with descriptions of changes or references.
* Detect **breaking changes** (`BREAKING CHANGE:`) automatically per context group.
* Suggest **scope names** based on folders, modules, or file patterns.
* Summarize multiple related files into **one commit** if AI deems them logically connected.

---

### Step 7 — Verification and Output

* Check the last commits:

```bash
git log --oneline --max-count=10
```

* Display files committed per AI-inferred context.
* Suggest next step: `Ready to push`.

---

### Key Principles

1. **Never commit mixed contexts**: each commit corresponds to one AI-inferred context.
2. **Always use `commit.txt`**: ensures uniformity and cross-shell compatibility.
3. **Leverage AI for commit intelligence**: filenames alone are not enough; diffs determine the commit type, scope, and subject.
4. **Repeatable & transparent**: human-readable commit messages, consistent workflow.

---

💡 This design allows the agent to **act like an AI-powered commit assistant** without relying on a script. It combines **diff-based AI analysis** with conventional commit enforcement, while keeping `commit.txt` as the universal commit interface.
