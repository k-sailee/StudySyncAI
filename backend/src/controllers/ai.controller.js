import { openai } from "../config/openai.js";

export const askDoubt = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Received doubt request:", message);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Calling OpenRouter API...");
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

    console.log("OpenRouter response received");
    res.json({
      answer: response.data.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    console.error("Full error:", error);
    res.status(500).json({ error: "AI processing failed", details: error.message });
  }
};
