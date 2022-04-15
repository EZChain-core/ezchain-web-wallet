import { __awaiter, __generator } from "tslib";
import { addAccountToStorage, getAccountByIndex, getLocalStorageAccounts, overwriteAccountAtIndex, removeAccountByIndex, verifyAccountPassword, } from '@/helpers/account_helper';
import { makeKeyfile } from '@/js/Keystore';
var accounts_module = {
    namespaced: true,
    state: {
        accounts: [],
        accountIndex: null,
    },
    mutations: {
        loadAccounts: function (state) {
            state.accounts = getLocalStorageAccounts();
        },
    },
    actions: {
        onLogout: function (_a) {
            var state = _a.state;
            state.accountIndex = null;
        },
        accessAccount: function (_a, input) {
            var state = _a.state, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var index, pass, account, data;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = input.index;
                            pass = input.pass;
                            account = getAccountByIndex(index);
                            if (!account)
                                throw new Error('Account not found.');
                            data = {
                                password: pass,
                                data: account.wallet,
                            };
                            return [4 /*yield*/, dispatch('importKeyfile', data, { root: true })];
                        case 1:
                            _b.sent();
                            state.accountIndex = index;
                            return [2 /*return*/];
                    }
                });
            });
        },
        // Creates a keystore file and saves to local storage
        saveAccount: function (_a, data) {
            var state = _a.state, dispatch = _a.dispatch, commit = _a.commit, getters = _a.getters, rootState = _a.rootState;
            return __awaiter(this, void 0, void 0, function () {
                var activeAccount, accountIndex, wallet_1, pass, wallets, activeIndex, file, baseAddresses, encryptedWallet, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            activeAccount = getters.account;
                            accountIndex = state.accountIndex;
                            wallet_1 = rootState.activeWallet;
                            pass = data.password;
                            if (!pass || (wallet_1 === null || wallet_1 === void 0 ? void 0 : wallet_1.type) === 'ledger')
                                return [2 /*return*/];
                            wallets = rootState.wallets;
                            if (!wallet_1)
                                throw new Error('No active wallet.');
                            activeIndex = wallets.findIndex(function (w) { return w.id == wallet_1.id; });
                            return [4 /*yield*/, makeKeyfile(wallets, pass, activeIndex)];
                        case 1:
                            file = _b.sent();
                            baseAddresses = getters.baseAddresses;
                            encryptedWallet = {
                                baseAddresses: baseAddresses,
                                name: (activeAccount === null || activeAccount === void 0 ? void 0 : activeAccount.name) || data.accountName,
                                wallet: file,
                            };
                            // Remove old account, add new one
                            if (accountIndex != null) {
                                overwriteAccountAtIndex(encryptedWallet, accountIndex);
                            }
                            else {
                                addAccountToStorage(encryptedWallet);
                            }
                            // No more volatile wallets
                            rootState.volatileWallets = [];
                            commit('loadAccounts');
                            state.accountIndex = state.accounts.length - 1;
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _b.sent();
                            dispatch('Notifications/add', {
                                title: 'Account Save',
                                message: 'Error Saving Account.',
                                type: 'error',
                            });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        },
        // If there is an active account, will remove it from local storage
        deleteAccount: function (_a, password) {
            var state = _a.state, dispatch = _a.dispatch, getters = _a.getters, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var acct, passCorrect, index;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            acct = getters.account;
                            return [4 /*yield*/, verifyAccountPassword(acct, password)];
                        case 1:
                            passCorrect = _b.sent();
                            if (!passCorrect)
                                throw new Error('Invalid password.');
                            index = state.accountIndex;
                            if (!acct || !index)
                                return [2 /*return*/];
                            removeAccountByIndex(index);
                            state.accountIndex = null;
                            // Update accounts
                            commit('loadAccounts');
                            return [2 /*return*/];
                    }
                });
            });
        },
        changePassword: function (_a, input) {
            var state = _a.state, getters = _a.getters, dispatch = _a.dispatch;
            return __awaiter(this, void 0, void 0, function () {
                var index, account, oldPassCorrect;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = state.accountIndex;
                            account = getters.account;
                            if (!account || !index)
                                return [2 /*return*/];
                            return [4 /*yield*/, verifyAccountPassword(account, input.passOld)];
                        case 1:
                            oldPassCorrect = _b.sent();
                            if (!oldPassCorrect)
                                throw new Error('Previous password invalid.');
                            // Remove current wallet file
                            removeAccountByIndex(index);
                            // Save with new password
                            dispatch('saveAccount', {
                                password: input.passNew,
                                accountName: account.name,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
        // Used to save volatile keys into the active account
        saveKeys: function (_a, pass) {
            var dispatch = _a.dispatch, getters = _a.getters, state = _a.state;
            return __awaiter(this, void 0, void 0, function () {
                var index, account, passCorrect;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = state.accountIndex;
                            account = getters.account;
                            if (!index)
                                return [2 /*return*/];
                            return [4 /*yield*/, verifyAccountPassword(account, pass)];
                        case 1:
                            passCorrect = _b.sent();
                            if (!passCorrect)
                                throw new Error('Invalid password.');
                            // Remove current wallet file
                            removeAccountByIndex(index);
                            // Save with volatile keys
                            dispatch('saveAccount', {
                                password: pass,
                                accountName: account.name,
                            });
                            return [2 /*return*/];
                    }
                });
            });
        },
        // Remove the selected key from account and update local storage
        deleteKey: function (_a, wallet) {
            var state = _a.state, getters = _a.getters, rootState = _a.rootState, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var delIndex, acctIndex, acct;
                return __generator(this, function (_b) {
                    if (!getters.account)
                        return [2 /*return*/];
                    delIndex = rootState.wallets.indexOf(wallet);
                    acctIndex = state.accountIndex;
                    acct = getters.account;
                    if (!acctIndex)
                        throw new Error('Account not found.');
                    acct.baseAddresses.splice(delIndex, 1);
                    acct.wallet.keys.splice(delIndex, 1);
                    overwriteAccountAtIndex(acct, acctIndex);
                    commit('loadAccounts');
                    return [2 /*return*/];
                });
            });
        },
    },
    getters: {
        baseAddresses: function (state, getters, rootState) {
            var wallets = rootState.wallets;
            return wallets.map(function (w) {
                return w.getEvmAddress();
            });
        },
        baseAddressesNonVolatile: function (state, getters, rootState) {
            var wallets = rootState.wallets.filter(function (w) {
                return !rootState.volatileWallets.includes(w);
            });
            return wallets.map(function (w) {
                return w.getEvmAddress();
            });
        },
        account: function (state, getters) {
            if (state.accountIndex === null)
                return null;
            return state.accounts[state.accountIndex];
        },
    },
};
export default accounts_module;
//# sourceMappingURL=accounts.js.map