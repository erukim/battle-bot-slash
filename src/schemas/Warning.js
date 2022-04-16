"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const warningSchema = new mongoose_1.Schema({
    userId: { type: String, default: '' },
    guildId: { type: String, default: '' },
    reason: { type: String, default: '' },
    managerId: { type: String, default: '' },
    published_date: { type: Date, default: Date.now }
}, { collection: 'warning' });
const Warning = (0, mongoose_1.model)('warning', warningSchema, 'warning');
exports.default = Warning;
