"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LevelSettingSchema = new mongoose_1.Schema({
    guild_id: String,
    useage: Boolean,
    published_date: { type: Date, default: Date.now }
}, { collection: 'levelsetting' });
const Level = (0, mongoose_1.model)('levelsetting', LevelSettingSchema, 'levelsetting');
exports.default = Level;
