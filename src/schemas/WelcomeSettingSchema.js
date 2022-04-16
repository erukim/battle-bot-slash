"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WelcomeSettingSchema = new mongoose_1.Schema({
    guild_id: String,
    welcome_message: { type: String, default: '' },
    outting_message: { type: String, default: '' },
    channel_id: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'greetingGuild' });
const WelcomeSetting = (0, mongoose_1.model)('greetingGuild', WelcomeSettingSchema, 'greetingGuild');
exports.default = WelcomeSetting;
