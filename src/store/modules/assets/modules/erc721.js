import { __awaiter, __generator } from "tslib";
import ERC721Token from '@/js/ERC721Token';
import ERC721_TOKEN_LIST from '@/ERC721Tokenlist.json';
import Vue from 'vue';
var erc721_module = {
    namespaced: true,
    state: {
        erc721Tokens: [],
        erc721TokensCustom: [],
        walletBalance: {},
    },
    mutations: {
        clear: function (state) {
            state.walletBalance = {};
        },
        saveCustomContracts: function (state) {
            var tokens = state.erc721TokensCustom;
            var tokenRawData = tokens.map(function (token) {
                return token.data;
            });
            localStorage.setItem('erc721_tokens', JSON.stringify(tokenRawData));
        },
        loadCustomContracts: function (state) {
            var tokensRaw = localStorage.getItem('erc721_tokens') || '[]';
            var tokens = JSON.parse(tokensRaw);
            for (var i = 0; i < tokens.length; i++) {
                state.erc721TokensCustom.push(new ERC721Token(tokens[i]));
            }
        },
    },
    actions: {
        removeCustom: function (_a, data) {
            var state = _a.state, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var index;
                return __generator(this, function (_b) {
                    index = state.erc721TokensCustom.indexOf(data);
                    state.erc721TokensCustom.splice(index, 1);
                    Vue.delete(state.walletBalance, data.contractAddress);
                    commit('saveCustomContracts');
                    return [2 /*return*/];
                });
            });
        },
        addCustom: function (_a, data) {
            var state = _a.state, dispatch = _a.dispatch, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var tokens, i, t_1, t;
                return __generator(this, function (_b) {
                    tokens = state.erc721Tokens.concat(state.erc721TokensCustom);
                    // Make sure its not added before
                    for (i = 0; i < tokens.length; i++) {
                        t_1 = tokens[i];
                        if (data.address === t_1.data.address && data.chainId === t_1.data.chainId) {
                            throw new Error('ERC20 Token already added.');
                        }
                    }
                    t = new ERC721Token(data);
                    state.erc721TokensCustom.push(t);
                    commit('saveCustomContracts');
                    setTimeout(function () {
                        dispatch('updateWalletBalance');
                    }, 500);
                    return [2 /*return*/, t];
                });
            });
        },
        init: function (_a) {
            var state = _a.state, commit = _a.commit;
            return __awaiter(this, void 0, void 0, function () {
                var erc721Tokens, i;
                return __generator(this, function (_b) {
                    erc721Tokens = ERC721_TOKEN_LIST.tokens;
                    for (i = 0; i < erc721Tokens.length; i++) {
                        state.erc721Tokens.push(new ERC721Token(erc721Tokens[i]));
                    }
                    commit('loadCustomContracts');
                    return [2 /*return*/];
                });
            });
        },
        updateWalletBalance: function (_a) {
            var state = _a.state, rootState = _a.rootState, getters = _a.getters;
            var w = rootState.activeWallet;
            if (!w)
                return;
            var walletAddr = '0x' + w.getEvmAddress();
            // Loop through contracts and update wallet balance object
            var contracts = getters.networkContracts;
            var _loop_1 = function () {
                var erc721 = contracts[i];
                erc721
                    .getAllTokensIds(walletAddr)
                    .then(function (tokenIds) {
                    Vue.set(state.walletBalance, erc721.contractAddress, tokenIds);
                })
                    .catch(function (err) {
                    console.error(err);
                });
            };
            for (var i = 0; i < contracts.length; i++) {
                _loop_1();
            }
        },
    },
    getters: {
        networkContracts: function (state, getters, rootState) {
            var tokens = state.erc721Tokens.concat(state.erc721TokensCustom);
            //@ts-ignore
            var chainId = rootState.Assets.evmChainId;
            var filt = tokens.filter(function (t) {
                if (t.data.chainId !== chainId)
                    return false;
                return true;
            });
            return filt;
        },
        networkContractsCustom: function (state, getters, rootState) {
            var contracts = getters.networkContracts;
            return contracts.filter(function (c) {
                return state.erc721TokensCustom.includes(c);
            });
        },
        totalOwned: function (state, getters, rootState) {
            var bal = state.walletBalance;
            var tot = 0;
            for (var contractAddrress in bal) {
                var len = bal[contractAddrress].length;
                tot += len;
            }
            return tot;
        },
        totalCollectionsOwned: function (state, getters, rootState) {
            var bal = state.walletBalance;
            var tot = 0;
            for (var contractAddrress in bal) {
                var len = bal[contractAddrress].length;
                if (len > 0)
                    tot++;
            }
            return tot;
        },
        find: function (state, getters) { return function (contractAddr) {
            var tokens = getters.networkContracts;
            for (var i = 0; i < tokens.length; i++) {
                var t = tokens[i];
                if (t.data.address === contractAddr) {
                    return t;
                }
            }
            return null;
        }; },
    },
};
export default erc721_module;
//# sourceMappingURL=erc721.js.map