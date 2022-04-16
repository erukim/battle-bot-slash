"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MusicSettingSchema = new mongoose_1.Schema({
    guild_id: String,
    channel_id: String,
    message_id: String,
    process_message_id: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'Music' });
const MusicSetting = (0, mongoose_1.model)('Music', MusicSettingSchema, 'Music');
exports.default = MusicSetting;
