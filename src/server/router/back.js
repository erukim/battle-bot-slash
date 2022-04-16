"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = req.guild;
    const client = req.client;
    const queue = client.player.getQueue(guild.id);
    if (!queue)
        return res
            .status(404)
            .json({ status: 404, message: '재생중인 노래가 없습니다' });
    yield queue.back().catch((e) => {
        if (e) {
            if (e.statusCode === 'TrackNotFound')
                return res
                    .status(404)
                    .json({ status: 404, message: '이전 노래를 찾을 수 없어요!' });
            else
                return res.status(500).json({
                    status: 500,
                    message: '알 수 없는 오류가 발생했어요!',
                    data: e.statusCode
                });
        }
    });
    return res
        .status(200)
        .json({ status: 200, message: '이전 노래를 재생했어요!' });
}));
exports.default = app;
