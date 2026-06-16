const { cmd } = require('../inconnuboy');
const axios = require("axios");

// ── MEDIAFIRE DOWNLOADER ──
cmd({
    pattern: 'mediafire',
    alias: ['mfire'],
    desc: 'Download files from MediaFire',
    category: 'download',
    react: '📥'
}, async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const url = args[0];
        if (!url) return reply('*⚠️ Please provide a MediaFire URL.*');

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // Build the API URL
        const apiUrl = `https://ominisave.vercel.app/api/mfire?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result || !data.result.download) {
            return reply('*❌ Unable to fetch the file.*');
        }

        const { fileName, uploaded, fileType, size, download } = data.result;

        // Info Message
        const infoMsg = `*「 DARK DEV MINI : MEDIAFIRE 」*

┌───────────────────┐
  📂 *FILE:* ${fileName}
  📦 *SIZE:* ${size}
  📅 *UP:* ${uploaded}
└───────────────────┘
> *Downloading...*`;

        await reply(infoMsg);

        // Download and Send file
        const fileResponse = await axios.get(download, { responseType: 'arraybuffer' });

        await conn.sendMessage(from, {
            document: Buffer.from(fileResponse.data),
            mimetype: fileType || 'application/octet-stream',
            fileName: fileName,
            caption: `*✅ Successfully downloaded: ${fileName}*`
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error(e);
        reply('*❌ Error: ' + e.message + '*');
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    }
});
