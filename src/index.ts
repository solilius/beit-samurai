import express, { Request, Response } from 'express';
import cors from 'cors';
import { getAvailableBeds } from './flows/get-available-beds';
import { config } from './config';
import { bookingJson } from './mock-data';

const app = express();
const PORT = config.port;

app.use(cors());

app.use(express.json());

// API route to get available beds
// EXAMPLE  http://localhost:3005/available-beds/15-09-2024
app.get('/available-beds/:week', async (req: Request, res: Response) => {
  const week = req.params.week;
  // if (!config.isProd && bookingJson[week]) {
  //   res.send(bookingJson[week]);
  //   return;
  // }

  const bookings = await getAvailableBeds(req.params.week);
  res.send(bookings);
});

app.get('/alive', async (req, res) => {
  res.send();
});

// Start the server
app.listen(PORT,  () => {
  console.log(`Server is running on port ${PORT}`);
});
