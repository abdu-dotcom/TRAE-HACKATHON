@echo off
setlocal enabledelayedexpansion
set BASEDIR=%~dp0
if "%BASEDIR:~-1%"=="\" set BASEDIR=%BASEDIR:~0,-1%
set WRAPPER_DIR=%BASEDIR%\.mvn\wrapper
set JAR=%WRAPPER_DIR%\maven-wrapper.jar
set PROPS=%WRAPPER_DIR%\maven-wrapper.properties
set WRAPPER_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
if not exist "%WRAPPER_DIR%" mkdir "%WRAPPER_DIR%" >nul 2>nul
if not exist "%JAR%" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$p='%JAR%';$u='%WRAPPER_URL%';$wc=New-Object Net.WebClient;$wc.DownloadFile($u,$p)"
)
set MAVEN_PROJECTBASEDIR=%BASEDIR%
java -classpath "%JAR%" "-Dmaven.multiModuleProjectDirectory=%BASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
endlocal
