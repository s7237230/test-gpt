const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// ✅ Middleware CORS – מאפשר קריאות מבחוץ כולל GPT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ✅ הנתיב הראשי
app.post('/forward', async (req, res) => {
  const payload = req.body;
  console.log('📥 קיבלתי בקשה מ-GPT:');
  console.log(JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post('https://webhook.site/1b12c044-80b6-4f55-8a9c-ed78e49d1872', payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('📤 התשובה מ־Webhook:');
    console.log(response.data);

    res.status(200).send({ success: true, response: response.data });
  } catch (err) {
    console.error('❌ שגיאה בשליחה ל־Webhook:');
    console.error(err.message);
    if (err.response) {
      console.error('📄 תגובת שגיאה מהשרת:');
      console.error(err.response.data);
    }
    res.status(500).send({ success: false, error: err.message });
  }
});

// ✅ מסלולים לפלאגין
app.get('/.well-known/ai-plugin1.json', (req, res) => {
  res.sendFile(__dirname + '/ai-plugin1.json');
});

app.get('/.well-known/openapi1.yaml', (req, res) => {
  res.sendFile(__dirname + '/openapi1.yaml');
});

// ✅ מאזין לשרת
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Plugin running on port ${port}`);
});
