"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Embed extends discord_js_1.MessageEmbed {
    constructor(client, type) {
        var _a;
        if (!client.isReady())
            return;
        const EmbedJSON = {
            timestamp: new Date(),
            footer: {
                text: client.user.username,
                icon_url: (_a = client.user.avatarURL()) !== null && _a !== void 0 ? _a : undefined
            }
        };
        if (type === 'success')
            EmbedJSON.color = '#57F287';
        else if (type === 'error')
            EmbedJSON.color = '#ED4245';
        else if (type === 'warn')
            EmbedJSON.color = '#FEE75C';
        else if (type === 'info')
            EmbedJSON.color = '#5865F2';
        else if (type === 'default')
            EmbedJSON.color = '#5865F2';
        super(EmbedJSON);
    }
    setType(type) {
        if (type === 'success')
            this.setColor('#57F287');
        else if (type === 'error')
            this.setColor('#ED4245');
        else if (type === 'warn')
            this.setColor('#FEE75C');
        else if (type === 'info')
            this.setColor('#5865F2');
        else if (type === 'default')
            this.setColor('#5865F2');
    }
}
exports.default = Embed;
