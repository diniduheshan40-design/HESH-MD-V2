const { setAiStatus } = require('../ai');
module.exports = {
    name: 'aion',
    async execute(sock, msg, args, sender) {
        await setAiStatus(true);
        await sock.sendMessage(sender, { text: "*✅ AI System සක්‍රිය කරන ලදී!* දැන් .ai මගින් ප්‍රශ්න ඇසිය හැක." }, { quoted: msg });
    }
};

