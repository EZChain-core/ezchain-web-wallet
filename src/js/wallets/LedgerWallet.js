import { __assign, __awaiter, __extends, __generator, __read, __spread } from 'tslib'
import EthereumjsCommon from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import moment from 'moment'
import { Buffer, BN } from 'ezchainjs2'
import HDKey from 'hdkey'
import { ava, bintools } from '@/AVA'
var bippath = require('bip32-path')
import createHash from 'create-hash'
import store from '@/store'
import { importPublic, publicToAddress, bnToRlp, rlp } from 'ethereumjs-util'
import {
    AVMConstants,
    SelectCredentialClass as AVMSelectCredentialClass,
    Tx as AVMTx,
} from 'ezchainjs2/dist/apis/avm'
import {
    ImportTx as PlatformImportTx,
    Tx as PlatformTx,
    PlatformVMConstants,
    SelectCredentialClass as PlatformSelectCredentialClass,
    AddDelegatorTx,
} from 'ezchainjs2/dist/apis/platformvm'
import {
    ImportTx as EVMImportTx,
    Tx as EvmTx,
    EVMConstants,
    SelectCredentialClass as EVMSelectCredentialClass,
} from 'ezchainjs2/dist/apis/evm'
import { Signature } from 'ezchainjs2/dist/common'
import { getPreferredHRP } from 'ezchainjs2/dist/utils'
import { HdWalletCore } from '@/js/wallets/HdWalletCore'
import { bnToBig } from '@/helpers/helper'
import { abiDecoder, web3 } from '@/evm'
import { AVA_ACCOUNT_PATH, ETH_ACCOUNT_PATH, LEDGER_ETH_ACCOUNT_PATH } from './MnemonicWallet'
import { ParseableAvmTxEnum, ParseablePlatformEnum, ParseableEvmTxEnum } from '../TxHelper'
import { WalletHelper } from '@/helpers/wallet_helper'
import { Utils, Network } from 'ezchain-wallet-sdk'
export var MIN_EVM_SUPPORT_V = '0.5.3'
var LedgerWallet = /** @class */ (function (_super) {
    __extends(LedgerWallet, _super)
    function LedgerWallet(app, hdkey, config, hdEth, ethApp) {
        var _this = _super.call(this, hdkey, hdEth) || this
        _this.app = app
        _this.ethApp = ethApp
        _this.type = 'ledger'
        _this.config = config
        _this.ethHdNode = hdEth
        if (hdEth) {
            var ethKey = hdEth
            var ethPublic = importPublic(ethKey.publicKey)
            _this.ethAddress = publicToAddress(ethPublic).toString('hex')
            _this.ethBalance = new BN(0)
        } else {
            _this.ethAddress = ''
            _this.ethBalance = new BN(0)
        }
        return _this
    }
    LedgerWallet.fromApp = function (app, eth, config) {
        return __awaiter(this, void 0, void 0, function () {
            var res, hd, ethRes, hdEth
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, app.getWalletExtendedPublicKey(AVA_ACCOUNT_PATH)]
                    case 1:
                        res = _a.sent()
                        hd = new HDKey()
                        hd.publicKey = res.public_key
                        hd.chainCode = res.chain_code
                        return [4 /*yield*/, eth.getAddress(LEDGER_ETH_ACCOUNT_PATH, true, true)]
                    case 2:
                        ethRes = _a.sent()
                        hdEth = new HDKey()
                        // @ts-ignore
                        hdEth.publicKey = Buffer.from(ethRes.publicKey, 'hex')
                        // @ts-ignore
                        hdEth.chainCode = Buffer.from(ethRes.chainCode, 'hex')
                        return [2 /*return*/, new LedgerWallet(app, hd, config, hdEth, eth)]
                }
            })
        })
    }
    // Returns an array of derivation paths that need to sign this transaction
    // Used with signTransactionHash and signTransactionParsable
    LedgerWallet.prototype.getTransactionPaths = function (unsignedTx, chainId) {
        // TODO: This is a nasty fix. Remove when AJS is updated.
        unsignedTx.toBuffer()
        var tx = unsignedTx.getTransaction()
        var txType = tx.getTxType()
        var ins = tx.getIns()
        var operations = []
        // Try to get operations, it will fail if there are none, ignore and continue
        try {
            operations = tx.getOperations()
        } catch (e) {
            console.log(e)
        }
        var items = ins
        if (
            (txType === AVMConstants.IMPORTTX && chainId === 'X') ||
            (txType === PlatformVMConstants.IMPORTTX && chainId === 'P')
        ) {
            items = (tx || PlatformImportTx).getImportInputs()
        }
        var hrp = getPreferredHRP(ava.getNetworkID())
        var paths = []
        var isAvaxOnly = true
        // Collect derivation paths for source addresses
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            var assetId = bintools.cb58Encode(item.getAssetID())
            // @ts-ignore
            if (assetId !== store.state.Assets.AVA_ASSET_ID) {
                isAvaxOnly = false
            }
            var sigidxs = item.getInput().getSigIdxs()
            var sources = sigidxs.map(function (sigidx) {
                return sigidx.getSource()
            })
            var addrs = sources.map(function (source) {
                return bintools.addressToString(hrp, chainId, source)
            })
            for (var j = 0; j < addrs.length; j++) {
                var srcAddr = addrs[j]
                var pathStr = this.getPathFromAddress(srcAddr) // returns change/index
                paths.push(pathStr)
            }
        }
        // Do the Same for operational inputs, if there are any...
        for (var i = 0; i < operations.length; i++) {
            var op = operations[i]
            var sigidxs = op.getOperation().getSigIdxs()
            var sources = sigidxs.map(function (sigidx) {
                return sigidx.getSource()
            })
            var addrs = sources.map(function (source) {
                return bintools.addressToString(hrp, chainId, source)
            })
            for (var j = 0; j < addrs.length; j++) {
                var srcAddr = addrs[j]
                var pathStr = this.getPathFromAddress(srcAddr) // returns change/index
                paths.push(pathStr)
            }
        }
        return { paths: paths, isAvaxOnly: isAvaxOnly }
    }
    LedgerWallet.prototype.pathsToUniqueBipPaths = function (paths) {
        var uniquePaths = paths.filter(function (val, i) {
            return paths.indexOf(val) === i
        })
        var bip32Paths = uniquePaths.map(function (path) {
            return bippath.fromString(path, false)
        })
        return bip32Paths
    }
    LedgerWallet.prototype.getChangeBipPath = function (unsignedTx, chainId) {
        if (chainId === 'C') {
            return null
        }
        var tx = unsignedTx.getTransaction()
        var txType = tx.getTxType()
        var chainChangePath = this.getChangePath(chainId).split('m/')[1]
        var changeIdx = this.getChangeIndex(chainId)
        // If change and destination paths are the same
        // it can cause ledger to not display the destination amt.
        // Since platform helper does not have internal/external
        // path for change (it uses the next address)
        // there can be an address collisions.
        if (
            (txType === PlatformVMConstants.IMPORTTX || txType === PlatformVMConstants.EXPORTTX) &&
            this.platformHelper.hdIndex === this.externalHelper.hdIndex
        ) {
            return null
        } else if (
            txType === PlatformVMConstants.ADDVALIDATORTX ||
            txType === PlatformVMConstants.ADDDELEGATORTX
        ) {
            changeIdx = this.platformHelper.getFirstAvailableIndex()
        }
        return bippath.fromString(AVA_ACCOUNT_PATH + '/' + chainChangePath + '/' + changeIdx)
    }
    LedgerWallet.prototype.getCredentials = function (unsignedTx, paths, sigMap, chainId) {
        var creds = []
        var tx = unsignedTx.getTransaction()
        var txType = tx.getTxType()
        // @ts-ignore
        var ins = tx.getIns ? tx.getIns() : []
        var operations = []
        var evmInputs = []
        var items = ins
        if (
            (txType === AVMConstants.IMPORTTX && chainId === 'X') ||
            (txType === PlatformVMConstants.IMPORTTX && chainId === 'P') ||
            (txType === EVMConstants.IMPORTTX && chainId === 'C')
        ) {
            items = (tx || PlatformImportTx || EVMImportTx).getImportInputs()
        }
        // Try to get operations, it will fail if there are none, ignore and continue
        try {
            operations = tx.getOperations()
        } catch (e) {
            console.error(e)
        }
        var CredentialClass
        if (chainId === 'X') {
            CredentialClass = AVMSelectCredentialClass
        } else if (chainId === 'P') {
            CredentialClass = PlatformSelectCredentialClass
        } else {
            CredentialClass = EVMSelectCredentialClass
        }
        // Try to get evm inputs, it will fail if there are none, ignore and continue
        try {
            evmInputs = tx.getInputs()
        } catch (e) {
            console.error(e)
        }
        for (var i = 0; i < items.length; i++) {
            var sigidxs = items[i].getInput().getSigIdxs()
            var cred = CredentialClass(items[i].getInput().getCredentialID())
            for (var j = 0; j < sigidxs.length; j++) {
                var pathIndex = i + j
                var pathStr = paths[pathIndex]
                var sigRaw = sigMap.get(pathStr)
                var sigBuff = Buffer.from(sigRaw)
                var sig = new Signature()
                sig.fromBuffer(sigBuff)
                cred.addSignature(sig)
            }
            creds.push(cred)
        }
        for (var i = 0; i < operations.length; i++) {
            var op = operations[i].getOperation()
            var sigidxs = op.getSigIdxs()
            var cred = CredentialClass(op.getCredentialID())
            for (var j = 0; j < sigidxs.length; j++) {
                var pathIndex = items.length + i + j
                var pathStr = paths[pathIndex]
                var sigRaw = sigMap.get(pathStr)
                var sigBuff = Buffer.from(sigRaw)
                var sig = new Signature()
                sig.fromBuffer(sigBuff)
                cred.addSignature(sig)
            }
            creds.push(cred)
        }
        for (var i = 0; i < evmInputs.length; i++) {
            var evmInput = evmInputs[i]
            var sigidxs = evmInput.getSigIdxs()
            var cred = CredentialClass(evmInput.getCredentialID())
            for (var j = 0; j < sigidxs.length; j++) {
                var pathIndex = items.length + i + j
                var pathStr = paths[pathIndex]
                var sigRaw = sigMap.get(pathStr)
                var sigBuff = Buffer.from(sigRaw)
                var sig = new Signature()
                sig.fromBuffer(sigBuff)
                cred.addSignature(sig)
            }
            creds.push(cred)
        }
        return creds
    }
    // Used for non parsable transactions.
    // Ideally we wont use this function at all, but ledger is not ready yet.
    LedgerWallet.prototype.signTransactionHash = function (unsignedTx, paths, chainId) {
        return __awaiter(this, void 0, void 0, function () {
            var txbuff,
                msg,
                bip32Paths,
                accountPathSource,
                accountPath,
                sigMap,
                creds,
                signedTx,
                e_1
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txbuff = unsignedTx.toBuffer()
                        msg = Buffer.from(createHash('sha256').update(txbuff).digest())
                        _a.label = 1
                    case 1:
                        _a.trys.push([1, 3, , 4])
                        store.commit('Ledger/openModal', {
                            title: 'Sign Hash',
                            messages: [],
                            info: msg.toString('hex').toUpperCase(),
                        })
                        bip32Paths = this.pathsToUniqueBipPaths(paths)
                        accountPathSource = chainId === 'C' ? ETH_ACCOUNT_PATH : AVA_ACCOUNT_PATH
                        accountPath = bippath.fromString('' + accountPathSource)
                        return [4 /*yield*/, this.app.signHash(accountPath, bip32Paths, msg)]
                    case 2:
                        sigMap = _a.sent()
                        store.commit('Ledger/closeModal')
                        creds = this.getCredentials(unsignedTx, paths, sigMap, chainId)
                        signedTx = void 0
                        switch (chainId) {
                            case 'X':
                                signedTx = new AVMTx(unsignedTx, creds)
                                break
                            case 'P':
                                signedTx = new PlatformTx(unsignedTx, creds)
                                break
                            case 'C':
                                signedTx = new EvmTx(unsignedTx, creds)
                                break
                        }
                        return [2 /*return*/, signedTx]
                    case 3:
                        e_1 = _a.sent()
                        store.commit('Ledger/closeModal')
                        console.error(e_1)
                        throw e_1
                    case 4:
                        return [2 /*return*/]
                }
            })
        })
    }
    // Used for signing transactions that are parsable
    LedgerWallet.prototype.signTransactionParsable = function (unsignedTx, paths, chainId) {
        return __awaiter(this, void 0, void 0, function () {
            var tx,
                txType,
                parseableTxs,
                title,
                bip32Paths,
                accountPath,
                txbuff,
                changePath,
                messages,
                ledgerSignedTx,
                sigMap,
                creds,
                signedTx,
                e_2
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = unsignedTx.getTransaction()
                        txType = tx.getTxType()
                        parseableTxs = {
                            X: ParseableAvmTxEnum,
                            P: ParseablePlatformEnum,
                            C: ParseableEvmTxEnum,
                        }[chainId]
                        title = 'Sign ' + parseableTxs[txType]
                        bip32Paths = this.pathsToUniqueBipPaths(paths)
                        accountPath =
                            chainId === 'C'
                                ? bippath.fromString('' + ETH_ACCOUNT_PATH)
                                : bippath.fromString('' + AVA_ACCOUNT_PATH)
                        txbuff = unsignedTx.toBuffer()
                        changePath = this.getChangeBipPath(unsignedTx, chainId)
                        messages = this.getTransactionMessages(unsignedTx, chainId, changePath)
                        _a.label = 1
                    case 1:
                        _a.trys.push([1, 3, , 4])
                        store.commit('Ledger/openModal', {
                            title: title,
                            messages: messages,
                            info: null,
                        })
                        return [
                            4 /*yield*/,
                            this.app.signTransaction(accountPath, bip32Paths, txbuff, changePath),
                        ]
                    case 2:
                        ledgerSignedTx = _a.sent()
                        sigMap = ledgerSignedTx.signatures
                        creds = this.getCredentials(unsignedTx, paths, sigMap, chainId)
                        signedTx = void 0
                        switch (chainId) {
                            case 'X':
                                signedTx = new AVMTx(unsignedTx, creds)
                                break
                            case 'P':
                                signedTx = new PlatformTx(unsignedTx, creds)
                                break
                            case 'C':
                                signedTx = new EvmTx(unsignedTx, creds)
                                break
                        }
                        return [2 /*return*/, signedTx]
                    case 3:
                        e_2 = _a.sent()
                        store.commit('Ledger/closeModal')
                        console.error(e_2)
                        throw e_2
                    case 4:
                        return [2 /*return*/]
                }
            })
        })
    }
    LedgerWallet.prototype.getOutputMsgs = function (unsignedTx, chainId, changePath) {
        var messages = []
        var hrp = getPreferredHRP(ava.getNetworkID())
        var tx = unsignedTx.getTransaction()
        var txType = tx.getTxType()
        // @ts-ignore
        var outs
        if (
            (txType === AVMConstants.EXPORTTX && chainId === 'X') ||
            (txType === PlatformVMConstants.EXPORTTX && chainId === 'P')
        ) {
            outs = tx.getExportOutputs()
        } else if (txType === EVMConstants.EXPORTTX && chainId === 'C') {
            outs = tx.getExportedOutputs()
        } else {
            outs = tx.getOuts()
        }
        var destinationChain = chainId
        if (chainId === 'C' && txType === EVMConstants.EXPORTTX) destinationChain = 'X'
        if (destinationChain === 'C') {
            for (var i = 0; i < outs.length; i++) {
                // @ts-ignore
                var value = outs[i].getAddress()
                var addr = bintools.addressToString(hrp, chainId, value)
                // @ts-ignore
                var amt = bnToBig(outs[i].getAmount(), 9)
                messages.push({
                    title: 'Output',
                    value: addr + ' - ' + amt.toString() + ' AVAX',
                })
            }
        } else {
            var changeIdx =
                changePath === null || changePath === void 0
                    ? void 0
                    : changePath.toPathArray()[
                          (changePath === null || changePath === void 0
                              ? void 0
                              : changePath.toPathArray().length) - 1
                      ]
            var changeAddr_1 = this.getChangeFromIndex(changeIdx, destinationChain)
            var _loop_1 = function (i) {
                outs[i]
                    .getOutput()
                    .getAddresses()
                    .forEach(function (value) {
                        var addr = bintools.addressToString(hrp, chainId, value)
                        // @ts-ignore
                        var amt = bnToBig(outs[i].getOutput().getAmount(), 9)
                        if (!changePath || changeAddr_1 !== addr)
                            messages.push({
                                title: 'Output',
                                value: addr + ' - ' + amt.toString() + ' AVAX',
                            })
                    })
            }
            for (var i = 0; i < outs.length; i++) {
                _loop_1(i)
            }
        }
        return messages
    }
    LedgerWallet.prototype.getValidateDelegateMsgs = function (unsignedTx, chainId) {
        var tx = unsignedTx.getTransaction() || AddDelegatorTx
        var txType = tx.getTxType()
        var messages = []
        if (
            (txType === PlatformVMConstants.ADDDELEGATORTX && chainId === 'P') ||
            (txType === PlatformVMConstants.ADDVALIDATORTX && chainId === 'P')
        ) {
            var format = 'YYYY-MM-DD H:mm:ss UTC'
            var nodeID = bintools.cb58Encode(tx.getNodeID())
            var startTime = moment(tx.getStartTime().toNumber() * 1000)
                .utc()
                .format(format)
            var endTime = moment(tx.getEndTime().toNumber() * 1000)
                .utc()
                .format(format)
            var stakeAmt = bnToBig(tx.getStakeAmount(), 9)
            var rewardOwners = tx.getRewardOwners()
            var hrp_1 = ava.getHRP()
            var rewardAddrs = rewardOwners
                .getOutput()
                .getAddresses()
                .map(function (addr) {
                    return bintools.addressToString(hrp_1, chainId, addr)
                })
            messages.push({ title: 'NodeID', value: nodeID })
            messages.push({ title: 'Start Time', value: startTime })
            messages.push({ title: 'End Time', value: endTime })
            messages.push({ title: 'Total Stake', value: stakeAmt + ' AVAX' })
            messages.push({
                title: 'Stake',
                value: stakeAmt + ' to ' + this.platformHelper.getCurrentAddress(),
            })
            messages.push({
                title: 'Reward to',
                value: '' + rewardAddrs.join('\n'),
            })
            // @ts-ignore
            if (tx.delegationFee) {
                // @ts-ignore
                messages.push({ title: 'Delegation Fee', value: tx.delegationFee + '%' })
            }
            messages.push({ title: 'Fee', value: '0' })
        }
        return messages
    }
    LedgerWallet.prototype.getFeeMsgs = function (unsignedTx, chainId) {
        var tx = unsignedTx.getTransaction()
        var txType = tx.getTxType()
        var messages = []
        if (
            (txType === AVMConstants.BASETX && chainId === 'X') ||
            (txType === AVMConstants.EXPORTTX && chainId === 'X') ||
            (txType === AVMConstants.IMPORTTX && chainId === 'X') ||
            (txType === PlatformVMConstants.EXPORTTX && chainId === 'P') ||
            (txType === PlatformVMConstants.IMPORTTX && chainId === 'P') ||
            (txType === EVMConstants.EXPORTTX && chainId === 'C') ||
            (txType === EVMConstants.IMPORTTX && chainId === 'C')
        ) {
            messages.push({ title: 'Fee', value: 0.001 + ' AVAX' })
        }
        return messages
    }
    // Given the unsigned transaction returns an array of messages that will be displayed on ledgegr window
    LedgerWallet.prototype.getTransactionMessages = function (unsignedTx, chainId, changePath) {
        var messages = []
        var outputMessages = this.getOutputMsgs(unsignedTx, chainId, changePath)
        messages.push.apply(messages, __spread(outputMessages))
        var validateDelegateMessages = this.getValidateDelegateMsgs(unsignedTx, chainId)
        messages.push.apply(messages, __spread(validateDelegateMessages))
        var feeMessages = this.getFeeMsgs(unsignedTx, chainId)
        messages.push.apply(messages, __spread(feeMessages))
        return messages
    }
    LedgerWallet.prototype.getEvmTransactionMessages = function (tx) {
        var gasPrice = tx.gasPrice
        var gasLimit = tx.gasLimit
        var totFee = gasPrice.mul(new BN(gasLimit))
        var feeNano = Utils.bnToBig(totFee, 9)
        var msgs = []
        try {
            var test_1 = '0x' + tx.data.toString('hex')
            var data = abiDecoder.decodeMethod(test_1)
            var callMsg = {
                title: 'Contract Call',
                value: data.name,
            }
            var paramMsgs = data.params.map(function (param) {
                return {
                    title: param.name,
                    value: param.value,
                }
            })
            var feeMsg = {
                title: 'Fee',
                value: feeNano.toLocaleString() + ' nAVAX',
            }
            msgs = __spread([callMsg], paramMsgs, [feeMsg])
        } catch (e) {
            console.log(e)
        }
        return msgs
    }
    LedgerWallet.prototype.signX = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var tx,
                txType,
                chainId,
                parseableTxs,
                _a,
                paths,
                isAvaxOnly,
                canLedgerParse,
                isParsableType,
                signedTx
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tx = unsignedTx.getTransaction()
                        txType = tx.getTxType()
                        chainId = 'X'
                        parseableTxs = ParseableAvmTxEnum
                        ;(_a = this.getTransactionPaths(unsignedTx, chainId)),
                            (paths = _a.paths),
                            (isAvaxOnly = _a.isAvaxOnly)
                        canLedgerParse = this.config.version >= '0.3.1'
                        isParsableType = txType in parseableTxs && isAvaxOnly
                        if (!(canLedgerParse && isParsableType)) return [3 /*break*/, 2]
                        return [
                            4 /*yield*/,
                            this.signTransactionParsable(unsignedTx, paths, chainId),
                        ]
                    case 1:
                        signedTx = _b.sent()
                        return [3 /*break*/, 4]
                    case 2:
                        return [4 /*yield*/, this.signTransactionHash(unsignedTx, paths, chainId)]
                    case 3:
                        signedTx = _b.sent()
                        _b.label = 4
                    case 4:
                        store.commit('Ledger/closeModal')
                        return [2 /*return*/, signedTx]
                }
            })
        })
    }
    LedgerWallet.prototype.signP = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var tx,
                txType,
                chainId,
                parseableTxs,
                _a,
                paths,
                isAvaxOnly,
                canLedgerParse,
                isParsableType,
                txIns,
                i,
                typeID,
                destChainBuff,
                destChain,
                sourceChainBuff,
                sourceChain,
                signedTx
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        tx = unsignedTx.getTransaction()
                        txType = tx.getTxType()
                        chainId = 'P'
                        parseableTxs = ParseablePlatformEnum
                        ;(_a = this.getTransactionPaths(unsignedTx, chainId)),
                            (paths = _a.paths),
                            (isAvaxOnly = _a.isAvaxOnly)
                        canLedgerParse = this.config.version >= '0.3.1'
                        isParsableType = txType in parseableTxs && isAvaxOnly
                        txIns = unsignedTx.getTransaction().getIns()
                        for (i = 0; i < txIns.length; i++) {
                            typeID = txIns[i].getInput().getTypeID()
                            if (typeID === PlatformVMConstants.STAKEABLELOCKINID) {
                                canLedgerParse = false
                                break
                            }
                        }
                        // TODO: Remove after ledger update
                        // Ledger is not able to parse P/C atomic transactions
                        if (txType === PlatformVMConstants.EXPORTTX) {
                            destChainBuff = tx.getDestinationChain()
                            destChain = Network.idToChainAlias(bintools.cb58Encode(destChainBuff))
                            if (destChain === 'C') {
                                canLedgerParse = false
                            }
                        }
                        // TODO: Remove after ledger update
                        if (txType === PlatformVMConstants.IMPORTTX) {
                            sourceChainBuff = tx.getSourceChain()
                            sourceChain = Network.idToChainAlias(
                                bintools.cb58Encode(sourceChainBuff)
                            )
                            if (sourceChain === 'C') {
                                canLedgerParse = false
                            }
                        }
                        if (!(canLedgerParse && isParsableType)) return [3 /*break*/, 2]
                        return [
                            4 /*yield*/,
                            this.signTransactionParsable(unsignedTx, paths, chainId),
                        ]
                    case 1:
                        signedTx = _b.sent()
                        return [3 /*break*/, 4]
                    case 2:
                        return [4 /*yield*/, this.signTransactionHash(unsignedTx, paths, chainId)]
                    case 3:
                        signedTx = _b.sent()
                        _b.label = 4
                    case 4:
                        store.commit('Ledger/closeModal')
                        return [2 /*return*/, signedTx]
                }
            })
        })
    }
    LedgerWallet.prototype.signC = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var tx,
                typeId,
                canLedgerParse,
                paths,
                ins,
                ins,
                destChainBuff,
                destChain,
                sourceChainBuff,
                sourceChain,
                txSigned
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tx = unsignedTx.getTransaction()
                        typeId = tx.getTxType()
                        canLedgerParse = true
                        paths = ['0/0']
                        if (typeId === EVMConstants.EXPORTTX) {
                            ins = tx.getInputs()
                            paths = ins.map(function (input) {
                                return '0/0'
                            })
                        } else if (typeId === EVMConstants.IMPORTTX) {
                            ins = tx.getImportInputs()
                            paths = ins.map(function (input) {
                                return '0/0'
                            })
                        }
                        // TODO: Remove after ledger update
                        // Ledger is not able to parse P/C atomic transactions
                        if (typeId === EVMConstants.EXPORTTX) {
                            destChainBuff = tx.getDestinationChain()
                            destChain = Network.idToChainAlias(bintools.cb58Encode(destChainBuff))
                            if (destChain === 'P') {
                                canLedgerParse = false
                            }
                        }
                        // TODO: Remove after ledger update
                        if (typeId === EVMConstants.IMPORTTX) {
                            sourceChainBuff = tx.getSourceChain()
                            sourceChain = Network.idToChainAlias(
                                bintools.cb58Encode(sourceChainBuff)
                            )
                            if (sourceChain === 'P') {
                                canLedgerParse = false
                            }
                        }
                        if (!canLedgerParse) return [3 /*break*/, 2]
                        return [4 /*yield*/, this.signTransactionParsable(unsignedTx, paths, 'C')]
                    case 1:
                        txSigned = _a.sent()
                        return [3 /*break*/, 4]
                    case 2:
                        return [4 /*yield*/, this.signTransactionHash(unsignedTx, paths, 'C')]
                    case 3:
                        txSigned = _a.sent()
                        _a.label = 4
                    case 4:
                        store.commit('Ledger/closeModal')
                        return [2 /*return*/, txSigned]
                }
            })
        })
    }
    LedgerWallet.prototype.signEvm = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var rawUnsignedTx,
                msgs,
                signature,
                signatureBN,
                chainId,
                networkId,
                chainParams,
                signedTx,
                e_3
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawUnsignedTx = rlp.encode([
                            bnToRlp(tx.nonce),
                            bnToRlp(tx.gasPrice),
                            bnToRlp(tx.gasLimit),
                            tx.to !== undefined ? tx.to.buf : Buffer.from([]),
                            bnToRlp(tx.value),
                            tx.data,
                            bnToRlp(new BN(tx.getChainId())),
                            Buffer.from([]),
                            Buffer.from([]),
                        ])
                        _a.label = 1
                    case 1:
                        _a.trys.push([1, 5, , 6])
                        msgs = this.getEvmTransactionMessages(tx)
                        // Open Modal Prompt
                        store.commit('Ledger/openModal', {
                            title: 'Transfer',
                            messages: msgs,
                            info: null,
                        })
                        return [
                            4 /*yield*/,
                            this.ethApp.signTransaction(
                                LEDGER_ETH_ACCOUNT_PATH,
                                rawUnsignedTx.toString('hex')
                            ),
                        ]
                    case 2:
                        signature = _a.sent()
                        store.commit('Ledger/closeModal')
                        signatureBN = {
                            v: new BN(signature.v, 16),
                            r: new BN(signature.r, 16),
                            s: new BN(signature.s, 16),
                        }
                        return [4 /*yield*/, web3.eth.getChainId()]
                    case 3:
                        chainId = _a.sent()
                        return [4 /*yield*/, web3.eth.net.getId()]
                    case 4:
                        networkId = _a.sent()
                        chainParams = {
                            common: EthereumjsCommon.forCustomChain(
                                'mainnet',
                                { networkId: networkId, chainId: chainId },
                                'istanbul'
                            ),
                        }
                        signedTx = Transaction.fromTxData(
                            __assign(
                                {
                                    nonce: tx.nonce,
                                    gasPrice: tx.gasPrice,
                                    gasLimit: tx.gasLimit,
                                    to: tx.to,
                                    value: tx.value,
                                    data: tx.data,
                                },
                                signatureBN
                            ),
                            chainParams
                        )
                        return [2 /*return*/, signedTx]
                    case 5:
                        e_3 = _a.sent()
                        store.commit('Ledger/closeModal')
                        console.error(e_3)
                        throw e_3
                    case 6:
                        return [2 /*return*/]
                }
            })
        })
    }
    LedgerWallet.prototype.getEvmAddress = function () {
        return this.ethAddress
    }
    LedgerWallet.prototype.getStake = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this
                        return [4 /*yield*/, WalletHelper.getStake(this)]
                    case 1:
                        _a.stakeAmount = _b.sent()
                        return [2 /*return*/, this.stakeAmount]
                }
            })
        })
    }
    LedgerWallet.prototype.getEthBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bal
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, WalletHelper.getEthBalance(this)]
                    case 1:
                        bal = _a.sent()
                        this.ethBalance = bal
                        return [2 /*return*/, bal]
                }
            })
        })
    }
    LedgerWallet.prototype.getUTXOs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isInit
            var _this = this
            return __generator(this, function (_a) {
                // TODO: Move to shared file
                this.isFetchUtxos = true
                isInit =
                    this.externalHelper.isInit &&
                    this.internalHelper.isInit &&
                    this.platformHelper.isInit
                if (!isInit) {
                    setTimeout(function () {
                        _this.getUTXOs()
                    }, 1000)
                    return [2 /*return*/]
                }
                _super.prototype.getUTXOs.call(this)
                this.getStake()
                this.getEthBalance()
                return [2 /*return*/]
            })
        })
    }
    LedgerWallet.prototype.getPathFromAddress = function (address) {
        var externalAddrs = this.externalHelper.getExtendedAddresses()
        var internalAddrs = this.internalHelper.getExtendedAddresses()
        var platformAddrs = this.platformHelper.getExtendedAddresses()
        var extIndex = externalAddrs.indexOf(address)
        var intIndex = internalAddrs.indexOf(address)
        var platformIndex = platformAddrs.indexOf(address)
        if (extIndex >= 0) {
            return '0/' + extIndex
        } else if (intIndex >= 0) {
            return '1/' + intIndex
        } else if (platformIndex >= 0) {
            return '0/' + platformIndex
        } else if (address[0] === 'C') {
            return '0/0'
        } else {
            throw 'Unable to find source address.'
        }
    }
    LedgerWallet.prototype.issueBatchTx = function (orders, addr, memo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, WalletHelper.issueBatchTx(this, orders, addr, memo)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    LedgerWallet.prototype.delegate = function (nodeID, amt, start, end, rewardAddress, utxos) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            WalletHelper.delegate(
                                this,
                                nodeID,
                                amt,
                                start,
                                end,
                                rewardAddress,
                                utxos
                            ),
                        ]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    LedgerWallet.prototype.validate = function (
        nodeID,
        amt,
        start,
        end,
        delegationFee,
        rewardAddress,
        utxos
    ) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            WalletHelper.validate(
                                this,
                                nodeID,
                                amt,
                                start,
                                end,
                                delegationFee,
                                rewardAddress,
                                utxos
                            ),
                        ]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    LedgerWallet.prototype.signHashByExternalIndex = function (index, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var pathStr, addressPath, accountPath, sigMap, signed, e_4
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pathStr = '0/' + index
                        addressPath = bippath.fromString(pathStr, false)
                        accountPath = bippath.fromString('' + AVA_ACCOUNT_PATH)
                        store.commit('Ledger/openModal', {
                            title: 'Sign Hash',
                            info: hash.toString('hex').toUpperCase(),
                        })
                        _a.label = 1
                    case 1:
                        _a.trys.push([1, 3, , 4])
                        return [4 /*yield*/, this.app.signHash(accountPath, [addressPath], hash)]
                    case 2:
                        sigMap = _a.sent()
                        store.commit('Ledger/closeModal')
                        signed = sigMap.get(pathStr)
                        return [2 /*return*/, bintools.cb58Encode(signed)]
                    case 3:
                        e_4 = _a.sent()
                        store.commit('Ledger/closeModal')
                        throw e_4
                    case 4:
                        return [2 /*return*/]
                }
            })
        })
    }
    LedgerWallet.prototype.createNftFamily = function (name, symbol, groupNum) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            WalletHelper.createNftFamily(this, name, symbol, groupNum),
                        ]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    LedgerWallet.prototype.mintNft = function (mintUtxo, payload, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            WalletHelper.mintNft(this, mintUtxo, payload, quantity),
                        ]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    LedgerWallet.prototype.sendEth = function (to, amount, gasPrice, gasLimit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            WalletHelper.sendEth(this, to, amount, gasPrice, gasLimit),
                        ]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    LedgerWallet.prototype.estimateGas = function (to, amount, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4 /*yield*/, WalletHelper.estimateGas(this, to, amount, token)]
                    case 1:
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    LedgerWallet.prototype.sendERC20 = function (to, amount, gasPrice, gasLimit, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [
                            4 /*yield*/,
                            WalletHelper.sendErc20(this, to, amount, gasPrice, gasLimit, token),
                        ]
                    case 1:
                        // throw 'Not Implemented'
                        return [2 /*return*/, _a.sent()]
                }
            })
        })
    }
    return LedgerWallet
})(HdWalletCore)
export { LedgerWallet }
//# sourceMappingURL=LedgerWallet.js.map
