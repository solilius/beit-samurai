import express, { Request, Response } from 'express';
import cors from 'cors';
import { getAvailableBeds } from './flows/get-available-beds';
import { config } from './config';

const app = express();
const PORT = config.port;

app.use(cors());

app.use(express.json());

// API route to get available beds
app.get('/available-beds', async (req: Request, res: Response) => {
  const weeks = req.query.weeks.split(',');
  const bookings = await getAvailableBeds(weeks);
  res.send(bookings);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});