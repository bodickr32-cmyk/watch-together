# Как установить на iPhone бесплатно

## Вариант 1: Expo Go (САМЫЙ ПРОСТОЙ)

1. Установи Node.js: https://nodejs.org/
2. Установи Expo Go на iPhone из App Store
3. В папке проекта запусти:
```bash
npm install
npm start
```
4. Отсканируй QR код в Expo Go
5. Готово! Приложение запустится

## Вариант 2: TestFlight (для друзей)

Если хочешь поделиться с друзьями:

1. Зарегистрируйся на https://developer.apple.com (бесплатно)
2. Установи Expo CLI:
```bash
npm install -g eas-cli
eas login
```
3. Собери для TestFlight:
```bash
eas build --platform ios
```
4. Загрузи в App Store Connect
5. Создай TestFlight бета-тест
6. Поделись ссылкой (до 10,000 человек могут установить)

## Вариант 3: Через Xcode (нужен Mac)

1. Установи Xcode из Mac App Store
2. Открой проект в Xcode
3. Подключи iPhone кабелем
4. Выбери свой Apple ID в настройках
5. Нажми Run
6. На iPhone: Настройки → Основные → Управление устройством → Доверять разработчику

## Вариант 4: PWA (веб-версия)

Можно сделать веб-версию которая работает как приложение:

1. Запусти веб-версию:
```bash
npm run web
```
2. Открой на iPhone в Safari
3. Нажми "Поделиться" → "На экран Домой"
4. Готово! Работает как приложение

## Для публикации в App Store (платно)

Если хочешь в настоящий App Store:
- Apple Developer Program: $99/год
- Регистрация: https://developer.apple.com/programs/
- После оплаты можешь публиковать неограниченно
