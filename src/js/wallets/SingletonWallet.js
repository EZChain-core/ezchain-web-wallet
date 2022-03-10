import { __awaiter, __extends, __generator } from "tslib";
import { ava, avm, bintools, pChain } from '@/AVA';
import { digestMessage } from '@/helpers/helper';
import { Buffer as BufferAvalanche, BN } from 'ezchainjs2';
import { KeyChain as AVMKeyChain, UTXOSet as AVMUTXOSet, } from 'ezchainjs2/dist/apis/avm';
import { KeyChain as PlatformKeyChain, UTXOSet as PlatformUTXOSet, } from 'ezchainjs2/dist/apis/platformvm';
import { KeyChain, KeyChain as EVMKeyChain } from 'ezchainjs2/dist/apis/evm';
import { buildUnsignedTransaction } from '../TxHelper';
import { privateToAddress } from 'ethereumjs-util';
import { WalletCore } from '@/js/wallets/WalletCore';
import { WalletHelper } from '@/helpers/wallet_helper';
import { avmGetAllUTXOs, platformGetAllUTXOs } from '@/helpers/utxo_helper';
var SingletonWallet = /** @class */ (function (_super) {
    __extends(SingletonWallet, _super);
    function SingletonWallet(pk) {
        var _this = _super.call(this) || this;
        _this.key = pk;
        _this.chainId = avm.getBlockchainAlias() || avm.getBlockchainID();
        _this.chainIdP = pChain.getBlockchainAlias() || pChain.getBlockchainID();
        var hrp = ava.getHRP();
        _this.keyChain = new AVMKeyChain(hrp, _this.chainId);
        _this.keyPair = _this.keyChain.importKey(pk);
        _this.platformKeyChain = new PlatformKeyChain(hrp, _this.chainIdP);
        _this.platformKeyPair = _this.platformKeyChain.importKey(pk);
        _this.stakeAmount = new BN(0);
        // Derive EVM key and address
        var pkBuf = bintools.cb58Decode(pk.split('-')[1]);
        var pkHex = pkBuf.toString('hex');
        var pkBuffNative = Buffer.from(pkHex, 'hex');
        _this.ethKey = pkHex;
        _this.ethAddress = privateToAddress(pkBuffNative).toString('hex');
        _this.ethBalance = new BN(0);
        var cPrivKey = "PrivateKey-" + bintools.cb58Encode(BufferAvalanche.from(pkBuf));
        _this.ethKeyBech = cPrivKey;
        var cKeyChain = new KeyChain(ava.getHRP(), 'C');
        _this.ethKeyChain = cKeyChain;
        var cKeypair = cKeyChain.importKey(cPrivKey);
        _this.ethAddressBech = cKeypair.getAddressString();
        _this.type = 'singleton';
        _this.isInit = true;
        return _this;
    }
    SingletonWallet.prototype.getChangeAddressAvm = function () {
        return this.getCurrentAddressAvm();
    };
    SingletonWallet.prototype.getCurrentAddressAvm = function () {
        return this.keyPair.getAddressString();
    };
    SingletonWallet.prototype.getChangeAddressPlatform = function () {
        return this.getCurrentAddressPlatform();
    };
    SingletonWallet.prototype.getDerivedAddresses = function () {
        var addr = this.getCurrentAddressAvm();
        return [addr];
    };
    SingletonWallet.prototype.getDerivedAddressesP = function () {
        return [this.getCurrentAddressPlatform()];
    };
    SingletonWallet.prototype.getAllDerivedExternalAddresses = function () {
        return this.getDerivedAddresses();
    };
    SingletonWallet.prototype.getExtendedPlatformAddresses = function () {
        var addr = this.platformKeyPair.getAddressString();
        return [addr];
    };
    SingletonWallet.prototype.getHistoryAddresses = function () {
        var addr = this.getCurrentAddressAvm();
        return [addr];
    };
    SingletonWallet.prototype.getPlatformRewardAddress = function () {
        return this.getCurrentAddressPlatform();
    };
    SingletonWallet.prototype.getCurrentAddressPlatform = function () {
        return this.platformKeyPair.getAddressString();
    };
    SingletonWallet.prototype.getBaseAddress = function () {
        return this.getCurrentAddressAvm();
    };
    SingletonWallet.prototype.getStake = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, WalletHelper.getStake(this)];
                    case 1:
                        _a.stakeAmount = _b.sent();
                        return [2 /*return*/, this.stakeAmount];
                }
            });
        });
    };
    SingletonWallet.prototype.getPlatformUTXOSet = function () {
        return this.platformUtxoset;
    };
    SingletonWallet.prototype.getEvmAddress = function () {
        return this.ethAddress;
    };
    SingletonWallet.prototype.getEvmAddressBech = function () {
        return this.ethAddressBech;
    };
    SingletonWallet.prototype.getEthBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var bal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.getEthBalance(this)];
                    case 1:
                        bal = _a.sent();
                        this.ethBalance = bal;
                        return [2 /*return*/, bal];
                }
            });
        });
    };
    SingletonWallet.prototype.updateUTXOsX = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, avmGetAllUTXOs([this.getCurrentAddressAvm()])];
                    case 1:
                        result = _a.sent();
                        this.utxoset = result;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SingletonWallet.prototype.updateUTXOsP = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, platformGetAllUTXOs([this.getCurrentAddressPlatform()])];
                    case 1:
                        result = _a.sent();
                        this.platformUtxoset = result;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SingletonWallet.prototype.getUTXOs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isFetchUtxos = true;
                        return [4 /*yield*/, this.updateUTXOsX()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.updateUTXOsP()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getStake()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.getEthBalance()];
                    case 4:
                        _a.sent();
                        this.isFetchUtxos = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    SingletonWallet.prototype.buildUnsignedTransaction = function (orders, addr, memo) {
        return __awaiter(this, void 0, void 0, function () {
            var changeAddress, derivedAddresses, utxoset;
            return __generator(this, function (_a) {
                changeAddress = this.getChangeAddressAvm();
                derivedAddresses = this.getDerivedAddresses();
                utxoset = this.getUTXOSet();
                return [2 /*return*/, buildUnsignedTransaction(orders, addr, derivedAddresses, utxoset, changeAddress, memo)];
            });
        });
    };
    SingletonWallet.prototype.issueBatchTx = function (orders, addr, memo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.issueBatchTx(this, orders, addr, memo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.getFirstAvailableAddressPlatform = function () {
        return this.getCurrentAddressPlatform();
    };
    SingletonWallet.prototype.onnetworkchange = function () {
        var hrp = ava.getHRP();
        this.keyChain = new AVMKeyChain(hrp, this.chainId);
        this.utxoset = new AVMUTXOSet();
        this.keyPair = this.keyChain.importKey(this.key);
        this.platformKeyChain = new PlatformKeyChain(hrp, this.chainIdP);
        this.platformUtxoset = new PlatformUTXOSet();
        this.platformKeyPair = this.platformKeyChain.importKey(this.key);
        // Update EVM values
        this.ethKeyChain = new EVMKeyChain(ava.getHRP(), 'C');
        var cKeypair = this.ethKeyChain.importKey(this.ethKeyBech);
        this.ethAddressBech = cKeypair.getAddressString();
        this.ethBalance = new BN(0);
        this.getUTXOs();
    };
    SingletonWallet.prototype.signX = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var keychain, tx;
            return __generator(this, function (_a) {
                keychain = this.keyChain;
                tx = unsignedTx.sign(keychain);
                return [2 /*return*/, tx];
            });
        });
    };
    SingletonWallet.prototype.signP = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var keychain, tx;
            return __generator(this, function (_a) {
                keychain = this.platformKeyChain;
                tx = unsignedTx.sign(keychain);
                return [2 /*return*/, tx];
            });
        });
    };
    SingletonWallet.prototype.signC = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var keyChain;
            return __generator(this, function (_a) {
                keyChain = this.ethKeyChain;
                return [2 /*return*/, unsignedTx.sign(keyChain)];
            });
        });
    };
    SingletonWallet.prototype.signEvm = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var keyBuff;
            return __generator(this, function (_a) {
                keyBuff = Buffer.from(this.ethKey, 'hex');
                return [2 /*return*/, tx.sign(keyBuff)];
            });
        });
    };
    SingletonWallet.prototype.signMessage = function (msgStr) {
        return __awaiter(this, void 0, void 0, function () {
            var digest, digestHex, digestBuff, signed;
            return __generator(this, function (_a) {
                digest = digestMessage(msgStr);
                digestHex = digest.toString('hex');
                digestBuff = BufferAvalanche.from(digestHex, 'hex');
                signed = this.keyPair.sign(digestBuff);
                return [2 /*return*/, bintools.cb58Encode(signed)];
            });
        });
    };
    SingletonWallet.prototype.delegate = function (nodeID, amt, start, end, rewardAddress, utxos) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.delegate(this, nodeID, amt, start, end, rewardAddress, utxos)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.validate = function (nodeID, amt, start, end, delegationFee, rewardAddress, utxos) {
        if (delegationFee === void 0) { delegationFee = 0; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.validate(this, nodeID, amt, start, end, delegationFee, rewardAddress, utxos)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.createNftFamily = function (name, symbol, groupNum) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.createNftFamily(this, name, symbol, groupNum)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.mintNft = function (mintUtxo, payload, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.mintNft(this, mintUtxo, payload, quantity)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.sendEth = function (to, amount, gasPrice, gasLimit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.sendEth(this, to, amount, gasPrice, gasLimit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.estimateGas = function (to, amount, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.estimateGas(this, to, amount, token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.sendERC20 = function (to, amount, gasPrice, gasLimit, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.sendErc20(this, to, amount, gasPrice, gasLimit, token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SingletonWallet.prototype.getAllAddressesX = function () {
        return [this.getCurrentAddressAvm()];
    };
    SingletonWallet.prototype.getAllAddressesP = function () {
        return [this.getCurrentAddressPlatform()];
    };
    return SingletonWallet;
}(WalletCore));
export { SingletonWallet };
//# sourceMappingURL=SingletonWallet.js.map