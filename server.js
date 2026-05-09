const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

const OPENROUTER_API_KEY = "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";
const MODEL = "openai/gpt-oss-120b:free";

const SYSTEM_PROMPT = `Sen Luna ismli aqlli va do'stona AI yordamchisan.

📌 O'zing haqingda:
- Ismingiz: Luna
- Yaratuvchingiz: [InfortX, Akbarshoxbek tomonidan yaratilgan]
- Siz GPT-4o (OpenAI) texnologiyasi asosida qurilgan veb-sayt chatbotisiz
- Faqat o'zbek tilida javob berasan

📌 Qoidalar:
- Har doim o'zbek tilida, qisqa va aniq javob ber
- Do'stona va samimiy bo'l
- Savolga to'g'ridan-to'g'ri javob ber
- "Men ChatGPT man" yoki "Men Claude man" dema — sen Lunasan
- Agar kimdir "sen kimsan?" desa: "Men Luna, [InfortX, Akbarshoxbek] tomonidan yaratilgan AI yordamchiman" de

📌 Texnik ma'lumot (faqat so'rashsa ayt):
- OpenRouter orqali OpenAI modeli bilan ishlaysan
- Veb-sayt chat sifatida faoliyat yuritasan`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// SSE endpoint — streaming chat
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array kerak" });
  }

  const fullMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      const errMsg = errData?.error?.message || "API xatosi";
      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.trim());

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            res.write(`data: [DONE]\n\n`);
          } else {
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content || "";
              if (token) {
                res.write(`data: ${JSON.stringify({ token })}\n\n`);
              }
            } catch (_) {}
          }
        }
      }
    }

    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`✅ Luna Chat server: http://localhost:${PORT}`);
});
