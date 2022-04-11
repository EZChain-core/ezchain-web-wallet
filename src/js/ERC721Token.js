import { __awaiter, __generator } from 'tslib'
import { web3 } from '@/evm'
import ERC721Abi from '@openzeppelin/contracts/build/contracts/ERC721.json'
import axios from 'axios'
var ERC721MetadataID = '0x5b5e139f'
var ERC721EnumerableID = '0x780e9d63'
var ERC721Token = /** @class */ (function () {
    function ERC721Token(data) {
        this.name = ''
        this.symbol = ''
        this.tokenCache = {}
        this.uriDataCache = {}
        this.canSupport = false
        this.contractAddress = data.address
        this.name = data.name
        this.symbol = data.symbol
        this.data = data
        //@ts-ignore
        this.contract = new web3.eth.Contract(ERC721Abi.abi, this.contractAddress)
        this.updateSupports()
    }
    ERC721Token.prototype.updateSupports = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metadata, enumerable, err_1
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4])
                        return [
                            4 /*yield*/,
                            this.contract.methods.supportsInterface(ERC721MetadataID).call(),
                        ]
                    case 1:
                        metadata = _a.sent()
                        return [
                            4 /*yield*/,
                            this.contract.methods.supportsInterface(ERC721EnumerableID).call(),
                        ]
                    case 2:
                        enumerable = _a.sent()
                        this.canSupport = metadata && enumerable
                        return [3 /*break*/, 4]
                    case 3:
                        err_1 = _a.sent()
                        this.canSupport = false
                        return [3 /*break*/, 4]
                    case 4:
                        return [2 /*return*/]
                }
            })
        })
    }
    ERC721Token.prototype.getBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.contract.methods.balanceOf(address).call()]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    ERC721Token.prototype.getAllTokensIds = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var bal, res, i, tokenId
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.canSupport) return [2 /*return*/, []]
                        return [4 /*yield*/, this.getBalance(address)]
                    case 1:
                        bal = _a.sent()
                        res = []
                        i = 0
                        _a.label = 2
                    case 2:
                        if (!(i < bal)) return [3 /*break*/, 5]
                        return [
                            4 /*yield*/,
                            this.contract.methods.tokenOfOwnerByIndex(address, i).call(),
                        ]
                    case 3:
                        tokenId = _a.sent()
                        res.push(tokenId)
                        _a.label = 4
                    case 4:
                        i++
                        return [3 /*break*/, 2]
                    case 5:
                        return [2 /*return*/, res]
                }
            })
        })
    }
    ERC721Token.prototype.getAllTokenData = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var ids, res, i, id, data
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.getAllTokensIds(address)]
                    case 1:
                        ids = _a.sent()
                        res = []
                        i = 0
                        _a.label = 2
                    case 2:
                        if (!(i < ids.length)) return [3 /*break*/, 5]
                        id = ids[i]
                        return [4 /*yield*/, this.getTokenURI(parseInt(id))]
                    case 3:
                        data = _a.sent()
                        res.push(data)
                        _a.label = 4
                    case 4:
                        i++
                        return [3 /*break*/, 2]
                    case 5:
                        return [2 /*return*/, res]
                }
            })
        })
    }
    ERC721Token.prototype.createTransferTx = function (from, to, id) {
        return this.contract.methods.transferFrom(from, to, id)
    }
    ERC721Token.prototype.getTokenURI = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var data
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.tokenCache[id]) return [2 /*return*/, this.tokenCache[id]]
                        return [4 /*yield*/, this.contract.methods.tokenURI(id).call()]
                    case 1:
                        data = _a.sent()
                        this.tokenCache[id] = data
                        return [2 /*return*/, data]
                }
            })
        })
    }
    ERC721Token.prototype.getTokenURIData = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, res
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //Check cache
                        if (this.uriDataCache[id]) return [2 /*return*/, this.uriDataCache[id]]
                        return [4 /*yield*/, this.getTokenURI(id)]
                    case 1:
                        uri = _a.sent()
                        if (!uri) return [2 /*return*/, null]
                        return [4 /*yield*/, axios.get(uri)]
                    case 2:
                        res = _a.sent().data
                        //Save to cache
                        this.uriDataCache[id] = res
                        return [2 /*return*/, res]
                }
            })
        })
    }
    return ERC721Token
})()
export default ERC721Token
//# sourceMappingURL=ERC721Token.js.map
