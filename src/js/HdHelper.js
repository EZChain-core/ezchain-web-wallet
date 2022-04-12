import { __awaiter, __generator } from 'tslib'
import {
    KeyChain as AVMKeyChain,
    KeyPair as AVMKeyPair,
    UTXOSet as AVMUTXOSet,
} from 'ezchainjs2/dist/apis/avm'
import { UTXOSet as PlatformUTXOSet } from 'ezchainjs2/dist/apis/platformvm'
import { getPreferredHRP } from 'ezchainjs2/dist/utils'
import { ava, avm, bintools, pChain } from '@/AVA'
import { Buffer } from 'ezchainjs2'
import { KeyChain as PlatformVMKeyChain } from 'ezchainjs2/dist/apis/platformvm'
import store from '@/store'
import { getAddressChains } from '@/explorer_api'
import { avmGetAllUTXOs, platformGetAllUTXOs } from '@/helpers/utxo_helper'
import { updateFilterAddresses } from '../providers'
var INDEX_RANGE = 20 // a gap of at least 20 indexes is needed to claim an index unused
var SCAN_SIZE = 100 // the total number of utxos to look at initially to calculate last index
var SCAN_RANGE = SCAN_SIZE - INDEX_RANGE // How many items are actually scanned
var HdHelper = /** @class */ (function () {
    function HdHelper(changePath, masterKey, chainId, isPublic) {
        if (chainId === void 0) {
            chainId = 'X'
        }
        if (isPublic === void 0) {
            isPublic = false
        }
        this.changePath = changePath
        this.isFetchUtxo = false
        this.isInit = false
        this.chainId = chainId
        var hrp = getPreferredHRP(ava.getNetworkID())
        if (chainId === 'X') {
            this.keyChain = new AVMKeyChain(hrp, chainId)
            this.utxoSet = new AVMUTXOSet()
        } else {
            this.keyChain = new PlatformVMKeyChain(hrp, chainId)
            this.utxoSet = new PlatformUTXOSet()
        }
        this.keyCache = {}
        this.addressCache = {}
        this.hdCache = {}
        this.masterKey = masterKey
        this.hdIndex = 0
        this.isPublic = isPublic
        // this.oninit()
    }
    HdHelper.prototype.oninit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.findHdIndex()]
                    case 1:
                        _a.sent()
                        return [2 /*return*/]
                }
            })
        })
    }
    // When the wallet connects to a different network
    // Clear internal data and scan again
    HdHelper.prototype.onNetworkChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hrp
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.clearCache()
                        this.isInit = false
                        hrp = getPreferredHRP(ava.getNetworkID())
                        if (this.chainId === 'X') {
                            this.keyChain = new AVMKeyChain(hrp, this.chainId)
                            this.utxoSet = new AVMUTXOSet()
                        } else {
                            this.keyChain = new PlatformVMKeyChain(hrp, this.chainId)
                            this.utxoSet = new PlatformUTXOSet()
                        }
                        this.hdIndex = 0
                        return [4 /*yield*/, this.oninit()]
                    case 1:
                        _a.sent()
                        return [2 /*return*/]
                }
            })
        })
    }
    // Increments the hd index by one and adds the key
    // returns the new keypair
    HdHelper.prototype.incrementIndex = function () {
        var newIndex = this.hdIndex + 1
        if (!this.isPublic) {
            if (this.chainId === 'X') {
                var keychain = this.keyChain
                var newKey = this.getKeyForIndex(newIndex)
                keychain.addKey(newKey)
            } else {
                var keychain = this.keyChain
                var newKey = this.getKeyForIndex(newIndex)
                keychain.addKey(newKey)
            }
        }
        this.hdIndex = newIndex
        // Update websocket addresses with the new one
        updateFilterAddresses()
        return newIndex
    }
    HdHelper.prototype.findHdIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var network, explorerUrl, _a, _b
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        network = store.state.Network.selectedNetwork
                        explorerUrl = network.explorerUrl
                        if (!explorerUrl) return [3 /*break*/, 2]
                        _a = this
                        return [4 /*yield*/, this.findAvailableIndexExplorer()]
                    case 1:
                        _a.hdIndex = _c.sent()
                        return [3 /*break*/, 4]
                    case 2:
                        _b = this
                        return [4 /*yield*/, this.findAvailableIndexNode()]
                    case 3:
                        _b.hdIndex = _c.sent()
                        _c.label = 4
                    case 4:
                        if (!this.isPublic) {
                            this.updateKeychain()
                        }
                        this.isInit = true
                        return [2 /*return*/]
                }
            })
        })
    }
    // Fetches the utxos for the current keychain
    // and increments the index if last index has a utxo
    HdHelper.prototype.updateUtxos = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addrs, result, currentAddr, currentAddrBuf, currentUtxos
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isFetchUtxo = true
                        if (!this.isInit) {
                            console.error('HD Index not found yet.')
                        }
                        addrs = this.getAllDerivedAddresses()
                        if (!(this.chainId === 'X')) return [3 /*break*/, 2]
                        return [4 /*yield*/, avmGetAllUTXOs(addrs)]
                    case 1:
                        result = _a.sent()
                        return [3 /*break*/, 4]
                    case 2:
                        return [4 /*yield*/, platformGetAllUTXOs(addrs)]
                    case 3:
                        result = _a.sent()
                        _a.label = 4
                    case 4:
                        this.utxoSet = result // we can use local copy of utxos as cache for some functions
                        currentAddr = this.getCurrentAddress()
                        currentAddrBuf = bintools.parseAddress(currentAddr, this.chainId)
                        currentUtxos = result.getUTXOIDs([currentAddrBuf])
                        if (currentUtxos.length > 0) {
                            this.incrementIndex()
                        }
                        this.isFetchUtxo = false
                        return [2 /*return*/, result]
                }
            })
        })
    }
    // Returns more addresses than the current index
    HdHelper.prototype.getExtendedAddresses = function () {
        var hdIndex = this.hdIndex
        return this.getAllDerivedAddresses(hdIndex + INDEX_RANGE)
    }
    // Not used?
    HdHelper.prototype.getUtxos = function () {
        return this.utxoSet
    }
    // Updates the helper keychain to contain keys upto the HD Index
    HdHelper.prototype.updateKeychain = function () {
        var hrp = getPreferredHRP(ava.getNetworkID())
        var keychain
        if (this.chainId === 'X') {
            keychain = new AVMKeyChain(hrp, this.chainId)
        } else {
            keychain = new PlatformVMKeyChain(hrp, this.chainId)
        }
        for (var i = 0; i <= this.hdIndex; i++) {
            var key = void 0
            if (this.chainId === 'X') {
                key = this.getKeyForIndex(i)
                keychain.addKey(key)
            } else {
                key = this.getKeyForIndex(i)
                keychain.addKey(key)
            }
        }
        this.keyChain = keychain
        return keychain
    }
    HdHelper.prototype.getKeychain = function () {
        return this.keyChain
    }
    // Returns all key pairs up to hd index
    HdHelper.prototype.getAllDerivedKeys = function (upTo) {
        if (upTo === void 0) {
            upTo = this.hdIndex
        }
        var set = []
        for (var i = 0; i <= upTo; i++) {
            if (this.chainId === 'X') {
                var key = this.getKeyForIndex(i)
                set.push(key)
            } else {
                var key = this.getKeyForIndex(i)
                set.push(key)
            }
        }
        return set
    }
    HdHelper.prototype.getAllDerivedAddresses = function (upTo, start) {
        if (upTo === void 0) {
            upTo = this.hdIndex
        }
        if (start === void 0) {
            start = 0
        }
        var res = []
        for (var i = start; i <= upTo; i++) {
            var addr = this.getAddressForIndex(i)
            res.push(addr)
        }
        return res
    }
    HdHelper.prototype.clearCache = function () {
        this.keyCache = {}
        this.addressCache = {}
    }
    // Scans the address space of this hd path and finds the last used index using the
    // explorer API.
    HdHelper.prototype.findAvailableIndexExplorer = function (startIndex) {
        if (startIndex === void 0) {
            startIndex = 0
        }
        return __awaiter(this, void 0, void 0, function () {
            var upTo,
                addrs,
                addrChains,
                chainID,
                i,
                gapSize,
                n,
                scanIndex,
                scanAddr,
                rawAddr,
                chains
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        upTo = 512
                        addrs = this.getAllDerivedAddresses(startIndex + upTo, startIndex)
                        return [4 /*yield*/, getAddressChains(addrs)]
                    case 1:
                        addrChains = _a.sent()
                        if (this.chainId === 'X') {
                            chainID = avm.getBlockchainID()
                        } else {
                            chainID = pChain.getBlockchainID()
                        }
                        for (i = 0; i < addrs.length - INDEX_RANGE; i++) {
                            gapSize = 0
                            for (n = 0; n < INDEX_RANGE; n++) {
                                scanIndex = i + n
                                scanAddr = addrs[scanIndex]
                                rawAddr = scanAddr.split('-')[1]
                                chains = addrChains[rawAddr]
                                if (!chains) {
                                    // If doesnt exist on any chain
                                    gapSize++
                                } else if (!chains.includes(chainID)) {
                                    // If doesnt exist on this chain
                                    gapSize++
                                } else {
                                    i = i + n
                                    break
                                }
                            }
                            // If the gap is reached return the index
                            if (gapSize === INDEX_RANGE) {
                                return [2 /*return*/, startIndex + i]
                            }
                        }
                        return [
                            4 /*yield*/,
                            this.findAvailableIndexExplorer(startIndex + (upTo - INDEX_RANGE)),
                        ]
                    case 2:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    // Uses the node to find last used HD index
    // Only used when there is no explorer API available
    HdHelper.prototype.findAvailableIndexNode = function (start) {
        if (start === void 0) {
            start = 0
        }
        return __awaiter(this, void 0, void 0, function () {
            var addrs,
                i,
                address,
                utxoSet,
                i,
                gapSize,
                n,
                scanIndex,
                addr,
                addrBuf,
                addrUTXOs,
                targetIndex
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addrs = []
                        // Get keys for indexes start to start+scan_size
                        for (i = start; i < start + SCAN_SIZE; i++) {
                            address = this.getAddressForIndex(i)
                            addrs.push(address)
                        }
                        if (!(this.chainId === 'X')) return [3 /*break*/, 2]
                        return [4 /*yield*/, avm.getUTXOs(addrs)]
                    case 1:
                        utxoSet = _a.sent().utxos
                        return [3 /*break*/, 4]
                    case 2:
                        return [4 /*yield*/, pChain.getUTXOs(addrs)]
                    case 3:
                        utxoSet = _a.sent().utxos
                        _a.label = 4
                    case 4:
                        // Scan UTXOs of these indexes and try to find a gap of INDEX_RANGE
                        for (i = 0; i < addrs.length - INDEX_RANGE; i++) {
                            gapSize = 0
                            // console.log(`Scan index: ${this.chainId} ${this.changePath}/${i+start}`);
                            for (n = 0; n < INDEX_RANGE; n++) {
                                scanIndex = i + n
                                addr = addrs[scanIndex]
                                addrBuf = bintools.parseAddress(addr, this.chainId)
                                addrUTXOs = utxoSet.getUTXOIDs([addrBuf])
                                if (addrUTXOs.length === 0) {
                                    gapSize++
                                } else {
                                    // Potential improvement
                                    i = i + n
                                    break
                                }
                            }
                            // If we found a gap of 20, we can return the last fullIndex+1
                            if (gapSize === INDEX_RANGE) {
                                targetIndex = start + i
                                return [2 /*return*/, targetIndex]
                            }
                        }
                        return [4 /*yield*/, this.findAvailableIndexNode(start + SCAN_RANGE)]
                    case 5:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    HdHelper.prototype.getFirstAvailableIndex = function () {
        for (var i = 0; i < this.hdIndex; i++) {
            var addr = this.getAddressForIndex(i)
            var addrBuf = bintools.parseAddress(addr, this.chainId)
            var utxoIds = this.utxoSet.getUTXOIDs([addrBuf])
            if (utxoIds.length === 0) {
                return i
            }
        }
        return 0
    }
    // Returns the key of the first index that has no utxos
    HdHelper.prototype.getFirstAvailableAddress = function () {
        var idx = this.getFirstAvailableIndex()
        return this.getAddressForIndex(idx)
    }
    HdHelper.prototype.getCurrentKey = function () {
        var index = this.hdIndex
        return this.getKeyForIndex(index)
    }
    HdHelper.prototype.getCurrentAddress = function () {
        var index = this.hdIndex
        return this.getAddressForIndex(index)
    }
    // TODO: Public wallet should never be using this
    HdHelper.prototype.getKeyForIndex = function (index, isPrivate) {
        if (isPrivate === void 0) {
            isPrivate = true
        }
        // If key is cached return that
        var cacheExternal
        if (this.chainId === 'X') {
            cacheExternal = this.keyCache[index]
        } else {
            cacheExternal = this.keyCache[index]
        }
        if (cacheExternal) return cacheExternal
        var derivationPath = this.changePath + '/' + index.toString()
        // Get key from cache, if not generate it
        var key
        if (this.hdCache[index]) {
            key = this.hdCache[index]
        } else {
            key = this.masterKey.derive(derivationPath)
            this.hdCache[index] = key
        }
        var pkHex
        if (!this.isPublic) {
            pkHex = key.privateKey.toString('hex')
        } else {
            pkHex = key.publicKey.toString('hex')
        }
        var pkBuf = new Buffer(pkHex, 'hex')
        var keypair = this.keyChain.importKey(pkBuf)
        // save to cache
        this.keyCache[index] = keypair
        return keypair
    }
    HdHelper.prototype.getAddressForIndex = function (index) {
        if (this.addressCache[index]) {
            return this.addressCache[index]
        }
        var derivationPath = this.changePath + '/' + index.toString()
        // let key: HDKey = this.masterKey.derive(derivationPath) as HDKey;
        // Get key from cache, if not generate it
        var key
        if (this.hdCache[index]) {
            key = this.hdCache[index]
        } else {
            key = this.masterKey.derive(derivationPath)
            this.hdCache[index] = key
        }
        var pkHex = key.publicKey.toString('hex')
        var pkBuff = Buffer.from(pkHex, 'hex')
        var hrp = getPreferredHRP(ava.getNetworkID())
        var chainId = this.chainId
        // No need for PlatformKeypair because addressToString uses chainID to decode
        var keypair = new AVMKeyPair(hrp, chainId)
        var addrBuf = keypair.addressFromPublicKey(pkBuff)
        var addr = bintools.addressToString(hrp, chainId, addrBuf)
        this.addressCache[index] = addr
        return addr
    }
    // Given an address find the derived index
    HdHelper.prototype.findAddressIndex = function (addr) {
        var addrs = this.getAllDerivedAddresses()
        var index = addrs.indexOf(addr)
        if (index < 0) return null
        return index
    }
    return HdHelper
})()
export { HdHelper }
//# sourceMappingURL=HdHelper.js.map
