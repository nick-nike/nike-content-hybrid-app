@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start-daily-snapshot.ps1"
pause
