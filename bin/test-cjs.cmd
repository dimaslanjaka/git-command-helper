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

:: Run the specific Jest test file while ignoring .mjs files.
:: Use caret (^) for line continuation in Windows CMD.
npx -y jest ^
  --runInBand ^
  --forceExit ^
  --testTimeout=120000 ^
  --testPathIgnorePatterns="\\.mjs$" ^
  --detectOpenHandles ^
  %CI_ARG% ^
  %*

endlocal