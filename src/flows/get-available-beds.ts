import { config } from "../config";
import { authorize, getBookingSpreadsheet, getSheetNames } from "../api/google-api";

const WEEK_LENGTH = 7;

export async function getAvailableBeds(months: string[]): Promise<{ [key: string]: number }> {
    try {
        await authorize();
        const sheetNames = await getSheetNames();
        const filterSheetNames = getRelevantSheetNames(sheetNames, months);
        let bookings: { [key: string]: number } = {};

        for (const sheetName of filterSheetNames) {
            const weeklyBookings = await getWeeklyBookings(sheetName);
            bookings = { ...bookings, ...weeklyBookings };
        }

        return bookings;
    } catch (error) {
        console.error('Error reading the spreadsheet:', error);
        return {};
    }
}

async function getWeeklyBookings(sheetName: string): Promise<{ [key: string]: number }> {
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

function getRelevantSheetNames(sheetNames: string[], months: string[]): string[] {
    return sheetNames.filter(s => months.some(m => s.includes(m)));
}

function formatDate(dateString: string, year: string): string {
    const addZero = (num: number) => (num < 10 ? '0' + num : num.toString());
    const [month, day] = dateString.split('/');

    return `${addZero(Number(day))}/${addZero(Number(month))}/${year}`;
}

function calcAvailableBeds(booked: number): number {
    return Math.max(0, config.maxBedCapacity - booked);
}
