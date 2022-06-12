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
const Command_1 = require("../../structures/Command");
const discord_js_1 = __importDefault(require("discord.js"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const comma_number_1 = __importDefault(require("comma-number"));
const Money_1 = __importDefault(require("../../schemas/Money"));
const Stock_1 = __importDefault(require("../../schemas/Stock"));
const config_1 = __importDefault(require("../../../config"));
const stock_1 = require("../../utils/stock");
exports.default = new Command_1.BaseCommand({
    name: 'stock',
    description: '주식을 거래합니다. (검색, 매수, 매도, 목록)',
    aliases: ['주식', 'stock', '주식거래', '주식거래하기']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    const type = args[0];
    const embed = new Embed_1.default(client, 'info')
        .setTitle('주식')
        .setColor('#2f3136');
    if (type === '검색') {
        const keyword = args.slice(1).join(' ');
        const results = yield (0, stock_1.searchStockList)(keyword);
        if (!results || (results === null || results === void 0 ? void 0 : results.items.length) == 0) {
            embed.setDescription('검색 결과가 없습니다.');
            return message.reply({ embeds: [embed] });
        }
        const result = yield (0, stock_1.searchStock)(results.items[0].code);
        if (!result) {
            embed.setDescription('검색 결과가 없습니다.');
            return message.reply({ embeds: [embed] });
        }
        embed.setTitle(`${results.items[0].name} (${results.items[0].code})`);
        embed.addField('현재가', `${(0, comma_number_1.default)(result.now)}원`, true);
        embed.addField('전일대비', `${(0, comma_number_1.default)(result.diff)}원 (${result.risefall == 1 || result.risefall == 2
            ? '▴'
            : result.risefall == 3
                ? '-'
                : '▾'} ${(0, comma_number_1.default)(result.rate)}%)`, true);
        embed.addField('거래량', `${(0, comma_number_1.default)(result.quant)}주`, true);
        embed.addField('고가', `${(0, comma_number_1.default)(result.high)}원`, true);
        embed.addField('저가', `${(0, comma_number_1.default)(result.low)}원`, true);
        embed.addField('거래대금', `${(0, comma_number_1.default)(result.amount)}백만원`, true);
        embed.setImage(`https://ssl.pstatic.net/imgfinance/chart/item/area/day/${results.items[0].code}.png`);
        return message.reply({
            embeds: [embed]
        });
    }
    else if (type === '목록') {
        const keyword = args.slice(1).join(' ');
        const result = yield (0, stock_1.searchStocks)(keyword);
        embed.setTitle(`${keyword} 검색 결과`);
        const results = result === null || result === void 0 ? void 0 : result.result.d.map((stock, index) => {
            return `${stock.rf == '1' || stock.rf == '2' ? '+' : stock.rf == '3' ? ' ' : '-'} ${index + 1}. ${stock.nm} (${stock.cd}) [ ${(0, comma_number_1.default)(stock.nv)}원 (${stock.rf == '1' || stock.rf == '2' ? '▴' : stock.rf == '3' ? '-' : '▾'} ${stock.cr}%) ]`;
        });
        embed.setDescription('```diff\n' + (results === null || results === void 0 ? void 0 : results.join('\n')) + '```');
        return message.reply({
            embeds: [embed]
        });
    }
    else if (type === '매수') {
        const keyword = args.slice(2).join(' ');
        const quantity = parseInt(args[1]);
        if (!quantity) {
            embed.setDescription(`매수하실 주식의 수량을 숫자만 입력해주세요.`);
            return message.reply({ embeds: [embed] });
        }
        const results = yield (0, stock_1.searchStockList)(keyword);
        if (!results || (results === null || results === void 0 ? void 0 : results.items.length) == 0) {
            embed.setDescription(`${keyword} 검색 결과가 없습니다.`);
            return message.reply({ embeds: [embed] });
        }
        const result = yield (0, stock_1.searchStock)(results.items[0].code);
        if (!result) {
            embed.setDescription(`${keyword} 검색 결과가 없습니다.`);
            return message.reply({ embeds: [embed] });
        }
        const price = result.now * quantity;
        const fee = price * 0.02;
        const total = price + fee;
        const user = yield Money_1.default.findOne({ userid: message.author.id });
        if (!user) {
            embed.setDescription(`등록되어 있지 않은 유저인 거 같아요!, 먼저 \`${config_1.default.bot.prefix}돈받기\` 명령어로 등록을 해주세요.`);
            return message.reply({ embeds: [embed] });
        }
        if (user.money < total) {
            embed.setDescription(`${(0, comma_number_1.default)(total - user.money)}원이 부족해요!\n잔액은 ${(0, comma_number_1.default)(user.money)}원이에요.`);
            return message.reply({ embeds: [embed] });
        }
        embed.setDescription(`${results.items[0].name} ${quantity}주(${(0, comma_number_1.default)(result.now * quantity)}원)을 매수하시겠습니까?`);
        embed.addField('현재가', `${(0, comma_number_1.default)(result.now)}원`, true);
        embed.addField('수수료', `${(0, comma_number_1.default)(fee)}원 (2%)`, true);
        embed.addField('총계', `${(0, comma_number_1.default)(total)}원`, true);
        embed.setImage(`https://ssl.pstatic.net/imgfinance/chart/item/area/day/${results.items[0].code}.png`);
        const row = new discord_js_1.default.MessageActionRow()
            .addComponents(new discord_js_1.default.MessageButton()
            .setCustomId('stock.accept')
            .setLabel('확인')
            .setStyle('SUCCESS'))
            .addComponents(new discord_js_1.default.MessageButton()
            .setCustomId('stock.deny')
            .setLabel('아니요')
            .setStyle('DANGER'));
        const m = yield message.reply({ embeds: [embed], components: [row] });
        const collector = m.createMessageComponentCollector({ time: 10000 });
        collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
            if (i.user.id != message.author.id)
                return;
            if (i.customId == 'stock.accept') {
                embed.setDescription(`${results.items[0].name} ${quantity}주를 매수했어요!`);
                embed.addField('현재가', `${(0, comma_number_1.default)(result.now)}원`, true);
                embed.addField('수수료', `${(0, comma_number_1.default)(fee)}원 (2%)`, true);
                embed.addField('총계', `${(0, comma_number_1.default)(total)}원`, true);
                embed.setImage(`https://ssl.pstatic.net/imgfinance/chart/item/area/day/${results.items[0].code}.png`);
                yield m.edit({ embeds: [embed] });
                yield Money_1.default.findOneAndUpdate({
                    userid: message.author.id
                }, {
                    $inc: { money: -total }
                });
                const nowStock = yield Stock_1.default.findOne({
                    userid: message.author.id,
                    'stocks.code': results.items[0].code
                });
                if (!nowStock) {
                    yield Stock_1.default.updateOne({ userid: message.author.id }, {
                        $push: {
                            stocks: {
                                code: results.items[0].code,
                                quantity,
                                name: results.items[0].name,
                                price: result.now
                            }
                        }
                    }, { upsert: true });
                }
                else {
                    yield Stock_1.default.findOneAndUpdate({ userid: message.author.id }, { $pull: { stocks: { code: results.items[0].code } } });
                    yield Stock_1.default.updateOne({ userid: message.author.id }, {
                        $push: {
                            stocks: {
                                code: results.items[0].code,
                                quantity: nowStock.stocks[0].quantity + quantity,
                                name: results.items[0].name,
                                price: (nowStock.stocks[0].quantity * nowStock.stocks[0].price +
                                    result.now * quantity) /
                                    (nowStock.stocks[0].quantity + quantity)
                            }
                        }
                    }, { upsert: true });
                }
                const successEmbed = new Embed_1.default(client, 'success')
                    .setTitle(`주식`)
                    .setDescription(`${results.items[0].name} ${quantity}주를 매수했어요!`)
                    .addField('거래금액', `${(0, comma_number_1.default)(total)}원`, true)
                    .addField('수수료', `${(0, comma_number_1.default)(fee)}원 (2%)`, true)
                    .addField('거래후 잔액', `${(0, comma_number_1.default)(user.money - total)}원`, true);
                return i.update({ embeds: [successEmbed], components: [] });
            }
            else if (i.customId == 'stock.deny') {
                embed.setDescription(`매수를 취소하였습니다.`);
                return i.update({ embeds: [embed], components: [] });
            }
        }));
        collector.on('end', (collected) => {
            if (collected.size == 1)
                return;
            m.edit({
                embeds: [embed],
                components: [
                    new discord_js_1.default.MessageActionRow()
                        .addComponents(new discord_js_1.default.MessageButton()
                        .setCustomId('stock.accept')
                        .setLabel('확인')
                        .setStyle('SUCCESS')
                        .setDisabled(true))
                        .addComponents(new discord_js_1.default.MessageButton()
                        .setCustomId('stock.deny')
                        .setLabel('아니요')
                        .setStyle('DANGER')
                        .setDisabled(true))
                ]
            });
        });
    }
    else if (type === '매도') {
        const keyword = args.slice(2).join(' ');
        const quantity = parseInt(args[1]);
        if (!quantity) {
            embed.setDescription(`매도하실 주식의 수량을 숫자만 입력해주세요.`);
            return message.reply({ embeds: [embed] });
        }
        const results = yield (0, stock_1.searchStockList)(keyword);
        if (!results || (results === null || results === void 0 ? void 0 : results.items.length) == 0) {
            embed.setDescription(`${keyword} 검색 결과가 없습니다.`);
            return message.reply({ embeds: [embed] });
        }
        const result = yield (0, stock_1.searchStock)(results.items[0].code);
        if (!result) {
            embed.setDescription(`${keyword} 검색 결과가 없습니다.`);
            return message.reply({ embeds: [embed] });
        }
        const stock = yield Stock_1.default.findOne({
            userid: message.author.id,
            'stocks.code': results.items[0].code
        });
        if (!stock || stock.stocks.length === 0) {
            embed.setDescription(`${results.items[0].name}을 보유하고 있지 않습니다.`);
            return message.reply({ embeds: [embed] });
        }
        if (stock.stocks[0].quantity < quantity) {
            embed.setDescription(`${results.items[0].name}주식을 ${quantity}주만큼 보유하고 있지 않습니다. 현재 보유량: ${stock.stocks[0].quantity}주`);
            return message.reply({ embeds: [embed] });
        }
        const price = result.now * quantity;
        const fee = price * 0.02;
        const total = price - fee;
        const user = yield Money_1.default.findOne({ userid: message.author.id });
        if (!user) {
            embed.setDescription(`등록되어 있지 않은 유저인 거 같아요!, 먼저 \`${config_1.default.bot.prefix}돈받기\` 명령어로 등록을 해주세요.`);
            return message.reply({ embeds: [embed] });
        }
        embed.setDescription(`${results.items[0].name} ${quantity}주(${(0, comma_number_1.default)(result.now * quantity)}원)을 매도하시겠습니까?`);
        embed.addField('현재가', `${(0, comma_number_1.default)(result.now)}원`, true);
        embed.addField('수수료', `${(0, comma_number_1.default)(fee)}원 (2%)`, true);
        embed.addField('총계', `${(0, comma_number_1.default)(total)}원`, true);
        embed.setImage(`https://ssl.pstatic.net/imgfinance/chart/item/area/day/${results.items[0].code}.png`);
        const row = new discord_js_1.default.MessageActionRow()
            .addComponents(new discord_js_1.default.MessageButton()
            .setCustomId('stocksell.accept')
            .setLabel('확인')
            .setStyle('SUCCESS'))
            .addComponents(new discord_js_1.default.MessageButton()
            .setCustomId('stocksell.deny')
            .setLabel('아니요')
            .setStyle('DANGER'));
        const m = yield message.reply({ embeds: [embed], components: [row] });
        const collector = m.createMessageComponentCollector({ time: 10000 });
        collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
            if (i.user.id != message.author.id)
                return;
            if (i.customId == 'stocksell.accept') {
                embed.setDescription(`${results.items[0].name} ${quantity}주를 매도했어요!`);
                embed.addField('현재가', `${(0, comma_number_1.default)(result.now)}원`, true);
                embed.addField('수수료', `${(0, comma_number_1.default)(fee)}원 (2%)`, true);
                embed.addField('총계', `${(0, comma_number_1.default)(total)}원`, true);
                embed.setImage(`https://ssl.pstatic.net/imgfinance/chart/item/area/day/${results.items[0].code}.png`);
                yield m.edit({ embeds: [embed] });
                yield Money_1.default.findOneAndUpdate({
                    userid: message.author.id
                }, {
                    $inc: { money: +total }
                });
                yield Stock_1.default.findOneAndUpdate({ userid: message.author.id }, { $pull: { stocks: { code: stock.stocks[0].code } } });
                yield Stock_1.default.updateOne({ userid: message.author.id }, {
                    $push: {
                        stocks: {
                            code: results.items[0].code,
                            quantity: stock.stocks[0].quantity - quantity,
                            name: results.items[0].name,
                            price: stock.stocks[0].price
                        }
                    }
                });
                const successEmbed = new Embed_1.default(client, 'success')
                    .setTitle(`주식`)
                    .setDescription(`${results.items[0].name} ${quantity}주를 매도했어요!`)
                    .addField('거래금액', `${(0, comma_number_1.default)(total)}원`, true)
                    .addField('수수료', `${(0, comma_number_1.default)(fee)}원 (2%)`, true)
                    .addField('거래후 잔액', `${(0, comma_number_1.default)(user.money + total)}원`, true);
                return i.update({ embeds: [successEmbed], components: [] });
            }
            else if (i.customId == 'stocksell.deny') {
                embed.setDescription(`매도를 취소하였습니다.`);
                return i.update({ embeds: [embed], components: [] });
            }
        }));
        collector.on('end', (collected) => {
            if (collected.size == 1)
                return;
            m.edit({
                embeds: [embed],
                components: [
                    new discord_js_1.default.MessageActionRow()
                        .addComponents(new discord_js_1.default.MessageButton()
                        .setCustomId('stock.accept')
                        .setLabel('확인')
                        .setStyle('SUCCESS')
                        .setDisabled(true))
                        .addComponents(new discord_js_1.default.MessageButton()
                        .setCustomId('stock.deny')
                        .setLabel('아니요')
                        .setStyle('DANGER')
                        .setDisabled(true))
                ]
            });
        });
    }
    else if (args[0] == '보유') {
        const nowStock = yield Stock_1.default.findOne({ userid: message.author.id });
        if (!nowStock) {
            embed.setDescription(`보유중인 주식이없습니다, 먼저 \`${config_1.default.bot.prefix}주식\` 명령어로 주식 명령어를 확인해보세요!`);
            return message.reply({
                embeds: [embed]
            });
        }
        else {
            embed.setTitle(`${message.author.username}님의 보유중인 주식`);
            const results = yield Promise.all(nowStock.stocks.map((stock, index) => __awaiter(void 0, void 0, void 0, function* () {
                const stockSearch = yield (0, stock_1.searchStock)(stock.code);
                if (!stockSearch)
                    return `- ${index + 1}. ${stock.name} ${stock.quantity}주 ${(0, comma_number_1.default)(Math.round(stock.price * stock.quantity))}원 (실시간 정보 확인불가)`;
                return `${Math.round(stockSearch.now) > Math.round(stock.price)
                    ? '-'
                    : Math.round(stockSearch.now) < Math.round(stock.price)
                        ? '+'
                        : ' '} ${index + 1}. ${stock.name} ${stock.quantity}주 [ ${Math.round(stockSearch.now * stock.quantity) >
                    Math.round(stock.price * stock.quantity)
                    ? '▾'
                    : Math.round(stockSearch.now * stock.quantity) <
                        Math.round(stock.price * stock.quantity)
                        ? '▴'
                        : '-'} ${(0, comma_number_1.default)(Math.round(stock.price * stock.quantity))}원 ]`;
            })));
            embed.setDescription('```diff\n' + results.join('\n') + '```');
            return message.reply({
                embeds: [embed]
            });
        }
    }
    else {
        embed.setTitle('주식 도움말');
        embed.setDescription('아래에 있는 명령어로 주식을 사용해보세요!');
        embed.addField(`\`${config_1.default.bot.prefix}주식 목록 (주식명)\``, '> 검색한 주식들의 목록을 확인합니다', true);
        embed.addField(`\`${config_1.default.bot.prefix}주식 검색 (주식명)\``, '> 검색한 주식의 상세 정보를 확인합니다.', true);
        embed.addField(`\`${config_1.default.bot.prefix}주식 매수 (개수) (주식명)\``, '> 입력한 주식을 개수만큼 매수합니다.', true);
        embed.addField(`\`${config_1.default.bot.prefix}주식 매도 (개수) (주식명)\``, '> 입력한 주식을 개수만큼 매도합니다.', true);
        embed.addField(`\`${config_1.default.bot.prefix}주식 보유\``, '> 보유중인 주식을 확인합니다.', true);
        return message.reply({
            embeds: [embed]
        });
    }
}));
