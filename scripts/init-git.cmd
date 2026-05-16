@echo off
REM Initialize the Portfolio Wars git repo and make the first commit.
REM Run from the mvp/ directory in cmd:
REM   cd /d "C:\Users\thela\Desktop\Portfolio Wars\mvp"
REM   scripts\init-git.cmd

setlocal enabledelayedexpansion

REM Move to the repo root (parent of this scripts/ folder).
pushd "%~dp0\.."

echo Initializing git repo in %CD%

if exist ".git" (
    echo   .git already exists -- skipping init
) else (
    git init -b main >nul
    if errorlevel 1 goto :fail
    echo   [ok] git init -b main
)

REM Per-repo identity. Won't touch your global ~/.gitconfig.
git config user.email "creatition@proton.me"
git config user.name  "Creatition"
echo   [ok] configured user.email and user.name (this repo only)

git add -A
if errorlevel 1 goto :fail

REM Count staged files (Windows-friendly, no wc).
set STAGED=0
for /f %%c in ('git ls-files --cached ^| find /c /v ""') do set STAGED=%%c
echo   [ok] staged %STAGED% files

REM Multi-line commit message via a temp file (cmd has no heredoc).
set MSGFILE=%TEMP%\pw-init-commit-msg.txt
> "%MSGFILE%" echo Initial commit: Portfolio Wars MVP
>>"%MSGFILE%" echo.
>>"%MSGFILE%" echo - Monorepo with npm workspaces (apps/web, apps/api, packages/shared)
>>"%MSGFILE%" echo - @pw/web: Next.js 14 frontend, deploys to Cloudflare Pages
>>"%MSGFILE%" echo - @pw/api: Fastify + tRPC backend, deploys to Railway
>>"%MSGFILE%" echo - @pw/shared: types, tRPC router, mock data
>>"%MSGFILE%" echo - contracts/: Hardhat sub-project with FundingContract.sol stub
>>"%MSGFILE%" echo - DEPLOYMENT.md walks through Railway + Cloudflare setup

git commit -F "%MSGFILE%" >nul
if errorlevel 1 goto :fail
del "%MSGFILE%" >nul 2>&1
echo   [ok] first commit made

echo.
echo Next steps:
echo   1. Create a private repo on GitHub (gh repo create or the web UI)
echo   2. git remote add origin git@github.com:^<your-handle^>/portfolio-wars.git
echo   3. git push -u origin main
echo.
echo Then follow DEPLOYMENT.md to wire up Railway + Cloudflare.

popd
endlocal
exit /b 0

:fail
echo.
echo [error] Something went wrong above. See output for details.
popd
endlocal
exit /b 1
