const { cmd } = require('../inconnuboy');

cmd({
    pattern: 'fakevote',
    desc: 'Simulate fake votes for a poll (100-700)',
    category: 'tools',
    react: '📊'
}, async (conn, mek, m, { args, reply }) => {
    try {
        const link = args[0];
        if (!link) return reply('*❌ Please provide the poll message link!*');

        // 100 සිට 700 දක්වා අහඹු අගයන් 3ක් උදාහරණයකට
        const vote1 = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
        const vote2 = Math.floor(Math.random() * (700 - 100 + 1)) + 100;
        const vote3 = Math.floor(Math.random() * (700 - 100 + 1)) + 100;

        const resultText = `
*📊 Poll Fake Results Simulation*

*Option 1:* ${vote1} votes
*Option 2:* ${vote2} votes
*Option 3:* ${vote3} votes

*Total Simulated:* ${vote1 + vote2 + vote3} votes
*Status:* Successfully generated fake data for link provided.`;

        await reply(resultText);
    } catch (e) {
        reply('*❌ Error: ' + e.message + '*');
    }
});
