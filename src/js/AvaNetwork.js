import { __awaiter, __generator } from 'tslib'
import axios from 'axios'
var network_id = 0
var AvaNetwork = /** @class */ (function () {
    // fee: BN
    function AvaNetwork(name, url, networkId, explorerUrl, explorerSiteUrl, readonly) {
        if (readonly === void 0) {
            readonly = false
        }
        this.withCredentials = false
        this.id = network_id++
        this.name = name
        this.explorerUrl = explorerUrl
        this.explorerSiteUrl = explorerSiteUrl
        this.protocol = 'http'
        this.port = 9650
        this.ip = 'localhost'
        this.url = url
        this.updateURL(url)
        this.networkId = networkId
        // this.chainId = chainId;
        this.readonly = readonly
        // this.fee = new BN(0);
    }
    AvaNetwork.prototype.testConnection = function (credentials) {
        if (credentials === void 0) {
            credentials = false
        }
        return __awaiter(this, void 0, void 0, function () {
            var resp
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            axios
                                .post(
                                    this.url + '/ext/info',
                                    {
                                        jsonrpc: '2.0',
                                        id: 1,
                                        method: 'info.getNetworkID',
                                    },
                                    {
                                        withCredentials: true,
                                    }
                                )
                                .catch(function (err) {
                                    return false
                                }),
                        ]
                    case 1:
                        resp = _a.sent()
                        return [2 /*return*/, true]
                }
            })
        })
    }
    // Checks if this network endpoint allows credentials
    AvaNetwork.prototype.updateCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, e_1
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3])
                        return [
                            4 /*yield*/,
                            axios.post(
                                this.url + '/ext/info',
                                {
                                    jsonrpc: '2.0',
                                    id: 1,
                                    method: 'info.getNetworkID',
                                },
                                {
                                    withCredentials: true,
                                }
                            ),
                        ]
                    case 1:
                        res = _a.sent()
                        this.withCredentials = true
                        return [3 /*break*/, 3]
                    case 2:
                        e_1 = _a.sent()
                        this.withCredentials = false
                        return [3 /*break*/, 3]
                    case 3:
                        return [2 /*return*/]
                }
            })
        })
    }
    AvaNetwork.prototype.updateURL = function (url) {
        var split = url.split('://')
        this.protocol = split[0]
        // port is set
        if (split[1].includes(':')) {
            var urlSplit = split[1].split(':')
            var ip = urlSplit[0]
            var port = urlSplit[1]
            this.ip = ip
            this.port = parseInt(port)
        } else {
            this.ip = split[1]
            if (this.protocol === 'http') {
                this.port = 80
            } else {
                this.port = 443
            }
        }
    }
    AvaNetwork.prototype.getFullURL = function () {
        return this.protocol + '://' + this.ip + ':' + this.port
    }
    AvaNetwork.prototype.getWsUrlX = function () {
        var protocol = this.protocol === 'https' ? 'wss' : 'ws'
        return protocol + '://' + this.ip + ':' + this.port + '/ext/bc/X/events'
    }
    AvaNetwork.prototype.getWsUrlC = function () {
        var protocol = this.protocol === 'https' ? 'wss' : 'ws'
        return protocol + '://' + this.ip + ':' + this.port + '/ext/bc/C/ws'
    }
    return AvaNetwork
})()
export { AvaNetwork }
//# sourceMappingURL=AvaNetwork.js.map
