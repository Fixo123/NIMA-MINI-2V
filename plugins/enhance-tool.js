const { cmd } = require('../inconnuboy'); // ඔබේ file path එක අනුව වෙනස් කරගන්න
const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");

// ── REMINI (ENHANCE) ──
cmd({
    pattern: 'remini',
    alias: ['enhance', 'hd', 'clair'],
    desc: 'Enhance photo quality using Remini AI',
    category: 'utility',
    react: '✨'
}, async (conn, mek, m, { from, quoted, reply }) => {
    try {
        const quotedMsg = quoted || mek;
        const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
        
        if (!mimeType || !mimeType.startsWith('image/')) {
            return reply("*❌ Please reply to an image file.*");
        }

        const mediaBuffer = await quotedMsg.download();
        let extension = mimeType.includes('image/png') ? '.png' : '.jpg';
        const tempFilePath = path.join(os.tmpdir(), `remini_${Date.now()}${extension}`);
        fs.writeFileSync(tempFilePath, mediaBuffer);

        await reply("*🔄 Enhancing image quality... Please wait.*");

        // Upload to Catbox
        const form = new FormData();
        form.append('fileToUpload', fs.createReadStream(tempFilePath));
        form.append('reqtype', 'fileupload');

        const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders()
        });

        const imageUrl = uploadResponse.data;
        fs.unlinkSync(tempFilePath); // Delete temp file

        if (!imageUrl) throw new Error("Failed to upload image.");

        // Enhance via API
        const apiUrl = `https://apis.davidcyriltech.my.id/remini?url=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });

        // Send Result
        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: "*✅ Image enhanced successfully!*",
        }, { quoted: mek });

    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
