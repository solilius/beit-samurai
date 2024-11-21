"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const get_available_beds_1 = require("./flows/get-available-beds");
const config_1 = require("./config");
const mock_data_1 = require("./mock-data");
const app = (0, express_1.default)();
const PORT = config_1.config.port;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API route to get available beds
// EXAMPLE  http://localhost:3005/available-beds/15-09-2024
app.get('/available-beds/:week', async (req, res) => {
    const week = req.params.week;
    if (!config_1.config.isProd && mock_data_1.bookingJson[week]) {
        res.send(mock_data_1.bookingJson[week]);
        return;
    }
    const bookings = await (0, get_available_beds_1.getAvailableBeds)(req.params.week);
    res.send(bookings);
});

app.get('/alive', async (req, res) => {
    res.send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    setInterval(() => {
        const memoryUsage = process.memoryUsage();
        console.log("Memory Usage:", {
            rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`
        });
    }, 5000);
});
