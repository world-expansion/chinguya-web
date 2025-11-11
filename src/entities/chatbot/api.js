// src/entities/chatbot/api.js
import { CHATBOT_BASE } from "../../shared/config/env";
import { post } from "../../shared/api/http";

export const chatbotApi = {
  initialize() {
    // 관리자용(글로벌 초기화): POST /api/chatbot/initialize
    return post(`${CHATBOT_BASE}/initialize`, {});
  },
  chat(question) {
    // 테스트용: POST /api/chatbot/chat { question }
    return post(`${CHATBOT_BASE}/chat`, { question });
  },
};
