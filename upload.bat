@echo off
cd /d D:\watch-together
set PATH=%PATH%;C:\Program Files\Git\bin

echo Загружаю обновления на GitHub...
echo.

git add .
git commit -m "Modern design with auth"
git push origin main

echo.
echo Готово! Render автоматически обновит сайт.
echo Подожди 2-3 минуты и обнови страницу.
echo.
pause
