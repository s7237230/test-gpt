const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// ✅ CORS - לאפשר גישה מבחוץ (כולל GPT)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post('/forward', async (req, res) => {
  const payload = req.body;
  console.log("📥 Payload received:\n", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(
      'https://webhook.site/1b12c044-80b6-4f55-8a9c-ed78e49d1872',
      payload,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log("✅ Forwarded successfully! Status:", response.status);
    res.status(200).send({ success: true });

  } catch (err) {
    console.error("❌ Forwarding failed:");
    console.error("Full Error:", err);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    res.status(500).send({ success: false, error: err.message });
  }
});

// 🔎 מסלולים עבור הפלאגין
app.get('/.well-known/ai-plugin1.json', (req, res) => {
  res.sendFile(__dirname + '/ai-plugin1.json');
});

app.get('/.well-known/openapi1.yaml', (req, res) => {
  res.sendFile(__dirname + '/openapi1.yaml');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Plugin running on port ${port}`));
