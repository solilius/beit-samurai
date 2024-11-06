import { google } from 'googleapis';
import { config } from '../config';

const GOOGLE_TOKEN_TTL = 3600 * 1000;

let authTimestamp: number;

const sheets = google.sheets('v4');

const auth = new google.auth.JWT(
    config.serviceAccountEmail,
    undefined,
    config.serviceAccountPrivateKey,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
);

export async function authorize() {
    const now = Date.now();
    if (!authTimestamp || now - authTimestamp >= GOOGLE_TOKEN_TTL) {
        await auth.authorize();
        authTimestamp = now;
    }
}

export async function getSheetNames(): Promise<string[]> {
    const response = await sheets.spreadsheets.get({
        auth,
        spreadsheetId: config.spreadsheetId,
    });

    return response.data.sheets?.map(sheet => sheet.properties?.title || '') ?? [];
}

export async function getBookingSpreadsheet(sheetName: string): Promise<string[][]> {
    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: config.spreadsheetId,
            range: `'${sheetName}'!C3:Z15`,
        });

        return response.data.values as string[][];
    } catch (error) {
        return [];
    }
}
