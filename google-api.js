const fs = require('fs');  // File system module to read files
const { google } = require('googleapis');
const sheets = google.sheets('v4');

const spreadsheetId = '1thy53RFFxk4Kv2OADfs8DmQsIo_LRG1iO3VkeEvySSg';
const MAX_BED_CAPACITY = 12;
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

// Extract the necessary fields from the credentials
const { client_email, private_key } = credentials;

const auth = new google.auth.JWT(
    client_email,  // Replace with your client email from credentials.json
    null,
    private_key,  // Replace with your private key from credentials.json
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
);

async function readSpreadsheet(months) {
    try {
        const client = await auth.authorize();

        const sheetNames = await getSheetNames(auth);
        const filterSheetNames = getRelevantSheetNames(sheetNames, months);
        let bookings = {};

        for (const sheetName of filterSheetNames) {
            const weeklyBookings = await getWeeklyBookings(sheetName);
            bookings = { ...bookings, ...weeklyBookings };
        }

        return bookings;
    } catch (error) {
        console.error('Error reading the spreadsheet:', error);
    }
}

async function getSheetNames(auth) {
    const response = await sheets.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    return response.data.sheets.map(sheet => sheet.properties.title);
}


function getRelevantSheetNames(sheetNames, months) {
    return sheetNames.filter(s => months.some(m => s.includes(m)))
}

async function getWeeklyBookings(sheetName) {
    const WEEK_LENGTH = 7;
    const response = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `'${sheetName}'!C3:Z15`,
    });

    const [dates, _weekDays, ...bookings] = response.data.values;

    const weeklyBookings = {};

    for (let i = 0; i < WEEK_LENGTH; i++) {
        let bookingsCounter = 0;

        for (let j = 0; j < bookings.length; j++) {
            if (bookings[j].length) {
                if (bookings[j][i]) bookingsCounter++;
            }
        }
        const year = sheetName.match(/\[(\d+)\]/)?.[1];
        weeklyBookings[formatDate(dates[i], year)] = getAvailableBeds(bookingsCounter);
    }
    return weeklyBookings;
}

function formatDate(dateString, year){
    const addZero = num => num < 10 ? '0' + num : num; 
    const [month, day] = dateString.split('/');
    return `${addZero(day)}/${addZero(month)}/${year}`;
}

function getAvailableBeds(booked) {
    return Math.max(0, MAX_BED_CAPACITY - booked);
}
module.exports = readSpreadsheet
