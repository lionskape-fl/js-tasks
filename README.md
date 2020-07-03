# JS Tasks

## Задача 1

Файл cache-server.js

### Описание

Перед вами реализация простого HTTP сервера на nodejs, которой отдаёт некоторые данные "подсчитанные" функцией `expensiveCalculation.calculateData`. Проблема в том что подсчёт этих данных занимает около секунды, можно представить что в реальном приложении это мог быть тяжелый запрос статистики из базы данных или другая долгая операция. Для пользователей время на запрос критично и мы не можем позволить себе обрабатывать каждый запрос целую секунду, более того такая долгая обработка запроса силно увеличивает нагрузку на сервер, когда в приложение приходит много запросов.

Известно что получаемые данные не теряют свою актуальность на протяжении примерно 4 секунд, так что было решено закешировать данные на это время в памяти.

### Задача

Реализовать кеширование результатов вычислений в памяти таким образом чтобы результат был валиден 4 секунды (погрешности допустимы) и лишь минимально возможное число запросов блокировались и ждали результаты.

Предусмотреть что в приложение будет приходить большое число запросов, настолько большое, насколько это возможно.

Менять работу объекта expensiveCalculation, а в частности его метод calculateData не нужно, в функцию обработчик сервера и любые другие места файла изменения вносить можно.

**Дополнительное задание**

Сделать всё тоже самое но для приложения cache-server-2.js

---

## Задача 2

Файл Purchase.jsx

### Описание

В этом компоненте реализован пример формы покупки для сайта

### Задача

Дореализовать форму покупки, при нажатии на кнопку должен вызываться метод `api.purchase` при успешном завершении метода должен показываться текст c классом `successText`, в случае ошибки - `errorText` до нажатия на кнопку ни один текст показываться не должен. Метод `api.purchase` асинхронный, и может бросить исключение. При необходимости нужно оптимизирвоать работу компонента, и предусмотреть по максимуму разные сценарии взаимодействия с ним. Использование react hooks приветствуется.

---

## Задача 3

Файл NewsFeed.jsx

### Описание

В этом файле реализована простая новостная лента, показывающая топ 100 постов по лайкам в порядке убывания, для получения данных она подписывается на некий real-time интерфейс, web-socket например, через котоырй получает события о новом посте и событие об удалении поста. Функции `handleNewItem` и `handleDeleteItem` - это обрбаотчики событий добавления и удаления поста соответственно. После подписки на `api` оно вызовет событие `newItem` для всех существующих постов, таким образом при инициализации компонента ему точно будут переданны все данные.

### Задача

Несмотря на выше сказанное компонент иногда показывает не все посты, часть теряются в процессе работы, нужно найти и исправить ошибки приводящие к этому, а также оптимизировать работу компонентов для частых обновлений и большого количества данных.


# Формат сдачи

Pull-request на github'e
