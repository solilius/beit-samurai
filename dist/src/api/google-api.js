"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = Date.now();
        if (!authTimestamp || now - authTimestamp >= GOOGLE_TOKEN_TTL) {
            yield auth.authorize();
            authTimestamp = now;
        }
    });
}
function getSheetNames() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const response = yield sheets.spreadsheets.get({
            auth,
            spreadsheetId: config_1.config.spreadsheetId,
        });
        return (_b = (_a = response.data.sheets) === null || _a === void 0 ? void 0 : _a.map(sheet => { var _a; return ((_a = sheet.properties) === null || _a === void 0 ? void 0 : _a.title) || ''; })) !== null && _b !== void 0 ? _b : [];
    });
}
function getBookingSpreadsheet(sheetName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield sheets.spreadsheets.values.get({
                auth,
                spreadsheetId: config_1.config.spreadsheetId,
                range: `'${sheetName}'!C3:Z17`,
            });
            return filterRows(response.data.values);
        }
        catch (error) {
            return { dates: [], bookings: [] };
        }
    });
}
function filterRows(rows) {
    const [dates, _weekDays, ...bookings] = rows;
    const filteredRows = bookings.filter((_, index) => index !== 4 && index !== 10); // 9, 15 are empty lines
    return { dates, bookings: filteredRows };
}
//# sourceMappingURL=google-api.js.map