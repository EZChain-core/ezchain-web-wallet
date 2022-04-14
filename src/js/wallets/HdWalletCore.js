import { __awaiter, __extends, __generator } from 'tslib'
import { BN, Buffer } from 'ezchainjs2'
import { ava, avm, bintools } from '@/AVA'
import { HdHelper } from '@/js/HdHelper'
import { buildUnsignedTransaction } from '../TxHelper'
import { WalletCore } from '@/js/wallets/WalletCore'
import { updateFilterAddresses } from '../../providers'
import { digestMessage } from '@/helpers/helper'
// A base class other HD wallets are based on.
// Mnemonic Wallet and LedgerWallet uses this
var HdWalletCore = /** @class */ (function (_super) {
    __extends(HdWalletCore, _super)
    function HdWalletCore(accountHdKey, ethHdNode, isPublic) {
        if (isPublic === void 0) {
            isPublic = true
        }
        var _this = _super.call(this) || this
        _this.ethHdNode = ethHdNode
        _this.chainId = avm.getBlockchainAlias() || avm.getBlockchainID()
        _this.externalHelper = new HdHelper('m/0', accountHdKey, undefined, isPublic)
        _this.internalHelper = new HdHelper('m/1', accountHdKey, undefined, isPublic)
        _this.platformHelper = new HdHelper('m/0', accountHdKey, 'P', isPublic)
        _this.externalHelper.oninit().then(function (res) {
            _this.updateInitState()
        })
        _this.internalHelper.oninit().then(function (res) {
            _this.updateInitState()
        })
        _this.platformHelper.oninit().then(function (res) {
            _this.updateInitState()
        })
        return _this
    }
    HdWalletCore.prototype.getEvmAddressBech = function () {
        return bintools.addressToString(
            ava.getHRP(),
            'C',
            // @ts-ignore
            this.ethHdNode.pubKeyHash
        )
    }
    HdWalletCore.prototype.updateAvmUTXOSet = function () {
        // if (this.isFetchUtxos) return
        var setExternal = this.externalHelper.utxoSet
        var setInternal = this.internalHelper.utxoSet
        var joined = setInternal.merge(setExternal)
        this.utxoset = joined
    }
    HdWalletCore.prototype.getFirstAvailableAddressPlatform = function () {
        return this.platformHelper.getFirstAvailableAddress()
    }
    HdWalletCore.prototype.updateFetchState = function () {
        this.isFetchUtxos =
            this.externalHelper.isFetchUtxo ||
            this.internalHelper.isFetchUtxo ||
            this.platformHelper.isFetchUtxo
    }
    HdWalletCore.prototype.updateInitState = function () {
        this.isInit =
            this.externalHelper.isInit && this.internalHelper.isInit && this.platformHelper.isInit
        if (this.isInit) {
            updateFilterAddresses()
        }
    }
    // Fetches the utxos
    HdWalletCore.prototype.getUTXOs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updateUTXOsX()
                // platform utxos are updated but not returned by function
                this.updateUTXOsP()
                return [2 /*return*/]
            })
        })
    }
    HdWalletCore.prototype.updateUTXOsX = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.updateUTXOsExternal()
                this.updateUTXOsInternal()
                return [2 /*return*/]
            })
        })
    }
    HdWalletCore.prototype.updateUTXOsExternal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.externalHelper.updateUtxos()]
                    case 1:
                        res = _a.sent()
                        this.updateFetchState()
                        this.updateAvmUTXOSet()
                        return [2 /*return*/]
                }
            })
        })
    }
    HdWalletCore.prototype.updateUTXOsInternal = function () {
        return __awaiter(this, void 0, void 0, function () {
            var utxoSet
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.internalHelper.updateUtxos()]
                    case 1:
                        utxoSet = _a.sent()
                        this.updateFetchState()
                        this.updateAvmUTXOSet()
                        return [2 /*return*/]
                }
            })
        })
    }
    HdWalletCore.prototype.updateUTXOsP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var utxoSet
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.platformHelper.updateUtxos()]
                    case 1:
                        utxoSet = _a.sent()
                        this.updateFetchState()
                        return [2 /*return*/]
                }
            })
        })
    }
    HdWalletCore.prototype.getAllDerivedExternalAddresses = function () {
        return this.externalHelper.getAllDerivedAddresses()
    }
    HdWalletCore.prototype.getDerivedAddresses = function () {
        var internal = this.internalHelper.getAllDerivedAddresses()
        var external = this.externalHelper.getAllDerivedAddresses()
        return internal.concat(external)
    }
    HdWalletCore.prototype.getDerivedAddressesP = function () {
        return this.platformHelper.getAllDerivedAddresses()
    }
    HdWalletCore.prototype.getAllAddressesX = function () {
        return this.getDerivedAddresses()
    }
    HdWalletCore.prototype.getAllAddressesP = function () {
        return this.getDerivedAddressesP()
    }
    // Returns addresses to check for history
    HdWalletCore.prototype.getHistoryAddresses = function () {
        var internalIndex = this.internalHelper.hdIndex
        // They share the same address space, so whatever has the highest index
        var externalIndex = Math.max(this.externalHelper.hdIndex, this.platformHelper.hdIndex)
        var internal = this.internalHelper.getAllDerivedAddresses(internalIndex)
        var external = this.externalHelper.getAllDerivedAddresses(externalIndex)
        return internal.concat(external)
    }
    HdWalletCore.prototype.getCurrentAddressAvm = function () {
        return this.externalHelper.getCurrentAddress()
    }
    HdWalletCore.prototype.getChangeAddressAvm = function () {
        return this.internalHelper.getCurrentAddress()
    }
    HdWalletCore.prototype.getChangeAddressPlatform = function () {
        return this.platformHelper.getCurrentAddress()
    }
    HdWalletCore.prototype.getChangePath = function (chainId) {
        switch (chainId) {
            case 'P':
                return this.platformHelper.changePath
            case 'X':
            default:
                return this.internalHelper.changePath
        }
    }
    HdWalletCore.prototype.getChangeIndex = function (chainId) {
        switch (chainId) {
            case 'P':
                return this.platformHelper.hdIndex
            case 'X':
            default:
                return this.internalHelper.hdIndex
        }
    }
    HdWalletCore.prototype.getChangeFromIndex = function (idx, chainId) {
        if (idx === undefined || idx === null) return null
        switch (chainId) {
            case 'P':
                return this.platformHelper.getAddressForIndex(idx)
            case 'X':
            default:
                return this.internalHelper.getAddressForIndex(idx)
        }
    }
    HdWalletCore.prototype.getPlatformRewardAddress = function () {
        return this.platformHelper.getCurrentAddress()
    }
    HdWalletCore.prototype.getCurrentAddressPlatform = function () {
        return this.platformHelper.getCurrentAddress()
    }
    HdWalletCore.prototype.getPlatformUTXOSet = function () {
        return this.platformHelper.utxoSet
    }
    HdWalletCore.prototype.getPlatformActiveIndex = function () {
        return this.platformHelper.hdIndex
    }
    HdWalletCore.prototype.getExternalActiveIndex = function () {
        return this.externalHelper.hdIndex
    }
    HdWalletCore.prototype.getBaseAddress = function () {
        return this.externalHelper.getAddressForIndex(0)
    }
    HdWalletCore.prototype.onnetworkchange = function () {
        var _this = this
        this.isInit = false
        this.stakeAmount = new BN(0)
        this.externalHelper.onNetworkChange().then(function () {
            _this.updateInitState()
        })
        this.internalHelper.onNetworkChange().then(function () {
            _this.updateInitState()
        })
        this.platformHelper.onNetworkChange().then(function () {
            _this.updateInitState()
        })
        // TODO: Handle EVM changes
    }
    HdWalletCore.prototype.buildUnsignedTransaction = function (orders, addr, memo) {
        return __awaiter(this, void 0, void 0, function () {
            var changeAddress, derivedAddresses, utxoset
            return __generator(this, function (_a) {
                changeAddress = this.getChangeAddressAvm()
                derivedAddresses = this.getDerivedAddresses()
                utxoset = this.getUTXOSet()
                return [
                    2 /*return*/,
                    buildUnsignedTransaction(
                        orders,
                        addr,
                        derivedAddresses,
                        utxoset,
                        changeAddress,
                        memo
                    ),
                ]
            })
        })
    }
    HdWalletCore.prototype.findExternalAddressIndex = function (address) {
        // TODO: Look for P addresses too
        var indexX = this.externalHelper.findAddressIndex(address)
        var indexP = this.platformHelper.findAddressIndex(address)
        var index = indexX !== null ? indexX : indexP
        if (indexX === null && indexP === null) throw new Error('Address not found.')
        return index
    }
    HdWalletCore.prototype.signMessageByExternalAddress = function (msgStr, address) {
        return __awaiter(this, void 0, void 0, function () {
            var index
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        index = this.findExternalAddressIndex(address)
                        if (index === null) throw new Error('Address not found.')
                        return [4 /*yield*/, this.signMessageByExternalIndex(msgStr, index)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    HdWalletCore.prototype.signMessageByExternalIndex = function (msgStr, index) {
        return __awaiter(this, void 0, void 0, function () {
            var digest, digestHex, digestBuff
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        digest = digestMessage(msgStr)
                        digestHex = digest.toString('hex')
                        digestBuff = Buffer.from(digestHex, 'hex')
                        return [4 /*yield*/, this.signHashByExternalIndex(index, digestBuff)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    HdWalletCore.prototype.signMessage = function (msg, address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.signMessageByExternalAddress(msg, address)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    return HdWalletCore
})(WalletCore)
export { HdWalletCore }
//# sourceMappingURL=HdWalletCore.js.map
