"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const premiumSchema = new mongoose_1.Schema({
    guild_id: String,
    nextpay_date: { type: Date, default: Date.now },
    published_date: { type: Date, default: Date.now }
}, { collection: 'premiumGuild' });
const Premium = (0, mongoose_1.model)('premiumGuild', premiumSchema, 'premiumGuild');
exports.default = Premium;
