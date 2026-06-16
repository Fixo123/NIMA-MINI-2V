const { cmd } = require('../inconnuboy');

cmd({
    pattern: 'fakereact',
    desc: 'Fake react to a channel message via link',
    category: 'tools',
    react: '🎭'
}, async (conn, mek, m, { args, reply }) => {
    try {
        const link = args[0];
        if (!link) return reply('*❌ Please provide the message link!*');

        // මෙතැනදී link එකෙන් message ID එක extract කරගත යුතුය (Framework එක අනුව මෙය වෙනස් විය හැක)
        // උදාහරණයක් ලෙස:
        const msgKey = link.split('/').pop(); 
        
        const randomCount = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
        const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '🎉'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // අදාළ message එකට react කිරීම
        await conn.sendMessage(link, { // මෙතැනදී link එක භාවිතා කර target එක හඳුනාගන්න
            react: {
                text: randomEmoji,
                key: { remoteJid: link, id: msgKey, fromMe: false }
            }
        });

        await reply(`*✅ Successfully reacted to the message!*\n*Emoji:* ${randomEmoji}\n*Fake Count Simulated:* ~${randomCount}`);
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
