const { cmd } = require('../inconnuboy');

// ── SAVE MESSAGE (FORWARD TO DM) ──
cmd({
    pattern: 'save',
    alias: ["vv6", "vv", "❤️", "🤠", "😀", "🥹", "😇", "👍", "🤩", "😍"],
    desc: 'Forwards quoted message to your DM',
    category: 'tool',
    react: '🪀'
}, async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    try {
        if (!isOwner) return reply('*❌ Only owner can use this.*');
        if (!quoted) return reply('*🍁 Please reply to a message!*');

        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        const buffer = await quoted.download();
        const mtype = quoted.mtype;

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

        // Send to owner's DM
        await conn.sendMessage(botNumber, messageContent);
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
