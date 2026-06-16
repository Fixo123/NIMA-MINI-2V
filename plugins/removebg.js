const { cmd } = require('../inconnuboy');
const { removeBackgroundFromImageFile } = require("remove.bg");
const fs = require('fs');
const path = require('path');

// ඔබගේ API Key එක මෙතැනට දමන්න
const REMOVE_BG_API_KEY = "vs8Aiv5Vi76tvYs2xfy8jGzs";

cmd({
    pattern: 'removebg',
    desc: 'Remove background from an image',
    category: 'tools',
    react: '✂️'
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // පින්තූරයක් quote කර තිබේදැයි පරීක්ෂා කිරීම
        if (!quoted || !quoted.imageMessage) return reply('*❌ Please reply to an image to remove its background.*');

        await reply('*⏳ Processing... Please wait.*');

        // පින්තූරය බාගත කර ගැනීම
        const media = await conn.downloadAndSaveMediaMessage(quoted);
        const outputFile = path.join(__dirname, `no-bg-${Date.now()}.png`);

        // Remove.bg API භාවිතා කිරීම
        await removeBackgroundFromImageFile({
            path: media,
            apiKey: REMOVE_BG_API_KEY,
            size: "regular",
            type: "auto",
            outputFile: outputFile
        });

        // පින්තූරය යැවීම
        await conn.sendMessage(from, { image: fs.readFileSync(outputFile) }, { quoted: mek });

        // זמනික ගොනු මකා දැමීම (Clean up)
        fs.unlinkSync(media);
        fs.unlinkSync(outputFile);

    } catch (e) {
        reply('*❌ Error removing background: ' + e.message + '*');
    }
});
