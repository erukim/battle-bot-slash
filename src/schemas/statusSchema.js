"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StatusSchema = new mongoose_1.Schema({
    build_number: String,
    commands: String,
    totalShard: String,
    shard: [
        {
            shardNumber: Number,
            shardWsPing: String,
            shardPing: String,
            shardGuild: String,
            shardMember: String,
            shardChannels: String,
            shardUptime: String
        }
    ],
    published_date: { type: Date, default: Date.now, expires: 3600 }
});
const Status = (0, mongoose_1.model)('status', StatusSchema, 'status');
// @ts-ignore
Status.schema.index({ published_date: 1 }, { expireAfterSeconds: 3600 });
exports.default = Status;
