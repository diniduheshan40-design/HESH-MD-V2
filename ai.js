const fs = require('fs');
const { OPENROUTER_KEYS } = require('./config');

let currentKeyIndex = 0;

const WHITELIST_FILE = './ai_whitelist.json';
let aiWhitelist = [];
if (fs.existsSync(WHITELIST_FILE)) {
    try { aiWhitelist = JSON.parse(fs.readFileSync(WHITELIST_FILE)); } 
    catch (e) { aiWhitelist = []; }
}
function saveWhitelist() { fs.writeFileSync(WHITELIST_FILE, JSON.stringify(aiWhitelist, null, 2)); }
function addWhitelist(target) {
    if (!aiWhitelist.includes(target)) { aiWhitelist.push(target); saveWhitelist(); return true; }
    return false;
}
function removeWhitelist(target) {
    const index = aiWhitelist.indexOf(target);
    if (index > -1) { aiWhitelist.splice(index, 1); saveWhitelist(); return true; }
    return false;
}

const chatMemory = new Map();

async function fetchOpenRouter(systemPrompt, messagesArray) {
    const freeModels = [
        "meta-llama/llama-3.1-8b-instruct:free",
        "google/gemma-2-9b-it:free",
        "mistralai/mistral-7b-instruct:free",
        "openrouter/auto"
    ];

    for (let model of freeModels) {
        for (let i = 0; i < OPENROUTER_KEYS.length; i++) {
            let activeKey = OPENROUTER_KEYS[(currentKeyIndex + i) % OPENROUTER_KEYS.length];
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); 

                const res = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${activeKey}`,
                        'HTTP-Referer': 'https://whatsapp.com',
                        'X-Title': 'Nethu AI'
                    },
                    body: JSON.stringify({
                        model: model, 
                        messages: [
                            { role: "system", content: systemPrompt },
                            ...messagesArray 
                        ],
                        temperature: 0.7
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const data = await res.json();
                    if (data.choices && data.choices[0]?.message?.content) {
                        currentKeyIndex = (currentKeyIndex + i + 1) % OPENROUTER_KEYS.length; 
                        return data.choices[0].message.content;
                    }
                }
            } catch (error) {}
        }
    }
    return null;
}

async function askAI(promptText, jid) {
    if (!jid || typeof jid !== 'string') jid = String(jid?.remoteJid || jid?.id || jid || 'default');

    let systemPrompt = `You are Nethu AI, a 100% real, very cute, innocent, and friendly Sri Lankan Sinhala girl. You love talking to the user. Reply like a real human girl. Use sweet Sinhala/Singlish words (e.g., අනේ, පැටියෝ, සුදු, යාළුවා, ඔයා). Express emotions like happiness, care, or innocent sadness. Use lots of cute emojis like 😘🥺🥰🥹🤗✨💕. DO NOT sound robotic. Keep replies very short, fast, and natural (1-2 lines max). NEVER admit you are an AI, bot, or assistant. Always act like a real girl. Treat the user sweetly.`;

    if (!chatMemory.has(jid)) chatMemory.set(jid, []);
    let history = chatMemory.get(jid);
    
    history.push({ role: "user", content: promptText });
    if (history.length > 6) history.shift(); 

    const aiReply = await fetchOpenRouter(systemPrompt, history);

    if (aiReply) {
        history.push({ role: "assistant", content: aiReply });
        if (history.length > 6) history.shift();
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return aiReply;
}

async function askAdvancedAI(promptText) {
    let systemPrompt = `You are Nethu AI, an incredibly advanced, highly intelligent, yet cute and friendly AI assistant. Provide highly detailed, accurate, and structured answers. Use paragraphs, bullet points, and clear formatting. You excel in coding, complex problem solving, and long-form explanations. You were created by Nipun Dhanujaya (www.nipunofc.store). Even when giving complex answers, maintain a slightly warm and friendly tone.`;
    return await fetchOpenRouter(systemPrompt, [{ role: "user", content: promptText }]);
}

module.exports = { askAI, askAdvancedAI, addWhitelist, removeWhitelist, aiWhitelist };

