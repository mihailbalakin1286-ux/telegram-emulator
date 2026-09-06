const ChatBot = {
    context: {},
    usedGreetings: {},

    respond(name, userMessage) {
        const msg = userMessage.toLowerCase().trim();
        if (!this.context[name]) {
            this.context[name] = { lastTopic: null, turnCount: 0 };
        }
        const c = this.context[name];
        c.turnCount++;

        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        if (/(привет|здравствуй|хай|хей|здарова|йо|добрый|доброе утро|добрый день|добрый вечер)/.test(msg)) {
            if (!this.usedGreetings[name]) this.usedGreetings[name] = [];
            const pool = ['Привет! Как дела?','Хей! Как ты?','Привет! Давно не общались!','Здарова! Как жизнь?','Хей! Рада слышать!','Приветик! Что нового?','О, привет! Как ты?','Хай! Как настроение?'];
            const avail = pool.filter(g => !this.usedGreetings[name].includes(g));
            const list = avail.length > 0 ? avail : pool;
            if (avail.length === 0) this.usedGreetings[name] = [];
            const g = pick(list);
            this.usedGreetings[name].push(g);
            return g;
        }

        if (/(как дела|как ты|как жизнь|как поживаешь|как сам)/.test(msg)) {
            c.lastTopic = 'about_me';
            return pick(['Нормально, работаю сегодня. Ты как?','Отлично! Сегодня солнечный день, настроение хорошее)','Так себе, устала немного. А у тебя как?','Живу-пользуюсь) Работаю над интересным проектом','Нормально вроде, ничего особенного. Ты чем занимаешься?']);
        }

        if (/(что делаешь|чем занимаешься|чем занят|что нового)/.test(msg)) {
            c.lastTopic = 'activity';
            return pick(['Да вот, сижу работаю. У меня дедлайн завтра)','Ничего особенного, просто отдыхаю после работы','Учу новый фреймворк, интересно очень','Сериал смотрю, кто-то видел?','Готовлю ужин, что-то простое — пасту','Гуляю с собакой в парке, погода отличная','Читаю книгу, давно хотела начать','Работаю над приложением, хочу показать потом']);
        }

        if (c.lastTopic === 'about_me' && /(норм|хорошо|отлично|так|неплохо|всё ок|всё норм|нормально)/.test(msg)) {
            c.lastTopic = null;
            return pick(['Рада слышать! А я тут думаю, куда сходить вечером','Класс! Тогда давай обсудим что-нибудь интересное)','Хорошо! Кстати, видела новый фильм? Рекомендую','Отлично! У меня тоже всё норм, просто устала немного']);
        }

        if (/(норм|класс|круто|супер|отлично|здорово|классно|прикольно)/.test(msg)) {
            return pick(['Рада за тебя!','Класс! Продолжай в том же духе!','Вот это здорово! Расскажи подробнее!','Круто! А что конкретно?','Молодец! Так держать','Приятно слышать! У меня тоже всё окей']);
        }

        if (/(плохо|хреново|ужасно|грустно|печально|неважно|тоска)/.test(msg)) {
            c.lastTopic = 'sad';
            return pick(['Не грусти, всё наладится! Расскажи что случилось','Держись! Если что — я рядом, можем поговорить','Бывает, главное не сдаваться. Что произошло?','Ой, что случилось? Мне жаль, расскажи','Всё будет хорошо, поверь мне. Хочешь отвлечься?','Мне очень жаль... Давай я тебя развлеку?']);
        }

        if (c.lastTopic === 'sad' && /(да|ага|вот именно|точно|всё так)/.test(msg)) {
            c.lastTopic = null;
            return pick(['Держись, пройдёт! Я верю в тебя','Всё будет хорошо. Если что — пиши, я всегда здесь','Понимаю тебя. Давай я расскажу что-нибудь смешное?','Главное — не сдавайся. Ты сильнее, чем думаешь!']);
        }

        if (/(спасибо|благодарю|спс|сенкс|thanks)/.test(msg)) {
            return pick(['Пожалуйста!) Обращайся!','Не за что! Рада помочь!','Да не за что, всё норм!)','Обращайся в любое время!','Рада была помочь!)']);
        }

        if (/(пока|прощай|до встречи|бай|чмоки)/.test(msg)) {
            c.lastTopic = null;
            return pick(['Пока! Удачи тебе!','До встречи! Береги себя!','Пока-пока!) Пиши когда захочешь поговорить!','Увидимся! Пока!)','Бай! Хорошего вечера!','До связи! Буду ждать следующего сообщения)']);
        }

        if (/(люблю|любовь|дорогой|дорогая|милая|милая|красавица|красавчик)/.test(msg)) {
            return pick(['Ой, как мило! Спасибо!)','Хех, ты тоже мне нравишься)','Ну спасибо!) Ты тоже классный/классная','Взаимно!)','Ого, не ожидала! Спасибо!)']);
        }

        if (/(смешно|лол|хаха|ахах|рофл|жарт)/.test(msg)) {
            return pick(['Хаха, да ладно!)','Я тоже посмеялась!','Ну ты даёшь!)','Хех, это было прикольно)','Ладно, это было смешно))']);
        }

        if (/(еда|обед|ужин|завтрак|кушать|голодн|пицца|борщ|суп|салат)/.test(msg)) {
            c.lastTopic = 'food';
            return pick(['О, я тоже хочу есть! Что бы такого съесть?','Я заказала пиццу вчера, очень вкусно было!','Давай сходим в кафе потом? Знаю одно классное место','А я салат делаю, диета сейчас у меня)','Ммм, звучит вкусно! А что именно?','Я обожаю готовить! Сегодня делала борщ']);
        }

        if (c.lastTopic === 'food' && /(да|ага|давай|ок|хочу|интересно)/.test(msg)) {
            c.lastTopic = null;
            return pick(['Отлично! Давай вечером сходим?','Класс! А ты любишь итальянскую кухню?','Я знаю одно кафе на центральной, очень вкусно там!','Ок, договорились!)','Давай! Я знаю отличное место с пиццей!']);
        }

        if (/(погода|жарко|холодно|дождь|снег|ветер|тепло|мороз)/.test(msg)) {
            return pick(['Да, погода сегодня шикарная!','Правда? А у меня тут солнце светит!','Холодновато, оденься потеплее!','Лучшая погода для прогулки!','Я не люблю жару, мне нравится когда прохладно']);
        }

        if (/(фильм|кино|сериал|смотреть|видео|ютуб)/.test(msg)) {
            c.lastTopic = 'movies';
            return pick(['О, я недавно смотрела "Дюну", очень круто!','Рекомендую "Интерстеллар", если не видела!','Сериал "Чернобыль" — просто шедевр!','Давай вместе посмотрим что-нибудь вечером?','Я обожаю смотреть фильмы! Что обычно смотришь?','А ты видел "Оппенгеймер"? Говорят круто']);
        }

        if (/(музыка|песня|слушать|звук|поставь|плейлист)/.test(msg)) {
            return pick(['Я сейчас слушаю новый альбом Billie Eilish!','Послушай песню "Танцы" — очень крутая!','Люблю слушать рок наушниках на прогулке','У меня плейлист на 500 песен, чем кормишь?','Какой жанр музыки тебе больше нравится?']);
        }

        if (/(программ|код|компьютер|проект|разработ)/.test(msg)) {
            c.lastTopic = 'coding';
            return pick(['О, я тоже учу JavaScript! На чём пишешь?','Программирование — это круто! Какой язык знаешь?','У меня баг в коде, не могу найти третий час(','Я последний проект на React сделала, очень удобно','Какой у тебя любимый язык программирования?','Давай вместе над проектом поработаем?']);
        }

        if (/(спорт|зал|бег|футбол|тренеров|качалка|йога)/.test(msg)) {
            return pick(['Я хожу в зал три раза в неделю, очень нравится!','Давай сходим в футбол на выходных?','Спорт — это здоровье! Я начала бегать по утрам','Я недавно пробежала свою первую 5 км!','Какой вид спорта тебе больше нравится?','Йога — это просто волшебство, советую попробовать!']);
        }

        if (/(работа|деньги|зарплата|начальник|коллеги|офис)/.test(msg)) {
            c.lastTopic = 'work';
            return pick(['Работа — это нормально, главное чтобы нравилось!','У меня сегодня совещания целый день, устала)','Хочу уволиться и заняться фрилансом, мечтаю)','А что ты работаешь? Интересно!','Деньги важны, но главное — чтобы душа пела!','Я мечтаю о remote работе, чтобы из дома']);
        }

        if (c.lastTopic === 'work' && /(да|ага|точно|вот именно|всё так)/.test(msg)) {
            c.lastTopic = null;
            return pick(['Да, ты прав(а)! Главное — удовольствие от работы','Согласна! Давай мечтать о лучшей работе вместе)','Точно! Надо стремиться к тому, что нравится','Всё будет хорошо! Главное — верить в себя']);
        }

        if (/\?$/.test(msg) || /^(что|как|где|когда|почему|зачем|кто|сколько|можно|надо|стоит|хочешь|будешь|любишь)/.test(msg)) {
            return pick(['Хм, хороший вопрос! Давай подумаем...','Интересно, сам(а) задумывалась об этом','Не уверена, но вот моё мнение...','Это сложный вопрос, честно говоря','О, отличный вопрос! Мне кажется, ответ зависит от ситуации','Давай обсудим это подробнее? Интересно!']);
        }

        if (/(расскажи|что знаешь|что можешь)/.test(msg)) {
            return pick(['О, я много чего знаю! О чём хочешь услышать?','Расскажу что-нибудь интересное! Ты знаешь...','Давай я расскажу тебе что-нибудь смешное!','Мне нравится рассказывать! О чём поговорим?']);
        }

        if (/(ага|угу|ну да|ну ага|понял|поняла|ясно|ок|лол|хех)/.test(msg) && c.turnCount > 2) {
            return pick(['Хех, ну ладно)','Ага, понял(а) тебя!','Ок, продолжай!','Ну да, бывает)','Интересно, а что дальше?']);
        }

        return pick(['Интересно, расскажи подробнее!','Хм, а что ты об этом думаешь?','О, продолжай! Мне интересно слушать!','Ага, и что потом?','Ладно, понял(а)! А что ещё нового?','Хех, ну да) А что по этому поводу думаешь?','Понятно! А у тебя есть какие-нибудь планы?','Ок, а давай обсудим что-нибудь интересное!','Хм, интересная мысль! Развей её','Ну ладно, а что сейчас делаешь?']);
    }
};

const Apps = {
    calculator: {
        title: 'Калькулятор',
        icon: 'calculator-icon',
        init(container) {
            let expression = '';
            let result = '0';
            let newNumber = true;

            function updateDisplay() {
                container.querySelector('.calc-expression').textContent = expression;
                container.querySelector('.calc-result').textContent = result;
            }

            function handleInput(value) {
                if (value >= '0' && value <= '9' || value === '.') {
                    if (newNumber) {
                        result = value === '.' ? '0.' : value;
                        newNumber = false;
                    } else {
                        if (value === '.' && result.includes('.')) return;
                        result += value;
                    }
                } else if (['+', '-', '×', '÷'].includes(value)) {
                    expression += result + ' ' + value + ' ';
                    result = '0';
                    newNumber = true;
                } else if (value === '=') {
                    expression += result;
                    try {
                        const evalExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
                        result = String(eval(evalExpr));
                        if (result === 'Infinity' || result === 'NaN') result = 'Ошибка';
                    } catch (e) {
                        result = 'Ошибка';
                    }
                    expression = '';
                    newNumber = true;
                } else if (value === 'C') {
                    expression = '';
                    result = '0';
                    newNumber = true;
                } else if (value === '⌫') {
                    if (!newNumber && result.length > 1) {
                        result = result.slice(0, -1);
                    } else {
                        result = '0';
                        newNumber = true;
                    }
                } else if (value === '±') {
                    if (result !== '0' && result !== 'Ошибка') {
                        result = result.startsWith('-') ? result.slice(1) : '-' + result;
                    }
                } else if (value === '%') {
                    result = String(parseFloat(result) / 100);
                }
                updateDisplay();
            }

            container.innerHTML = `
                <div class="calc-display">
                    <div class="calc-expression"></div>
                    <div class="calc-result">0</div>
                </div>
                <div class="calc-grid">
                    <button class="calc-btn clear" data-val="C">C</button>
                    <button class="calc-btn operator" data-val="±">±</button>
                    <button class="calc-btn operator" data-val="%">%</button>
                    <button class="calc-btn operator" data-val="÷">÷</button>
                    <button class="calc-btn" data-val="7">7</button>
                    <button class="calc-btn" data-val="8">8</button>
                    <button class="calc-btn" data-val="9">9</button>
                    <button class="calc-btn operator" data-val="×">×</button>
                    <button class="calc-btn" data-val="4">4</button>
                    <button class="calc-btn" data-val="5">5</button>
                    <button class="calc-btn" data-val="6">6</button>
                    <button class="calc-btn operator" data-val="-">−</button>
                    <button class="calc-btn" data-val="1">1</button>
                    <button class="calc-btn" data-val="2">2</button>
                    <button class="calc-btn" data-val="3">3</button>
                    <button class="calc-btn operator" data-val="+">+</button>
                    <button class="calc-btn" data-val="0" style="grid-column: span 2;">0</button>
                    <button class="calc-btn" data-val=".">.</button>
                    <button class="calc-btn equals" data-val="=">=</button>
                </div>
            `;

            container.querySelectorAll('.calc-btn').forEach(btn => {
                btn.addEventListener('click', () => handleInput(btn.dataset.val));
            });
        }
    },

    settings: {
        title: 'Настройки',
        icon: 'settings-icon',
        init(container) {
            const items = [
                { icon: '#2196f3', svg: '<path d="M12 12m-3.2 0a3.2 3.2 0 1 0 6.4 0a3.2 3.2 0 1 0-6.4 0M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z', title: 'Настройки сети', subtitle: 'Wi-Fi, Bluetooth, VPN' },
                { icon: '#4caf50', svg: '<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z', title: 'Уведомления', subtitle: 'Настройка уведомлений' },
                { icon: '#ff9800', svg: '<path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z', title: 'Дисплей', subtitle: 'Яркость, тема, размер шрифта' },
                { icon: '#9c27b0', svg: '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z', title: 'Звуки и вибрация', subtitle: 'Громкость, мелодии, вибрация' },
                { icon: '#f44336', svg: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z', title: 'Безопасность', subtitle: 'Блокировка, отпечаток, лицо' },
                { icon: '#00bcd4', svg: '<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z', title: 'Дата и время', subtitle: 'Часовой пояс, формат времени' },
                { icon: '#607d8b', svg: '<path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z', title: 'Система', subtitle: 'Язык, сброс, обновления' },
                { icon: '#795548', svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', title: 'О телефоне', subtitle: 'Android 14, модель, версия' },
            ];

            container.innerHTML = `
                <div class="settings-list">
                    <div class="settings-section-title">Настройки</div>
                    ${items.map(item => `
                        <div class="settings-item">
                            <div class="settings-item-icon" style="background:${item.icon}">
                                <svg viewBox="0 0 24 24">${item.svg}</svg>
                            </div>
                            <div class="settings-item-text">
                                <div class="settings-item-title">${item.title}</div>
                                <div class="settings-item-subtitle">${item.subtitle}</div>
                            </div>
                            <svg class="settings-item-arrow" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    files: {
        title: 'Файлы',
        icon: 'files-icon',
        init(container) {
            const files = [
                { name: 'Download', type: 'folder', size: '12 файлов', color: '#42a5f5' },
                { name: 'DCIM', type: 'folder', size: '8 файлов', color: '#66bb6a' },
                { name: 'Documents', type: 'folder', size: '5 файлов', color: '#ffa726' },
                { name: 'Music', type: 'folder', size: '23 файла', color: '#ab47bc' },
                { name: 'Pictures', type: 'folder', size: '47 файлов', color: '#ef5350' },
                { name: 'report.pdf', type: 'file', size: '2.4 МБ', color: '#ef5350' },
                { name: 'photo_2024.jpg', type: 'file', size: '3.8 МБ', color: '#66bb6a' },
                { name: 'notes.txt', type: 'file', size: '12 КБ', color: '#78909c' },
                { name: 'presentation.pptx', type: 'file', size: '5.1 МБ', color: '#ff7043' },
                { name: 'budget.xlsx', type: 'file', size: '890 КБ', color: '#4caf50' },
            ];

            const folderSvg = '<path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>';
            const fileSvg = '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>';

            container.innerHTML = `
                <div class="files-header">
                    <svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:var(--android-text)"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                    <div class="files-breadcrumb"><span>Внутренняя память</span></div>
                </div>
                <div class="files-grid">
                    ${files.map(f => `
                        <div class="file-item">
                            <div class="file-icon" style="background:${f.color}">
                                <svg viewBox="0 0 24 24">${f.type === 'folder' ? folderSvg : fileSvg}</svg>
                            </div>
                            <div class="file-info">
                                <div class="file-name">${f.name}</div>
                                <div class="file-meta">${f.size}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    browser: {
        title: 'Браузер',
        icon: 'browser-icon',
        history: [],
        historyIndex: -1,
        PROXY: '/proxy?url=',

        init(container) {
            this.container = container;
            this.history = [];
            this.historyIndex = -1;

            container.style.height = '100%';
            container.classList.add('browser-mode');

            container.innerHTML = `
                <div class="browser-toolbar">
                    <button class="header-btn" id="browser-back" style="width:32px;height:32px" title="Назад">
                        <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:var(--android-text)"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                    </button>
                    <button class="header-btn" id="browser-forward" style="width:32px;height:32px" title="Вперёд">
                        <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:var(--android-text)"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                    </button>
                    <button class="header-btn" id="browser-refresh" style="width:32px;height:32px" title="Обновить">
                        <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:var(--android-text)"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </button>
                    <div class="browser-url-bar">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        <input type="text" class="browser-url-input" id="browser-url" placeholder="Введите URL или поисковый запрос...">
                    </div>
                    <button class="header-btn" id="browser-go" style="width:32px;height:32px" title="Перейти">
                        <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:var(--android-primary)"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                    </button>
                </div>
                <div class="browser-loading" id="browser-loading" style="display:none">
                    <div class="browser-loading-bar"></div>
                </div>
                <div class="browser-iframe-wrap">
                    <iframe id="browser-iframe" sandbox="allow-same-origin allow-forms allow-popups" referrerpolicy="no-referrer"></iframe>
                    <div class="browser-homepage" id="browser-homepage">
                        <h1 class="browser-google-logo">
                            <span style="color:#4285f4">G</span><span style="color:#ea4335">o</span><span style="color:#fbbc05">o</span><span style="color:#4285f4">g</span><span style="color:#34a853">l</span><span style="color:#ea4335">e</span>
                        </h1>
                        <div class="browser-search-box">
                            <input type="text" class="browser-search-input" id="browser-search" placeholder="Поиск в Google или введите URL">
                            <button class="browser-search-btn" id="browser-search-btn">Поиск</button>
                        </div>
                        <div class="browser-shortcuts">
                            <div class="browser-shortcut" data-url="https://www.youtube.com">
                                <div class="browser-shortcut-icon" style="background:#ff0000">▶</div>
                                <span>YouTube</span>
                            </div>
                            <div class="browser-shortcut" data-url="https://ru.wikipedia.org">
                                <div class="browser-shortcut-icon" style="background:#636466">W</div>
                                <span>Wikipedia</span>
                            </div>
                            <div class="browser-shortcut" data-url="https://github.com">
                                <div class="browser-shortcut-icon" style="background:#24292e">⌘</div>
                                <span>GitHub</span>
                            </div>
                            <div class="browser-shortcut" data-url="https://www.reddit.com">
                                <div class="browser-shortcut-icon" style="background:#ff4500">R</div>
                                <span>Reddit</span>
                            </div>
                            <div class="browser-shortcut" data-url="https://twitter.com">
                                <div class="browser-shortcut-icon" style="background:#1da1f2">𝕏</div>
                                <span>Twitter</span>
                            </div>
                            <div class="browser-shortcut" data-url="https://dzen.ru">
                                <div class="browser-shortcut-icon" style="background:#ff6600">Д</div>
                                <span>Дзен</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            const urlInput = container.querySelector('#browser-url');
            const iframe = container.querySelector('#browser-iframe');
            const homepage = container.querySelector('#browser-homepage');
            const loading = container.querySelector('#browser-loading');
            const searchInput = container.querySelector('#browser-search');

            this.iframe = iframe;
            this.homepage = homepage;
            this.loading = loading;
            this.urlInput = urlInput;

            const loadUrl = async (targetUrl) => {
                loading.style.display = 'block';
                homepage.style.display = 'none';
                iframe.style.display = 'block';

                try {
                    const proxyUrl = this.PROXY + encodeURIComponent(targetUrl);
                    const resp = await fetch(proxyUrl);
                    const html = await resp.text();

                    const sanitized = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<!-- scripts removed -->')
                        .replace(/<script\b[^>]*\/?>/gi, '');

                    iframe.srcdoc = sanitized;
                    iframe.onload = () => { loading.style.display = 'none'; };
                } catch (e) {
                    iframe.srcdoc = `<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#1a1a2e;color:#e0e0e0">
                        <h2>Ошибка загрузки</h2><p>${e.message}</p><p style="color:#9e9e9e">${targetUrl}</p>
                    </body></html>`;
                    loading.style.display = 'none';
                }

                setTimeout(() => { loading.style.display = 'none'; }, 15000);
            };

            const navigate = (url) => {
                if (!url) return;
                url = url.trim();
                if (!url) return;

                let realUrl;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    if (url.includes('.') && !url.includes(' ') && url.split('.').length >= 2) {
                        realUrl = 'https://' + url;
                    } else {
                        realUrl = 'https://www.google.com/search?q=' + encodeURIComponent(url);
                    }
                } else {
                    realUrl = url;
                }

                this.addToHistory(realUrl);
                urlInput.value = realUrl;
                loadUrl(realUrl);
            };

            this.navigate = navigate;

            urlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') navigate(urlInput.value);
            });

            container.querySelector('#browser-go').addEventListener('click', () => {
                navigate(urlInput.value);
            });

            container.querySelector('#browser-refresh').addEventListener('click', () => {
                if (this.historyIndex >= 0) {
                    loadUrl(this.history[this.historyIndex]);
                }
            });

            container.querySelector('#browser-back').addEventListener('click', () => {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    const url = this.history[this.historyIndex];
                    urlInput.value = url;
                    loadUrl(url);
                } else {
                    homepage.style.display = '';
                    iframe.style.display = 'none';
                    loading.style.display = 'none';
                    urlInput.value = '';
                }
            });

            container.querySelector('#browser-forward').addEventListener('click', () => {
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    const url = this.history[this.historyIndex];
                    urlInput.value = url;
                    loadUrl(url);
                }
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') navigate(searchInput.value);
            });

            container.querySelector('#browser-search-btn').addEventListener('click', () => {
                navigate(searchInput.value);
            });

            container.querySelectorAll('.browser-shortcut').forEach(s => {
                s.addEventListener('click', () => {
                    navigate(s.dataset.url);
                });
            });
        },

        addToHistory(url) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(url);
            this.historyIndex = this.history.length - 1;
        },

        destroy(container) {
            container.style.height = '';
            container.classList.remove('browser-mode');
        }
    },

    phone: {
        title: 'Телефон',
        icon: 'phone-icon',
        init(container) {
            let number = '';

            function updateDisplay() {
                const display = container.querySelector('.phone-number-display');
                display.textContent = number || '';
            }

            const keys = [
                { num: '1', letters: '' },
                { num: '2', letters: 'АБВГ' },
                { num: '3', letters: 'ДЕЖЗ' },
                { num: '4', letters: 'ИЙКЛ' },
                { num: '5', letters: 'МНОП' },
                { num: '6', letters: 'РСТУ' },
                { num: '7', letters: 'ФХЦЧ' },
                { num: '8', letters: 'ШЩЪЫ' },
                { num: '9', letters: 'ЬЭЮЯ' },
                { num: '*', letters: '' },
                { num: '0', letters: '+' },
                { num: '#', letters: '' },
            ];

            container.innerHTML = `
                <div class="phone-dialer">
                    <div class="phone-number-display"></div>
                    <div class="phone-keypad">
                        ${keys.map(k => `
                            <button class="keypad-btn" data-num="${k.num}">
                                <span class="keypad-number">${k.num}</span>
                                <span class="keypad-letters">${k.letters}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div style="display:flex;gap:20px;align-items:center">
                        <button class="backspace-btn" id="phone-backspace">
                            <svg viewBox="0 0 24 24"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/></svg>
                        </button>
                        <button class="call-btn" id="phone-call">
                            <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        </button>
                    </div>
                </div>
            `;

            container.querySelectorAll('.keypad-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    number += btn.dataset.num;
                    updateDisplay();
                });
            });

            container.querySelector('#phone-backspace').addEventListener('click', () => {
                number = number.slice(0, -1);
                updateDisplay();
            });

            container.querySelector('#phone-call').addEventListener('click', () => {
                if (number) {
                    Utils.showToast('Вызов: ' + number);
                }
            });
        }
    },

    messages: {
        title: 'Сообщения',
        icon: 'messages-icon',
        threads: [
            {
                name: 'Алексей', color: '#4caf50', time: '14:30', unread: 2,
                messages: [
                    { from: 'them', text: 'Привет!', time: '14:20' },
                    { from: 'me', text: 'Привет! Как дела?', time: '14:22' },
                    { from: 'them', text: 'Нормально, работаем)', time: '14:25' },
                    { from: 'them', text: 'Кстати, ты видел тот проект?', time: '14:28' },
                    { from: 'them', text: 'Нужно обсудить завтра', time: '14:30' },
                ],
                replies: ['Ок, завтра в 10?', 'Да, давай', 'Хорошо, пока!', 'Понял', 'Спасибо!']
            },
            {
                name: 'Мария', color: '#e91e63', time: '13:45', unread: 0,
                messages: [
                    { from: 'them', text: 'Привет! Как выходные?', time: '13:30' },
                    { from: 'me', text: 'Отлично, ходили в парк', time: '13:32' },
                    { from: 'them', text: 'Здорово! Мы тоже', time: '13:35' },
                    { from: 'them', text: 'Давай встретимся завтра', time: '13:40' },
                    { from: 'me', text: 'Да, конечно! Во сколько?', time: '13:42' },
                    { from: 'them', text: 'В 15:00 у кафе', time: '13:45' },
                ],
                replies: ['Хорошо, буду!', 'А где?', 'Окей', 'Договорились', 'До завтра!']
            },
            {
                name: 'Дмитрий', color: '#2196f3', time: '12:10', unread: 1,
                messages: [
                    { from: 'them', text: 'Слушай, отправил тебе файл', time: '12:00' },
                    { from: 'me', text: 'Какой файл?', time: '12:02' },
                    { from: 'them', text: 'Тот отчёт за август', time: '12:05' },
                    { from: 'them', text: 'Посмотри, там правки нужны', time: '12:08' },
                    { from: 'them', text: 'Срочно пожалуйста', time: '12:10' },
                ],
                replies: ['Сейчас посмотрю', 'Ок, принял', 'Без проблем', 'Сделаю сегодня', 'Позже гляну']
            },
            {
                name: 'Анна', color: '#9c27b0', time: 'Вчера', unread: 0,
                messages: [
                    { from: 'me', text: 'Привет! Нужна помощь с кодом', time: '18:00' },
                    { from: 'them', text: 'Привет! Что случилось?', time: '18:05' },
                    { from: 'me', text: 'Баг в авторизации, не пойму почему', time: '18:10' },
                    { from: 'them', text: 'Скинь код, гляну', time: '18:12' },
                    { from: 'me', text: 'Отправил', time: '18:15' },
                    { from: 'them', text: 'А, вижу! Тут лишняя проверка', time: '18:20' },
                    { from: 'them', text: 'Удали строку 42 и будет работать', time: '18:21' },
                    { from: 'me', text: 'Спасибо! Заработало!', time: '18:25' },
                    { from: 'them', text: 'Рада помочь)', time: '18:26' },
                ],
                replies: ['Спасибо!', 'Ты лучшая!', 'Помогла)', 'Ещё раз спасибо', 'Обязательно отблагодарю']
            },
            {
                name: 'Сергей', color: '#ff9800', time: 'Вчера', unread: 0,
                messages: [
                    { from: 'them', text: 'Братан, идём в футбол?', time: '19:00' },
                    { from: 'me', text: 'Когда?', time: '19:05' },
                    { from: 'them', text: 'Завтра в 18:00', time: '19:06' },
                    { from: 'me', text: 'Давай! Где?', time: '19:08' },
                    { from: 'them', text: 'Стадион у парка', time: '19:10' },
                    { from: 'me', text: 'Ок, буду', time: '19:12' },
                    { from: 'them', text: 'Договорились)', time: '19:15' },
                ],
                replies: ['Буду!', 'Окей', 'Жду', 'Класс!', 'До встречи']
            },
            {
                name: 'Елена', color: '#00bcd4', time: 'Пн', unread: 0,
                messages: [
                    { from: 'them', text: 'Посмотри это видео, очень смешное', time: '10:00' },
                    { from: 'me', text: 'Скинь ссылку', time: '10:05' },
                    { from: 'them', text: 'youtube.com/watch?v=abc123', time: '10:06' },
                    { from: 'me', text: 'Хахаха, действительно смешно', time: '10:15' },
                    { from: 'them', text: 'Правда? Я тоже улыбнулась', time: '10:16' },
                ],
                replies: ['Хаха, спасибо!', 'Есть ещё?', 'Класс!', 'Смешно', 'Отправь ещё']
            },
        ],

        init(container) {
            this.container = container;
            this.renderList();
        },

        renderList() {
            const container = this.container;
            container.innerHTML = `
                <div class="messages-list">
                    ${this.threads.map((t, i) => `
                        <div class="message-thread" data-thread="${i}">
                            <div class="message-avatar" style="background:${t.color}">${t.name[0]}</div>
                            <div class="message-preview">
                                <div class="message-name">${t.name}</div>
                                <div class="message-snippet">${t.messages[t.messages.length - 1].text}</div>
                            </div>
                            <div class="message-time-badge">
                                <span class="message-time">${t.time}</span>
                                ${t.unread > 0 ? `<span class="message-badge">${t.unread}</span>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            container.querySelectorAll('.message-thread').forEach(el => {
                el.addEventListener('click', () => {
                    const idx = parseInt(el.dataset.thread);
                    this.openChat(idx);
                });
            });
        },

        openChat(idx) {
            const t = this.threads[idx];
            t.unread = 0;
            const container = this.container;

            container.innerHTML = `
                <div class="chat-view">
                    <div class="chat-header">
                        <button class="chat-back-btn" id="chat-back">
                            <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                        </button>
                        <div class="chat-avatar" style="background:${t.color}">${t.name[0]}</div>
                        <div class="chat-contact-info">
                            <div class="chat-contact-name">${t.name}</div>
                            <div class="chat-contact-status">в сети</div>
                        </div>
                    </div>
                    <div class="chat-messages" id="chat-messages">
                        ${t.messages.map(m => `
                            <div class="chat-bubble ${m.from === 'me' ? 'me' : 'them'}">
                                <div class="chat-bubble-text">${m.text}</div>
                                <div class="chat-bubble-time">${m.time}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="chat-input-bar">
                        <input type="text" id="chat-input" placeholder="Сообщение..." autocomplete="off">
                        <button id="chat-send" class="chat-send-btn">
                            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                        </button>
                    </div>
                </div>
            `;

            const messagesEl = container.querySelector('#chat-messages');
            messagesEl.scrollTop = messagesEl.scrollHeight;

            const input = container.querySelector('#chat-input');
            const sendBtn = container.querySelector('#chat-send');

            const send = () => {
                const text = input.value.trim();
                if (!text) return;

                const now = new Date();
                const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

                t.messages.push({ from: 'me', text, time });

                const bubble = document.createElement('div');
                bubble.className = 'chat-bubble me';
                bubble.innerHTML = `<div class="chat-bubble-text">${text}</div><div class="chat-bubble-time">${time}</div>`;
                messagesEl.appendChild(bubble);
                messagesEl.scrollTop = messagesEl.scrollHeight;
                input.value = '';

                const typingBubble = document.createElement('div');
                typingBubble.className = 'chat-bubble them';
                typingBubble.innerHTML = `<div class="chat-bubble-text chat-typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
                messagesEl.appendChild(typingBubble);
                messagesEl.scrollTop = messagesEl.scrollHeight;

                const delay = 800 + Math.random() * 1500;
                setTimeout(() => {
                    const reply = ChatBot.respond(t.name, text);
                    const replyTime = new Date();
                    const rt = replyTime.getHours().toString().padStart(2, '0') + ':' + replyTime.getMinutes().toString().padStart(2, '0');

                    t.messages.push({ from: 'them', text: reply, time: rt });

                    typingBubble.remove();
                    const replyBubble = document.createElement('div');
                    replyBubble.className = 'chat-bubble them';
                    replyBubble.innerHTML = `<div class="chat-bubble-text">${reply}</div><div class="chat-bubble-time">${rt}</div>`;
                    messagesEl.appendChild(replyBubble);
                    messagesEl.scrollTop = messagesEl.scrollHeight;
                }, delay);
            };

            sendBtn.addEventListener('click', send);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') send();
            });

            container.querySelector('#chat-back').addEventListener('click', () => {
                this.renderList();
            });
        }
    },

    camera: {
        title: 'Камера',
        icon: 'camera-icon',
        init(container) {
            container.innerHTML = `
                <div class="camera-viewfinder">
                    <div class="camera-preview" id="camera-preview">
                        <div class="camera-grid-overlay">
                            ${Array(9).fill('<div class="camera-grid-line"></div>').join('')}
                        </div>
                        <div class="camera-focus"></div>
                        <div id="camera-flash"></div>
                    </div>
                </div>
                <div class="camera-modes">
                    <span class="camera-mode">Видео</span>
                    <span class="camera-mode active">Фото</span>
                    <span class="camera-mode">Портрет</span>
                    <span class="camera-mode">Ночной</span>
                </div>
                <div class="camera-controls">
                    <button class="camera-mode-btn" id="camera-gallery-btn">
                        <svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                    </button>
                    <button class="camera-shutter" id="camera-shutter"></button>
                    <button class="camera-mode-btn" id="camera-switch">
                        <svg viewBox="0 0 24 24"><path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-5 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"/></svg>
                    </button>
                </div>
            `;

            container.querySelector('#camera-shutter').addEventListener('click', () => {
                const flash = container.querySelector('#camera-flash');
                flash.classList.add('flash');
                setTimeout(() => flash.classList.remove('flash'), 500);
                Utils.showToast('Фото сохранено');
            });

            container.querySelectorAll('.camera-mode').forEach(m => {
                m.addEventListener('click', () => {
                    container.querySelectorAll('.camera-mode').forEach(x => x.classList.remove('active'));
                    m.classList.add('active');
                });
            });
        }
    },

    gallery: {
        title: 'Галерея',
        icon: 'gallery-icon',
        init(container) {
            const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
                '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39',
                '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b',
                '#f44336', '#e91e63', '#673ab7', '#4caf50', '#2196f3'];

            const emojis = ['🌄', '🌅', '🏙️', '🌌', '🏖️', '🌸', '🌺', '🌻',
                '🦋', '🐶', '🐱', '🌺', '🌈', '⭐', '🎨', '🏔️',
                '🌊', '🍕', '🎵', '📸'];

            container.innerHTML = `
                <div class="gallery-grid">
                    ${colors.map((c, i) => `
                        <div class="gallery-item">
                            <div class="gallery-placeholder" style="background:${c}">${emojis[i] || '📷'}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    clock: {
        title: 'Часы',
        icon: 'clock-icon',
        init(container) {
            function updateClock() {
                const now = new Date();
                const h = now.getHours() % 12;
                const m = now.getMinutes();
                const s = now.getSeconds();

                const hourDeg = (h * 30) + (m * 0.5);
                const minDeg = m * 6;
                const secDeg = s * 6;

                const hourHand = container.querySelector('.hand-hour');
                const minHand = container.querySelector('.hand-minute');
                const secHand = container.querySelector('.hand-second');
                const digitalTime = container.querySelector('.digital-time');
                const digitalSec = container.querySelector('.digital-seconds');

                if (hourHand) {
                    hourHand.style.transform = `rotate(${hourDeg}deg)`;
                    minHand.style.transform = `rotate(${minDeg}deg)`;
                    secHand.style.transform = `rotate(${secDeg}deg)`;
                }
                if (digitalTime) {
                    digitalTime.textContent = Utils.formatTime(now);
                    digitalSec.textContent = now.getSeconds().toString().padStart(2, '0');
                }
            }

            let markersHTML = '';
            for (let i = 0; i < 12; i++) {
                const isMajor = i % 3 === 0;
                markersHTML += `<div class="clock-marker ${isMajor ? 'major' : ''}" style="transform:rotate(${i * 30}deg)"></div>`;
            }

            container.innerHTML = `
                <div class="clock-app">
                    <div class="analog-clock">
                        <div class="clock-markers">${markersHTML}</div>
                        <div class="clock-hand hand-hour"></div>
                        <div class="clock-hand hand-minute"></div>
                        <div class="clock-hand hand-second"></div>
                        <div class="clock-center"></div>
                    </div>
                    <div class="digital-time"></div>
                    <div class="digital-seconds"></div>
                </div>
            `;

            updateClock();
            container._clockInterval = setInterval(updateClock, 1000);
        },
        destroy(container) {
            if (container._clockInterval) {
                clearInterval(container._clockInterval);
            }
        }
    },

    notes: {
        title: 'Заметки',
        icon: 'notes-icon',
        init(container) {
            const notes = [
                { title: 'Список покупок', preview: 'Молоко, хлеб, яблоки, сыр, курица...', date: 'Сегодня' },
                { title: 'Идеи для проекта', preview: '1. Добавить тёмную тему\n2. Оптимизировать загрузку\n3. Добавить уведомления', date: 'Вчера' },
                { title: 'Встреча', preview: 'Встреча с командой в 15:00. Подготовить презентацию.', date: 'Пн, 25 авг' },
                { title: 'Рецепт', preview: 'Паста с курицей: отварить пасту, обжарить курицу с...', date: 'Пн, 25 авг' },
                { title: 'Пароли', preview: 'Wi-Fi: ********\nEmail: ********', date: '23 авг' },
                { title: 'Спортзал', preview: 'Понедельник: грудь и трицепс\nСреда: спина и бицепс\nПятница: ноги', date: '22 авг' },
            ];

            container.innerHTML = `
                <div class="notes-list">
                    ${notes.map(n => `
                        <div class="note-card">
                            <div class="note-title">${n.title}</div>
                            <div class="note-preview">${n.preview}</div>
                            <div class="note-date">${n.date}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    email: {
        title: 'Почта',
        icon: 'email-icon',
        init(container) {
            const emails = [
                { sender: 'Google', subject: 'Подтвердите свой аккаунт', snippet: 'Благодарим за регистрацию. Пожалуйста, подтвердите...', time: '10:30', color: '#4285f4', unread: true },
                { sender: 'GitHub', subject: 'Security alert', snippet: 'Обнаружена новая активность в вашем аккаунте...', time: '09:15', color: '#333', unread: true },
                { sender: 'Telegram', subject: 'Код подтверждения', snippet: 'Ваш код: 48291. Не сообщайте его никому.', time: 'Вчера', color: '#0088cc', unread: false },
                { sender: 'Яндекс', subject: 'Новости недели', snippet: 'Лучшие статьи и обзоры за последнюю неделю...', time: 'Вчера', color: '#fc3f1d', unread: false },
                { sender: 'Amazon', subject: 'Ваш заказ отправлен', snippet: 'Заказ #38291 в доставке. Ожидаемое время...', time: 'Пн', color: '#ff9900', unread: false },
            ];

            container.innerHTML = `
                <div class="email-list">
                    ${emails.map(e => `
                        <div class="email-item">
                            <div class="email-avatar" style="background:${e.color}">${e.sender[0]}</div>
                            <div class="email-content">
                                <div class="email-sender">${e.sender}</div>
                                <div class="email-subject">${e.subject}</div>
                                <div class="email-snippet">${e.snippet}</div>
                            </div>
                            <div class="email-meta">
                                <span class="email-time">${e.time}</span>
                                ${e.unread ? '<div class="email-unread"></div>' : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    weather: {
        title: 'Погода',
        icon: 'weather-big-icon',
        init(container) {
            container.innerHTML = `
                <div class="weather-app">
                    <div class="weather-main">
                        <div class="weather-icon-big">☀️</div>
                        <div class="weather-temp-big">22°</div>
                        <div class="weather-desc">Ясно</div>
                        <div style="color:var(--android-text-secondary);margin-top:4px">Москва</div>
                    </div>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <div class="weather-detail-label">Влажность</div>
                            <div class="weather-detail-value">45%</div>
                        </div>
                        <div class="weather-detail">
                            <div class="weather-detail-label">Ветер</div>
                            <div class="weather-detail-value">3 м/с</div>
                        </div>
                        <div class="weather-detail">
                            <div class="weather-detail-label">Давление</div>
                            <div class="weather-detail-value">762</div>
                        </div>
                    </div>
                    <div class="weather-forecast">
                        ${[
                            { day: 'Ср', icon: '⛅', temp: '19°' },
                            { day: 'Чт', icon: '🌧️', temp: '16°' },
                            { day: 'Пт', icon: '☀️', temp: '21°' },
                            { day: 'Сб', icon: '⛅', temp: '18°' },
                            { day: 'Вс', icon: '☀️', temp: '23°' },
                            { day: 'Пн', icon: '🌤️', temp: '20°' },
                        ].map(d => `
                            <div class="forecast-day">
                                <div class="forecast-name">${d.day}</div>
                                <div class="forecast-icon">${d.icon}</div>
                                <div class="forecast-temp">${d.temp}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    },

    store: {
        title: 'Play Маркет',
        icon: 'store-icon',
        init(container) {
            const apps = [
                { name: 'WhatsApp', desc: 'Мессенджер', rating: '★ 4.5', color: '#25d366', icon: '💬' },
                { name: 'Instagram', desc: 'Социальная сеть', rating: '★ 4.2', color: '#e1306c', icon: '📸' },
                { name: 'Spotify', desc: 'Музыка', rating: '★ 4.6', color: '#1db954', icon: '🎵' },
                { name: 'Telegram', desc: 'Мессенджер', rating: '★ 4.7', color: '#0088cc', icon: '✈️' },
                { name: 'Netflix', desc: 'Видео', rating: '★ 4.3', color: '#e50914', icon: '🎬' },
                { name: 'Uber', desc: 'Такси', rating: '★ 4.1', color: '#000', icon: '🚗' },
            ];

            container.innerHTML = `
                <div style="padding:16px">
                    <h2 style="color:var(--android-text);margin-bottom:16px;font-size:20px;font-weight:500">Рекомендации</h2>
                    <div style="display:flex;flex-direction:column;gap:12px">
                        ${apps.map(a => `
                            <div style="display:flex;align-items:center;gap:14px;padding:12px;background:rgba(255,255,255,0.05);border-radius:12px;cursor:pointer">
                                <div style="width:48px;height:48px;background:${a.color};border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px">${a.icon}</div>
                                <div style="flex:1">
                                    <div style="color:var(--android-text);font-size:15px;font-weight:500">${a.name}</div>
                                    <div style="color:var(--android-text-secondary);font-size:12px">${a.desc}</div>
                                    <div style="color:#ffc107;font-size:12px;margin-top:2px">${a.rating}</div>
                                </div>
                                <button style="padding:6px 16px;background:var(--android-primary);border:none;border-radius:16px;color:#000;font-size:13px;font-weight:500;cursor:pointer">Установить</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    },

    telegram: {
        title: 'Telegram',
        socket: null,
        me: null,
        currentChat: null,
        conversations: {},

        init(container) {
            container.innerHTML = this.render();
            this.bind();
        },

        destroy() {
            if (this.socket) { this.socket.disconnect(); this.socket = null; }
            this.me = null;
            this.currentChat = null;
            this.conversations = {};
        },

        render() {
            if (!this.me) return this.renderAuth();
            return this.renderMessenger();
        },

        renderAuth() {
            return `
                <div class="tg-auth">
                    <div class="tg-auth-card">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="#2b5278"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
                        <div class="tg-auth-title">Telegram</div>
                        <div class="tg-auth-sub">Войдите или создайте аккаунт</div>
                        <input type="text" id="tg-reg-name" placeholder="Ваше имя" class="tg-auth-input" style="display:none">
                        <input type="text" id="tg-login-user" placeholder="Логин" class="tg-auth-input">
                        <input type="password" id="tg-login-pass" placeholder="Пароль" class="tg-auth-input">
                        <button class="tg-auth-btn" id="tg-login-btn">Войти</button>
                        <div class="tg-auth-switch"><a id="tg-toggle-auth">Создать аккаунт</a></div>
                        <div class="tg-auth-error" id="tg-auth-error"></div>
                    </div>
                </div>
            `;
        },

        renderMessenger() {
            return `
                <div class="tg-layout">
                    <div class="tg-sidebar">
                        <div class="tg-sidebar-head">
                            <span style="font-size:18px;font-weight:600;color:#fff;flex:1">Telegram</span>
                            <button class="tg-icon-btn" id="tg-add-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="#aaa"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
                            <button class="tg-icon-btn" id="tg-logout-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="#aaa"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg></button>
                        </div>
                        <div class="tg-search">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#7b8b9a"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                            <input type="text" placeholder="Поиск" id="tg-search-input">
                        </div>
                        <div class="tg-chat-list" id="tg-chat-list"></div>
                    </div>
                    <div class="tg-chat-area" id="tg-chat-area">
                        <div class="tg-empty-state" id="tg-empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="#2b5278"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                            <div style="font-size:15px;color:#7b8b9a;margin-top:12px">Выберите чат или начните новый</div>
                        </div>
                        <div id="tg-msg-view" style="display:none;flex-direction:column;height:100%">
                            <div class="tg-msg-header">
                                <button class="tg-icon-btn tg-back-btn" id="tg-back-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="#aaa"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>
                                <div class="tg-msg-avatar" id="tg-msg-avatar"></div>
                                <div style="flex:1"><div style="color:#fff;font-size:15px;font-weight:600" id="tg-msg-name"></div><div style="font-size:12px;color:#7b8b9a" id="tg-msg-status"></div></div>
                            </div>
                            <div class="tg-messages" id="tg-messages"></div>
                            <div class="tg-typing" id="tg-typing" style="display:none"><div class="tg-typing-dots"><span></span><span></span><span></span></div></div>
                            <div class="tg-input-bar">
                                <input type="text" id="tg-msg-input" placeholder="Сообщение" autocomplete="off">
                                <button class="tg-send-btn" id="tg-send-btn"><svg width="22" height="22" viewBox="0 0 24 24" fill="#7b8b9a"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        bind() {
            const tgRegName = document.getElementById('tg-reg-name');
            const tgUser = document.getElementById('tg-login-user');
            const tgPass = document.getElementById('tg-login-pass');
            const tgBtn = document.getElementById('tg-login-btn');
            const tgToggle = document.getElementById('tg-toggle-auth');
            const tgErr = document.getElementById('tg-auth-error');
            if (!tgBtn) return;
            let isReg = false;
            tgToggle.onclick = () => { isReg = !isReg; tgRegName.style.display = isReg ? '' : 'none'; tgBtn.textContent = isReg ? 'Создать' : 'Войти'; tgToggle.textContent = isReg ? 'Войти' : 'Создать аккаунт'; tgErr.textContent = ''; };
            tgBtn.onclick = async () => {
                const u = tgUser.value.trim(), p = tgPass.value, d = tgRegName.value.trim();
                tgErr.textContent = '';
                if (!u || !p || (isReg && !d)) { tgErr.textContent = 'Заполните все поля'; return; }
                const url = isReg ? '/api/register' : '/api/login';
                const body = isReg ? { username: u, password: p, display_name: d } : { username: u, password: p };
                try {
                    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
                    const data = await r.json();
                    if (!r.ok) { tgErr.textContent = data.error; return; }
                    this.me = data;
                    this.startMessenger();
                } catch (e) { tgErr.textContent = 'Ошибка сети'; }
            };
            tgPass.onkeydown = (e) => { if (e.key === 'Enter') tgBtn.click(); };
            tgUser.onkeydown = (e) => { if (e.key === 'Enter') tgPass.focus(); };
        },

        startMessenger() {
            document.getElementById('app-content').innerHTML = this.renderMessenger();
            this.bindChat();
            this.socket = io();
            this.socket.emit('auth', this.me.id);
            this.socket.on('new-message', (m) => this.onMessage(m));
            this.socket.on('typing', (d) => this.onTyping(d));
            this.socket.on('messages-read', (d) => this.onRead(d));
            this.socket.on('user-online', (d) => this.onOnline(d));
            this.loadChatList();
        },

        bindChat() {
            document.getElementById('tg-add-btn').onclick = () => this.showNewChat();
            document.getElementById('tg-logout-btn').onclick = () => { this.me = null; if (this.socket) this.socket.disconnect(); this.socket = null; document.getElementById('app-content').innerHTML = this.render(); this.bind(); };
            document.getElementById('tg-send-btn').onclick = () => this.sendMsg();
            document.getElementById('tg-msg-input').onkeydown = (e) => { if (e.key === 'Enter') this.sendMsg(); };
            document.getElementById('tg-back-btn').onclick = () => { document.getElementById('tg-msg-view').style.display = 'none'; document.getElementById('tg-empty-state').style.display = ''; };
            document.getElementById('tg-search-input').oninput = (e) => { const q = e.target.value.toLowerCase(); document.querySelectorAll('.tg-chat-item').forEach(el => { el.style.display = el.dataset.name.toLowerCase().includes(q) ? '' : 'none'; }); };
        },

        async loadChatList() {
            const r = await fetch('/api/conversations');
            const convs = await r.json();
            const list = document.getElementById('tg-chat-list');
            if (!list) return;
            list.innerHTML = '';
            convs.sort((a, b) => (b.last_date + ' ' + b.last_time).localeCompare(a.last_date + ' ' + a.last_time));
            convs.forEach(c => {
                const d = document.createElement('div');
                d.className = 'tg-chat-item';
                d.dataset.uid = c.user.id;
                d.dataset.name = c.user.display_name;
                d.innerHTML = `
                    <div class="tg-av-wrap"><div class="tg-av" style="background:${c.user.avatar_color}">${c.user.display_name[0]}</div>${c.user.online ? '<div class="tg-online-dot"></div>' : ''}</div>
                    <div class="tg-ci-info">
                        <div class="tg-ci-top"><span class="tg-ci-name">${c.user.display_name}</span><span class="tg-ci-time">${c.last_time}</span></div>
                        <div class="tg-ci-bot"><span class="tg-ci-last">${c.last_message}</span>${c.unread > 0 ? `<span class="tg-unread">${c.unread}</span>` : ''}</div>
                    </div>`;
                d.onclick = () => this.openChat(c.user);
                list.appendChild(d);
            });
        },

        async openChat(user) {
            this.currentChat = user;
            document.querySelectorAll('.tg-chat-item').forEach(el => el.classList.remove('active'));
            const sel = document.querySelector(`.tg-chat-item[data-uid="${user.id}"]`);
            if (sel) sel.classList.add('active');
            document.getElementById('tg-empty-state').style.display = 'none';
            document.getElementById('tg-msg-view').style.display = 'flex';
            document.getElementById('tg-msg-avatar').style.background = user.avatar_color;
            document.getElementById('tg-msg-avatar').textContent = user.display_name[0];
            document.getElementById('tg-msg-name').textContent = user.display_name;
            const st = document.getElementById('tg-msg-status');
            st.textContent = user.online ? 'в сети' : 'был(а) недавно';
            st.style.color = user.online ? '#2b5278' : '#7b8b9a';
            const r = await fetch(`/api/messages/${user.id}`);
            const msgs = await r.json();
            this.conversations[user.id] = msgs;
            this.renderMsgs(msgs);
            this.socket.emit('mark-read', { from_id: user.id });
            document.getElementById('tg-msg-input').focus();
        },

        renderMsgs(msgs) {
            const area = document.getElementById('tg-messages');
            area.innerHTML = '';
            let ld = '';
            msgs.forEach(m => {
                if (m.date !== ld) { ld = m.date; area.innerHTML += `<div class="tg-date-sep"><span>${m.date}</span></div>`; }
                const isMe = m.from_id === this.me.id;
                const check = isMe ? (m.status === 'read' ? '<span class="tg-check done">✓✓</span>' : '<span class="tg-check sent">✓</span>') : '';
                area.innerHTML += `<div class="tg-msg ${isMe ? 'me' : 'them'}"><div class="tg-msg-text">${this.esc(m.text)}</div><div class="tg-msg-meta">${m.time} ${check}</div></div>`;
            });
            area.scrollTop = area.scrollHeight;
        },

        esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; },

        sendMsg() {
            const inp = document.getElementById('tg-msg-input');
            const t = inp.value.trim();
            if (!t || !this.currentChat) return;
            this.socket.emit('send-message', { to_id: this.currentChat.id, text: t });
            inp.value = '';
        },

        onMessage(msg) {
            const oid = msg.from_id === this.me.id ? msg.to_id : msg.from_id;
            if (!this.conversations[oid]) this.conversations[oid] = [];
            this.conversations[oid].push(msg);
            if (this.currentChat && oid === this.currentChat.id) {
                this.renderMsgs(this.conversations[oid]);
                if (msg.from_id !== this.me.id) this.socket.emit('mark-read', { from_id: oid });
            }
            this.loadChatList();
        },

        onTyping(d) {
            if (this.currentChat && d.from_id === this.currentChat.id) {
                const el = document.getElementById('tg-typing');
                if (el) { el.style.display = d.typing ? 'flex' : 'none'; if (d.typing) { const a = document.getElementById('tg-messages'); a.scrollTop = a.scrollHeight; } }
            }
        },

        onRead(d) {
            if (this.conversations[d.by_id]) { this.conversations[d.by_id].forEach(m => { if (m.from_id === this.me.id) m.status = 'read'; }); if (this.currentChat && d.by_id === this.currentChat.id) this.renderMsgs(this.conversations[d.by_id]); }
        },

        onOnline(d) {
            const dot = document.querySelector(`.tg-chat-item[data-uid="${d.userId}"] .tg-online-dot`);
            if (dot) dot.style.display = d.online ? '' : 'none';
            if (this.currentChat && d.userId === this.currentChat.id) {
                this.currentChat.online = d.online;
                const s = document.getElementById('tg-msg-status');
                if (s) { s.textContent = d.online ? 'в сети' : 'был(а) недавно'; s.style.color = d.online ? '#2b5278' : '#7b8b9a'; }
            }
        },

        async showNewChat() {
            const r = await fetch('/api/users');
            const users = await r.json();
            let html = '<div class="tg-overlay" id="tg-overlay"><div class="tg-modal"><div class="tg-modal-head"><span style="color:#fff;font-size:16px;font-weight:600">Новый чат</span><button class="tg-icon-btn" id="tg-modal-close"><svg width="20" height="20" viewBox="0 0 24 24" fill="#aaa"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button></div><div class="tg-modal-list">';
            users.forEach(u => { html += `<div class="tg-nc-user" data-uid="${u.id}" data-name="${u.display_name}" data-color="${u.avatar_color}" data-online="${u.online}"><div class="tg-av" style="background:${u.avatar_color}">${u.display_name[0]}</div><div style="flex:1"><div style="color:#fff;font-size:14px">${u.display_name}</div><div style="color:#7b8b9a;font-size:12px">${u.online ? 'в сети' : 'был(а) недавно'}</div></div></div>`; });
            if (!users.length) html += '<div style="padding:24px;text-align:center;color:#7b8b9a">Пока нет пользователей.<br>Откройте другую вкладку<br>и зарегистрируйтесь!</div>';
            html += '</div></div></div>';
            document.getElementById('app-content').insertAdjacentHTML('beforeend', html);
            document.getElementById('tg-modal-close').onclick = () => document.getElementById('tg-overlay').remove();
            document.getElementById('tg-overlay').onclick = (e) => { if (e.target.id === 'tg-overlay') e.target.remove(); };
            document.querySelectorAll('.tg-nc-user').forEach(el => {
                el.onclick = () => {
                    document.getElementById('tg-overlay').remove();
                    this.openChat({ id: parseInt(el.dataset.uid), display_name: el.dataset.name, avatar_color: el.dataset.color, online: el.dataset.online === 'true' });
                };
            });
        }
    }
};
