@echo off
cd /d "%~dp0"
title Compartir Preguntas y respuestas
echo ========================================
echo  Compartir app de preguntas y respuestas
echo ========================================
echo.

echo 1. Limpiando puerto 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000"') do (
  taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo 2. Iniciando servidor web...
start "ServidorPreguntas" /MIN node server.js
timeout /t 2 /nobreak >nul

echo 3. Abriendo tunel ngrok...
start "NgrokTunnel" /MIN ngrok.exe http 8000 --log=stdout > ngrok_log.txt 2>&1
timeout /t 5 /nobreak >nul

echo.
echo === ENLACE PARA COMPARTIR CON TUS COMPANEROS ===
echo.
findstr "url=" ngrok_log.txt
echo.
echo ================================================
echo Panel ngrok: http://localhost:4040
echo App local:   http://localhost:8000
echo.
echo 4. Abriendo app en tu navegador...
start http://localhost:8000
echo.
echo Presiona cualquier tecla para cerrar TODO.
pause >nul
echo Cerrando...
taskkill /F /FI "WINDOWTITLE eq NgrokTunnel" >nul 2>&1
taskkill /F /FI "WINDOWTITLE eq ServidorPreguntas" >nul 2>&1
