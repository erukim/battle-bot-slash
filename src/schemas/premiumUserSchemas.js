"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const premiumUserSchema = new mongoose_1.Schema({
    user_id: String,
    nextpay_date: { type: Date, default: Date.now },
    published_date: { type: Date, default: Date.now }
}, { collection: 'premiumUser' });
const PremiumUser = (0, mongoose_1.model)('premiumUser', premiumUserSchema, 'premiumUser');
exports.default = PremiumUser;
