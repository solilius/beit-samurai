"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
exports.config = {
    port: Number(process.env.PORT || 3000),
    isProd: Boolean(process.env.NODE_ENV === 'production'),
    spreadsheetId: String(process.env.SPREADSHEET_ID || ''),
    maxBedCapacity: Number(process.env.MAX_BED_CAPACITY || 0),
    serviceAccountEmail: String(process.env.SERVICE_ACCOUNT_EMAIL || ''),
    serviceAccountPrivateKey: String(process.env.SERVICE_ACCOUNT_PRIVATE_KEY || ''),
};
//# sourceMappingURL=config.js.map