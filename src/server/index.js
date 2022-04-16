"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const authGuild_1 = __importDefault(require("./middleware/authGuild"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const playlist_1 = __importDefault(require("./router/playlist"));
const back_1 = __importDefault(require("./router/back"));
const pause_1 = __importDefault(require("./router/pause"));
const skip_1 = __importDefault(require("./router/skip"));
const logger = new Logger_1.default('web');
const app = (0, express_1.default)();
app.listen(3001, () => {
    logger.log('web started');
});
const web = (client) => {
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        credentials: true,
        origin: ['http://localhost:3000', 'http://localhost:3001']
    }));
    app.use((req, res, next) => {
        req.client = client;
        next();
    });
    app.use('/:guild/playlist', authGuild_1.default, playlist_1.default);
    app.use('/:guild/back', authGuild_1.default, back_1.default);
    app.use('/:guild/pause', authGuild_1.default, pause_1.default);
    app.use('/:guild/skip', authGuild_1.default, skip_1.default);
};
exports.default = web;
