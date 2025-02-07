import dotenv from "dotenv"

dotenv.config()

const config = {
    port: process.env.PORT || 3000,
    modelPath: process.env.MODEL_PATH || "./models/qna-model.nlp",
    nlpConfig: {
        languages: ["en"],
        threshold: 0.7,
        autoSave: true,
        autoLoad: true,
        modelFileName: "qna-model.nlp",
    },
};

export default config;
