"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
exports.getSheetNames = getSheetNames;
exports.getBookingSpreadsheet = getBookingSpreadsheet;
const googleapis_1 = require("googleapis");
const config_1 = require("../config");
const GOOGLE_TOKEN_TTL = 3600 * 1000;
let authTimestamp;
const sheets = googleapis_1.google.sheets('v4');
const auth = new googleapis_1.google.auth.JWT(config_1.config.serviceAccountEmail, undefined, config_1.config.serviceAccountPrivateKey, ['https://www.googleapis.com/auth/spreadsheets.readonly']);
async function authorize() {
    const now = Date.now();
    if (!authTimestamp || now - authTimestamp >= GOOGLE_TOKEN_TTL) {
        await auth.authorize();
        authTimestamp = now;
    }
}
async function getSheetNames() {
    const response = await sheets.spreadsheets.get({
        auth,
        spreadsheetId: config_1.config.spreadsheetId,
    });
    return response.data.sheets?.map(sheet => sheet.properties?.title || '') ?? [];
}
async function getBookingSpreadsheet(sheetName) {
    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId: config_1.config.spreadsheetId,
            range: `'${sheetName}'!C3:Z15`,
        });
        return response.data.values;
    }
    catch (error) {
        return [];
    }
}
