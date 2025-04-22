const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your actual API keys
const GET_API_KEY_contractors = 'f0ff47e1026eba404111d5b9b5f3c794876c9de6';
const POST_API_KEY_clients = '26ba9cb1b455fad1256c9639deceef185a6d4e39';
const POST_API_KEY_enquiry = '26ba9cb1b455fad1256c9639deceef185a6d4e39';

// GET /contractors
app.get('/contractors', async (req, res) => {
  try {
    const response = await axios.get('https://secure.tutorcruncher.com/api/contractors/', {
      headers: {
        Authorization: `Token ${GET_API_KEY_contractors}`, // Capital 'T' in Token ✅
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// POST /clients
app.post('/clients', async (req, res) => {
  try {
    const response = await axios.post(
      'https://secure.tutorcruncher.com/api/clients/',
      req.body,
      {
        headers: {
          Authorization: `Token ${POST_API_KEY_clients}`, // Capital 'T' in Token ✅
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('POST /clients error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

app.listen(3001, () => {
  console.log('✅ Proxy server running at http://localhost:3001');
});
