const { cmd } = require('../inconnuboy');

// ── SEND / SAVE MEDIA ──
cmd({
    pattern: 'send',
    alias: ['sendme', 'save'],
    desc: 'Forwards quoted message back to user',
    category: 'tool',
    react: '📤'
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        if (!quoted) return reply('*❌ Please reply to a media message!*');

        const buffer = await quoted.download();
        const mtype = quoted.mtype;
        const options = { quoted: mek };

        let messageContent = {};

        switch (mtype) {
            case "imageMessage":
                messageContent = {
                    image: buffer,
                    caption: quoted.text || '',
                    mimetype: quoted.mimetype || "image/jpeg"
                };
                break;
            case "videoMessage":
                messageContent = {
                    video: buffer,
                    caption: quoted.text || '',
                    mimetype: quoted.mimetype || "video/mp4"
                };
                break;
            case "audioMessage":
                messageContent = {
                    audio: buffer,
                    mimetype: "audio/mp4",
                    ptt: quoted.ptt || false
                };
                break;
            default:
                return reply('*❌ Only image, video, and audio messages are supported.*');
        }

        await conn.sendMessage(from, messageContent, options);
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
