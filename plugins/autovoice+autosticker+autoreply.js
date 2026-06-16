const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../inconnuboy');

let getUserConfigFromMongoDB;
try {
    getUserConfigFromMongoDB = require('../lib/database').getUserConfigFromMongoDB;
} catch (e) {
    getUserConfigFromMongoDB = async () => ({});
}

function loadJSON(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        console.error('JSON load error:', filePath, e.message);
    }
    return {};
}

// DB value නැත්නම් config.js value use කරනවා
function isEnabled(dbVal, configVal) {
    if (dbVal === 'true' || dbVal === true) return true;
    if (dbVal === 'false' || dbVal === false) return false;
    return configVal === 'true' || configVal === true;
}

cmd({ on: "body" }, async (conn, mek, m, { from, sender, body }) => {
    try {
        if (!body || !body.trim()) return;
        // fromMe messages skip
        if (mek.key.fromMe) return;

        const textInput = body.toLowerCase().trim();
        console.log(`[AUTO] Received: "${textInput}" from ${sender}`);

        // Safe DB fetch
        let userConfig = {};
        try {
            if (sender) {
                userConfig = await getUserConfigFromMongoDB(sender.split('@')[0]) || {};
            }
        } catch (e) {
            userConfig = {};
        }

        // ─────────────────────────────
        // 🎙️ 1. AUTO VOICE
        // ─────────────────────────────
        if (isEnabled(userConfig.AUTO_VOICE, config.AUTO_VOICE)) {
            const voiceData = loadJSON(path.join(__dirname, '../data/autovoice.json'));
            const voiceKey = Object.keys(voiceData).find(
                k => k.toLowerCase() === textInput
            );
            if (voiceKey) {
                console.log(`[AUTO VOICE] Match: "${voiceKey}"`);
                await conn.sendPresenceUpdate('recording', from);
                return await conn.sendMessage(from, {
                    audio: { url: voiceData[voiceKey] },
                    mimetype: 'audio/mpeg',
                    ptt: true
                }, { quoted: mek });
            }
        }

        // ─────────────────────────────
        // 🧸 2. AUTO STICKER
        // ─────────────────────────────
        if (isEnabled(userConfig.AUTO_STICKER, config.AUTO_STICKER)) {
            const stickerData = loadJSON(path.join(__dirname, '../data/autosticker.json'));
            const stickerKey = Object.keys(stickerData).find(
                k => k.toLowerCase() === textInput
            );
            if (stickerKey) {
                console.log(`[AUTO STICKER] Match: "${stickerKey}"`);
                return await conn.sendMessage(from, {
                    sticker: { url: stickerData[stickerKey] }
                }, { quoted: mek });
            }
        }

        // ─────────────────────────────
        // 💬 3. AUTO REPLY
        // ─────────────────────────────
        if (isEnabled(userConfig.AUTO_REPLY, config.AUTO_REPLY)) {
            const replyData = loadJSON(path.join(__dirname, '../data/autoreply.json'));
            const replyKey = Object.keys(replyData).find(
                k => k.toLowerCase() === textInput
            );
            if (replyKey) {
                console.log(`[AUTO REPLY] Match: "${replyKey}"`);
                return await conn.sendMessage(from, {
                    text: replyData[replyKey]
                }, { quoted: mek });
            }
        }

    } catch (e) {
        console.error('💔 Auto features error:', e.message);
    }
});
