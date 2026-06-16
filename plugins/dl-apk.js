const { cmd } = require('../inconnuboy');
const axios = require("axios");

// ── APK DOWNLOADER ──
cmd({
  pattern: "apk",
  alias: ["getapk", "app"],
  react: '📦',
  desc: "Universal APK Downloader",
  category: "download",
  use: ".apk <app name>",
}, async (conn, mek, m, { from, reply, args, sender }) => {
  try {
    const q = args.join(" ");
    if (!q) return reply('⚠️ *Please provide an app name.*\n\n*Example: .apk whatsapp*');

    await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

    let appData = null;
    let source = "NexOracle";

    // Try Source 1: NexOracle
    try {
      const res = await axios.get(`https://api.nexoracle.com/downloader/apk`, {
        params: { apikey: 'free_key@maher_apis', q }
      });
      if (res.data?.status === 200 && res.data.result) {
        const r = res.data.result;
        appData = {
          name: r.name,
          size: r.size,
          upd: r.lastup,
          icon: r.icon,
          dl: r.dllink
        };
      }
    } catch (e) { /* fallback to next source */ }

    // Try Source 2: Aptoide (if Source 1 failed)
    if (!appData) {
      try {
        const res = await axios.get(`http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`);
        if (res.data?.datalist?.list?.length) {
          const r = res.data.datalist.list[0];
          source = "Aptoide";
          appData = {
            name: r.name,
            size: (r.size / 1048576).toFixed(2) + " MB",
            upd: r.updated,
            icon: r.icon,
            dl: r.file.path_alt
          };
        }
      } catch (e) { /* both failed */ }
    }

    if (!appData) return reply('❌ *App not found in any database.*');

    // UI Message
    const infoMsg = `
*「 APK CORE 」*

┌───────────────────┐
  📦 *App:* ${appData.name}
  📏 *Size:* ${appData.size}
  📅 *Updated:* ${appData.upd}
  📡 *Source:* ${source}
└───────────────────┘`;

    // Send Icon/Info
    await conn.sendMessage(from, {
      image: { url: appData.icon },
      caption: infoMsg,
      contextInfo: { mentionedJid: [sender] }
    }, { quoted: mek });

    // Send APK File
    await conn.sendMessage(from, {
      document: { url: appData.dl },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${appData.name}.apk`,
      caption: `*✅ Successfully downloaded: ${appData.name}*`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

  } catch (error) {
    reply('❌ *Download failed: ' + error.message + '*');
  }
});
