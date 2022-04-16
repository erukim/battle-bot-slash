"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ticketSchema = new mongoose_1.Schema({
    status: String,
    guildId: String,
    channelId: String,
    userId: String,
    ticketId: String,
    messages: Array,
    published_date: { type: Date, default: Date.now }
}, { collection: 'ticket' });
const Ticket = (0, mongoose_1.model)('ticket', ticketSchema, 'ticket');
exports.default = Ticket;
