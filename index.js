const express = require('express');
const { nanoid } = require('nanoid'); 
const db = require('./db'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies from requests
app.use(express.json());
app.use(express.static('public'));

// A simple health check route (good to keep for testing)
app.get('/api/health', (req, res) => {
  res.send({ status: 'ok' });
});


// The shortening endpoint - THIS IS THE NEW FEATURE
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;

  // Basic validation to make sure a URL was sent
  if (!longUrl) {
    return res.status(400).json({ error: 'longUrl is required' });
  }

  // Generate a unique short code of 7 characters
  const shortCode = nanoid(7);

  try {
    // Insert the new short code and the original long URL into the database
    const result = await db.query(
      'INSERT INTO urls(short_code, long_url) VALUES($1, $2) RETURNING short_code',
      [shortCode, longUrl]
    );
    
    // Construct the full short URL to send back to the user
    const shortUrl = `${req.protocol}://${req.get('host')}/${result.rows[0].short_code}`;
    
    // Send a "201 Created" response with the new URL
    res.status(201).json({ shortUrl });
  } catch (error) {
    // If anything goes wrong with the database, send a server error
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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