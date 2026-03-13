@echo off
echo ========================================
echo   ЛОКАЛЬНЫЙ ТЕСТ
echo ========================================
echo.
echo Останавливаю старые процессы...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul
timeout /t 2 /nobreak >nul

echo Запускаю сервер на http://localhost:3000
echo Открой браузер и зайди на этот адрес
echo.
echo Нажми Ctrl+C чтобы остановить
echo ========================================
echo.

set PATH=%PATH%;C:\Program Files\nodejs
node server.js
pause
