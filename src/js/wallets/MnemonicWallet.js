// A simple wrapper thar combines avalanche.js, bip39 and HDWallet
import { __awaiter, __extends, __generator } from "tslib";
import { KeyChain as AVMKeyChain, } from 'ezchainjs2/dist/apis/avm';
import { privateToAddress } from 'ethereumjs-util';
import { KeyChain as EVMKeyChain, } from 'ezchainjs2/dist/apis/evm';
import { getPreferredHRP } from 'ezchainjs2/dist/utils';
import * as bip39 from 'bip39';
import { BN, Buffer as BufferAvalanche } from 'ezchainjs2';
import { ava, bintools } from '@/AVA';
import HDKey from 'hdkey';
import { HdWalletCore } from '@/js/wallets/HdWalletCore';
import { KeyChain } from 'ezchainjs2/dist/apis/evm';
import { WalletHelper } from '@/helpers/wallet_helper';
import MnemonicPhrase from '@/js/wallets/MnemonicPhrase';
// HD WALLET
// Accounts are not used and the account index is fixed to 0
// m / purpose' / coin_type' / account' / change / address_index
var AVA_TOKEN_INDEX = '9000';
export var AVA_ACCOUNT_PATH = "m/44'/" + AVA_TOKEN_INDEX + "'/0'"; // Change and index left out
export var ETH_ACCOUNT_PATH = "m/44'/60'/0'";
export var LEDGER_ETH_ACCOUNT_PATH = ETH_ACCOUNT_PATH + '/0/0';
var INDEX_RANGE = 20; // a gap of at least 20 indexes is needed to claim an index unused
var SCAN_SIZE = 70; // the total number of utxos to look at initially to calculate last index
var SCAN_RANGE = SCAN_SIZE - INDEX_RANGE; // How many items are actually scanned
// Possible indexes for each request is
// SCAN_SIZE - INDEX_RANGE
var MnemonicWallet = /** @class */ (function (_super) {
    __extends(MnemonicWallet, _super);
    // The master key from avalanche.js
    function MnemonicWallet(mnemonic) {
        var _this = this;
        var seed = bip39.mnemonicToSeedSync(mnemonic);
        var masterHdKey = HDKey.fromMasterSeed(seed);
        var accountHdKey = masterHdKey.derive(AVA_ACCOUNT_PATH);
        var ethAccountKey = masterHdKey.derive(ETH_ACCOUNT_PATH + '/0/0');
        _this = _super.call(this, accountHdKey, ethAccountKey, false) || this;
        // Derive EVM key and address
        var ethPrivateKey = ethAccountKey.privateKey;
        _this.ethKey = ethPrivateKey.toString('hex');
        _this.ethAddress = privateToAddress(ethPrivateKey).toString('hex');
        _this.ethBalance = new BN(0);
        var cPrivKey = "PrivateKey-" + bintools.cb58Encode(BufferAvalanche.from(ethPrivateKey));
        _this.ethKeyBech = cPrivKey;
        var cKeyChain = new KeyChain(ava.getHRP(), 'C');
        _this.ethKeyChain = cKeyChain;
        var cKeypair = cKeyChain.importKey(cPrivKey);
        _this.type = 'mnemonic';
        _this.seed = seed.toString('hex');
        _this.hdKey = masterHdKey;
        _this.mnemonic = new MnemonicPhrase(mnemonic);
        _this.isLoading = false;
        return _this;
    }
    // TODO : Move to hd core class
    MnemonicWallet.prototype.onnetworkchange = function () {
        _super.prototype.onnetworkchange.call(this);
        // Update EVM values
        this.ethKeyChain = new EVMKeyChain(ava.getHRP(), 'C');
        var cKeypair = this.ethKeyChain.importKey(this.ethKeyBech);
        this.ethBalance = new BN(0);
    };
    MnemonicWallet.prototype.getEvmAddress = function () {
        return this.ethAddress;
    };
    MnemonicWallet.prototype.getEthBalance = function () {
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
    MnemonicWallet.prototype.sendEth = function (to, amount, gasPrice, gasLimit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.sendEth(this, to, amount, gasPrice, gasLimit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MnemonicWallet.prototype.estimateGas = function (to, amount, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.estimateGas(this, to, amount, token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MnemonicWallet.prototype.sendERC20 = function (to, amount, gasPrice, gasLimit, token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.sendErc20(this, to, amount, gasPrice, gasLimit, token)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MnemonicWallet.prototype.getUTXOs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isInit;
            var _this = this;
            return __generator(this, function (_a) {
                // TODO: Move to shared file
                this.isFetchUtxos = true;
                isInit = this.externalHelper.isInit && this.internalHelper.isInit && this.platformHelper.isInit;
                if (!isInit) {
                    setTimeout(function () {
                        _this.getUTXOs();
                    }, 1000);
                    return [2 /*return*/];
                }
                _super.prototype.getUTXOs.call(this);
                this.getStake();
                this.getEthBalance();
                return [2 /*return*/];
            });
        });
    };
    MnemonicWallet.prototype.getCurrentKey = function () {
        return this.externalHelper.getCurrentKey();
    };
    /**
     * Returns the mnemonic phrase of this wallet
     */
    MnemonicWallet.prototype.getMnemonic = function () {
        return this.mnemonic.getValue();
    };
    MnemonicWallet.prototype.getMnemonicEncrypted = function () {
        return this.mnemonic;
    };
    MnemonicWallet.prototype.validate = function (nodeID, amt, start, end, delegationFee, rewardAddress, utxos) {
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
    // Delegates AVAX to the given node ID
    MnemonicWallet.prototype.delegate = function (nodeID, amt, start, end, rewardAddress, utxos) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.delegate(this, nodeID, amt, start, end, rewardAddress, utxos)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MnemonicWallet.prototype.getStake = function () {
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
    MnemonicWallet.prototype.issueBatchTx = function (orders, addr, memo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.issueBatchTx(this, orders, addr, memo)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // returns a keychain that has all the derived private/public keys for X chain
    MnemonicWallet.prototype.getKeyChain = function () {
        var internal = this.internalHelper.getAllDerivedKeys();
        var external = this.externalHelper.getAllDerivedKeys();
        var allKeys = internal.concat(external);
        var keychain = new AVMKeyChain(getPreferredHRP(ava.getNetworkID()), this.chainId);
        for (var i = 0; i < allKeys.length; i++) {
            keychain.addKey(allKeys[i]);
        }
        return keychain;
    };
    MnemonicWallet.prototype.signX = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var keychain, tx;
            return __generator(this, function (_a) {
                keychain = this.getKeyChain();
                tx = unsignedTx.sign(keychain);
                return [2 /*return*/, tx];
            });
        });
    };
    MnemonicWallet.prototype.signP = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var keychain, tx;
            return __generator(this, function (_a) {
                keychain = this.platformHelper.getKeychain();
                tx = unsignedTx.sign(keychain);
                return [2 /*return*/, tx];
            });
        });
    };
    MnemonicWallet.prototype.signC = function (unsignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var keyChain;
            return __generator(this, function (_a) {
                keyChain = this.ethKeyChain;
                return [2 /*return*/, unsignedTx.sign(keyChain)];
            });
        });
    };
    MnemonicWallet.prototype.signEvm = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var keyBuff;
            return __generator(this, function (_a) {
                keyBuff = Buffer.from(this.ethKey, 'hex');
                return [2 /*return*/, tx.sign(keyBuff)];
            });
        });
    };
    MnemonicWallet.prototype.signHashByExternalIndex = function (index, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var key, signed;
            return __generator(this, function (_a) {
                key = this.externalHelper.getKeyForIndex(index);
                signed = key.sign(hash);
                return [2 /*return*/, bintools.cb58Encode(signed)];
            });
        });
    };
    MnemonicWallet.prototype.createNftFamily = function (name, symbol, groupNum) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.createNftFamily(this, name, symbol, groupNum)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MnemonicWallet.prototype.mintNft = function (mintUtxo, payload, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, WalletHelper.mintNft(this, mintUtxo, payload, quantity)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MnemonicWallet;
}(HdWalletCore));
export default MnemonicWallet;
//# sourceMappingURL=MnemonicWallet.js.map