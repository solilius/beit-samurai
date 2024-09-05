import express, { Request, Response } from 'express';
import path from 'path';
import { getAvailableBeds } from './flows/get-available-beds';
import { config } from './config';

const app = express();
const PORT = config.port;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('/available-beds', async (req: Request, res: Response) => {
  const months = (req.query.months as string).split(',');
  const bookings = await getAvailableBeds(months);
  res.json(bookings);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
