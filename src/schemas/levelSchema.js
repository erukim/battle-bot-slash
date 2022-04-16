"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LevelSchema = new mongoose_1.Schema({
    user_id: String,
    guild_id: String,
    level: Number,
    currentXP: Number,
    totalXP: Number,
    published_date: { type: Date, default: Date.now }
}, { collection: 'userlevel' });
const Level = (0, mongoose_1.model)('userlevel', LevelSchema, 'userlevel');
exports.default = Level;
