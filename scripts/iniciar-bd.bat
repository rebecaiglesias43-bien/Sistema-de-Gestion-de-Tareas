@echo off
setlocal
title Iniciar PostgreSQL (desarrollo)

rem Ubica los binarios de PostgreSQL:
rem   1) variable de entorno PGSQL_HOME
rem   2) rutas habituales del instalador oficial
if defined PGSQL_HOME goto :encontrado

for %%V in (18 17 16 15 14) do (
    if exist "%ProgramFiles%\PostgreSQL\%%V\bin\pg_ctl.exe" (
        set "PGSQL_HOME=%ProgramFiles%\PostgreSQL\%%V"
        goto :encontrado
    )
)

echo No se encontro PostgreSQL.
echo.
echo Define PGSQL_HOME con la carpeta de la instalacion, por ejemplo:
echo   set PGSQL_HOME=C:\Program Files\PostgreSQL\18
echo   set PGSQL_HOME=%USERPROFILE%\Desktop\pgsql
echo.
pause
exit /b 1

:encontrado
if not defined PGSQL_DATA set "PGSQL_DATA=%PGSQL_HOME%\data"

"%PGSQL_HOME%\bin\pg_ctl.exe" status -D "%PGSQL_DATA%" >nul 2>&1
if %errorlevel%==0 (
    echo PostgreSQL ya esta en ejecucion.
    echo Puedes conectar pgAdmin con el usuario postgres.
    timeout /t 4 >nul
    exit /b 0
)

echo Iniciando PostgreSQL desde %PGSQL_HOME% ...
echo.
"%PGSQL_HOME%\bin\pg_ctl.exe" start -D "%PGSQL_DATA%" -l "%TEMP%\postgresql-dev.log" -w -t 30

if %errorlevel%==0 (
    echo.
    echo PostgreSQL iniciado correctamente.
    echo Abre pgAdmin y conectate con el usuario postgres.
) else (
    echo.
    echo ERROR: no se pudo iniciar PostgreSQL.
    echo Revisa el registro: %TEMP%\postgresql-dev.log
)

echo.
pause
