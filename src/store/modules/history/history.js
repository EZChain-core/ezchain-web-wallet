import { __awaiter, __generator } from 'tslib'
import { getAddressHistory } from '@/explorer_api'
import moment from 'moment'
import { avm, pChain } from '@/AVA'
import { filterDuplicateTransactions } from '@/helpers/history_helper'
var history_module = {
    namespaced: true,
    state: {
        isUpdating: false,
        isUpdatingAll: false,
        transactions: [],
        allTransactions: [],
    },
    mutations: {
        clear: function (state) {
            state.transactions = []
            state.allTransactions = []
        },
    },
    actions: {
        updateTransactionHistory: function (_a) {
            var state = _a.state,
                rootState = _a.rootState,
                rootGetters = _a.rootGetters,
                dispatch = _a.dispatch
            return __awaiter(this, void 0, void 0, function () {
                var wallet, network, avmAddrs, pvmAddrs, limit, txs, txsP, transactions
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            wallet = rootState.activeWallet
                            if (!wallet) return [2 /*return*/]
                            network = rootState.Network.selectedNetwork
                            if (!wallet.isInit) {
                                setTimeout(function () {
                                    dispatch('updateTransactionHistory')
                                }, 500)
                                return [2 /*return*/, false]
                            }
                            // can't update if there is no explorer or no wallet
                            if (!network || !network.explorerUrl || rootState.address === null) {
                                return [2 /*return*/, false]
                            }
                            state.isUpdating = true
                            avmAddrs = wallet.getAllAddressesX()
                            pvmAddrs = wallet.getAllAddressesP()
                            // this shouldnt ever happen, but to avoid getting every transaction...
                            if (avmAddrs.length === 0) {
                                state.isUpdating = false
                                return [2 /*return*/]
                            }
                            limit = 20
                            return [
                                4 /*yield*/,
                                getAddressHistory(avmAddrs, limit, avm.getBlockchainID()),
                            ]
                        case 1:
                            txs = _b.sent()
                            return [
                                4 /*yield*/,
                                getAddressHistory(pvmAddrs, limit, pChain.getBlockchainID()),
                            ]
                        case 2:
                            txsP = _b.sent()
                            transactions = txs.concat(txsP).sort(function (x, y) {
                                return moment(x.timestamp).isBefore(moment(y.timestamp)) ? 1 : -1
                            })
                            state.transactions = transactions
                            state.isUpdating = false
                            return [2 /*return*/]
                    }
                })
            })
        },
        updateAllTransactionHistory: function (_a) {
            var state = _a.state,
                rootState = _a.rootState,
                rootGetters = _a.rootGetters,
                dispatch = _a.dispatch
            return __awaiter(this, void 0, void 0, function () {
                var wallet,
                    network,
                    avmAddrs,
                    pvmAddrs,
                    limit,
                    txsX,
                    txsP,
                    txsXFiltered,
                    txsPFiltered,
                    transactions
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            wallet = rootState.activeWallet
                            if (!wallet) return [2 /*return*/]
                            network = rootState.Network.selectedNetwork
                            if (!wallet.isInit) {
                                setTimeout(function () {
                                    dispatch('updateAllTransactionHistory')
                                }, 500)
                                return [2 /*return*/, false]
                            }
                            // can't update if there is no explorer or no wallet
                            if (!network.explorerUrl || rootState.address === null) {
                                return [2 /*return*/, false]
                            }
                            state.isUpdatingAll = true
                            avmAddrs = wallet.getAllAddressesX()
                            pvmAddrs = wallet.getAllAddressesP()
                            // this shouldnt ever happen, but to avoid getting every transaction...
                            if (avmAddrs.length === 0) {
                                state.isUpdatingAll = false
                                return [2 /*return*/]
                            }
                            limit = 0
                            return [
                                4 /*yield*/,
                                getAddressHistory(avmAddrs, limit, avm.getBlockchainID()),
                            ]
                        case 1:
                            txsX = _b.sent()
                            return [
                                4 /*yield*/,
                                getAddressHistory(pvmAddrs, limit, pChain.getBlockchainID()),
                            ]
                        case 2:
                            txsP = _b.sent()
                            txsXFiltered = filterDuplicateTransactions(txsX)
                            txsPFiltered = filterDuplicateTransactions(txsP)
                            transactions = txsXFiltered.concat(txsPFiltered).sort(function (x, y) {
                                return moment(x.timestamp).isBefore(moment(y.timestamp)) ? 1 : -1
                            })
                            state.allTransactions = transactions
                            state.isUpdatingAll = false
                            return [2 /*return*/]
                    }
                })
            })
        },
    },
    getters: {
        stakingTxs: function (state) {
            return state.allTransactions.filter(function (tx) {
                var types = ['add_validator', 'add_delegator']
                if (types.includes(tx.type)) {
                    return true
                }
                return false
            })
        },
    },
}
export default history_module
//# sourceMappingURL=history.js.map
