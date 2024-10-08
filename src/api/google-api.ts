import { google } from 'googleapis';
import { config } from '../config';

const sheets = google.sheets('v4');

const auth = new google.auth.JWT(
    config.serviceAccountEmail,
    undefined,
    config.serviceAccountPrivateKey,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
);

export async function authorize() {
    await auth.authorize();
}

export async function getSheetNames(): Promise<string[]> {
    const response = await sheets.spreadsheets.get({
        auth,
        spreadsheetId: config.spreadsheetId,
    });

    return response.data.sheets?.map(sheet => sheet.properties?.title || '') ?? [];
}

export async function getBookingSpreadsheet(sheetName: string) {
    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: config.spreadsheetId,
            range: `'${sheetName}'!C3:Z15`,
        });

        return response.data.values
    } catch (error) {
        return [];
    }
}
