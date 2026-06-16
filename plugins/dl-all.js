//=============================================
// DARK DEV MINI - ALL IN ONE DOWNLOADER
// API: https://dl.dnuz.top:2168
//=============================================

const { cmd } = require('../inconnuboy');
const axios = require('axios');

const API_BASE = 'https://dl.dnuz.top:2168/dl';
const API_KEY = process.env.DL_API_KEY || 'YOUR_API_KEY_HERE';

// ─────────────────────────────────────────
// Helper: API call
// ─────────────────────────────────────────
async function fetchMedia(url) {
    const res = await axios.get(API_BASE, {
        params: { url, api_key: API_KEY },
        timeout: 30000,
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });
    return res.data;
}

// ─────────────────────────────────────────
// Helper: Send video/audio with selection menu
// ─────────────────────────────────────────
async function sendSelectionMenu(conn, mek, from, data, title) {
    const medias = data.medias || [];
    if (!medias.length) throw new Error('No media found');

    // Build menu
    let menu = `*「 DARK DEV MINI 🏴‍☠️ 」*\n\n`;
    menu += `📌 *${title || data.title || 'Media'}*\n`;
    if (data.duration) menu += `⏱️ *Duration:* ${data.duration}\n`;
    if (data.platform) menu += `🌐 *Platform:* ${data.platform}\n`;
    menu += `\n*📥 Select format:*\n\n`;

    medias.forEach((m, i) => {
        const quality = m.quality || m.ext || 'Unknown';
        const type = m.type || (m.ext === 'mp3' ? 'audio' : 'video');
        const icon = type === 'audio' ? '🎵' : '🎥';
        menu += `${i + 1} ‣ ${icon} *${quality.toUpperCase()}*\n`;
    });

    menu += `\n> *Reply with number to download*`;

    // Thumbnail send
    let sentMsg;
    if (data.thumbnail) {
        sentMsg = await conn.sendMessage(from, {
            image: { url: data.thumbnail },
            caption: menu
        }, { quoted: mek });
    } else {
        sentMsg = await conn.sendMessage(from, { text: menu }, { quoted: mek });
    }

    // Listen for reply
    const handler = async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg?.message) return;

            const text = (
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text || ''
            ).trim();

            const isReply = msg.message.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;
            if (!isReply) return;

            const idx = parseInt(text) - 1;
            if (isNaN(idx) || idx < 0 || idx >= medias.length) return;

            const chosen = medias[idx];
            const chosenUrl = chosen.url;
            const ext = (chosen.ext || '').toLowerCase();
            const isAudio = chosen.type === 'audio' || ext === 'mp3' || ext === 'ogg';

            await conn.sendMessage(from, { react: { text: '⏳', key: msg.key } });

            if (isAudio) {
                await conn.sendMessage(from, {
                    audio: { url: chosenUrl },
                    mimetype: 'audio/mpeg'
                }, { quoted: msg });
            } else {
                await conn.sendMessage(from, {
                    video: { url: chosenUrl },
                    caption: `*✅ Downloaded | DARK DEV MINI 🏴‍☠️*`
                }, { quoted: msg });
            }

            await conn.sendMessage(from, { react: { text: '✅', key: msg.key } });
            conn.ev.off('messages.upsert', handler);
        } catch (e) {
            console.error('[DL handler]', e.message);
        }
    };

    conn.ev.on('messages.upsert', handler);
    setTimeout(() => conn.ev.off('messages.upsert', handler), 5 * 60 * 1000);
}

// ─────────────────────────────────────────
// 1. INSTAGRAM
// ─────────────────────────────────────────
cmd({
    pattern: 'instagram',
    alias: ['insta', 'ig'],
    desc: 'Download Instagram Reels/Posts',
    category: 'download',
    react: '📸'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *Instagram URL දෙන්න*\n`.instagram <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        await sendSelectionMenu(conn, mek, from, data, data.title || 'Instagram Media');
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ─────────────────────────────────────────
// 2. TIKTOK
// ─────────────────────────────────────────
cmd({
    pattern: 'tiktok',
    alias: ['tt'],
    desc: 'Download TikTok videos',
    category: 'download',
    react: '🎵'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *TikTok URL දෙන්න*\n`.tiktok <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        await sendSelectionMenu(conn, mek, from, data, data.title || 'TikTok Media');
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ─────────────────────────────────────────
// 3. YOUTUBE (video/audio)
// ─────────────────────────────────────────
cmd({
    pattern: 'yt',
    alias: ['youtube', 'ytdl'],
    desc: 'Download YouTube videos',
    category: 'download',
    react: '▶️'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *YouTube URL දෙන්න*\n`.yt <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        await sendSelectionMenu(conn, mek, from, data, data.title || 'YouTube Media');
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ─────────────────────────────────────────
// 4. FACEBOOK
// ─────────────────────────────────────────
cmd({
    pattern: 'facebook',
    alias: ['fb'],
    desc: 'Download Facebook videos',
    category: 'download',
    react: '📘'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *Facebook URL දෙන්න*\n`.facebook <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        await sendSelectionMenu(conn, mek, from, data, data.title || 'Facebook Media');
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ─────────────────────────────────────────
// 5. TWITTER / X
// ─────────────────────────────────────────
cmd({
    pattern: 'twitter',
    alias: ['x', 'xdl'],
    desc: 'Download Twitter/X videos',
    category: 'download',
    react: '🐦'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *Twitter/X URL දෙන්න*\n`.twitter <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        await sendSelectionMenu(conn, mek, from, data, data.title || 'Twitter Media');
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ─────────────────────────────────────────
// 6. THREADS
// ─────────────────────────────────────────
cmd({
    pattern: 'threads',
    alias: ['th'],
    desc: 'Download Threads videos/images',
    category: 'download',
    react: '🧵'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *Threads URL දෙන්න*\n`.threads <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        await sendSelectionMenu(conn, mek, from, data, data.title || 'Threads Media');
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ─────────────────────────────────────────
// 7. PINTEREST
// ─────────────────────────────────────────
cmd({
    pattern: 'pinterest',
    alias: ['pin', 'pt'],
    desc: 'Download Pinterest images/videos',
    category: 'download',
    react: '📌'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *Pinterest URL දෙන්න*\n`.pinterest <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        // Pinterest mostly images — direct send
        const medias = data.medias || [];
        if (!medias.length) return reply('❌ *Media නොලැබුණා*');

        for (const media of medias.slice(0, 5)) {
            const ext = (media.ext || '').toLowerCase();
            if (ext === 'mp4' || media.type === 'video') {
                await conn.sendMessage(from, {
                    video: { url: media.url },
                    caption: '*✅ Pinterest Video | DARK DEV MINI 🏴‍☠️*'
                }, { quoted: mek });
            } else {
                await conn.sendMessage(from, {
                    image: { url: media.url },
                    caption: '*✅ Pinterest Image | DARK DEV MINI 🏴‍☠️*'
                }, { quoted: mek });
            }
        }
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});

// ─────────────────────────────────────────
// 8. UNIVERSAL / ANY URL
// ─────────────────────────────────────────
cmd({
    pattern: 'dl',
    alias: ['download'],
    desc: 'Download from any supported URL',
    category: 'download',
    react: '📥'
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q || !q.startsWith('http')) return reply('⚠️ *URL දෙන්න*\n`.dl <url>`');
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        const data = await fetchMedia(q);
        if (!data || data.error) return reply(`❌ *Error:* ${data?.error || 'Failed'}`);

        await sendSelectionMenu(conn, mek, from, data, data.title || 'Media');
    } catch (e) {
        reply(`❌ *Error:* ${e.message}`);
    }
});
