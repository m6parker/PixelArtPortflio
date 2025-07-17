@echo off
rem Usage: build.bat [image-name] [any extra docker build flags]
setlocal

set "IMAGE=%1"
if "%IMAGE%"=="" (
    set "IMAGE=game-asset-library"
) else (
    shift
)

docker build %* -t %IMAGE% .
endlocal
