@echo off
cd /d D:\watch-together
set PATH=%PATH%;C:\Program Files\Git\bin

echo ========================================
echo   ЗАГРУЗКА НА СЕРВЕР
echo ========================================
echo.
echo Загружаю изменения на GitHub...
echo.

git add .
git commit -m "Update"
git push origin main

echo.
echo ========================================
echo   ГОТОВО!
echo ========================================
echo.
echo Render обновит сайт через 2-3 минуты
echo Следи за статусом на dashboard.render.com
echo.
pause
