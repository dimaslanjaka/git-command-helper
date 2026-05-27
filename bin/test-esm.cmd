@echo off
setlocal

:: Detect GitHub Actions or GitLab CI
set "CI_ARG="

if defined GITHUB_ACTIONS (
    set "CI_ARG=--ci"
)

if defined GITLAB_CI (
    set "CI_ARG=--ci"
)

node --experimental-vm-modules node_modules/jest/bin/jest.js ^
  --runInBand ^
  --forceExit ^
  --testTimeout=120000 ^
  --testPathIgnorePatterns="\\.(ts|js|cjs)$" ^
  %CI_ARG% ^
  %*

endlocal