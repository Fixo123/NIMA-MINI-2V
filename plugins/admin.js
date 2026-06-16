const { cmd } = require('../inconnuboy');

// ── PROMOTE ADMIN ──
cmd({
    pattern: 'promote',
    alias: ['admin'],
    desc: 'Promote user to admin role',
    category: 'group',
    react: '👑'
}, async (conn, mek, m, { from, isGroup, isBotAdmins, isAdmins, isOwner, groupAdmins, mentionedJid, quoted, reply }) => {
    try {
        if (!isGroup) return reply('*❌ Group only command.*');
        if (!isOwner && !isAdmins) return reply('*❌ Only admins can promote users.*');
        if (!isBotAdmins) return reply('*❌ I need to be an admin to promote users.*');

        // පරිශීලකයා හඳුනා ගැනීම (Mention කර ඇති අය හෝ Reply කර ඇති අය)
        const target = mentionedJid[0] || (quoted ? quoted.sender : null);
        if (!target) return reply('*❌ Please mention or reply to a user to promote.*');

        if (groupAdmins.includes(target)) return reply('*❌ User is already an admin.*');

        // Admin ලබා දීම
        await conn.groupParticipantsUpdate(from, [target], 'promote');
        await reply(`*👑 @${target.split('@')[0]} has been promoted to admin.*`);
        
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
