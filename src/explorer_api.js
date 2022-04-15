import { __awaiter, __generator, __read, __spread } from "tslib";
import axios from 'axios';
// Doesn't really matter what we set, it will change
var api_url = 'localhost';
var explorer_api = axios.create({
    baseURL: api_url,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
});
function getAddressHistory(addrs, limit, chainID, endTime) {
    if (limit === void 0) { limit = 20; }
    return __awaiter(this, void 0, void 0, function () {
        var ADDR_SIZE, selection, remaining, addrsRaw, rootUrl, req, res, txs, next, endTime_1, nextRes, nextRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ADDR_SIZE = 1024;
                    selection = addrs.slice(0, ADDR_SIZE);
                    remaining = addrs.slice(ADDR_SIZE);
                    addrsRaw = selection.map(function (addr) {
                        return addr.split('-')[1];
                    });
                    rootUrl = 'v2/transactions';
                    req = {
                        address: addrsRaw,
                        sort: ['timestamp-desc'],
                        disableCount: ['1'],
                        chainID: [chainID],
                        disableGenesis: ['false'],
                    };
                    if (limit > 0) {
                        //@ts-ignore
                        req.limit = [limit.toString()];
                    }
                    if (endTime) {
                        console.log('Setting endtime');
                        //@ts-ignore
                        req.endTime = [endTime];
                    }
                    return [4 /*yield*/, explorer_api.post(rootUrl, req)];
                case 1:
                    res = _a.sent();
                    txs = res.data.transactions;
                    next = res.data.next;
                    if (txs === null)
                        txs = [];
                    if (!(next && !limit)) return [3 /*break*/, 3];
                    endTime_1 = next.split('&')[0].split('=')[1];
                    return [4 /*yield*/, getAddressHistory(selection, limit, chainID, endTime_1)];
                case 2:
                    nextRes = _a.sent();
                    txs.push.apply(txs, __spread(nextRes));
                    _a.label = 3;
                case 3:
                    if (!(remaining.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, getAddressHistory(remaining, limit, chainID)];
                case 4:
                    nextRes = _a.sent();
                    txs.push.apply(txs, __spread(nextRes));
                    _a.label = 5;
                case 5: return [2 /*return*/, txs];
            }
        });
    });
}
function isAddressUsedX(addr) {
    return __awaiter(this, void 0, void 0, function () {
        var addrRaw, url, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addrRaw = addr.split('-')[1];
                    url = "/x/transactions?address=" + addrRaw + "&limit=1&disableCount=1";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, explorer_api.get(url)
                        // console.log(res);
                    ];
                case 2:
                    res = _a.sent();
                    // console.log(res);
                    if (res.data.transactions.length > 0)
                        return [2 /*return*/, true];
                    else
                        return [2 /*return*/, false];
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAddressDetailX(addr) {
    return __awaiter(this, void 0, void 0, function () {
        var addrRaw, url, res, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addrRaw = addr.split('-')[1];
                    url = "/x/addresses/" + addrRaw;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, explorer_api.get(url)];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res.data];
                case 3:
                    e_2 = _a.sent();
                    throw e_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAddressChains(addrs) {
    return __awaiter(this, void 0, void 0, function () {
        var rawAddrs, urlRoot, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rawAddrs = addrs.map(function (addr) {
                        return addr.split('-')[1];
                    });
                    urlRoot = "/v2/addressChains";
                    return [4 /*yield*/, explorer_api.post(urlRoot, {
                            address: rawAddrs,
                            disableCount: ['1'],
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data.addressChains];
            }
        });
    });
}
export { explorer_api, getAddressHistory, getAddressDetailX, isAddressUsedX, getAddressChains };
//# sourceMappingURL=explorer_api.js.map