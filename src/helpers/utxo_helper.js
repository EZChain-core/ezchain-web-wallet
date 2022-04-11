import { __awaiter, __generator } from 'tslib'
import { avm, pChain } from '@/AVA'
export function getStakeForAddresses(addrs) {
    return __awaiter(this, void 0, void 0, function () {
        var stakeData, chunk, remainingChunk, stakeData, chunkStake, _a, _b
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(addrs.length <= 256)) return [3 /*break*/, 2]
                    return [4 /*yield*/, pChain.getStake(addrs)]
                case 1:
                    stakeData = _c.sent()
                    return [2 /*return*/, stakeData.staked]
                case 2:
                    chunk = addrs.slice(0, 256)
                    remainingChunk = addrs.slice(256)
                    return [4 /*yield*/, pChain.getStake(chunk)]
                case 3:
                    stakeData = _c.sent()
                    chunkStake = stakeData.staked
                    _b = (_a = chunkStake).add
                    return [4 /*yield*/, getStakeForAddresses(remainingChunk)]
                case 4:
                    return [2 /*return*/, _b.apply(_a, [_c.sent()])]
            }
        })
    })
}
export function avmGetAllUTXOs(addrs) {
    return __awaiter(this, void 0, void 0, function () {
        var utxos, chunk, remainingChunk, newSet, _a, _b
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(addrs.length <= 1024)) return [3 /*break*/, 2]
                    return [4 /*yield*/, avmGetAllUTXOsForAddresses(addrs)]
                case 1:
                    utxos = _c.sent()
                    return [2 /*return*/, utxos]
                case 2:
                    chunk = addrs.slice(0, 1024)
                    remainingChunk = addrs.slice(1024)
                    return [4 /*yield*/, avmGetAllUTXOsForAddresses(chunk)]
                case 3:
                    newSet = _c.sent()
                    _b = (_a = newSet).merge
                    return [4 /*yield*/, avmGetAllUTXOs(remainingChunk)]
                case 4:
                    return [2 /*return*/, _b.apply(_a, [_c.sent()])]
            }
        })
    })
}
export function avmGetAllUTXOsForAddresses(addrs, endIndex) {
    if (endIndex === void 0) {
        endIndex = undefined
    }
    return __awaiter(this, void 0, void 0, function () {
        var response, utxoSet, utxos, nextEndIndex, len, subUtxos
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (addrs.length > 1024) throw new Error('Maximum length of addresses is 1024')
                    if (endIndex) return [3 /*break*/, 2]
                    return [4 /*yield*/, avm.getUTXOs(addrs)]
                case 1:
                    response = _a.sent()
                    return [3 /*break*/, 4]
                case 2:
                    return [4 /*yield*/, avm.getUTXOs(addrs, undefined, 0, endIndex)]
                case 3:
                    response = _a.sent()
                    _a.label = 4
                case 4:
                    utxoSet = response.utxos
                    utxos = utxoSet.getAllUTXOs()
                    nextEndIndex = response.endIndex
                    len = response.numFetched
                    if (!(len >= 1024)) return [3 /*break*/, 6]
                    return [4 /*yield*/, avmGetAllUTXOsForAddresses(addrs, nextEndIndex)]
                case 5:
                    subUtxos = _a.sent()
                    return [2 /*return*/, utxoSet.merge(subUtxos)]
                case 6:
                    return [2 /*return*/, utxoSet]
            }
        })
    })
}
// helper method to get utxos for more than 1024 addresses
export function platformGetAllUTXOs(addrs) {
    return __awaiter(this, void 0, void 0, function () {
        var newSet, chunk, remainingChunk, newSet, _a, _b
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(addrs.length <= 1024)) return [3 /*break*/, 2]
                    return [4 /*yield*/, platformGetAllUTXOsForAddresses(addrs)]
                case 1:
                    newSet = _c.sent()
                    return [2 /*return*/, newSet]
                case 2:
                    chunk = addrs.slice(0, 1024)
                    remainingChunk = addrs.slice(1024)
                    return [4 /*yield*/, platformGetAllUTXOsForAddresses(chunk)]
                case 3:
                    newSet = _c.sent()
                    _b = (_a = newSet).merge
                    return [4 /*yield*/, platformGetAllUTXOs(remainingChunk)]
                case 4:
                    return [2 /*return*/, _b.apply(_a, [_c.sent()])]
            }
        })
    })
}
export function platformGetAllUTXOsForAddresses(addrs, endIndex) {
    if (endIndex === void 0) {
        endIndex = undefined
    }
    return __awaiter(this, void 0, void 0, function () {
        var response, utxoSet, nextEndIndex, len, subUtxos
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (endIndex) return [3 /*break*/, 2]
                    return [4 /*yield*/, pChain.getUTXOs(addrs)]
                case 1:
                    response = _a.sent()
                    return [3 /*break*/, 4]
                case 2:
                    return [4 /*yield*/, pChain.getUTXOs(addrs, undefined, 0, endIndex)]
                case 3:
                    response = _a.sent()
                    _a.label = 4
                case 4:
                    utxoSet = response.utxos
                    nextEndIndex = response.endIndex
                    len = response.numFetched
                    if (!(len >= 1024)) return [3 /*break*/, 6]
                    return [4 /*yield*/, platformGetAllUTXOsForAddresses(addrs, nextEndIndex)]
                case 5:
                    subUtxos = _a.sent()
                    return [2 /*return*/, utxoSet.merge(subUtxos)]
                case 6:
                    return [2 /*return*/, utxoSet]
            }
        })
    })
}
//# sourceMappingURL=utxo_helper.js.map
