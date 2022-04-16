"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ticketSettingSchema = new mongoose_1.Schema({
    guildId: String,
    categories: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'ticketSetting' });
const TicketSetting = (0, mongoose_1.model)('ticketSetting', ticketSettingSchema, 'ticketSetting');
exports.default = TicketSetting;
