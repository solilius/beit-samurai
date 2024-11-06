"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableBeds = getAvailableBeds;
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
const google_api_1 = require("../api/google-api");
const WEEK_LENGTH = 7;
async function getAvailableBeds(week) {
    try {
        await (0, google_api_1.authorize)();
        const weeklyBookings = await getWeeklyBookings(week);
        return weeklyBookings;
    }
    catch (error) {
        console.error('Error reading the spreadsheet:', error);
        return {};
    }
}
async function getWeeklyBookings(week) {
    const sheetName = parseToSheetName(week);
    const [dates, _weekDays, ...bookings] = await (0, google_api_1.getBookingSpreadsheet)(sheetName);
    if (!dates)
        return getEmptyWeekBooking(week);
    const weeklyBookings = {};
    for (let i = 0; i < WEEK_LENGTH; i++) {
        let bookingsCounter = 0;
        for (let j = 0; j < bookings.length; j++) {
            if (bookings[j].length) {
                if (bookings[j][i])
                    bookingsCounter++;
            }
        }
        const year = sheetName.match(/\[(\d+)\]/)?.[1];
        weeklyBookings[formatDate((0, moment_1.default)(dates[i], 'MM/DD'), year)] = calcAvailableBeds(bookingsCounter);
    }
    return weeklyBookings;
}
function parseToSheetName(week) {
    const date = (0, moment_1.default)(week, 'DD/MM/YYYY');
    const yearSuffix = date.format('YY');
    return `[${yearSuffix}] ${date.format('MMM D')}`;
}
;
function formatDate(dateString, year) {
    return `${dateString.format('DD/MM')}/${year}`;
}
function calcAvailableBeds(booked) {
    return Math.max(0, config_1.config.maxBedCapacity - booked);
}
function getEmptyWeekBooking(week) {
    const weekData = {};
    const sunday = (0, moment_1.default)(week, 'DD-MM-YY');
    for (let i = 0; i < 7; i++) {
        const currentDate = sunday.clone().add(i, 'days');
        const formattedDate = formatDate(currentDate, currentDate.format('YY'));
        weekData[formattedDate] = calcAvailableBeds(0);
    }
    return weekData;
}
