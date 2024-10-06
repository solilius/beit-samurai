import moment from 'moment';

import { config } from "../config";
import { authorize, getBookingSpreadsheet, getSheetNames } from "../api/google-api";

const WEEK_LENGTH = 7;

type WeeklyBooking = { [key: string]: number };
type Booking = { [key: string]: WeeklyBooking };

export async function getAvailableBeds(weeks: string[]): Promise<Booking> {
    try {
        await authorize();
        const bookings: Booking = {};

        for (const sheetName of weeks) {
            const weeklyBookings = await getWeeklyBookings(sheetName);
            bookings[sheetName] = weeklyBookings;
        }

        return bookings;
    } catch (error) {
        console.error('Error reading the spreadsheet:', error);
        return {};
    }
}

async function getWeeklyBookings(week: string): Promise<{ [key: string]: number }> {
    const sheetName = formatWeek(week);

    const [dates, _weekDays, ...bookings] = await getBookingSpreadsheet(sheetName);
    const weeklyBookings: { [key: string]: number } = {};

    for (let i = 0; i < WEEK_LENGTH; i++) {
        let bookingsCounter = 0;

        for (let j = 0; j < bookings.length; j++) {
            if (bookings[j].length) {
                if (bookings[j][i]) bookingsCounter++;
            }
        }
        const year = sheetName.match(/\[(\d+)\]/)?.[1];
        weeklyBookings[formatDate(dates[i], year)] = calcAvailableBeds(bookingsCounter);
    }
    return weeklyBookings;
}

function formatWeek(week: string) {
    const date = moment(week, "DD-MM-YYYY");
    const yearSuffix = date.format("YY");
    const month = date.format("MMM");
    const day = date.format("D");
    
    return `[${yearSuffix}] ${month} ${day}`;
};

function formatDate(dateString: string, year: string): string {
    const addZero = (num: number) => (num < 10 ? '0' + num : num.toString());
    const [month, day] = dateString.split('/');

    return `${addZero(Number(day))}/${addZero(Number(month))}/${year}`;
}

function calcAvailableBeds(booked: number): number {
    return Math.max(0, config.maxBedCapacity - booked);
}
