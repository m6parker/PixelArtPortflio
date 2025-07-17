@echo off
rem Usage examples:
rem   start.bat
rem   start.bat HOST_PORT=8080 DEV=false
rem   start.bat HOST_PORT=8080 APP_PORT=3000 DEV=false IMAGE=myapp CONTAINER=myapp

setlocal EnableExtensions

:: defaults
set "IMAGE=game-asset-library"
set "CONTAINER=game-asset-library"
set "HOST_PORT=3001"
set "APP_PORT=3000"
set "DEV=true"

:: simple key=value parser
:parse
if "%~1"=="" goto run
for /f "tokens=1,2 delims==" %%A in ("%~1") do set "%%A=%%B"
shift
goto parse

:run
if /I "%DEV%"=="true" (
    set "VOL_ROOT=%CD%"
) else (
    set "VOL_ROOT=/var/www/%IMAGE%"
)

set "UPLOADS_VOL=%VOL_ROOT%/uploads:/app/uploads"
set "DB_VOL=%VOL_ROOT%/files.db:/app/files.db"

docker run -d ^
  --name %CONTAINER% ^
  --restart unless-stopped ^
  -p 127.0.0.1:%HOST_PORT%:%APP_PORT% ^
  -v %UPLOADS_VOL% ^
  -v %DB_VOL% ^
  %IMAGE%

endlocal
