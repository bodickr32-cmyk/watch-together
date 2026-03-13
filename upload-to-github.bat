@echo off
set PATH=%PATH%;C:\Program Files\Git\bin
echo ========================================
echo   Загрузка на GitHub
echo ========================================
echo.
echo Загружаю код...
echo.

git init
git add .
git commit -m "Watch Together app"
git branch -M main
git remote add origin https://github.com/bodickr32-cmyk/watch-together.git
git push -u origin main

echo.
echo ========================================
echo Готово! Код загружен на GitHub
echo ========================================
echo.
echo Теперь на Render:
echo 1. Нажми GitHub (Connect account)
echo 2. Выбери репозиторий watch-together
echo 3. Нажми Create Web Service
echo.
pause
