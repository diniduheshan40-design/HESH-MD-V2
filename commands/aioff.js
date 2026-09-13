const { setAiStatus } = require('../ai');
module.exports = {
    name: 'aioff',
    async execute(sock, msg, args, sender) {
        await setAiStatus(false);
        await sock.sendMessage(sender, { text: "*❌ AI System අක්‍රිය කරන ලදී!*" }, { quoted: msg });
    }
};

