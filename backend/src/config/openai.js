import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

export const openai = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:8080",
    "X-Title": "StudySyncAI"
  },
});
