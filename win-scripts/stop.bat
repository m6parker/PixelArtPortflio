@echo off
rem Usage: stop.bat [container-name]

setlocal
set "CONTAINER=game-asset-library"
if not "%~1"=="" set "CONTAINER=%~1"

docker stop %CONTAINER%  >nul 2>&1
endlocal
