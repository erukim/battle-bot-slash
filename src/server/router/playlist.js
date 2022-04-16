"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    const guild = req.guild;
    const auth = req.auth;
    const client = req.client;
    const queue = client.player.getQueue(guild.id);
    if (!queue)
        return res.status(200).json({
            status: 200,
            message: '재생중인 노래가 없습니다',
            data: {
                status: {
                    isPause: true
                },
                playing: {
                    title: null,
                    descriptin: null,
                    author: null,
                    url: null,
                    image: null,
                    request: null,
                    duration: null,
                    currnt: null,
                    progress: null
                },
                playList: []
            }
        });
    return res.status(200).json({
        status: 200,
        message: '재생중인 노래가 없습니다',
        data: {
            status: {
                isPause: queue.connection.paused
            },
            playing: {
                title: queue.nowPlaying().title,
                descriptin: queue.nowPlaying().description,
                author: queue.nowPlaying().author,
                url: queue.nowPlaying().url,
                image: queue.nowPlaying().thumbnail,
                request: queue.nowPlaying().requestedBy,
                duration: queue.nowPlaying().duration,
                currnt: queue.getPlayerTimestamp().current,
                progress: queue.getPlayerTimestamp().progress
            },
            playList: queue.tracks
        }
    });
});
exports.default = app;
