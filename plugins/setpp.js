const { cmd } = require('../inconnuboy');
const fs = require('fs');
const Jimp = require('jimp'); // image resize සඳහා මෙය අවශ්‍ය වේ (npm install jimp)

cmd({
    pattern: 'setpp',
    desc: 'Set bot profile picture',
    category: 'owner',
    react: '🖼️'
}, async (conn, mek, m, { from, isOwner, reply, quoted }) => {
    try {
        if (!isOwner) return reply('*❌ Only owner can use this command.*');
        
        // පණිවිඩයේ පින්තූරයක් තිබේදැයි පරීක්ෂා කිරීම
        const isQuotedImage = mek.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
        const isImage = mek.message.imageMessage;
        
        if (!isImage && !isQuotedImage) return reply('*❌ Please reply to an image.*');

        const media = await conn.downloadAndSaveMediaMessage(isQuotedImage ? mek.quoted : mek);
        
        // පින්තූරය WhatsApp profile වලට ගැලපෙන ලෙස Resize කිරීම (720x720)
        const image = await Jimp.read(media);
        await image.cover(720, 720).writeAsync('temp_pp.jpg');

        // profile picture එක update කිරීම
        await conn.updateProfilePicture(conn.user.id, { url: 'temp_pp.jpg' });
        
        // තාවකාලික ගොනුව මැකීම
        fs.unlinkSync(media);
        fs.unlinkSync('temp_pp.jpg');

        reply('*✅ Profile picture updated successfully!*');
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
