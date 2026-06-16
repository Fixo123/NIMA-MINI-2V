const { cmd } = require('../inconnuboy'); // ඔබේ පවතින path එකට අනුව මෙය වෙනස් කරන්න
const axios = require("axios");

// ── GOOGLE DRIVE DOWNLOADER ──
cmd({
    pattern: 'gdrive',
    alias: ['gd'],
    desc: 'Download files from Google Drive.',
    category: 'download',
    react: '📥',
    use: '.gdrive <url>',
    filename: __filename
}, async (conn, mek, m, { from, reply, args, q, sender }) => {
    try {
        const gLink = q || args[0];
        if (!gLink || !gLink.includes("drive.google.com")) {
            return reply('*❌ Please provide a valid Google Drive URL.*');
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // API Call Logic
        let downloadData = null;

        // Protocol 1: NexOracle
        try {
            const res = await axios.get(`https://api.nexoracle.com/downloader/gdrive`, {
                params: { apikey: 'free_key@maher_apis', url: gLink }
            });
            if (res.data?.status === 200) downloadData = res.data.result;
        } catch (e) {}

        // Protocol 2: Visper API
        if (!downloadData) {
            try {
                const res = await axios.get(`https://visper-md-ap-is.vercel.app/download/gdrive?q=${encodeURIComponent(gLink)}`);
                if (res.data.success) downloadData = res.data.result;
            } catch (e) {}
        }

        if (!downloadData) return reply('*❌ Unable to fetch file. Please check permissions.*');

        const { downloadUrl, fileName, fileSize, mimetype } = downloadData;

        const infoMsg = `*「 DARK DEV MINI : G-DRIVE CORE 」*

┌───────────────────┐
  📂 *File:* ${fileName}
  📏 *Size:* ${fileSize || "N/A"}
  📡 *Type:* ${mimetype}
└───────────────────┘`;

        // Send Media
        if (mimetype.startsWith('image')) {
            await conn.sendMessage(from, { image: { url: downloadUrl }, caption: infoMsg }, { quoted: mek });
        } else if (mimetype.startsWith('video')) {
            await conn.sendMessage(from, { video: { url: downloadUrl }, caption: infoMsg }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { 
                document: { url: downloadUrl }, 
                mimetype: mimetype, 
                fileName: fileName, 
                caption: infoMsg 
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
