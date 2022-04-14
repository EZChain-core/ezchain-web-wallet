import { __awaiter, __generator } from 'tslib'
var axios = require('axios')
var COIN_ID = 'avalanche-2'
var COINGECKO_URL =
    'https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd'
var coingeckoApi = axios.create({
    baseURL: 'https://api.coingecko.com/api/v3',
    timeout: 10000,
})
export function getAvaxPriceUSD() {
    return __awaiter(this, void 0, void 0, function () {
        var res
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [
                        4 /*yield*/,
                        axios.get(COINGECKO_URL),
                        //return res.data['avalanche-2']['usd']
                    ]
                case 1:
                    res = _a.sent()
                    //return res.data['avalanche-2']['usd']
                    return [2 /*return*/, 1]
            }
        })
    })
}
var priceHistory = []
function getPriceHistory() {
    return __awaiter(this, void 0, void 0, function () {
        var res
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [
                        4 /*yield*/,
                        coingeckoApi.get('/coins/' + COIN_ID + '/market_chart', {
                            params: {
                                vs_currency: 'usd',
                                days: 'max',
                                interval: 'daily',
                            },
                        }),
                    ]
                case 1:
                    res = _a.sent()
                    priceHistory = res.data.prices
                    return [2 /*return*/]
            }
        })
    })
}
/**
 * Round the UNIX time in ms and search the previously fetched price points
 * @param time
 */
export function getPriceAtUnixTime(time) {
    var remainder = time % (24 * 60 * 60 * 1000)
    var dayTimestamp = time - remainder
    var pricePair = priceHistory.find(function (value) {
        return value[0] == dayTimestamp
    })
    if (!pricePair) return undefined
    return pricePair[1]
}
getPriceHistory()
//# sourceMappingURL=price_helper.js.map
