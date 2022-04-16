"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VerifySchema = new mongoose_1.Schema({
    guild_id: String,
    user_id: String,
    token: String,
    status: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'Verify' });
const Verify = (0, mongoose_1.model)('Verify', VerifySchema, 'Verify');
exports.default = Verify;
