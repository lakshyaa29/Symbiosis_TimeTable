@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is needed to run this launcher.
  echo Alternatively, run: python -m http.server 4173 --directory dist --bind 127.0.0.1
  pause
  exit /b 1
)
echo Starting the SSPU timetable portal at http://localhost:4173
node server.cjs
pause
