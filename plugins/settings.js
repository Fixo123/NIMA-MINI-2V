const { cmd } = require('../inconnuboy');
const { getUserConfigFromMongoDB, updateUserConfigInMongoDB } = require('../lib/database');

// Helper - toggle karana function
async function toggleSetting(sender, key, action, reply, onText, offText) {
    const number = sender.split('@')[0];
    const userConfig = await getUserConfigFromMongoDB(number);

    if (!action ||!['on', 'off'].includes(action)) {
        const current = userConfig[key] === 'true';
        return reply(`📌 *Current:* ${current? 'ON ✅' : 'OFF ❌'}\n\nUse: *.command on/off*`);
    }

    const newVal = action === 'on';
    userConfig[key] = String(newVal);
    await updateUserConfigInMongoDB(number, userConfig);

    reply(newVal? onText : offText);
}

// 1. Admin Events
cmd({
    pattern: "admin-events",
    alias: ["adminevents"],
    desc: "Enable/disable admin event notifications",
    category: "settings",
    react: "👑"
}, async(conn, mek, m, { from, sender, args, reply, isCreator }) => {
    if (!isCreator) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'ADMIN_EVENTS', args[0], reply,
        '*👑 Admin Events: ENABLED ✅*\n\nAdmin join/leave events now notified.',
        '*👑 Admin Events: DISABLED ❌*'
    );
});

// 2. Welcome
cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable/disable welcome messages",
    category: "settings",
    react: "👋"
}, async(conn, mek, m, { from, sender, args, reply, isCreator }) => {
    if (!isCreator) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'WELCOME', args[0], reply,
        '*👋 Welcome: ENABLED ✅*\n\nNew member welcome messages ON.',
        '*👋 Welcome: DISABLED ❌*'
    );
});

// 3. Auto Typing
cmd({
    pattern: "auto_typing",
    alias: ["autotyping"],
    desc: "Enable/disable auto typing",
    category: "settings",
    react: "⌨️"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_TYPING', args[0], reply,
        '*⌨️ Auto Typing: ENABLED ✅*',
        '*⌨️ Auto Typing: DISABLED ❌*'
    );
});

// 4. Always Online
cmd({
    pattern: "always_online",
    alias: ["alwaysonline"],
    desc: "Enable/disable always online",
    category: "settings",
    react: "🟢"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'ALWAYS_ONLINE', args[0], reply,
        '*🟢 Always Online: ENABLED ✅*',
        '*🟢 Always Online: DISABLED ❌*'
    );
});

// 5. Auto Recording
cmd({
    pattern: "auto_recording",
    alias: ["autorecording"],
    desc: "Enable/disable auto recording",
    category: "settings",
    react: "🎙️"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_RECORDING', args[0], reply,
        '*🎙️ Auto Recording: ENABLED ✅*',
        '*🎙️ Auto Recording: DISABLED ❌*'
    );
});

// 6. Status View
cmd({
    pattern: "status_view",
    alias: ["auto_status_seen"],
    desc: "Enable/disable auto status view",
    category: "settings",
    react: "👁️"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_STATUS_SEEN', args[0], reply,
        '*👁️ Auto View Status: ENABLED ✅*',
        '*👁️ Auto View Status: DISABLED ❌*'
    );
});

// 7. Status React
cmd({
    pattern: "status_react",
    alias: ["statusreact"],
    desc: "Enable/disable auto status react",
    category: "settings",
    react: "❤️"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_STATUS_REACT', args[0], reply,
        '*❤️ Auto Status React: ENABLED ✅*',
        '*❤️ Auto Status React: DISABLED ❌*'
    );
});

// 8. Read Message
cmd({
    pattern: "read_message",
    alias: ["autoread"],
    desc: "Enable/disable auto read messages",
    category: "settings",
    react: "✅"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'READ_MESSAGE', args[0], reply,
        '*✅ Auto Read: ENABLED ✅*\n\nBlue ticks ON.',
        '*✅ Auto Read: DISABLED ❌*'
    );
});

// 9. Auto Sticker
cmd({
    pattern: "auto_sticker",
    alias: ["autosticker"],
    desc: "Enable/disable auto sticker",
    category: "settings",
    react: "🎨"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_STICKER', args[0], reply,
        '*🎨 Auto Sticker: ENABLED ✅*',
        '*🎨 Auto Sticker: DISABLED ❌*'
    );
});

// 10. Auto Reply
cmd({
    pattern: "auto_reply",
    alias: ["autoreply"],
    desc: "Enable/disable auto reply",
    category: "settings",
    react: "💬"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_REPLY', args[0], reply,
        '*💬 Auto Reply: ENABLED ✅*',
        '*💬 Auto Reply: DISABLED ❌*'
    );
});

// 11. Auto Voice
cmd({
    pattern: "auto_voice",
    alias: ["autovoice"],
    desc: "Enable/disable auto voice",
    category: "settings",
    react: "🔊"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_VOICE', args[0], reply,
        '*🔊 Auto Voice: ENABLED ✅*',
        '*🔊 Auto Voice: DISABLED ❌*'
    );
});

// 12. Auto React
cmd({
    pattern: "auto_react",
    alias: ["autoreact", "areact"],
    desc: "Enable/disable auto react",
    category: "settings",
    react: "⚡"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_REACT', args[0], reply,
        '*⚡ Auto React: ENABLED ✅*',
        '*⚡ Auto React: DISABLED ❌*'
    );
});

// 13. Custom React
cmd({
    pattern: "custom_reacts",
    alias: ["heartreact"],
    desc: "Enable/disable custom heart react",
    category: "settings",
    react: "💖"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'CUSTOM_REACT', args[0], reply,
        '*💖 Heart React: ENABLED ✅*',
        '*💖 Heart React: DISABLED ❌*'
    );
});

// 14. Anti Link
cmd({
    pattern: "anti_link",
    alias: ["antilink", "anti"],
    desc: "Enable/disable anti link",
    category: "settings",
    react: "🔗"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'ANTI_LINK', args[0], reply,
        '*🔗 Anti Link: ENABLED ✅*\n\nLinks will be deleted.',
        '*🔗 Anti Link: DISABLED ❌*'
    );
});

// 15. Anti Bad
cmd({
    pattern: "anti_bad",
    alias: ["antibad"],
    desc: "Enable/disable anti bad words",
    category: "settings",
    react: "🚫"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'ANTI_BAD', args[0], reply,
        '*🚫 Anti Bad Word: ENABLED ✅*',
        '*🚫 Anti Bad Word: DISABLED ❌*'
    );
});

// 16. Status Reply
cmd({
    pattern: "status_reply",
    alias: ["autostatusreply"],
    desc: "Enable/disable auto status reply",
    category: "settings",
    react: "💌"
}, async(conn, mek, m, { from, sender, args, reply, isOwner }) => {
    if (!isOwner) return reply("📛 *Owner witharak*");
    await toggleSetting(sender, 'AUTO_STATUS_REPLY', args[0], reply,
        '*💌 Auto Status Reply: ENABLED ✅*',
        '*💌 Auto Status Reply: DISABLED ❌*'
    );
});