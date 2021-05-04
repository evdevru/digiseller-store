# Интернет-магазин цифровых товаров

## Готовый шаблон для интернет-магазина на базе DigiSeller API

**_Сотрудничество (разработка):_** [Telegram](https://t.me/sonicbhf)

**_В чём преимущество сервиса?_**

1. Не требуется иметь собственный товар
2. Не требуется поддерживать всю платёжную систему
3. Не требуется полная аттестация WebMoney для продажи чужих товаров

Всё очень просто! Заполнил описания товаров и направляй платежеспособный трафик.

**_В чём преимущество шаблона?_**

1. Написано на JS фрейморке Nuxt.js
2. Не требует мощного сервера (можно использовать бесплатно)
3. Синхронизация товаров и категорий в 1 клик
4. Оптимизация страниц для поисковых систем:

- OpenGraph, Twitter, Schema.org
- Все показатель Lighthouse 90+, на хорошем сервере не менее 95
- Оптимизация размера изображений
- Ваша карточка товара будет иметь выделяющийся вид: [Посмотреть пример](https://i.imgur.com/KB8v4R8.png)

5. Модифицируемая цветовая палитра
6. Минималистичный дизайн

[![Видео с установкой](https://i.imgur.com/Ej91fq4.png)](https://www.youtube.com/watch?v=T8-OGv1erfU)

## Установка и настройка

Эта инструкция для работы на heroku.  
В случае использования на VPS потребуется настраивать серверный прокси (например, Nginx)

1. [Скачайте репозиторий](https://github.com/evdevru/digiseller-store/archive/refs/heads/main.zip) и разархивируйте
2. Установите [Git](https://git-scm.com/download/win), [Heroku](https://devcenter.heroku.com/articles/heroku-cli)
3. Загеристрируйтесь на [heroku](https://dashboard.heroku.com/) и создайте 2 **_РАЗНЫХ_** проекта (для клиента и сервера)

Откройте командную строку и выполните команду

```bash
$ heroku login
```

Далее согласно видео выполняйте шаги (команды)

### Папка "client"

```bash
$ git init && git add . && git commit -m "first commit"

$ heroku git:remote -a ИМЯ_СОЗДАННОГО_ВАМИ_ПЕРВОГО_ПРОЕКТА

$ heroku config:set HOST=0.0.0.0

$ heroku config:set SELLER_ID=id_продавца_digiseller

$ heroku config:set AGENT_ID=id_продавца_digiseller

# REVIEWS_TYPE=all || good || bad
$ heroku config:set REVIEWS_TYPE=all

$ heroku config:set NODE_ENV=production

$ heroku config:set BASE_URL=https://ИМЯ_СОЗДАННОГО_ВАМИ_ВТОРОГО_ПРОЕКТА.herokuapp.com/

$ git push heroku master
```

Перед работой с папкой "server" выполните:

1. Перейдите в проект для сервера
2. Вкладка "resources"
3. В поиске введите "ClearDB" и согласитесь на бесплатное обслуживание

### Папка "server"

```bash
$ git init && git add . && git commit -m "first commit"

$ heroku git:remote -a ИМЯ_СОЗДАННОГО_ВАМИ_ВТОРОГО_ПРОЕКТА

$ heroku config:set APP_URL=https://ИМЯ_СОЗДАННОГО_ВАМИ_ВТОРОГО_ПРОЕКТА.herokuapp.com

$ heroku config:set APP_KEY=16-значный_уникальный_ключ (n96M1TPG821EdN4mMIjnGKxGytx9W2UJ)

$ heroku config:set ENV_SILENT=true

$ heroku config:set ADMIN_PASSWORD=желаемый_пароль

$ git push heroku master
```

На этом установка закончена. Осталось авторизовать в панели и создать или синхронизировать товары.
