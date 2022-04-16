"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VerifySettingSchema = new mongoose_1.Schema({
    guild_id: String,
    role_id: String,
    type: String,
    del_role_id: String,
    published_date: { type: Date, default: Date.now }
}, { collection: 'VerifySetting' });
const VerifySetting = (0, mongoose_1.model)('VerifySetting', VerifySettingSchema, 'VerifySetting');
exports.default = VerifySetting;
