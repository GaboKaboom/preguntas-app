@echo off
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\GitHub CLI;C:\Program Files\Git\cmd"
echo ========================================
echo  Subir app a GitHub
echo ========================================
echo.
echo INICIANDO SESION EN GITHUB...
echo.
gh auth login -h github.com -w
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo No se completo la autenticacion.
  pause
  exit /b
)
echo.
echo CREANDO REPOSITORIO...
gh repo create preguntas-app --public --source=. --remote=origin --push
if %ERRORLEVEL% EQU 0 (
  echo.
  echo ========================================
  echo  LISTO!
  echo  https://github.com/%USERNAME%/preguntas-app
  echo ========================================
) else (
  echo.
  echo ERROR al crear el repositorio.
)
pause
