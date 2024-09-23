import moment from 'moment';

import { config } from "../config";
import { authorize, getBookingSpreadsheet, getSheetNames } from "../api/google-api";

const WEEK_LENGTH = 7;

export async function getAvailableBeds(weeks: string[]): Promise<{ [key: string]: number }> {
    try {
        await authorize();
        // const sheetNames = await getSheetNames();
        // const filterSheetNames = getRelevantSheetNames(sheetNames, month);
        const formattedWeeks = weeks.map(w => formatWeek(w));
        let bookings: { [key: string]: number } = {};

        for (const sheetName of formattedWeeks) {
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

// function getRelevantSheetNames(sheetNames: string[], date: string): string[] {
//     const [year, month] = date.split('-');
//     return sheetNames.filter(s => s.includes(`[${year}] ${month}`));
// }

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
