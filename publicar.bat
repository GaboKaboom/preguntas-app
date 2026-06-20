@echo off
cd /d "%~dp0"
echo ========================================
echo  Publicar app en Firebase Hosting
echo ========================================
echo.
echo PASO 1: Iniciar sesion en Firebase
echo    Se abrira el navegador para que
echo    inicies sesion con tu cuenta de Google.
echo.
echo    Escribe en la ventana que se abrira:
echo      firebase login
echo.
echo PASO 2: Despues de iniciar sesion,
echo    escribe en la misma ventana:
echo      firebase deploy
echo.
echo    La URL final sera algo como:
echo      https://preguntas-bs-fn.web.app
echo.
echo ========================================
echo.
start "Firebase Deploy" cmd /K "cd /d %~dp0 && echo === LISTO PARA PUBLICAR === && echo. && echo Escribe: firebase login && echo Luego: firebase deploy"
echo.
echo Se abrio una ventana de comandos nueva.
echo Sigue las instrucciones de arriba.
echo.
pause
