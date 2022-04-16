"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AutoRoleSchema = new mongoose_1.Schema({
    guild_id: String,
    message_id: String,
    token: String,
    isKeep: Boolean,
    published_date: { type: Date, default: Date.now }
}, { collection: 'AutoTaskRole' });
const AutoTaskRole = (0, mongoose_1.model)('AutoTaskRole', AutoRoleSchema, 'AutoTaskRole');
exports.default = AutoTaskRole;
