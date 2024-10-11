import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const config = {
    port: Number(process.env.PORT || 3000),
    isProd: Boolean(process.env.ENV === 'prod'),
    spreadsheetId: String(process.env.SPREADSHEET_ID || ''),
    maxBedCapacity: Number(process.env.MAX_BED_CAPACITY || 0),
    serviceAccountEmail: String(process.env.SERVICE_ACCOUNT_EMAIL || ''),
    serviceAccountPrivateKey: String(process.env.SERVICE_ACCOUNT_PRIVATE_KEY || ''),
}