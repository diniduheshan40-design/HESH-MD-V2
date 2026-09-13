module.exports = {
    // Database URL
    MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://kethmi12345_db_user:nipun1234@cluster0.3fhoect.mongodb.net/",
    
    // AI API Keys (Render Environment එකෙන් පමණක් ලබාගනී)
    OPENROUTER_KEYS: [process.env.OPENROUTER_API_KEY],
    
    // File Paths
    FILES: {
        PERSONAS: './bot_personas.json',
        PROMPTS: './custom_prompts.json'
    },
    
    // Bot Details
    BOT_NAME: "HESH-MD V2",
    OWNER_NUMBER: "94719845166"
};

