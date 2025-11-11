// src/entities/chatbot/model.js
import { chatbotApi } from "./api";

export const chatbotService = {
  initialize: () => chatbotApi.initialize(),
  ask: (q) => chatbotApi.chat(q),
};
