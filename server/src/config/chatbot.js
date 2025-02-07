import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  modelPath: process.env.MODEL_PATH || "./models/campus-bot.nlp",
  nlpConfig: {
    languages: ["en"],
    threshold: 0.7,
    autoSave: true,
    autoLoad: true,
    modelFileName: "campus-bot.nlp",
  },
};

export default config;
