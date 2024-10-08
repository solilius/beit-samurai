import express, { Request, Response } from 'express';
import cors from 'cors';
import { getAvailableBeds } from './flows/get-available-beds';
import { config } from './config';

const app = express();
const PORT = config.port;

app.use(cors());

app.use(express.json());

// API route to get available beds
// EXAMPLE  http://localhost:3005/available-beds/15-09-2024
app.get('/available-beds/:week', async (req: Request, res: Response) => {
  if (bookingJson[req.params.week]) {
    res.send(bookingJson[req.params.week]);
    return;
  }

  const bookings = await getAvailableBeds(req.params.week);
  res.send(bookings);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const bookingJson = {
  '29-09-24': {
    "29/09/24": 5,
    "30/09/24": 4,
    "01/10/24": 3,
    "02/10/24": 3,
    "03/10/24": 3,
    "04/10/24": 3,
    "05/10/24": 3
  },
  '06-10-24': {
    "06/10/24": 4,
    "07/10/24": 3,
    "08/10/24": 4,
    "09/10/24": 3,
    "10/10/24": 3,
    "11/10/24": 3,
    "12/10/24": 3
  },
  '13-10-24': {
    "13/10/24": 3,
    "14/10/24": 3,
    "15/10/24": 6,
    "16/10/24": 3,
    "17/10/24": 3,
    "18/10/24": 3,
    "19/10/24": 3
  },
  '20-10-24': {
    "20/10/24": 4,
    "21/10/24": 4,
    "22/10/24": 6,
    "23/10/24": 5,
    "24/10/24": 4,
    "25/10/24": 6,
    "26/10/24": 7
  },
  '27-10-24': {
    "27/10/24": 6,
    "28/10/24": 7,
    "29/10/24": 6,
    "30/10/24": 3,
    "31/10/24": 3,
    "01/11/24": 5,
    "02/11/24": 5
  },
  '03-11-24': {
    "03/11/24": 5,
    "04/11/24": 7,
    "05/11/24": 9,
    "06/11/24": 12,
    "07/11/24": 11,
    "08/11/24": 11,
    "09/11/24": 7
  },
  '10-11-24': {
    "10/11/24": 6,
    "11/11/24": 6,
    "12/11/24": 8,
    "13/11/24": 7,
    "14/11/24": 5,
    "15/11/24": 8,
    "16/11/24": 10
  },
  '17-11-24': {
    "17/11/24": 10,
    "18/11/24": 11,
    "19/11/24": 11,
    "20/11/24": 10,
    "21/11/24": 10,
    "22/11/24": 11,
    "23/11/24": 11
  },
  '24-11-24': {
    "24/11/24": 12,
    "25/11/24": 12,
    "26/11/24": 12,
    "27/11/24": 12,
    "28/11/24": 12,
    "29/11/24": 7,
    "30/11/24": 7
  },
  '01-12-24': {
    "01/12/24": 7,
    "02/12/24": 7,
    "03/12/24": 7,
    "04/12/24": 7,
    "05/12/24": 3,
    "06/12/24": 3,
    "07/12/24": 8
  },
  '08-12-24': {
    "08/12/24": 8,
    "09/12/24": 12,
    "10/12/24": 12,
    "11/12/24": 12,
    "12/12/24": 10,
    "13/12/24": 10,
    "14/12/24": 10
  },
}