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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const get_available_beds_1 = require("./flows/get-available-beds");
const config_1 = require("./config");
const app = (0, express_1.default)();
const PORT = config_1.config.port;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API route to get available beds
// EXAMPLE  http://localhost:3005/available-beds/15-09-2024
app.get('/available-beds/:week', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const week = req.params.week;
    // if (!config.isProd && bookingJson[week]) {
    //   res.send(bookingJson[week]);
    //   return;
    // }
    const bookings = yield (0, get_available_beds_1.getAvailableBeds)(req.params.week);
    res.send(bookings);
}));
app.get('/alive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send();
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map