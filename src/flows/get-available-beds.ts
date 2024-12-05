import moment, { Moment } from 'moment';

import { config } from "../config";
import { authorize, getBookingSpreadsheet } from "../api/google-api";

const WEEK_LENGTH = 7;

type WeeklyBooking = { [key: string]: number };

export async function getAvailableBeds(week: string): Promise<WeeklyBooking> {
    try {
        await authorize();
        const weeklyBookings = await getWeeklyBookings(week);
        return weeklyBookings;
    } catch (error) {
        console.error('Error reading the spreadsheet:', error);
        return {};
    }
}

async function getWeeklyBookings(week: string): Promise<WeeklyBooking> {
    const sheetName = parseToSheetName(week);

    const { dates, bookings } = await getBookingSpreadsheet(sheetName);

    if (!dates) return getEmptyWeekBooking(week);
    
    const weeklyBookings: WeeklyBooking = {};

    for (let i = 0; i < WEEK_LENGTH; i++) {
        let bookingsCounter = 0;

        for (let j = 0; j < bookings.length; j++) {
            if (bookings[j].length) {
                if (bookings[j][i]) bookingsCounter++;
            }
        }
        const year = sheetName.match(/\[(\d+)\]/)?.[1];
        weeklyBookings[formatDate(moment(dates[i], 'MM/DD'), year)] = calcAvailableBeds(bookingsCounter);
    }

    return weeklyBookings;
}

function parseToSheetName(week: string) {
    const date = moment(week, 'DD/MM/YYYY');
    const yearSuffix = date.format('YY');
    return  `[${yearSuffix}] ${date.format('MMM D')}`;
};

function formatDate(dateString: Moment, year?:string): string {
    return `${dateString.format('DD/MM')}/${year}`;
}

function calcAvailableBeds(booked: number): number {
    return Math.max(0, config.maxBedCapacity - booked);
}

function getEmptyWeekBooking(week: string) : WeeklyBooking {
    const weekData: Record<string, number> = {};
    const sunday = moment(week, 'DD-MM-YY');
  
    for (let i = 0; i < 7; i++) {
      const currentDate = sunday.clone().add(i, 'days');
      const formattedDate = formatDate(currentDate, currentDate.format('YY'));
      weekData[formattedDate] = calcAvailableBeds(0);
    }
  
    return weekData;
}
