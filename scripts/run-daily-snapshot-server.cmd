@echo off
title Daily Snapshot Server
cd /d "%~dp0.."
"C:\Users\hanhc\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "%~dp0serve-dist-spa.py"
pause
