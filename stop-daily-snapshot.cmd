@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\stop-daily-snapshot.ps1"
pause
