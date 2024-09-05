import { google } from 'googleapis';
import { config } from '../config';
import { JWT } from 'google-auth-library';

const sheets = google.sheets('v4');

let auth: JWT;

export async function authorize() {
    auth = new google.auth.JWT(
        config.serviceAccountEmail,
        undefined,
        config.serviceAccountPrivateKey,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    auth.authorize();
}

export async function getSheetNames(): Promise<string[]> {
    const response = await sheets.spreadsheets.get({
        auth,
        spreadsheetId: config.spreadsheetId,
    });

    return response.data.sheets?.map(sheet => sheet.properties?.title || '') ?? [];
}

export async function getBookingSpreadsheet(sheetName: string) {
    const response = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: config.spreadsheetId,
        range: `'${sheetName}'!C3:Z15`,
    });

    return response.data.values || [];
}
