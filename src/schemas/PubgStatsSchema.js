"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PubgStatsSchema = new mongoose_1.Schema({
    user_id: String,
    nickname: String,
    platform: String,
    stats: {
        rankSoloTpp: Object,
        rankSoloFpp: Object,
        rankSquardTpp: Object,
        rankSquardFpp: Object,
        soloFpp: Object,
        soloTpp: Object,
        duoFpp: Object,
        duoTpp: Object,
        SquardFpp: Object,
        SquardTpp: Object
    },
    last_update: { type: Date, default: Date.now },
    published_date: { type: Date, default: Date.now }
}, { collection: 'pubgstats' });
const PubgStats = (0, mongoose_1.model)('pubgstats', PubgStatsSchema, 'pubgstats');
exports.default = PubgStats;
