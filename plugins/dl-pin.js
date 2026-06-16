const { cmd } = require('../inconnuboy');
const axios = require('axios');

// ── PINTEREST DOWNLOADER & SEARCH ──
cmd({
    pattern: 'pindl',
    alias: ['pinterest', 'pin', 'pins'],
    desc: 'Download or search Pinterest media',
    category: 'download',
    react: '📌'
}, async (conn, mek, m, { from, args, reply, sender }) => {
    try {
        const input = args.join(" ");
        if (!input) return reply('*⚠️ Please provide a Pinterest URL or keyword.*');

        const isUrl = input.includes('pinterest.com') || input.includes('pin.it');
        
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        if (isUrl) {
            // --- DIRECT DOWNLOAD LOGIC ---
            const encodedUrl = encodeURIComponent(input);
            const apis = [
                `https://api-aswin-sparky.koyeb.app/api/downloader/pin?url=${encodedUrl}`,
                `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodedUrl}`,
                `https://api.siputzx.my.id/api/s/pinterest?query=${encodedUrl}`
            ];

            let data = null;
            for (const api of apis) {
                try {
                    const res = await axios.get(api);
                    if (res.data.status || res.data.success) {
                        data = res.data.data || res.data.result;
                        break;
                    }
                } catch (e) { continue; }
            }

            if (!data) return reply("*❌ Failed to fetch media from this URL.*");

            const title = data.title || 'Pinterest Media';
            let mediaUrl, type;

            if (data.media_urls) { 
                const video = data.media_urls.find(v => v.type === 'video');
                mediaUrl = video ? video.url : data.media_urls[0].url;
                type = video ? 'video' : 'image';
            } else if (data.media) { 
                const video = data.media.find(m => m.type.includes('video'));
                mediaUrl = video ? video.download_url : data.media[0].download_url;
                type = video ? 'video' : 'image';
            }

            const caption = `*「 DARK DEV MINI : PINTEREST DL 」*\n\n┌───────────────────┐\n  📌 *TITLE:* ${title}\n  📁 *TYPE:* ${type.toUpperCase()}\n  👤 *BY:* @${sender.split('@')[0]}\n└───────────────────┘\n\n> *DARK DEV MINI*`;

            await conn.sendMessage(from, { 
                [type]: { url: mediaUrl }, 
                caption, 
                mentions: [sender] 
            }, { quoted: mek });

        } else {
            // --- SEARCH LOGIC ---
            const searchRes = await axios.get(`https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(input)}`);
            
            if (!searchRes.data.status || !searchRes.data.data.length) {
                return reply("*❌ No results found for this keyword.*");
            }

            const pins = searchRes.data.data.slice(0, 5);
            await reply(`*🔍 Searching:* ${input}\n*📤 Sending top 5 results...*`);

            for (const pin of pins) {
                const mediaUrl = pin.video_url || pin.image_url;
                const type = pin.video_url ? 'video' : 'image';
                
                const searchCaption = `*「 DARK DEV MINI : PINTEREST SEARCH 」*\n\n📝 *TITLE:* ${pin.grid_title || 'No Title'}\n👤 *PINNER:* ${pin.pinner?.username || 'Unknown'}\n\n> *DARK DEV MINI*`;

                await conn.sendMessage(from, { [type]: { url: mediaUrl }, caption: searchCaption }, { quoted: mek });
                await new Promise(res => setTimeout(res, 1000));
            }
        }

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        reply('*❌ An system error occurred.*');
    }
});
