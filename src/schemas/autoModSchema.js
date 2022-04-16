"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const automodSchema = new mongoose_1.Schema({
    guild_id: String,
    useing: {
        useUrl: { type: Boolean, default: false },
        useCurse: { type: Boolean, default: false },
        useBlackList: { type: Boolean, default: false },
        useCreateAt: { type: Number, default: 0 },
        useAutoRole: { type: Boolean, default: false },
        autoRoleId: { type: String, default: '' },
        useCurseType: String,
        useCurseIgnoreChannel: { type: Array, default: [] },
        useResetChannel: { type: Boolean, default: false },
        useResetChannels: { type: Array, default: [] }
    },
    published_date: { type: Date, default: Date.now }
}, { collection: 'automod' });
const Automod = (0, mongoose_1.model)('automod', automodSchema, 'automod');
exports.default = Automod;
