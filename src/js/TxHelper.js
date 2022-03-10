import { __awaiter, __generator } from "tslib";
import { ava, avm, bintools } from '@/AVA';
import { BN } from 'ezchainjs2';
import { AssetAmountDestination, BaseTx, MinterSet, UnsignedTx as AVMUnsignedTx, UTXOSet as AVMUTXOSet, AVMConstants, } from 'ezchainjs2/dist/apis/avm';
import { OutputOwners } from 'ezchainjs2/dist/common';
import { PlatformVMConstants } from 'ezchainjs2/dist/apis/platformvm';
import { EVMConstants } from 'ezchainjs2/dist/apis/evm';
import { web3 } from '@/evm';
import { Transaction } from '@ethereumjs/tx';
import EthereumjsCommon from '@ethereumjs/common';
export function buildUnsignedTransaction(orders, addr, derivedAddresses, utxoset, changeAddress, memo) {
    return __awaiter(this, void 0, void 0, function () {
        var fromAddrsStr, fromAddrs, changeAddr, AVAX_ID_BUF, AVAX_ID_STR, TO_BUF, aad, ZERO, isFeeAdded, i, order, tx, assetId, amt, success, ins, outs, nftUtxos, unsignedTx, networkId, chainId, nftSet, utxoIds, rawTx, outsNft, insNft, baseTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // TODO: Get new change index.
                    if (!changeAddress) {
                        throw 'Unable to issue transaction. Ran out of change index.';
                    }
                    fromAddrsStr = derivedAddresses;
                    fromAddrs = fromAddrsStr.map(function (val) { return bintools.parseAddress(val, 'X'); });
                    changeAddr = bintools.stringToAddress(changeAddress);
                    return [4 /*yield*/, avm.getAVAXAssetID()];
                case 1:
                    AVAX_ID_BUF = _a.sent();
                    AVAX_ID_STR = AVAX_ID_BUF.toString('hex');
                    TO_BUF = bintools.stringToAddress(addr);
                    aad = new AssetAmountDestination([TO_BUF], fromAddrs, [
                        changeAddr,
                    ]);
                    ZERO = new BN(0);
                    isFeeAdded = false;
                    // Aggregate Fungible ins & outs
                    for (i = 0; i < orders.length; i++) {
                        order = orders[i];
                        if (order.asset) {
                            tx = order;
                            assetId = bintools.cb58Decode(tx.asset.id);
                            amt = tx.amount;
                            if (assetId.toString('hex') === AVAX_ID_STR) {
                                aad.addAssetAmount(assetId, amt, avm.getTxFee());
                                isFeeAdded = true;
                            }
                            else {
                                aad.addAssetAmount(assetId, amt, ZERO);
                            }
                        }
                    }
                    // If fee isn't added, add it
                    if (!isFeeAdded) {
                        if (avm.getTxFee().gt(ZERO)) {
                            aad.addAssetAmount(AVAX_ID_BUF, ZERO, avm.getTxFee());
                        }
                    }
                    success = utxoset.getMinimumSpendable(aad);
                    ins = [];
                    outs = [];
                    if (typeof success === 'undefined') {
                        ins = aad.getInputs();
                        outs = aad.getAllOutputs();
                    }
                    else {
                        throw success;
                    }
                    nftUtxos = orders.filter(function (val) {
                        if (val.asset)
                            return false;
                        return true;
                    });
                    networkId = ava.getNetworkID();
                    chainId = bintools.cb58Decode(avm.getBlockchainID());
                    if (nftUtxos.length > 0) {
                        nftSet = new AVMUTXOSet();
                        nftSet.addArray(nftUtxos);
                        utxoIds = nftSet.getUTXOIDs();
                        // Sort nft utxos
                        utxoIds.sort(function (a, b) {
                            if (a < b) {
                                return -1;
                            }
                            else if (a > b) {
                                return 1;
                            }
                            return 0;
                        });
                        unsignedTx = nftSet.buildNFTTransferTx(networkId, chainId, [TO_BUF], fromAddrs, fromAddrs, // change address should be something else?
                        utxoIds, undefined, undefined, memo);
                        rawTx = unsignedTx.getTransaction();
                        outsNft = rawTx.getOuts();
                        insNft = rawTx.getIns();
                        // TODO: This is a hackish way of doing this, need methods in avalanche.js
                        //@ts-ignore
                        rawTx.outs = outsNft.concat(outs);
                        //@ts-ignore
                        rawTx.ins = insNft.concat(ins);
                    }
                    else {
                        baseTx = new BaseTx(networkId, chainId, outs, ins, memo);
                        unsignedTx = new AVMUnsignedTx(baseTx);
                    }
                    return [2 /*return*/, unsignedTx];
            }
        });
    });
}
export function buildCreateNftFamilyTx(name, symbol, groupNum, fromAddrs, minterAddr, changeAddr, utxoSet) {
    return __awaiter(this, void 0, void 0, function () {
        var fromAddresses, changeAddress, minterAddress, minterSets, i, minterSet, unsignedTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fromAddresses = fromAddrs;
                    changeAddress = changeAddr;
                    minterAddress = minterAddr;
                    minterSets = [];
                    // Create the groups
                    for (i = 0; i < groupNum; i++) {
                        minterSet = new MinterSet(1, [minterAddress]);
                        minterSets.push(minterSet);
                    }
                    return [4 /*yield*/, avm.buildCreateNFTAssetTx(utxoSet, fromAddresses, [changeAddress], minterSets, name, symbol)];
                case 1:
                    unsignedTx = _a.sent();
                    return [2 /*return*/, unsignedTx];
            }
        });
    });
}
export function buildMintNftTx(mintUtxo, payload, quantity, ownerAddress, changeAddress, fromAddresses, utxoSet) {
    return __awaiter(this, void 0, void 0, function () {
        var addrBuf, owners, sourceAddresses, i, owner, groupID, mintTx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    addrBuf = bintools.parseAddress(ownerAddress, 'X');
                    owners = [];
                    sourceAddresses = fromAddresses;
                    for (i = 0; i < quantity; i++) {
                        owner = new OutputOwners([addrBuf]);
                        owners.push(owner);
                    }
                    groupID = mintUtxo.getOutput().getGroupID();
                    return [4 /*yield*/, avm.buildCreateNFTMintTx(utxoSet, owners, sourceAddresses, [changeAddress], mintUtxo.getUTXOID(), groupID, payload)];
                case 1:
                    mintTx = _a.sent();
                    return [2 /*return*/, mintTx];
            }
        });
    });
}
export function buildEvmTransferNativeTx(from, to, amount, // in wei
gasPrice, gasLimit) {
    return __awaiter(this, void 0, void 0, function () {
        var nonce, chainId, networkId, chainParams, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getTransactionCount(from)];
                case 1:
                    nonce = _a.sent();
                    return [4 /*yield*/, web3.eth.getChainId()];
                case 2:
                    chainId = _a.sent();
                    return [4 /*yield*/, web3.eth.net.getId()];
                case 3:
                    networkId = _a.sent();
                    chainParams = {
                        common: EthereumjsCommon.forCustomChain('mainnet', { networkId: networkId, chainId: chainId }, 'istanbul'),
                    };
                    tx = new Transaction({
                        nonce: nonce,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        to: to,
                        value: amount,
                        data: '0x',
                    }, chainParams);
                    return [2 /*return*/, tx];
            }
        });
    });
}
export function buildEvmTransferErc20Tx(from, to, amount, // in wei
gasPrice, gasLimit, token) {
    return __awaiter(this, void 0, void 0, function () {
        var nonce, chainId, networkId, chainParams, tokenTx, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getTransactionCount(from)];
                case 1:
                    nonce = _a.sent();
                    return [4 /*yield*/, web3.eth.getChainId()];
                case 2:
                    chainId = _a.sent();
                    return [4 /*yield*/, web3.eth.net.getId()];
                case 3:
                    networkId = _a.sent();
                    chainParams = {
                        common: EthereumjsCommon.forCustomChain('mainnet', { networkId: networkId, chainId: chainId }, 'istanbul'),
                    };
                    tokenTx = token.createTransferTx(to, amount);
                    tx = new Transaction({
                        nonce: nonce,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        value: '0x0',
                        to: token.data.address,
                        data: tokenTx.encodeABI(),
                    }, chainParams);
                    return [2 /*return*/, tx];
            }
        });
    });
}
export function buildEvmTransferErc721Tx(from, to, gasPrice, gasLimit, token, tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        var nonce, chainId, networkId, chainParams, tokenTx, tx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, web3.eth.getTransactionCount(from)];
                case 1:
                    nonce = _a.sent();
                    return [4 /*yield*/, web3.eth.getChainId()];
                case 2:
                    chainId = _a.sent();
                    return [4 /*yield*/, web3.eth.net.getId()];
                case 3:
                    networkId = _a.sent();
                    chainParams = {
                        common: EthereumjsCommon.forCustomChain('mainnet', { networkId: networkId, chainId: chainId }, 'istanbul'),
                    };
                    tokenTx = token.createTransferTx(from, to, tokenId);
                    tx = new Transaction({
                        nonce: nonce,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        value: '0x0',
                        to: token.data.address,
                        data: tokenTx.encodeABI(),
                    }, chainParams);
                    return [2 /*return*/, tx];
            }
        });
    });
}
export var AvmTxNameEnum;
(function (AvmTxNameEnum) {
    AvmTxNameEnum[AvmTxNameEnum["Transaction"] = AVMConstants.BASETX] = "Transaction";
    AvmTxNameEnum[AvmTxNameEnum["Mint"] = AVMConstants.CREATEASSETTX] = "Mint";
    AvmTxNameEnum[AvmTxNameEnum["Operation"] = AVMConstants.OPERATIONTX] = "Operation";
    AvmTxNameEnum[AvmTxNameEnum["Import"] = AVMConstants.IMPORTTX] = "Import";
    AvmTxNameEnum[AvmTxNameEnum["Export"] = AVMConstants.EXPORTTX] = "Export";
})(AvmTxNameEnum || (AvmTxNameEnum = {}));
export var PlatfromTxNameEnum;
(function (PlatfromTxNameEnum) {
    PlatfromTxNameEnum[PlatfromTxNameEnum["Transaction"] = PlatformVMConstants.BASETX] = "Transaction";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Validator"] = PlatformVMConstants.ADDVALIDATORTX] = "Add Validator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Delegator"] = PlatformVMConstants.ADDDELEGATORTX] = "Add Delegator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Import"] = PlatformVMConstants.IMPORTTX] = "Import";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Export"] = PlatformVMConstants.EXPORTTX] = "Export";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Add Subnet Validator"] = PlatformVMConstants.ADDSUBNETVALIDATORTX] = "Add Subnet Validator";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Create Chain"] = PlatformVMConstants.CREATECHAINTX] = "Create Chain";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Create Subnet"] = PlatformVMConstants.CREATESUBNETTX] = "Create Subnet";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Advance Time"] = PlatformVMConstants.ADVANCETIMETX] = "Advance Time";
    PlatfromTxNameEnum[PlatfromTxNameEnum["Reward Validator"] = PlatformVMConstants.REWARDVALIDATORTX] = "Reward Validator";
})(PlatfromTxNameEnum || (PlatfromTxNameEnum = {}));
// TODO: create asset transactions
export var ParseableAvmTxEnum;
(function (ParseableAvmTxEnum) {
    ParseableAvmTxEnum[ParseableAvmTxEnum["Transaction"] = AVMConstants.BASETX] = "Transaction";
    ParseableAvmTxEnum[ParseableAvmTxEnum["Import"] = AVMConstants.IMPORTTX] = "Import";
    ParseableAvmTxEnum[ParseableAvmTxEnum["Export"] = AVMConstants.EXPORTTX] = "Export";
})(ParseableAvmTxEnum || (ParseableAvmTxEnum = {}));
export var ParseablePlatformEnum;
(function (ParseablePlatformEnum) {
    ParseablePlatformEnum[ParseablePlatformEnum["Transaction"] = PlatformVMConstants.BASETX] = "Transaction";
    ParseablePlatformEnum[ParseablePlatformEnum["Add Validator"] = PlatformVMConstants.ADDVALIDATORTX] = "Add Validator";
    ParseablePlatformEnum[ParseablePlatformEnum["Add Delegator"] = PlatformVMConstants.ADDDELEGATORTX] = "Add Delegator";
    ParseablePlatformEnum[ParseablePlatformEnum["Import"] = PlatformVMConstants.IMPORTTX] = "Import";
    ParseablePlatformEnum[ParseablePlatformEnum["Export"] = PlatformVMConstants.EXPORTTX] = "Export";
})(ParseablePlatformEnum || (ParseablePlatformEnum = {}));
export var ParseableEvmTxEnum;
(function (ParseableEvmTxEnum) {
    ParseableEvmTxEnum[ParseableEvmTxEnum["Import"] = EVMConstants.IMPORTTX] = "Import";
    ParseableEvmTxEnum[ParseableEvmTxEnum["Export"] = EVMConstants.EXPORTTX] = "Export";
})(ParseableEvmTxEnum || (ParseableEvmTxEnum = {}));
//# sourceMappingURL=TxHelper.js.map