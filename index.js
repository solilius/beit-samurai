const express = require('express');
const readSpreadsheet = require('./google-api');  // Use require to import the function

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/available-beds', async (req, res) => {
    const months = req.query.months.split(',');
    const bookings = await readSpreadsheet(months);
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
