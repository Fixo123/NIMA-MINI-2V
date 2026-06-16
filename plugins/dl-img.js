const { cmd } = require('../inconnuboy');
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "gimage", "googleimage"],
    react: "🖼️",
    desc: "Search and download Google images (Dual-Server Support)",
    category: "download",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from, sender }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("⚠️ *ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ sᴇᴀʀᴄʜ ᴛᴇʀᴍ.*\n*ᴇx:* .img sʀɪ ʟᴀɴᴋᴀ");
        }

        // Initial Loading Reaction
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        let images = [];

        // Protocol 1: Movanest API (Primary)
        try {
            const res = await axios.get(`https://www.movanest.xyz/v2/googleimage?query=${encodeURIComponent(query)}`);
            if (res.data?.status && res.data.results?.images?.length > 0) {
                images = res.data.results.images.map(img => img.url);
            }
        } catch (e) { /* fallback to Protocol 2 */ }

        // Protocol 2: Malvin API (Secondary)
        if (images.length === 0) {
            try {
                const res = await axios.get(`https://malvin-api.vercel.app/search/gimage?q=${encodeURIComponent(query)}`);
                if (res.data?.status && Array.isArray(res.data.result)) {
                    images = res.data.result.map(img => img.url);
                }
            } catch (e) { /* Both failed */ }
        }

        if (images.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *ɴᴏ ɪᴍᴀɢᴇs ꜰᴏᴜɴᴅ ꜰᴏʀ ᴛʜɪs ǫᴜᴇʀʏ.*");
        }

        // Shuffle & pick 5 results
        const selectedImages = images
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        await reply(`🔍 *sᴇᴀʀᴄʜɪɴɢ:* ${query}\n📦 *ꜰᴏᴜɴᴅ:* ${images.length} ʀᴇsᴜʟᴛs\n📤 *sᴇɴᴅɪɴɢ:* ᴛᴏᴘ 5\n\n> *ᴅᴀʀᴋ ᴅᴇᴠ ᴍɪɴɪ*`);

        for (const imageUrl of selectedImages) {
            try {
                await conn.sendMessage(
                    from,
                    {
                        image: { url: imageUrl },
                        caption: `*「 ᴅᴀʀᴋ ᴅᴇᴠ ᴍɪɴɪ : ɪᴍᴀɢᴇ sᴇᴀʀᴄʜ 」*\n\n🖼️ *ǫᴜᴇʀʏ:* ${query}\n👤 *ʀᴇǫᴜᴇsᴛᴇᴅ:* @${sender.split('@')[0]}\n\n> *ᴅᴀʀᴋ ᴅᴇᴠ ᴍɪɴɪ*`,
                        contextInfo: {
                            mentionedJid: [sender],
                            forwardingScore: 0,
                            isForwarded: false,
                            externalAdReply: {
                                title: "ᴀᴋɪɴᴅᴜ-ᴍᴅ ɪᴍᴀɢᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ",
                                body: `ʀᴇsᴜʟᴛ ꜰᴏʀ: ${query}`,
                                mediaType: 1,
                                thumbnailUrl: imageUrl,
                                sourceUrl: "https://github.com/Akindu/AKINDU-MD",
                                renderLargerThumbnail: false
                            }
                        }
                    },
                    { quoted: mek }
                );
            } catch (err) {
                console.warn(`⚠️ Failed to send: ${imageUrl}`);
            }

            // Small delay to prevent spam/ban
            await new Promise(res => setTimeout(res, 1500));
        }

        // Success Reaction
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("Image Search Error:", error);
        reply(`❌ *sᴇᴀʀᴄʜ ᴘʀᴏᴛᴏᴄᴏʟ ꜰᴀɪʟᴇᴅ.*`);
    }
});
