import { openai } from "../config/openai.js";

export const askDoubt = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await openai.post("/chat/completions", {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI tutor. Explain concepts clearly in simple language."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    res.json({
      answer: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    res.status(500).json({ error: "AI processing failed" });
  }
};
