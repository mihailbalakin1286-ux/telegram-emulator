const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const express = require('express');
const { Server } = require('socket.io');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const initSqlJs = require('sql.js');

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const COLORS = ['#e91e63','#4caf50','#ff9800','#9c27b0','#2196f3','#00bcd4','#f44336','#607d8b','#795548','#ff5722'];

let db;
let users = [];
let messages = [];

async function initDB() {
    const SQL = await initSqlJs();
    const dbPath = path.join(ROOT, 'data.db');

    if (fs.existsSync(dbPath)) {
        const fileBuffer = fs.readFileSync(dbPath);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        avatar_color TEXT NOT NULL,
        online INTEGER DEFAULT 0,
        last_seen TEXT DEFAULT ''
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_id INTEGER NOT NULL,
        to_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        time TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'sent',
        FOREIGN KEY (from_id) REFERENCES users(id),
        FOREIGN KEY (to_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS conversations (
        user1_id INTEGER NOT NULL,
        user2_id INTEGER NOT NULL,
        last_message TEXT DEFAULT '',
        last_time TEXT DEFAULT '',
        PRIMARY KEY (user1_id, user2_id)
    )`);

    saveDB();
    users = db.exec("SELECT * FROM users").values || [];
    messages = db.exec("SELECT * FROM messages").values || [];
}

function saveDB() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(path.join(ROOT, 'data.db'), buffer);
}

function getUser(id) {
    const rows = db.exec("SELECT * FROM users WHERE id = ?", [id]);
    if (!rows.length || !rows[0].values.length) return null;
    const r = rows[0].values[0];
    return { id: r[0], username: r[1], password: r[2], display_name: r[3], avatar_color: r[4], online: r[5], last_seen: r[6] };
}

function getUserByUsername(username) {
    const rows = db.exec("SELECT * FROM users WHERE username = ?", [username]);
    if (!rows.length || !rows[0].values.length) return null;
    const r = rows[0].values[0];
    return { id: r[0], username: r[1], password: r[2], display_name: r[3], avatar_color: r[4], online: r[5], last_seen: r[6] };
}

function getAllUsers() {
    const rows = db.exec("SELECT id, username, display_name, avatar_color, online, last_seen FROM users");
    if (!rows.length) return [];
    return rows[0].values.map(r => ({ id: r[0], username: r[1], display_name: r[2], avatar_color: r[3], online: r[4], last_seen: r[5] }));
}

function getConversation(u1, u2) {
    const rows = db.exec("SELECT * FROM messages WHERE (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?) ORDER BY id ASC", [u1, u2, u2, u1]);
    if (!rows.length) return [];
    return rows[0].values.map(r => ({ id: r[0], from_id: r[1], to_id: r[2], text: r[3], time: r[4], date: r[5], status: r[6] }));
}

function getConversations(userId) {
    const rows = db.exec(`
        SELECT
            CASE WHEN from_id = ? THEN to_id ELSE from_id END as other_id,
            text as last_message,
            time as last_time,
            date as last_date
        FROM messages
        WHERE from_id = ? OR to_id = ?
        GROUP BY other_id
        ORDER BY MAX(id) DESC
    `, [userId, userId, userId]);
    if (!rows.length) return [];
    return rows[0].values.map(r => ({ other_id: r[0], last_message: r[1], last_time: r[2], last_date: r[3] }));
}

function getUnreadCount(userId, fromId) {
    const rows = db.exec("SELECT COUNT(*) FROM messages WHERE from_id = ? AND to_id = ? AND status != 'read'", [fromId, userId]);
    if (!rows.length) return 0;
    return rows[0].values[0][0];
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'telegram-emulator-secret-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Static files
app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/socket.io/')) return next();
    const filePath = path.join(ROOT, req.path === '/' ? 'index.html' : req.path);
    const ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('404'); return; }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

// Auth middleware
function requireAuth(req, res, next) {
    if (!req.session.userId) { res.status(401).json({ error: 'Not authenticated' }); return; }
    next();
}

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, display_name } = req.body;
        if (!username || !password) { res.status(400).json({ error: 'Username and password required' }); return; }
        if (username.length < 3) { res.status(400).json({ error: 'Username must be at least 3 characters' }); return; }
        if (password.length < 4) { res.status(400).json({ error: 'Password must be at least 4 characters' }); return; }

        const existing = getUserByUsername(username);
        if (existing) { res.status(409).json({ error: 'Username already taken' }); return; }

        const hash = await bcrypt.hash(password, 10);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const name = display_name || username;

        db.run("INSERT INTO users (username, password, display_name, avatar_color) VALUES (?, ?, ?, ?)", [username, hash, name, color]);
        saveDB();

        const user = getUserByUsername(username);
        req.session.userId = user.id;
        res.json({ id: user.id, username: user.username, display_name: user.display_name, avatar_color: user.avatar_color });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = getUserByUsername(username);
        if (!user) { res.status(401).json({ error: 'User not found' }); return; }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) { res.status(401).json({ error: 'Wrong password' }); return; }

        req.session.userId = user.id;
        db.run("UPDATE users SET online = 1 WHERE id = ?", [user.id]);
        saveDB();

        res.json({ id: user.id, username: user.username, display_name: user.display_name, avatar_color: user.avatar_color });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Logout
app.post('/api/logout', requireAuth, (req, res) => {
    db.run("UPDATE users SET online = 0, last_seen = datetime('now') WHERE id = ?", [req.session.userId]);
    saveDB();
    req.session.destroy();
    res.json({ ok: true });
});

// Current user
app.get('/api/me', requireAuth, (req, res) => {
    const user = getUser(req.session.userId);
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }
    res.json({ id: user.id, username: user.username, display_name: user.display_name, avatar_color: user.avatar_color });
});

// Get all users
app.get('/api/users', requireAuth, (req, res) => {
    const allUsers = getAllUsers().filter(u => u.id !== req.session.userId);
    res.json(allUsers);
});

// Get conversations
app.get('/api/conversations', requireAuth, (req, res) => {
    const convs = getConversations(req.session.userId);
    const result = convs.map(c => {
        const other = getUser(c.other_id);
        const unread = getUnreadCount(req.session.userId, c.other_id);
        return {
            user: other ? { id: other.id, username: other.username, display_name: other.display_name, avatar_color: other.avatar_color, online: other.online } : null,
            last_message: c.last_message,
            last_time: c.last_time,
            last_date: c.last_date,
            unread
        };
    }).filter(c => c.user);
    res.json(result);
});

// Get messages with user
app.get('/api/messages/:userId', requireAuth, (req, res) => {
    const otherId = parseInt(req.params.userId);
    const msgs = getConversation(req.session.userId, otherId);

    // Mark as read
    db.run("UPDATE messages SET status = 'read' WHERE from_id = ? AND to_id = ? AND status != 'read'", [otherId, req.session.userId]);
    saveDB();

    res.json(msgs);
});

// Proxy
function proxyFetch(targetUrl, res) {
    const mod = targetUrl.startsWith('https') ? https : http;
    const req = mod.get(targetUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        timeout: 10000,
    }, (proxyRes) => {
        if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
            let redirect = proxyRes.headers.location;
            if (redirect.startsWith('/')) { const p = new URL(targetUrl); redirect = p.origin + redirect; }
            proxyFetch(redirect, res);
            return;
        }
        const ct = proxyRes.headers['content-type'] || '';
        const isHtml = ct.includes('text/html') || ct.includes('application/xhtml');
        if (isHtml) {
            let body = [];
            proxyRes.on('data', (chunk) => body.push(chunk));
            proxyRes.on('end', () => {
                let html = Buffer.concat(body).toString('utf-8');
                try {
                    const p = new URL(targetUrl);
                    const bp = p.pathname.endsWith('/') ? p.pathname : p.pathname.substring(0, p.pathname.lastIndexOf('/') + 1);
                    html = html.replace(/(src|href|action|poster)=["']([^"'#?]+)["']/gi, (m, a, v) => {
                        if (v.startsWith('http') || v.startsWith('data:') || v.startsWith('#') || v.startsWith('mailto:')) return m;
                        if (v.startsWith('//')) return `${a}="http:${v}"`;
                        if (v.startsWith('/')) return `${a}="${p.origin}${v}"`;
                        return `${a}="${p.origin}${bp}${v}"`;
                    });
                    html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '<!-- removed -->');
                    html = html.replace(/<script\b[^>]*\/?>/gi, '');
                    html = html.replace(/<base\b[^>]*>/gi, '');
                    if (html.includes('<head')) html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${p.origin}/">`);
                } catch (e) {}
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'text/html; charset=utf-8', 'Access-Control-Allow-Origin': '*' });
                res.end(html);
            });
        } else {
            res.writeHead(proxyRes.statusCode, { 'Content-Type': ct, 'Access-Control-Allow-Origin': '*' });
            proxyRes.pipe(res);
        }
    });
    req.on('error', (err) => { res.writeHead(502, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(`<h2>Error: ${err.message}</h2>`); });
    req.on('timeout', () => { req.destroy(); res.writeHead(504, { 'Content-Type': 'text/html; charset=utf-8' }); res.end('<h2>Timeout</h2>'); });
}

app.get('/proxy', (req, res) => {
    const target = req.query.url;
    if (!target) { res.writeHead(400); res.end('Missing url'); return; }
    try { new URL(target); } catch (e) { res.writeHead(400); res.end('Invalid URL'); return; }
    proxyFetch(target, res);
});

// Socket.IO
const onlineUsers = new Map();

io.on('connection', (socket) => {
    let currentUserId = null;

    socket.on('auth', (userId) => {
        currentUserId = userId;
        onlineUsers.set(userId, socket.id);
        db.run("UPDATE users SET online = 1 WHERE id = ?", [userId]);
        saveDB();
        io.emit('user-online', { userId, online: true });
    });

    socket.on('send-message', (data) => {
        if (!currentUserId) return;
        const { to_id, text } = data;
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        const date = now.toISOString().split('T')[0];

        db.run("INSERT INTO messages (from_id, to_id, text, time, date, status) VALUES (?, ?, ?, ?, ?, 'sent')", [currentUserId, to_id, text, time, date]);
        saveDB();

        const msgId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
        const msg = { id: msgId, from_id: currentUserId, to_id, text, time, date, status: 'sent' };

        // Send to sender
        socket.emit('new-message', msg);

        // Send to receiver if online
        const receiverSocket = onlineUsers.get(to_id);
        if (receiverSocket) {
            io.to(receiverSocket).emit('new-message', msg);
        }
    });

    socket.on('typing', (data) => {
        if (!currentUserId) return;
        const receiverSocket = onlineUsers.get(data.to_id);
        if (receiverSocket) {
            io.to(receiverSocket).emit('typing', { from_id: currentUserId, typing: data.typing });
        }
    });

    socket.on('mark-read', (data) => {
        if (!currentUserId) return;
        db.run("UPDATE messages SET status = 'read' WHERE from_id = ? AND to_id = ? AND status != 'read'", [data.from_id, currentUserId]);
        saveDB();
        const senderSocket = onlineUsers.get(data.from_id);
        if (senderSocket) {
            io.to(senderSocket).emit('messages-read', { by_id: currentUserId });
        }
    });

    socket.on('disconnect', () => {
        if (currentUserId) {
            onlineUsers.delete(currentUserId);
            db.run("UPDATE users SET online = 0, last_seen = datetime('now') WHERE id = ?", [currentUserId]);
            saveDB();
            io.emit('user-online', { userId: currentUserId, online: false });
        }
    });
});

async function start() {
    await initDB();
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`\n  Telegram Messenger running at:\n`);
        console.log(`  http://localhost:${PORT}\n`);
    });
}

start();
