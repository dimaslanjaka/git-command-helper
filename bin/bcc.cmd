@echo off
setlocal

REM -----------------------------
REM BCC – Binary Collections CLI Runner with Remote Fallback
REM -----------------------------

echo [bcc] Attempting local binary-collections...
npm exec --legacy-peer-deps --yes --package=binary-collections -- binary-collections %*
if %ERRORLEVEL% EQU 0 (
    echo [bcc] Local binary-collections succeeded.
    exit /b 0
)

echo [bcc] Local binary-collections failed. Trying remote tarball...
npm exec --legacy-peer-deps --yes --package=https://raw.githubusercontent.com/dimaslanjaka/bin/master/releases/bin.tgz -- binary-collections %*
if %ERRORLEVEL% EQU 0 (
    echo [bcc] Remote tarball binary-collections succeeded.
    exit /b 0
)

echo [bcc] ERROR: Both local and remote binary-collections failed.
exit /b %ERRORLEVEL%