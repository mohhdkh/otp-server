import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API لإرسال OTP
app.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const response = await fetch("https://api.elasticemail.com/v2/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        apikey: process.env.ELASTIC_API_KEY,
        subject: "رمز التحقق - Najdah App",
        from: "your_email@yourdomain.com", // بريدك الموثق في Elastic Email
        to: email,
        bodyHtml: `<h2>رمز التحقق: <b>${otp}</b></h2>`,
        bodyText: `رمز التحقق الخاص بك هو: ${otp}`,
        isTransactional: "true"
      }),
    });

    const data = await response.json();
    if (data.success) {
      res.json({ success: true, message: "✅ OTP تم إرساله" });
    } else {
      res.status(400).json({ success: false, error: data.error });
    }
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 OTP Server running on http://localhost:${PORT}`)
);
