import { __awaiter, __generator } from 'tslib'
/*
The base wallet class used for common functionality
*/
import { BN } from 'ezchainjs2'
import { UTXOSet as AVMUTXOSet } from 'ezchainjs2/dist/apis/avm'
import { UTXOSet as PlatformUTXOSet } from 'ezchainjs2/dist/apis/platformvm'
import { Network, UtxoHelper, TxHelper, GasHelper } from 'ezchain-wallet-sdk'
import { ava, avm, bintools, cChain, pChain } from '@/AVA'
var uniqid = require('uniqid')
var WalletCore = /** @class */ (function () {
    function WalletCore() {
        this.id = uniqid()
        this.utxoset = new AVMUTXOSet()
        this.platformUtxoset = new PlatformUTXOSet()
        this.stakeAmount = new BN(0)
        this.isInit = false
        this.isFetchUtxos = false
    }
    WalletCore.prototype.getUTXOSet = function () {
        return this.utxoset
    }
    WalletCore.prototype.evmGetAtomicUTXOs = function (sourceChain) {
        return __awaiter(this, void 0, void 0, function () {
            var addrs
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addrs = [this.getEvmAddressBech()]
                        return [4 /*yield*/, UtxoHelper.evmGetAtomicUTXOs(addrs, sourceChain)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletCore.prototype.createImportTxC = function (sourceChain, utxoSet, fee) {
        return __awaiter(this, void 0, void 0, function () {
            var bechAddr, hexAddr, toAddress, ownerAddresses, fromAddresses, sourceChainId
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bechAddr = this.getEvmAddressBech()
                        hexAddr = this.getEvmAddress()
                        toAddress = '0x' + hexAddr
                        ownerAddresses = [bechAddr]
                        fromAddresses = ownerAddresses
                        sourceChainId = Network.chainIdFromAlias(sourceChain)
                        return [
                            4 /*yield*/,
                            cChain.buildImportTx(
                                utxoSet,
                                toAddress,
                                ownerAddresses,
                                sourceChainId,
                                fromAddresses,
                                fee
                            ),
                        ]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    /**
     *
     * @param sourceChain
     * @param fee Fee to use in nAVAX
     * @param utxoSet
     */
    WalletCore.prototype.importToCChain = function (sourceChain, fee, utxoSet) {
        return __awaiter(this, void 0, void 0, function () {
            var unsignedTxFee, tx, id
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utxoSet) return [3 /*break*/, 2]
                        return [4 /*yield*/, this.evmGetAtomicUTXOs(sourceChain)]
                    case 1:
                        utxoSet = _a.sent()
                        _a.label = 2
                    case 2:
                        // TODO: Only use AVAX utxos
                        // TODO?: If the import fee for a utxo is greater than the value of the utxo, ignore it
                        if (utxoSet.getAllUTXOs().length === 0) {
                            throw new Error('Nothing to import.')
                        }
                        return [4 /*yield*/, this.createImportTxC(sourceChain, utxoSet, fee)]
                    case 3:
                        unsignedTxFee = _a.sent()
                        return [4 /*yield*/, this.signC(unsignedTxFee)]
                    case 4:
                        tx = _a.sent()
                        return [4 /*yield*/, cChain.issueTx(tx.toString())]
                    case 5:
                        id = _a.sent()
                        return [2 /*return*/, id]
                }
            })
        })
    }
    WalletCore.prototype.exportFromXChain = function (amt, destinationChain, importFee) {
        return __awaiter(this, void 0, void 0, function () {
            var amtFee, destinationAddr, fee, fromAddresses, changeAddress, utxos, exportTx, tx
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (destinationChain === 'C' && !importFee)
                            throw new Error('Exports to C chain must specify an import fee.')
                        amtFee = amt.clone()
                        destinationAddr =
                            destinationChain === 'P'
                                ? this.getCurrentAddressPlatform()
                                : this.getEvmAddressBech()
                        // Add import fee to transaction
                        if (importFee) {
                            amtFee = amt.add(importFee)
                        } else if (destinationChain === 'P') {
                            fee = pChain.getTxFee()
                            amtFee = amt.add(fee)
                        }
                        fromAddresses = this.getAllAddressesX()
                        changeAddress = this.getChangeAddressAvm()
                        utxos = this.getUTXOSet()
                        return [
                            4 /*yield*/,
                            TxHelper.buildAvmExportTransaction(
                                destinationChain,
                                utxos,
                                fromAddresses,
                                destinationAddr,
                                amtFee,
                                changeAddress
                            ),
                        ]
                    case 1:
                        exportTx = _a.sent()
                        return [4 /*yield*/, this.signX(exportTx)]
                    case 2:
                        tx = _a.sent()
                        return [2 /*return*/, avm.issueTx(tx)]
                }
            })
        })
    }
    WalletCore.prototype.exportFromPChain = function (amt, destinationChain, importFee) {
        return __awaiter(this, void 0, void 0, function () {
            var utxoSet, pChangeAddr, fromAddrs, amtFee, fee, destinationAddr, exportTx, tx
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utxoSet = this.getPlatformUTXOSet()
                        pChangeAddr = this.getCurrentAddressPlatform()
                        fromAddrs = this.getAllAddressesP()
                        if (destinationChain === 'C' && !importFee)
                            throw new Error('Exports to C chain must specify an import fee.')
                        amtFee = amt.clone()
                        if (importFee) {
                            amtFee = amt.add(importFee)
                        } else if (destinationChain === 'X') {
                            fee = avm.getTxFee()
                            amtFee = amt.add(fee)
                        }
                        destinationAddr =
                            destinationChain === 'C'
                                ? this.getEvmAddressBech()
                                : this.getCurrentAddressAvm()
                        return [
                            4 /*yield*/,
                            TxHelper.buildPlatformExportTransaction(
                                utxoSet,
                                fromAddrs,
                                destinationAddr,
                                amtFee,
                                pChangeAddr,
                                destinationChain
                            ),
                        ]
                    case 1:
                        exportTx = _a.sent()
                        return [4 /*yield*/, this.signP(exportTx)]
                    case 2:
                        tx = _a.sent()
                        return [4 /*yield*/, pChain.issueTx(tx)]
                    case 3:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    /**
     *
     * @param amt The amount to receive on the destination chain, in nAVAX.
     * @param destinationChain `X` or `P`
     * @param fee Fee to use in the export transaction, given in nAVAX.
     */
    WalletCore.prototype.exportFromCChain = function (amt, destinationChain, exportFee) {
        return __awaiter(this, void 0, void 0, function () {
            var importFee, amtFee, hexAddr, bechAddr, fromAddresses, destinationAddr, exportTx, tx
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importFee = avm.getTxFee()
                        amtFee = amt.add(importFee)
                        hexAddr = this.getEvmAddress()
                        bechAddr = this.getEvmAddressBech()
                        fromAddresses = [hexAddr]
                        destinationAddr =
                            destinationChain === 'X'
                                ? this.getCurrentAddressAvm()
                                : this.getCurrentAddressPlatform()
                        return [
                            4 /*yield*/,
                            TxHelper.buildEvmExportTransaction(
                                fromAddresses,
                                destinationAddr,
                                amtFee,
                                bechAddr,
                                destinationChain,
                                exportFee
                            ),
                        ]
                    case 1:
                        exportTx = _a.sent()
                        return [4 /*yield*/, this.signC(exportTx)]
                    case 2:
                        tx = _a.sent()
                        return [2 /*return*/, cChain.issueTx(tx.toString())]
                }
            })
        })
    }
    /**
     * Returns the estimated gas to export from C chain.
     * @param destinationChain
     * @param amount
     */
    WalletCore.prototype.estimateExportFee = function (destinationChain, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var hexAddr, bechAddr, destinationAddr
            return __generator(this, function (_a) {
                hexAddr = this.getEvmAddress()
                bechAddr = this.getEvmAddressBech()
                destinationAddr =
                    destinationChain === 'X'
                        ? this.getCurrentAddressAvm()
                        : this.getCurrentAddressPlatform()
                return [
                    2 /*return*/,
                    GasHelper.estimateExportGasFee(
                        destinationChain,
                        hexAddr,
                        bechAddr,
                        destinationAddr,
                        amount
                    ),
                ]
            })
        })
    }
    WalletCore.prototype.avmGetAtomicUTXOs = function (sourceChain) {
        return __awaiter(this, void 0, void 0, function () {
            var addrs
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addrs = this.getAllAddressesX()
                        return [4 /*yield*/, UtxoHelper.avmGetAtomicUTXOs(addrs, sourceChain)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletCore.prototype.platformGetAtomicUTXOs = function (sourceChain) {
        return __awaiter(this, void 0, void 0, function () {
            var addrs
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addrs = this.getAllAddressesP()
                        return [4 /*yield*/, UtxoHelper.platformGetAtomicUTXOs(addrs, sourceChain)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletCore.prototype.importToPlatformChain = function (sourceChain) {
        return __awaiter(this, void 0, void 0, function () {
            var utxoSet,
                sourceChainId,
                pToAddr,
                hrp,
                utxoAddrs,
                fromAddrs,
                ownerAddrs,
                unsignedTx,
                tx
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.platformGetAtomicUTXOs(sourceChain)]
                    case 1:
                        utxoSet = _a.sent()
                        if (utxoSet.getAllUTXOs().length === 0) {
                            throw new Error('Nothing to import.')
                        }
                        sourceChainId = Network.chainIdFromAlias(sourceChain)
                        pToAddr = this.getCurrentAddressPlatform()
                        hrp = ava.getHRP()
                        utxoAddrs = utxoSet.getAddresses().map(function (addr) {
                            return bintools.addressToString(hrp, 'P', addr)
                        })
                        fromAddrs = utxoAddrs
                        ownerAddrs = utxoAddrs
                        return [
                            4 /*yield*/,
                            pChain.buildImportTx(
                                utxoSet,
                                ownerAddrs,
                                sourceChainId,
                                [pToAddr],
                                [pToAddr],
                                [pToAddr],
                                undefined,
                                undefined
                            ),
                        ]
                    case 2:
                        unsignedTx = _a.sent()
                        return [
                            4 /*yield*/,
                            this.signP(unsignedTx),
                            // Pass in string because AJS fails to verify Tx type
                        ]
                    case 3:
                        tx = _a.sent()
                        // Pass in string because AJS fails to verify Tx type
                        return [2 /*return*/, pChain.issueTx(tx.toString())]
                }
            })
        })
    }
    WalletCore.prototype.importToXChain = function (sourceChain) {
        return __awaiter(this, void 0, void 0, function () {
            var utxoSet,
                xToAddr,
                hrp,
                utxoAddrs,
                fromAddrs,
                ownerAddrs,
                sourceChainId,
                unsignedTx,
                tx
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, this.avmGetAtomicUTXOs(sourceChain)]
                    case 1:
                        utxoSet = _a.sent()
                        if (utxoSet.getAllUTXOs().length === 0) {
                            throw new Error('Nothing to import.')
                        }
                        xToAddr = this.getCurrentAddressAvm()
                        hrp = ava.getHRP()
                        utxoAddrs = utxoSet.getAddresses().map(function (addr) {
                            return bintools.addressToString(hrp, 'X', addr)
                        })
                        fromAddrs = utxoAddrs
                        ownerAddrs = utxoAddrs
                        sourceChainId = Network.chainIdFromAlias(sourceChain)
                        return [
                            4 /*yield*/,
                            avm.buildImportTx(
                                utxoSet,
                                ownerAddrs,
                                sourceChainId,
                                [xToAddr],
                                fromAddrs,
                                [xToAddr]
                            ),
                        ]
                    case 2:
                        unsignedTx = _a.sent()
                        return [4 /*yield*/, this.signX(unsignedTx)]
                    case 3:
                        tx = _a.sent()
                        return [4 /*yield*/, avm.issueTx(tx.toString())]
                    case 4:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    return WalletCore
})()
export { WalletCore }
//# sourceMappingURL=WalletCore.js.map
