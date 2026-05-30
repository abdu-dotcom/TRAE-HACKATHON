@echo off
setlocal EnableExtensions EnableDelayedExpansion

set BASEDIR=%~dp0
set WRAPPER_DIR=%BASEDIR%\.mvn\wrapper
set MAVEN_VERSION=3.9.9
set DIST_NAME=apache-maven-%MAVEN_VERSION%
set DIST_DIR=%WRAPPER_DIR%\dists\%DIST_NAME%
set DIST_HOME=%DIST_DIR%\%DIST_NAME%
set ZIP_PATH=%DIST_DIR%\%DIST_NAME%-bin.zip
set DIST_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/%DIST_NAME%-bin.zip

if exist "%DIST_HOME%\bin\mvn.cmd" goto run

if not exist "%DIST_DIR%" mkdir "%DIST_DIR%"

if not exist "%ZIP_PATH%" (
  where curl.exe >nul 2>nul
  if %ERRORLEVEL%==0 (
    curl.exe -L -o "%ZIP_PATH%" "%DIST_URL%"
    if errorlevel 1 exit /b 1
  ) else (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; Invoke-WebRequest -UseBasicParsing -Uri '%DIST_URL%' -OutFile '%ZIP_PATH%';"
    if errorlevel 1 exit /b 1
  )
)

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Expand-Archive -LiteralPath '%ZIP_PATH%' -DestinationPath '%DIST_DIR%' -Force;"
if errorlevel 1 exit /b 1

:run
set "JAVA_HOME="
call "%DIST_HOME%\bin\mvn.cmd" %*
exit /b %ERRORLEVEL%
