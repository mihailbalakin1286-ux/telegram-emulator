const Emulator = {
    currentScreen: 'lock',
    currentApp: null,
    recentApps: [],
    notifOpen: false,
    powerMenuOpen: false,
    handlers: {},
    batteryLevel: 85,
    batteryDirection: -1,

    elements: {},

    init() {
        this.cacheElements();
        this.setupClock();
        this.setupNavigation();
        this.setupStatusBar();
        this.setupLockScreen();
        this.setupAppDrawer();
        this.setupNotifications();
        this.setupPowerMenu();
        this.setupEmulatorControls();
        this.setupGestures();
        this.setupVolumeOverlay();
        this.setupRecentApps();
    },

    cacheElements() {
        const ids = ['lock-screen', 'home-screen', 'app-drawer', 'app-container',
            'notification-panel', 'recent-apps', 'power-menu', 'nav-bar',
            'lock-time', 'lock-date', 'status-time', 'battery-level',
            'widget-clock-time', 'widget-clock-date', 'drawer-grid',
            'drawer-search-input', 'app-title', 'app-content', 'app-back',
            'recent-cards', 'clear-recent', 'phone-screen'];

        ids.forEach(id => {
            this.elements[id.replace(/-/g, '_')] = document.getElementById(id);
        });
    },

    setupClock() {
        const updateTime = () => {
            const now = new Date();
            const time = Utils.formatTime(now);
            const date = Utils.formatDate(now);

            if (this.elements.lock_time) {
                this.elements.lock_time.textContent = time;
            }
            if (this.elements.lock_date) {
                this.elements.lock_date.textContent = date.charAt(0).toUpperCase() + date.slice(1);
            }
            if (this.elements.status_time) {
                this.elements.status_time.textContent = time;
            }
            if (this.elements.widget_clock_time) {
                this.elements.widget_clock_time.textContent = time;
            }
            if (this.elements.widget_clock_date) {
                this.elements.widget_clock_date.textContent = date.charAt(0).toUpperCase() + date.slice(1);
            }
        };

        updateTime();
        setInterval(updateTime, 1000);

        const updateBattery = () => {
            this.batteryLevel += this.batteryDirection * (1 + Math.floor(Math.random() * 3));
            if (this.batteryLevel <= 15) {
                this.batteryLevel = 15;
                this.batteryDirection = 1;
            } else if (this.batteryLevel >= 95) {
                this.batteryLevel = 95;
                this.batteryDirection = -1;
            }

            const batteryEl = document.getElementById('battery-level');
            if (batteryEl) {
                batteryEl.style.width = this.batteryLevel + '%';
                document.getElementById('battery-percent').textContent = this.batteryLevel + '%';

                if (this.batteryLevel < 20) {
                    batteryEl.style.background = '#ef5350';
                } else if (this.batteryLevel < 50) {
                    batteryEl.style.background = '#ffc107';
                } else {
                    batteryEl.style.background = 'var(--android-accent)';
                }
            }
        };

        updateBattery();
        setInterval(updateBattery, 30000);
    },

    showScreen(name) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(name + '-screen');
        if (screen) {
            screen.classList.add('active');
        }
        this.currentScreen = name;
    },

    setupLockScreen() {
        this.handlers.lock = new SwipeHandler(this.elements.lock_screen, {
            swipeUp: () => this.unlock(),
            tap: () => this.unlock()
        });
    },

    unlock() {
        const lockScreen = this.elements.lock_screen;
        lockScreen.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
        lockScreen.style.transform = 'translateY(-100%)';
        lockScreen.style.opacity = '0';

        setTimeout(() => {
            lockScreen.style.transition = '';
            lockScreen.style.transform = '';
            lockScreen.style.opacity = '';
            this.showScreen('home');
            this.elements.nav_bar.style.display = 'flex';
        }, 350);
    },

    lock() {
        this.elements.nav_bar.style.display = 'none';
        this.closeApp();
        this.closeNotifications();
        this.closePowerMenu();
        this.closeRecentApps();
        this.showScreen('lock');
    },

    setupNavigation() {
        document.getElementById('nav-back').addEventListener('click', () => this.goBack());
        document.getElementById('nav-home').addEventListener('click', () => this.goHome());
        document.getElementById('nav-recent').addEventListener('click', () => this.toggleRecentApps());
        this.elements.app_back.addEventListener('click', () => this.goBack());
    },

    goBack() {
        if (this.powerMenuOpen) {
            this.closePowerMenu();
        } else if (this.notifOpen) {
            this.closeNotifications();
        } else if (this.currentScreen === 'app-drawer') {
            this.closeAppDrawer();
        } else if (this.currentApp === 'messages') {
            const chatView = this.elements.app_content.querySelector('.chat-view');
            if (chatView) {
                Apps.messages.renderList();
                return;
            }
            this.closeApp();
        } else if (this.currentApp) {
            this.closeApp();
        } else if (this.currentScreen === 'recent') {
            this.closeRecentApps();
        }
    },

    goHome() {
        if (this.notifOpen) this.closeNotifications();
        if (this.powerMenuOpen) this.closePowerMenu();
        if (this.currentApp) this.closeApp();
        if (this.currentScreen === 'app-drawer') this.closeAppDrawer();
        if (this.currentScreen === 'recent') this.closeRecentApps();
        this.showScreen('home');
    },

    openApp(appName) {
        const app = Apps[appName];
        if (!app) return;

        if (this.currentApp && this.currentApp !== appName) {
            this.closeApp();
        }

        this.currentApp = appName;
        this.elements.app_title.textContent = app.title;

        if (app.init) {
            app.init(this.elements.app_content);
        }

        this.elements.app_container.classList.add('active');
        this.elements.app_container.classList.add('app-open');

        if (!this.recentApps.includes(appName)) {
            this.recentApps.unshift(appName);
            if (this.recentApps.length > 5) this.recentApps.pop();
        } else {
            this.recentApps = this.recentApps.filter(a => a !== appName);
            this.recentApps.unshift(appName);
        }
    },

    closeApp() {
        if (this.currentApp) {
            const app = Apps[this.currentApp];
            if (app && app.destroy) {
                app.destroy(this.elements.app_content);
            }
        }

        this.elements.app_container.classList.remove('active');
        this.elements.app_container.classList.remove('app-open');
        this.currentApp = null;
    },

    setupAppDrawer() {
        this.populateDrawer();

        document.getElementById('drawer-search-input').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.populateDrawer(query);
        });
    },

    populateDrawer(filter = '') {
        const grid = this.elements.drawer_grid;
        grid.innerHTML = '';

        const appList = Object.entries(Apps).filter(([key, app]) => {
            return !filter || app.title.toLowerCase().includes(filter);
        });

        appList.forEach(([key, app]) => {
            const icon = document.createElement('div');
            icon.className = 'app-icon';
            icon.dataset.app = key;
            icon.innerHTML = `
                <div class="icon-bg ${app.icon}">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </div>
                <span>${app.title}</span>
            `;
            icon.addEventListener('click', () => {
                this.closeAppDrawer();
                setTimeout(() => this.openApp(key), 250);
            });
            grid.appendChild(icon);
        });
    },

    openAppDrawer() {
        this.elements.drawer_search_input.value = '';
        this.populateDrawer();
        this.elements.app_drawer.classList.remove('active');
        void this.elements.app_drawer.offsetWidth;
        this.elements.app_drawer.classList.add('active');
        setTimeout(() => {
            this.elements.drawer_search_input.focus();
        }, 300);
    },

    closeAppDrawer() {
        this.elements.app_drawer.classList.remove('active');
        this.elements.drawer_search_input.blur();
    },

    setupStatusBar() {
        const statusBar = document.getElementById('status-bar');

        statusBar.addEventListener('click', (e) => {
            if (this.notifOpen) {
                this.closeNotifications();
            } else {
                this.openNotifications();
            }
        });
    },

    setupNotifications() {
        document.querySelectorAll('.qs-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                tile.classList.toggle('active');
                const name = tile.querySelector('span').textContent;
                Utils.showToast(`${name}: ${tile.classList.contains('active') ? 'Вкл' : 'Выкл'}`);
            });
        });
    },

    openNotifications() {
        this.notifOpen = true;
        const panel = this.elements.notification_panel;
        panel.style.display = 'flex';
        panel.classList.remove('open');
        void panel.offsetWidth;
        panel.classList.add('open');
    },

    closeNotifications() {
        this.notifOpen = false;
        const panel = this.elements.notification_panel;
        panel.classList.remove('open');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 350);
    },

    setupPowerMenu() {
        document.querySelectorAll('.power-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const action = opt.dataset.action;
                this.closePowerMenu();

                if (action === 'poweroff') {
                    this.powerOff();
                } else if (action === 'restart') {
                    this.restart();
                } else if (action === 'screenshot') {
                    Utils.showToast('Скриншот сохранён');
                }
            });
        });
    },

    openPowerMenu() {
        this.powerMenuOpen = true;
        this.elements.power_menu.classList.add('active');
    },

    closePowerMenu() {
        this.powerMenuOpen = false;
        this.elements.power_menu.classList.remove('active');
    },

    powerOff() {
        const screen = this.elements.phone_screen;
        screen.style.transition = 'opacity 1s ease';
        screen.style.opacity = '0';
        setTimeout(() => {
            screen.style.opacity = '1';
            this.lock();
        }, 1500);
    },

    restart() {
        this.powerOff();
        setTimeout(() => {
            this.unlock();
        }, 2000);
    },

    setupEmulatorControls() {
        document.getElementById('btn-power').addEventListener('click', () => {
            if (this.powerMenuOpen) {
                this.closePowerMenu();
            } else {
                this.openPowerMenu();
            }
        });

        document.getElementById('btn-volup').addEventListener('click', () => {
            this.showVolumeToast('up');
        });

        document.getElementById('btn-voldown').addEventListener('click', () => {
            this.showVolumeToast('down');
        });

        document.getElementById('btn-volume-mute').addEventListener('click', () => {
            Utils.showToast('Звук выключен');
        });
    },

    showVolumeToast(direction) {
        let overlay = document.getElementById('volume-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'volume-overlay';
            overlay.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg><span>Громкость</span>`;
            this.elements.phone_screen.appendChild(overlay);
        }

        overlay.style.display = 'flex';
        overlay.style.opacity = '1';

        clearTimeout(this._volumeTimer);
        this._volumeTimer = setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 300);
        }, 1500);
    },

    setupVolumeOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'volume-overlay';
        overlay.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg><span>Громкость</span>`;
        overlay.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.85);border-radius:16px;padding:20px 30px;display:none;align-items:center;gap:12px;z-index:300;color:white;font-size:14px;transition:opacity 0.3s ease;';
        this.elements.phone_screen.appendChild(overlay);
    },

    setupRecentApps() {
        this.elements.clear_recent.addEventListener('click', () => {
            this.recentApps = [];
            this.elements.recent_cards.innerHTML = '';
            this.closeRecentApps();
            Utils.showToast('Все приложения закрыты');
        });
    },

    toggleRecentApps() {
        if (this.currentScreen === 'recent') {
            this.closeRecentApps();
        } else {
            this.openRecentApps();
        }
    },

    openRecentApps() {
        this.elements.recent_cards.innerHTML = '';

        if (this.recentApps.length === 0) {
            this.elements.recent_cards.innerHTML = '<div style="color:var(--android-text-secondary);text-align:center;width:100%;font-size:14px">Нет недавних приложений</div>';
        } else {
            this.recentApps.forEach(appName => {
                const app = Apps[appName];
                if (!app) return;

                const card = document.createElement('div');
                card.className = 'recent-card';
                card.innerHTML = `
                    <div class="recent-card-title">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                        ${app.title}
                    </div>
                    <div class="recent-card-preview"></div>
                `;
                card.addEventListener('click', () => {
                    this.closeRecentApps();
                    this.openApp(appName);
                });

                const preview = card.querySelector('.recent-card-preview');
                if (app.init) {
                    const tempDiv = document.createElement('div');
                    tempDiv.style.cssText = 'width:100%;height:100%;overflow:hidden';
                    app.init(tempDiv);
                    preview.appendChild(tempDiv);
                }

                this.elements.recent_cards.appendChild(card);
            });
        }

        this.showScreen('recent');
    },

    closeRecentApps() {
        this.showScreen('home');
    },

    setupGestures() {
        const homeScreen = this.elements.home_screen;

        this.handlers.home = new SwipeHandler(homeScreen, {
            swipeUp: (data) => {
                const screenRect = homeScreen.getBoundingClientRect();
                const relativeStartY = data.startY - screenRect.top;
                if (relativeStartY > screenRect.height * 0.5) {
                    this.openAppDrawer();
                }
            },
            swipeDown: () => {
                if (!this.currentApp && this.currentScreen === 'home') {
                    this.openNotifications();
                }
            }
        });

        this.handlers.drawer = new SwipeHandler(this.elements.app_drawer, {
            swipeDown: () => {
                this.closeAppDrawer();
            }
        });

        this.handlers.notifPanel = new SwipeHandler(this.elements.notification_panel, {
            swipeUp: () => {
                this.closeNotifications();
            }
        });

        document.querySelectorAll('.app-icon[data-app]').forEach(icon => {
            icon.addEventListener('click', () => {
                const appName = icon.dataset.app;
                this.openApp(appName);
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Emulator.init();
    Emulator.elements.nav_bar.style.display = 'none';
});
