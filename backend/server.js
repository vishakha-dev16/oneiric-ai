import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const HF_API_KEY = process.env.HF_API_KEY;

app.get("/", (req, res) => {
  res.send("Oneiric AI Backend is running 🚀");
});

app.post("/decode", async (req, res) => {
  const { dream } = req.body;

  try {
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        inputs: `Interpret this dream in a calm, psychological way:\n${dream}`,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      result:
        response.data?.[0]?.generated_text ||
        response.data?.generated_text ||
        "No response from AI",
    });
  } catch (error) {
    console.error("HF ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: "AI could not decode your dream.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
