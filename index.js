// index.js - FINAL VERSION

const express = require('express');
const { nanoid } = require('nanoid'); 
const db = require('./db'); 
const path = require('path'); // <-- ADD THIS LINE

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies from requests
app.use(express.json());

// THIS IS THE MODIFIED LINE - USE AN ABSOLUTE PATH
app.use(express.static(path.join(__dirname, 'public')));

// A simple health check route
app.get('/api/health', (req, res) => {
  res.send({ status: 'ok' });
});

// The shortening endpoint
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }
  const shortCode = nanoid(7);
  try {
    const result = await db.query(
      'INSERT INTO urls(short_code, long_url) VALUES($1, $2) RETURNING short_code',
      [shortCode, longUrl]
    );
    const shortUrl = `${req.protocol}://${req.get('host')}/${result.rows[0].short_code}`;
    res.status(201).json({ shortUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// The redirect handler
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  try {
    const result = await db.query(
      'SELECT long_url FROM urls WHERE short_code = $1',
      [shortCode]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('URL not found');
    }
    const { long_url } = result.rows[0];
    res.redirect(long_url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Starts the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});