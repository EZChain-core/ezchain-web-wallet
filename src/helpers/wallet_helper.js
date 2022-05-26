import { __awaiter, __generator } from 'tslib'
import { avm, pChain } from '@/AVA'
import { UTXOSet as PlatformUTXOSet } from 'ezchainjs2/dist/apis/platformvm/utxos'
import { BN } from 'ezchainjs2'
import {
    buildCreateNftFamilyTx,
    buildEvmTransferErc20Tx,
    buildEvmTransferErc721Tx,
    buildEvmTransferNativeTx,
    buildMintNftTx,
} from '@/js/TxHelper'
import { web3 } from '@/evm'
import { getStakeForAddresses } from '@/helpers/utxo_helper'
var WalletHelper = /** @class */ (function () {
    function WalletHelper() {}
    WalletHelper.getStake = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var addrs
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addrs = wallet.getAllAddressesP()
                        return [4 /*yield*/, getStakeForAddresses(addrs)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletHelper.createNftFamily = function (wallet, name, symbol, groupNum) {
        return __awaiter(this, void 0, void 0, function () {
            var fromAddresses, changeAddress, minterAddress, utxoSet, unsignedTx, signed
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromAddresses = wallet.getDerivedAddresses()
                        changeAddress = wallet.getChangeAddressAvm()
                        minterAddress = wallet.getCurrentAddressAvm()
                        utxoSet = wallet.utxoset
                        return [
                            4 /*yield*/,
                            buildCreateNftFamilyTx(
                                name,
                                symbol,
                                groupNum,
                                fromAddresses,
                                minterAddress,
                                changeAddress,
                                utxoSet
                            ),
                        ]
                    case 1:
                        unsignedTx = _a.sent()
                        return [4 /*yield*/, wallet.signX(unsignedTx)]
                    case 2:
                        signed = _a.sent()
                        return [4 /*yield*/, avm.issueTx(signed)]
                    case 3:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletHelper.mintNft = function (wallet, mintUtxo, payload, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var ownerAddress, changeAddress, sourceAddresses, utxoSet, tx, signed
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ownerAddress = wallet.getCurrentAddressAvm()
                        changeAddress = wallet.getChangeAddressAvm()
                        sourceAddresses = wallet.getDerivedAddresses()
                        utxoSet = wallet.utxoset
                        return [
                            4 /*yield*/,
                            buildMintNftTx(
                                mintUtxo,
                                payload,
                                quantity,
                                ownerAddress,
                                changeAddress,
                                sourceAddresses,
                                utxoSet
                            ),
                        ]
                    case 1:
                        tx = _a.sent()
                        return [4 /*yield*/, wallet.signX(tx)]
                    case 2:
                        signed = _a.sent()
                        return [4 /*yield*/, avm.issueTx(signed)]
                    case 3:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletHelper.issueBatchTx = function (wallet, orders, addr, memo) {
        return __awaiter(this, void 0, void 0, function () {
            var unsignedTx, tx, txId
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, wallet.buildUnsignedTransaction(orders, addr, memo)]
                    case 1:
                        unsignedTx = _a.sent()
                        return [4 /*yield*/, wallet.signX(unsignedTx)]
                    case 2:
                        tx = _a.sent()
                        return [4 /*yield*/, avm.issueTx(tx)]
                    case 3:
                        txId = _a.sent()
                        return [2 /*return*/, txId]
                }
            })
        })
    }
    WalletHelper.validate = function (
        wallet,
        nodeID,
        amt,
        start,
        end,
        delegationFee,
        rewardAddress,
        utxos
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var utxoSet,
                pAddressStrings,
                stakeAmount,
                changeAddress,
                stakeReturnAddr,
                startTime,
                endTime,
                unsignedTx,
                tx
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utxoSet = wallet.getPlatformUTXOSet()
                        // If given custom UTXO set use that
                        if (utxos) {
                            utxoSet = new PlatformUTXOSet()
                            utxoSet.addArray(utxos)
                        }
                        pAddressStrings = wallet.getAllAddressesP()
                        stakeAmount = amt
                        // If reward address isn't given use index 0 address
                        if (!rewardAddress) {
                            rewardAddress = wallet.getPlatformRewardAddress()
                        }
                        changeAddress = wallet.getFirstAvailableAddressPlatform()
                        stakeReturnAddr = wallet.getCurrentAddressPlatform()
                        startTime = new BN(Math.round(start.getTime() / 1000))
                        endTime = new BN(Math.round(end.getTime() / 1000))
                        return [
                            4 /*yield*/,
                            pChain.buildAddValidatorTx(
                                utxoSet,
                                [stakeReturnAddr],
                                pAddressStrings, // from
                                [changeAddress], // change
                                nodeID,
                                startTime,
                                endTime,
                                stakeAmount,
                                [rewardAddress],
                                delegationFee
                            ),
                        ]
                    case 1:
                        unsignedTx = _a.sent()
                        return [4 /*yield*/, wallet.signP(unsignedTx)]
                    case 2:
                        tx = _a.sent()
                        return [4 /*yield*/, pChain.issueTx(tx)]
                    case 3:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletHelper.delegate = function (wallet, nodeID, amt, start, end, rewardAddress, utxos) {
        return __awaiter(this, void 0, void 0, function () {
            var utxoSet,
                pAddressStrings,
                stakeAmount,
                stakeReturnAddr,
                changeAddress,
                startTime,
                endTime,
                unsignedTx,
                tx
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utxoSet = wallet.getPlatformUTXOSet()
                        pAddressStrings = wallet.getAllAddressesP()
                        stakeAmount = amt
                        // If given custom UTXO set use that
                        if (utxos) {
                            utxoSet = new PlatformUTXOSet()
                            utxoSet.addArray(utxos)
                        }
                        // If reward address isn't given use index 0 address
                        if (!rewardAddress) {
                            rewardAddress = wallet.getPlatformRewardAddress()
                        }
                        stakeReturnAddr = wallet.getPlatformRewardAddress()
                        changeAddress = wallet.getFirstAvailableAddressPlatform()
                        startTime = new BN(Math.round(start.getTime() / 1000))
                        endTime = new BN(Math.round(end.getTime() / 1000))
                        return [
                            4 /*yield*/,
                            pChain.buildAddDelegatorTx(
                                utxoSet,
                                [stakeReturnAddr],
                                pAddressStrings,
                                [changeAddress],
                                nodeID,
                                startTime,
                                endTime,
                                stakeAmount,
                                [rewardAddress] // reward address
                            ),
                        ]
                    case 1:
                        unsignedTx = _a.sent()
                        return [4 /*yield*/, wallet.signP(unsignedTx)]
                    case 2:
                        tx = _a.sent()
                        return [4 /*yield*/, pChain.issueTx(tx)]
                    case 3:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    WalletHelper.getEthBalance = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var bal
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, web3.eth.getBalance(wallet.ethAddress)]
                    case 1:
                        bal = _a.sent()
                        return [2 /*return*/, new BN(bal)]
                }
            })
        })
    }
    WalletHelper.sendEth = function (
        wallet,
        to,
        amount, // in wei
        gasPrice,
        gasLimit
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var fromAddr, tx, signedTx, txHex, hash
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromAddr = '0x' + wallet.getEvmAddress()
                        return [
                            4 /*yield*/,
                            buildEvmTransferNativeTx(fromAddr, to, amount, gasPrice, gasLimit),
                        ]
                    case 1:
                        tx = _a.sent()
                        return [4 /*yield*/, wallet.signEvm(tx)]
                    case 2:
                        signedTx = _a.sent()
                        txHex = signedTx.serialize().toString('hex')
                        return [4 /*yield*/, web3.eth.sendSignedTransaction('0x' + txHex)]
                    case 3:
                        hash = _a.sent()
                        return [2 /*return*/, hash.transactionHash]
                }
            })
        })
    }
    WalletHelper.sendErc20 = function (wallet, to, amount, gasPrice, gasLimit, token) {
        return __awaiter(this, void 0, void 0, function () {
            var fromAddr, tx, signedTx, txHex, hash
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromAddr = '0x' + wallet.getEvmAddress()
                        return [
                            4 /*yield*/,
                            buildEvmTransferErc20Tx(
                                fromAddr,
                                to,
                                amount,
                                gasPrice,
                                gasLimit,
                                token
                            ),
                        ]
                    case 1:
                        tx = _a.sent()
                        return [4 /*yield*/, wallet.signEvm(tx)]
                    case 2:
                        signedTx = _a.sent()
                        txHex = signedTx.serialize().toString('hex')
                        return [4 /*yield*/, web3.eth.sendSignedTransaction('0x' + txHex)]
                    case 3:
                        hash = _a.sent()
                        return [2 /*return*/, hash.transactionHash]
                }
            })
        })
    }
    WalletHelper.sendErc721 = function (wallet, to, gasPrice, gasLimit, token, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var fromAddr, tx, signedTx, txHex, hash
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromAddr = '0x' + wallet.getEvmAddress()
                        return [
                            4 /*yield*/,
                            buildEvmTransferErc721Tx(
                                fromAddr,
                                to,
                                gasPrice,
                                gasLimit,
                                token,
                                tokenId
                            ),
                        ]
                    case 1:
                        tx = _a.sent()
                        return [4 /*yield*/, wallet.signEvm(tx)]
                    case 2:
                        signedTx = _a.sent()
                        txHex = signedTx.serialize().toString('hex')
                        return [4 /*yield*/, web3.eth.sendSignedTransaction('0x' + txHex)]
                    case 3:
                        hash = _a.sent()
                        return [2 /*return*/, hash.transactionHash]
                }
            })
        })
    }
    WalletHelper.estimateTxGas = function (wallet, tx) {
        return __awaiter(this, void 0, void 0, function () {
            var fromAddr, estGas
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fromAddr = '0x' + wallet.getEvmAddress()
                        return [4 /*yield*/, tx.estimateGas({ from: fromAddr })]
                    case 1:
                        estGas = _a.sent()
                        return [2 /*return*/, Math.round(estGas * 1.1)]
                }
            })
        })
    }
    WalletHelper.estimateGas = function (wallet, to, amount, token) {
        return __awaiter(this, void 0, void 0, function () {
            var from, tx, estGas
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        from = '0x' + wallet.getEvmAddress()
                        tx = token.createTransferTx(to, amount)
                        return [
                            4 /*yield*/,
                            tx.estimateGas({
                                from: from,
                            }),
                            // Return 10% more
                        ]
                    case 1:
                        estGas = _a.sent()
                        // Return 10% more
                        return [2 /*return*/, Math.round(estGas * 1.1)]
                }
            })
        })
    }
    return WalletHelper
})()
export { WalletHelper }
//# sourceMappingURL=wallet_helper.js.map
