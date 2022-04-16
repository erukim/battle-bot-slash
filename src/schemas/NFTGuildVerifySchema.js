"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const nftVerifySchema = new mongoose_1.Schema({
    guild_id: String,
    role_id: String,
    wallet: String,
    published_date: { type: Date, default: Date.now }
}, {
    collection: 'nftGuildVerify'
});
const NFTGuildVerify = (0, mongoose_1.model)('nftGuildVerify', nftVerifySchema, 'nftGuildVerify');
exports.default = NFTGuildVerify;
