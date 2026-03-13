# Как залить на бесплатный хостинг

## Вариант 1: Render (рекомендую)

1. Зарегистрируйся на https://render.com (можно через GitHub)
2. Создай новый репозиторий на GitHub:
   - Зайди на https://github.com/new
   - Назови репозиторий: `watch-together`
   - Создай репозиторий

3. Залей код на GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/ТВОЙ_ЮЗЕРНЕЙМ/watch-together.git
   git push -u origin main
   ```

4. На Render:
   - Нажми "New +" → "Web Service"
   - Подключи свой GitHub репозиторий
   - Render автоматически найдет настройки из render.yaml
   - Нажми "Create Web Service"

5. Через 2-3 минуты получишь ссылку типа: `https://watch-together-abc123.onrender.com`

6. Готово! Отправляй эту ссылку друзьям 🎉

**Важно:** Бесплатный план Render засыпает после 15 минут неактивности. Первый запуск может занять 30 секунд.

---

## Вариант 2: Railway

1. Зарегистрируйся на https://railway.app
2. Создай новый проект → Deploy from GitHub
3. Выбери свой репозиторий
4. Railway автоматически задеплоит
5. Получишь ссылку типа: `https://watch-together.up.railway.app`

---

## Вариант 3: Vercel (только для статики, нужны изменения)

Vercel не поддерживает WebSocket из коробки, нужно использовать Vercel Serverless Functions.

---

## Вариант 4: Glitch

1. Зайди на https://glitch.com
2. Создай новый проект → Import from GitHub
3. Вставь ссылку на свой репозиторий
4. Получишь ссылку типа: `https://watch-together.glitch.me`

---

## Без GitHub (быстрый способ)

Если не хочешь возиться с GitHub:

1. Зайди на https://replit.com
2. Создай новый Repl → Import from GitHub или загрузи файлы
3. Нажми Run
4. Получишь ссылку для друзей

---

## Рекомендация

Используй **Render** - он самый стабильный и простой для Node.js приложений с WebSocket.
