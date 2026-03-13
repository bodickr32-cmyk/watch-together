@echo off
cd /d D:\watch-together
set PATH=%PATH%;C:\Program Files\Git\bin

echo Настраиваю Git...
git config --global user.email "bodickr32@example.com"
git config --global user.name "bodickr32-cmyk"

echo Загружаю код на GitHub...
echo.

git init
git add .
git commit -m "first commit"
git branch -M main
git remote remove origin
git remote add origin https://github.com/bodickr32-cmyk/watch-together.git
git push -u origin main

echo.
echo Готово! Код загружен.
echo.
echo Теперь на Render:
echo 1. Нажми GitHub - Connect account
echo 2. Выбери watch-together
echo 3. Нажми Create Web Service
echo.
pause
