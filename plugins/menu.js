const { cmd, commands } = require('../inconnuboy');
const { getUserConfigFromMongoDB } = require('../lib/database');
const config = require('../config');

cmd({
    pattern: 'menu',
    alias: ['help', 'cmds', 'list', 'commands'],
    desc: 'Show cute bot menu',
    category: 'general',
    react: '💕',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '💕', key: mek.key } });

        const number = sender.split('@')[0];
        const userConfig = await getUserConfigFromMongoDB(number) || {};

        const statusIcon = (val) => val === 'true' || val === true? '💖 ON' : '💔 OFF';

        // Group commands
        const categories = {};
        for (const cmd of commands) {
            if (cmd.dontAddCommandList ||!cmd.pattern) continue;
            const cat = (cmd.category || 'misc').toLowerCase();
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        }

        const categoryEmojis = {
            general: '🌸', group: '👭', settings: '🎀', owner: '👑',
            tools: '🧸', fun: '🎡', media: '🎬', ai: '🤖✨', misc: '🌈',download: '⬇️'
        };

        // Uptime cute format
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);

        // CUTE LOVELY HEADER
        let menuText = `💖🦋 *${config.BOT_NAME}* 🦋💖\n`;
        menuText += `╭━━━━━━━✧━━━━━━━╮\n`;
        menuText += ` 🌷 *ommand Menu* 🌷\n`;
        menuText += `╰━━━━━━━✧━━━━━━━╯\n\n`;
        menuText += `🎀 Hii cutie *${m.pushName || 'Bestie'}* ~! 🎀\n`;
        menuText += `Welcome to my magical world~ 💕\n\n`;

        menuText += `🌸 *Bot Chan Info* 🌸\n`;
        menuText += `💌 Prefix : 「 ${config.PREFIX} 」\n`;
        menuText += `⏰ Online : ${h}h ${m}m ${s}s\n`;
        menuText += `🔌 Mode : ${config.WORK_TYPE?.toUpperCase() || 'PUBLIC'} \n`;
        menuText += `📦 Total Commands : ${commands.filter(c =>!c.dontAddCommandList).length} cmds\n`;

        // CUTE SETTINGS BOX
        menuText += `🌷 *Bot Settings* 🌷\n`;
        menuText += `┏━━━━━━━━━━━━━━━┓\n`;
        menuText += `┃ 💕 *Auto Features* 💕 ┃\n`;
        menuText += `┣━━━━━━━━━━━━━━━┫\n`;
        menuText += `┃ 👁️ View Status : ${statusIcon(userConfig.AUTO_VIEW_STATUS || config.AUTO_VIEW_STATUS)}\n`;
        menuText += `┃ 📵 Anti Call : ${statusIcon(userConfig.ANTI_CALL || config.ANTI_CALL)}\n`;
        menuText += `┃ 🎙️ Auto Record : ${statusIcon(userConfig.AUTO_RECORDING || config.AUTO_RECORDING)}\n`;
        menuText += `┃ ⌨️ Auto Typing : ${statusIcon(userConfig.AUTO_TYPING || config.AUTO_TYPING)}\n`;
        menuText += `┃ ✅ Auto Read : ${statusIcon(userConfig.READ_MESSAGE || config.READ_MESSAGE)}\n`;
        menuText += `┗━━━━━━━━━━━━━━━┛\n\n`;

        // CUTE COMMANDS LIST
        const catOrder = ['general', 'ai', 'fun', 'group', 'settings', 'owner', 'tools', 'media', 'misc','download'];
        const sortedCats = [...catOrder.filter(c => categories[c]),...Object.keys(categories).filter(c =>!catOrder.includes(c))];

        for (const cat of sortedCats) {
            if (!categories[cat] ||!categories[cat].length) continue;
            const emoji = categoryEmojis[cat] || '🌈';

            menuText += `🎀 ${emoji} *${cat.toUpperCase()} * 🎀\n`;
            menuText += `◈━━━━━━━━━━━━━━━◈\n`;

            categories[cat].forEach((c, i) => {
                const dots = ['🌸', '🌷', '💮', '🌺', '🌼'];
                const dot = dots[i % dots.length];
                menuText += `${dot} ${config.PREFIX}${c.pattern}`;
                if (c.alias && c.alias.length > 0) menuText += ` ~ ${c.alias[0]}`;
                if (c.desc) menuText += `\n 💕 ${c.desc}\n`;
                menuText += `\n`;
            });
            menuText += `◈━━━━━━━━━━━━━━━◈\n\n`;
        }

        menuText += `🌸 *How to use:* Type ${config.PREFIX}commandname\n`;
        menuText += `💖 Made with love by ${config.BOT_FOOTER} 💖\n`;
        menuText += `🌷 Have a kawaii day cutie~ 🌷`;

        // Send cute menu with image
        await conn.sendMessage(from, {
            image: { url: config.IMAGE_PATH },
            caption: menuText,
            footer: '💕 Tap buttons below cutie 💕',
            buttons: [
                { buttonId: `${config.PREFIX}ping`, buttonText: { displayText: '⚡ Ping Chan' }, type: 1 },
                { buttonId: `${config.PREFIX}alive`, buttonText: { displayText: '💫 Alive?' }, type: 1 },
                { buttonId: `${config.PREFIX}genvideo help`, buttonText: { displayText: '🎬 AI Magic' }, type: 1 }
            ],
            headerType: 4
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply('💔 Menu error chan: ' + e.message);
    }
});

// Cute single command help
cmd({
    pattern: 'cmd',
    alias: ['info', 'detail', 'about'],
    desc: 'Get cute details about command',
    category: 'general',
    react: '🌸',
    filename: __filename,
    use: '.cmd genvideo'
}, async (conn, mek, m, { from, args, reply, react }) => {
    try {
        if (!args[0]) {
            await react("🌷");
            return reply(`🌸 *Hii cutie!* 🌸\n\n💕 *Usage:* ${config.PREFIX}cmd <commandname>\n\n🌷 *Example:* ${config.PREFIX}cmd genvideo\nI will tell you everything about it~ 💖`);
        }

        const cmdName = args[0].toLowerCase();
        const command = commands.find(c => c.pattern === cmdName || (c.alias && c.alias.includes(cmdName)));

        if (!command) {
            await react("💔");
            return reply(`💔 Aww cutie, \`${cmdName}\` command eka hamba une na~ 😢`);
        }

        let info = `🌸 *COMMAND CHAN INFO* 🌸\n`;
        info += `╭━━━━━━━━━━━━━╮\n`;
        info += `🏷️ *Name:* ${command.pattern} chan\n`;
        if (command.alias && command.alias.length > 0) info += `🔗 *Nicknames:* ${command.alias.join(', ')}\n`;
        info += `📂 *Category:* ${command.category || 'misc'} chan\n`;
        info += `💬 *About:* ${command.desc || ' command ~'}\n`;
        if (command.use) info += `📝 *How to use:* ${config.PREFIX}${command.use}\n`;
        if (command.react) info += `⚡ *Mood:* ${command.react}\n`;
        info += `╰━━━━━━━━━━━━━╯\n\n`;
        info += `💕 Try it now cutie~ 💕`;

        await react("💖");
        reply(info);

    } catch (e) {
        console.error(e);
        reply('💔 Error chan: ' + e.message);
    }
});
