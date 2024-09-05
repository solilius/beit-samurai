import express, { Request, Response } from 'express';
import path from 'path';
import { getAvailableBeds } from './flows/get-available-beds';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/available-beds', async (req: Request, res: Response) => {
  const months = (req.query.months as string).split(',');
  const bookings = await getAvailableBeds(months);
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
