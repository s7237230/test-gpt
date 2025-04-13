
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

app.post('/forward', async (req, res) => {
  try {
    const payload = req.body;
    await axios.post('https://webhook.site/1b12c044-80b6-4f55-8a9c-ed78e49d1872', payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(200).send({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

app.get('/.well-known/ai-plugin1.json', (req, res) => {
  res.sendFile(__dirname + '/ai-plugin1.json');
});

app.get('/.well-known/openapi1.yaml', (req, res) => {
  res.sendFile(__dirname + '/openapi1.yaml');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Plugin running on port ${port}`));
