const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

// --- HELPER FOR CLEAN CONTEXT ---
const cleanContext = (sender) => ({
    mentionedJid: [sender],
    forwardingScore: 0,
    isForwarded: false
});

// 1. CHAT OPENAI
cmd({
    pattern: "ai",
    desc: "Chat with an AI model",
    category: "tools",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply('*⚠️ Please provide a message.*\n\n*DARK DEV MINI*');
        await react("⏳");

        const apiUrl = `https://apis.sandarux.sbs/api/ai/chatopenai?apikey=darknero&text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.answer) throw new Error("API failed");

        const response = `*「 DARK DEV MINI : AI CHAT 」*\n\n┌───────────────────┐\n${data.answer}\n└───────────────────┘\n> *DARK DEV MINI*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply('*❌ Error: ' + e.message + '*');
    }
});

// 2. OPENAI (SUPUN API)
cmd({
    pattern: "openai",
    desc: "Chat with OpenAI",
    category: "ai",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply('*⚠️ Please provide a query.*\n\n*DARK DEV MINI*');
        await react("⏳");

        const apiUrl = `https://supun-md-api-xmjh.vercel.app/api/ai/openai?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.results) throw new Error("OpenAI failed");

        const response = `*「 DARK DEV MINI : OPENAI 」*\n\n┌───────────────────┐\n${data.results}\n└───────────────────┘\n> *DARK DEV MINI*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply('*❌ Error: ' + e.message + '*');
    }
});

// 3. VENICE (MISTRAL 24B)
cmd({
    pattern: "venice",
    desc: "Chat with Venice AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply('*⚠️ Please provide a query.*\n\n*DARK DEV MINI*');
        await react("⏳");

        const apiUrl = `https://malvin-api.vercel.app/ai/venice?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result) throw new Error("Venice failed");

        const response = `*「 DARK DEV MINI : VENICE AI 」*\n\n┌───────────────────┐\n${data.result}\n└───────────────────┘\n> *DARK DEV MINI*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply('*❌ Error: ' + e.message + '*');
    }
});

// 4. COPILOT (STANDARD)
cmd({
    pattern: "copilot",
    desc: "Chat with Copilot",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply('*⚠️ Please provide input.*\n\n*DARK DEV MINI*');
        await react("⏳");

        const apiUrl = `https://malvin-api.vercel.app/ai/copilot?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result) throw new Error("Copilot failed");

        const response = `*「 DARK DEV MINI : COPILOT 」*\n\n┌───────────────────┐\n${data.result}\n└───────────────────┘\n⌚ *Time:* ${data.response_time}\n> *DARK DEV MINI*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply('*❌ Error: ' + e.message + '*');
    }
});

// 5. GPT-5 (COPILOT ENGINE)
cmd({
    pattern: "gpt",
    desc: "Chat with GPT-5 Engine",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, react, sender }) => {
    try {
        if (!q) return reply('*⚠️ Please provide a question.*\n\n*DARK DEV MINI*');
        await react("⏳");

        const apiUrl = `https://malvin-api.vercel.app/ai/gpt-5?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result) throw new Error("GPT-5 failed");

        const response = `*「 DARK DEV MINI : GPT-5 CORE 」*\n\n┌───────────────────┐\n${data.result}\n└───────────────────┘\n⌚ *Time:* ${data.response_time}\n> *DARK DEV MINI*`;

        await conn.sendMessage(from, { text: response, contextInfo: cleanContext(sender) }, { quoted: mek });
        await react("✅");
    } catch (e) {
        await react("❌");
        reply('*❌ Error: ' + e.message + '*');
    }
});
