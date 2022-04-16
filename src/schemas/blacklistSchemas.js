"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blacklistSchema = new mongoose_1.Schema({
    user_id: String,
    report_user_id: String,
    reason: String,
    status: String,
    message: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'blacklist' });
const Blacklist = (0, mongoose_1.model)('blacklist', blacklistSchema, 'blacklist');
exports.default = Blacklist;
