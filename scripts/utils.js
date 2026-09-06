const Utils = {
    formatTime(date) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    },

    formatDate(date) {
        return date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    },

    formatTimeFull(date) {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    },

    formatDateShort(date) {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    },

    getDayOfWeek(date) {
        return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    randomColor() {
        const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
            '#00bcd4', '#009688', '#4caf50', '#ff9800', '#ff5722'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    showToast(message) {
        const screen = document.getElementById('phone-screen');
        const existing = screen.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        screen.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    createElement(tag, className, innerHTML) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    },

    debounce(fn, delay) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    }
};
