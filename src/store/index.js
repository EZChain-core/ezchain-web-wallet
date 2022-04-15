import { __awaiter, __generator } from "tslib";
import Vue from 'vue';
import Vuex from 'vuex';
import Assets from './modules/assets/assets';
import Network from './modules/network/network';
import Notifications from './modules/notifications/notifications';
import History from './modules/history/history';
import Platform from './modules/platform/platform';
import Ledger from './modules/ledger/ledger';
import Accounts from './modules/accounts/accounts';
Vue.use(Vuex);
import router from '@/router';
import { bintools } from '@/AVA';
import MnemonicWallet from '@/js/wallets/MnemonicWallet';
import { extractKeysFromDecryptedFile, KEYSTORE_VERSION, makeKeyfile, readKeyFile, } from '@/js/Keystore';
import { SingletonWallet } from '@/js/wallets/SingletonWallet';
import { Buffer } from 'ezchainjs2';
import { privateToAddress } from 'ethereumjs-util';
import { updateFilterAddresses } from '../providers';
import { getAvaxPriceUSD } from '@/helpers/price_helper';
export default new Vuex.Store({
    modules: {
        Assets: Assets,
        Notifications: Notifications,
        Network: Network,
        History: History,
        Platform: Platform,
        Ledger: Ledger,
        Accounts: Accounts,
    },
    state: {
        isAuth: false,
        activeWallet: null,
        address: null,
        wallets: [],
        volatileWallets: [],
        warnUpdateKeyfile: false,
        prices: {
            usd: 0,
        },
    },
    getters: {
        addresses: function (state) {
            var wallet = state.activeWallet;
            if (!wallet)
                return [];
            var addresses = wallet.getDerivedAddresses();
            return addresses;
        },
    },
    mutations: {
        updateActiveAddress: function (state) {
            if (!state.activeWallet) {
                state.address = null;
            }
            else {
                var addrNow = state.activeWallet.getCurrentAddressAvm();
                state.address = addrNow;
                // Update the websocket addresses
                updateFilterAddresses();
            }
        },
    },
    actions: {
        // Used in home page to access a user's wallet
        // Used to access wallet with a single key
        // TODO rename to accessWalletMenmonic
        accessWallet: function (_a, mnemonic) {
            var state = _a.state, dispatch = _a.dispatch, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dispatch('addWalletMnemonic', mnemonic)];
                        case 1:
                            wallet = _b.sent();
                            return [4 /*yield*/, dispatch('activateWallet', wallet)];
                        case 2:
                            _b.sent();
                            dispatch('onAccess');
                            return [2 /*return*/, wallet];
                    }
                });
            });
        },
        // Only for singletons and mnemonics
        accessWalletMultiple: function (_a, _b) {
            var state = _a.state, dispatch = _a.dispatch, commit = _a.commit;
            var keyList = _b.keys, activeIndex = _b.activeIndex;
            return __awaiter(this, void 0, void 0, function () {
                var i, keyInfo, e_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(i < keyList.length)) return [3 /*break*/, 9];
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 7, , 8]);
                            keyInfo = keyList[i];
                            if (!(keyInfo.type === 'mnemonic')) return [3 /*break*/, 4];
                            return [4 /*yield*/, dispatch('addWalletMnemonic', keyInfo.key)];
                        case 3:
                            _c.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, dispatch('addWalletSingleton', keyInfo.key)];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6: return [3 /*break*/, 8];
                        case 7:
                            e_1 = _c.sent();
                            return [3 /*break*/, 8];
                        case 8:
                            i++;
                            return [3 /*break*/, 1];
                        case 9: return [4 /*yield*/, dispatch('activateWallet', state.wallets[activeIndex])];
                        case 10:
                            _c.sent();
                            dispatch('onAccess');
                            return [2 /*return*/];
                    }
                });
            });
        },
        accessWalletLedger: function (_a, wallet) {
            var state = _a.state, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            state.wallets = [wallet];
                            return [4 /*yield*/, dispatch('activateWallet', wallet)];
                        case 1:
                            _b.sent();
                            dispatch('onAccess');
                            return [2 /*return*/];
                    }
                });
            });
        },
        accessWalletSingleton: function (_a, key) {
            var state = _a.state, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var wallet;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, dispatch('addWalletSingleton', key)];
                        case 1:
                            wallet = _b.sent();
                            return [4 /*yield*/, dispatch('activateWallet', wallet)];
                        case 2:
                            _b.sent();
                            dispatch('onAccess');
                            return [2 /*return*/];
                    }
                });
            });
        },
        onAccess: function (store) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    store.state.isAuth = true;
                    store.dispatch('Assets/updateAvaAsset');
                    store.dispatch('Platform/update');
                    router.push('/wallet');
                    store.dispatch('Assets/updateUTXOs');
                    return [2 /*return*/];
                });
            });
        },
        // TODO: Parts can be shared with the logout function below
        // Similar to logout but keeps the Remembered keys.
        timeoutLogout: function (store) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, store.dispatch('Notifications/add', {
                                title: 'Session Timeout',
                                message: 'You are logged out due to inactivity.',
                                type: 'warning',
                            })];
                        case 1:
                            _a.sent();
                            store.dispatch('logout');
                            return [2 /*return*/];
                    }
                });
            });
        },
        logout: function (store) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    localStorage.removeItem('w');
                    // Go to the base URL with GET request not router
                    window.location.href = '/';
                    return [2 /*return*/];
                });
            });
        },
        // used with logout
        removeAllKeys: function (_a) {
            var state = _a.state, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var wallets, wallet;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            wallets = state.wallets;
                            _b.label = 1;
                        case 1:
                            if (!(wallets.length > 0)) return [3 /*break*/, 3];
                            wallet = wallets[0];
                            return [4 /*yield*/, dispatch('removeWallet', wallet)];
                        case 2:
                            _b.sent();
                            dispatch('Notifications/add', {
                                title: 'Key Removed',
                                message: 'Private key and assets removed from the wallet.',
                            });
                            return [3 /*break*/, 1];
                        case 3:
                            state.wallets = [];
                            state.volatileWallets = [];
                            return [2 /*return*/];
                    }
                });
            });
        },
        // Add a HD wallet from mnemonic string
        addWalletMnemonic: function (_a, mnemonic) {
            var _b;
            var state = _a.state, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var i, w, wallet;
                return __generator(this, function (_c) {
                    // Cannot add mnemonic wallets on ledger mode
                    if (((_b = state.activeWallet) === null || _b === void 0 ? void 0 : _b.type) === 'ledger')
                        return [2 /*return*/, null
                            // Make sure wallet doesnt exist already
                        ];
                    // Make sure wallet doesnt exist already
                    for (i = 0; i < state.wallets.length; i++) {
                        w = state.wallets[i];
                        if (w.type === 'mnemonic') {
                            if (w.getMnemonic() === mnemonic) {
                                throw new Error('Wallet already exists.');
                            }
                        }
                    }
                    wallet = new MnemonicWallet(mnemonic);
                    state.wallets.push(wallet);
                    state.volatileWallets.push(wallet);
                    return [2 /*return*/, wallet];
                });
            });
        },
        // Add a singleton wallet from private key string
        addWalletSingleton: function (_a, pk) {
            var _b;
            var state = _a.state, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var keyBuf, i, w, wallet;
                return __generator(this, function (_c) {
                    try {
                        keyBuf = Buffer.from(pk, 'hex');
                        // @ts-ignore
                        privateToAddress(keyBuf);
                        pk = "PrivateKey-" + bintools.cb58Encode(keyBuf);
                    }
                    catch (e) {
                        //
                    }
                    // Cannot add singleton wallets on ledger mode
                    if (((_b = state.activeWallet) === null || _b === void 0 ? void 0 : _b.type) === 'ledger')
                        return [2 /*return*/, null
                            // Make sure wallet doesnt exist already
                        ];
                    // Make sure wallet doesnt exist already
                    for (i = 0; i < state.wallets.length; i++) {
                        w = state.wallets[i];
                        if (w.type === 'singleton') {
                            if (w.key === pk) {
                                throw new Error('Wallet already exists.');
                            }
                        }
                    }
                    wallet = new SingletonWallet(pk);
                    state.wallets.push(wallet);
                    state.volatileWallets.push(wallet);
                    return [2 /*return*/, wallet];
                });
            });
        },
        removeWallet: function (_a, wallet) {
            var state = _a.state, dispatch = _a.dispatch, getters = _a.getters;
            // TODO: This might cause an error use wallet id instead
            var index = state.wallets.indexOf(wallet);
            state.wallets.splice(index, 1);
        },
        issueBatchTx: function (_a, data) {
            var state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var wallet, toAddr, orders, memo, txId, e_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            wallet = state.activeWallet;
                            if (!wallet)
                                return [2 /*return*/, 'error'];
                            toAddr = data.toAddress;
                            orders = data.orders;
                            memo = data.memo;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, wallet.issueBatchTx(orders, toAddr, memo)];
                        case 2:
                            txId = _b.sent();
                            return [2 /*return*/, txId];
                        case 3:
                            e_2 = _b.sent();
                            throw e_2;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        },
        activateWallet: function (_a, wallet) {
            var state = _a.state, dispatch = _a.dispatch, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    state.activeWallet = wallet;
                    dispatch('Assets/updateAvaAsset');
                    commit('updateActiveAddress');
                    dispatch('History/updateTransactionHistory');
                    updateFilterAddresses();
                    return [2 /*return*/];
                });
            });
        },
        exportWallets: function (_a, input) {
            var state = _a.state, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var pass, wallets, wallet_1, activeIndex, file_data, text, utcDate, dateString, filename, blob, url, element, e_3;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            pass = input.password;
                            wallets = input.wallets;
                            wallet_1 = state.activeWallet;
                            if (!wallet_1)
                                throw new Error('No active wallet.');
                            activeIndex = wallets.findIndex(function (w) { return w.id == wallet_1.id; });
                            return [4 /*yield*/, makeKeyfile(wallets, pass, activeIndex)
                                // Download the file
                            ];
                        case 1:
                            file_data = _b.sent();
                            text = JSON.stringify(file_data);
                            utcDate = new Date();
                            dateString = utcDate.toISOString().replace(' ', '_');
                            filename = "EZC_" + dateString + ".json";
                            blob = new Blob([text], {
                                type: 'application/json',
                            });
                            url = URL.createObjectURL(blob);
                            element = document.createElement('a');
                            element.setAttribute('href', url);
                            element.setAttribute('download', filename);
                            element.style.display = 'none';
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                            return [3 /*break*/, 3];
                        case 2:
                            e_3 = _b.sent();
                            dispatch('Notifications/add', {
                                title: 'Export Wallet',
                                message: 'Error exporting wallet.',
                                type: 'error',
                            });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        // Given a key file with password, will try to decrypt the file and add keys to user's
        // key chain
        importKeyfile: function (store, data) {
            return __awaiter(this, void 0, void 0, function () {
                var pass, fileData, version, keyFile, keys, i, key, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pass = data.password;
                            fileData = data.data;
                            version = fileData.version;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 11, , 12]);
                            return [4 /*yield*/, readKeyFile(fileData, pass)
                                // Extract wallet keys
                            ];
                        case 2:
                            keyFile = _a.sent();
                            keys = extractKeysFromDecryptedFile(keyFile);
                            if (!!store.state.isAuth) return [3 /*break*/, 4];
                            return [4 /*yield*/, store.dispatch('accessWalletMultiple', {
                                    keys: keys,
                                    activeIndex: keyFile.activeIndex,
                                })];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 10];
                        case 4:
                            i = 0;
                            _a.label = 5;
                        case 5:
                            if (!(i < keys.length)) return [3 /*break*/, 10];
                            key = keys[i];
                            if (!(key.type === 'mnemonic')) return [3 /*break*/, 7];
                            return [4 /*yield*/, store.dispatch('addWalletMnemonic', key.key)];
                        case 6:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 7:
                            if (!(key.type === 'singleton')) return [3 /*break*/, 9];
                            return [4 /*yield*/, store.dispatch('addWalletSingleton', key.key)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            i++;
                            return [3 /*break*/, 5];
                        case 10:
                            // Keystore warning flag asking users to update their keystore files;
                            store.state.warnUpdateKeyfile = false;
                            if (version !== KEYSTORE_VERSION) {
                                store.state.warnUpdateKeyfile = true;
                            }
                            store.state.volatileWallets = [];
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'success',
                                }];
                        case 11:
                            err_1 = _a.sent();
                            throw err_1;
                        case 12: return [2 /*return*/];
                    }
                });
            });
        },
        updateAvaxPrice: function (store) {
            return __awaiter(this, void 0, void 0, function () {
                var usd;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, getAvaxPriceUSD()];
                        case 1:
                            usd = _a.sent();
                            store.state.prices = {
                                usd: usd,
                            };
                            return [2 /*return*/];
                    }
                });
            });
        },
    },
});
//# sourceMappingURL=index.js.map