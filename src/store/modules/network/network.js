import { __awaiter, __generator } from 'tslib'
import { ava, avm, cChain, infoApi, pChain } from '@/AVA'
import { AvaNetwork } from '@/js/AvaNetwork'
import { explorer_api } from '@/explorer_api'
import { BN } from 'ezchainjs2'
import router from '@/router'
import { web3 } from '@/evm'
import { setSocketNetwork } from '../../../providers'
import { Network } from 'ezchain-wallet-sdk'
var network_module = {
    namespaced: true,
    state: {
        status: 'disconnected',
        networks: [],
        networksCustom: [],
        selectedNetwork: null,
        txFee: new BN(0),
    },
    mutations: {
        addNetwork: function (state, net) {
            state.networks.push(net)
        },
    },
    getters: {
        allNetworks: function (state) {
            return state.networks.concat(state.networksCustom)
        },
    },
    actions: {
        addCustomNetwork: function (_a, net) {
            var state = _a.state,
                dispatch = _a.dispatch
            // Check if network alerady exists
            var networks = state.networksCustom
            // Do not add if there is a network already with the same url
            for (var i = 0; i < networks.length; i++) {
                var url = networks[i].url
                if (net.url === url) {
                    return
                }
            }
            state.networksCustom.push(net)
            dispatch('save')
        },
        removeCustomNetwork: function (_a, net) {
            var state = _a.state,
                dispatch = _a.dispatch
            return __awaiter(this, void 0, void 0, function () {
                var index
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = state.networksCustom.indexOf(net)
                            state.networksCustom.splice(index, 1)
                            return [4 /*yield*/, dispatch('save')]
                        case 1:
                            _b.sent()
                            return [2 /*return*/]
                    }
                })
            })
        },
        saveSelectedNetwork: function (_a) {
            var _b
            var state = _a.state
            var data = JSON.stringify(
                (_b = state.selectedNetwork) === null || _b === void 0 ? void 0 : _b.url
            )
            localStorage.setItem('network_selected', data)
        },
        loadSelectedNetwork: function (_a) {
            var dispatch = _a.dispatch,
                getters = _a.getters
            return __awaiter(this, void 0, void 0, function () {
                var data, nets, i, net
                return __generator(this, function (_b) {
                    data = localStorage.getItem('network_selected')
                    if (!data) return [2 /*return*/, false]
                    try {
                        nets = getters.allNetworks
                        for (i = 0; i < nets.length; i++) {
                            net = nets[i]
                            if (JSON.stringify(net.url) === data) {
                                dispatch('setNetwork', net)
                                return [2 /*return*/, true]
                            }
                        }
                        return [2 /*return*/, false]
                    } catch (e) {
                        return [2 /*return*/, false]
                    }
                    return [2 /*return*/]
                })
            })
        },
        // Save custom networks to local storage
        save: function (_a) {
            var state = _a.state
            var data = JSON.stringify(state.networksCustom)
            localStorage.setItem('networks', data)
        },
        // Load custom networks from local storage
        load: function (_a) {
            var dispatch = _a.dispatch
            var data = localStorage.getItem('networks')
            if (data) {
                var networks = JSON.parse(data)
                networks.forEach(function (n) {
                    var newCustom = new AvaNetwork(
                        n.name,
                        n.url,
                        //@ts-ignore
                        parseInt(n.networkId),
                        n.explorerUrl,
                        n.explorerSiteUrl,
                        n.readonly
                    )
                    dispatch('addCustomNetwork', newCustom)
                })
            }
        },
        setNetwork: function (_a, net) {
            var state = _a.state,
                dispatch = _a.dispatch,
                commit = _a.commit,
                rootState = _a.rootState
            return __awaiter(this, void 0, void 0, function () {
                var chainIdX, chainIdP, chainIdC, web3Provider, i, w, sdkNetConf
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            state.status = 'connecting'
                            // Chose if the network should use credentials
                            return [4 /*yield*/, net.updateCredentials()]
                        case 1:
                            // Chose if the network should use credentials
                            _b.sent()
                            ava.setRequestConfig('withCredentials', net.withCredentials)
                            ava.setAddress(net.ip, net.port, net.protocol)
                            ava.setNetworkID(net.networkId)
                            // Reset transaction history
                            commit('History/clear', null, { root: true })
                            return [4 /*yield*/, infoApi.getBlockchainID('X')]
                        case 2:
                            chainIdX = _b.sent()
                            return [4 /*yield*/, infoApi.getBlockchainID('P')]
                        case 3:
                            chainIdP = _b.sent()
                            return [4 /*yield*/, infoApi.getBlockchainID('C')]
                        case 4:
                            chainIdC = _b.sent()
                            avm.refreshBlockchainID(chainIdX)
                            avm.setBlockchainAlias('X')
                            pChain.refreshBlockchainID(chainIdP)
                            pChain.setBlockchainAlias('P')
                            cChain.refreshBlockchainID(chainIdC)
                            cChain.setBlockchainAlias('C')
                            avm.getAVAXAssetID(true)
                            pChain.getAVAXAssetID(true)
                            cChain.getAVAXAssetID(true)
                            state.selectedNetwork = net
                            dispatch('saveSelectedNetwork')
                            // Update explorer api
                            explorer_api.defaults.baseURL = net.explorerUrl
                            web3Provider =
                                net.protocol + '://' + net.ip + ':' + net.port + '/ext/bc/C/rpc'
                            web3.setProvider(web3Provider)
                            // Set socket connections
                            setSocketNetwork(net)
                            commit('Assets/removeAllAssets', null, { root: true })
                            return [
                                4 /*yield*/,
                                dispatch('Assets/updateAvaAsset', null, { root: true }),
                                // If authenticated
                            ]
                        case 5:
                            _b.sent()
                            // If authenticated
                            if (rootState.isAuth) {
                                // Go back to wallet page
                                router.replace('/wallet')
                                for (i = 0; i < rootState.wallets.length; i++) {
                                    w = rootState.wallets[i]
                                    w.onnetworkchange()
                                }
                            }
                            return [
                                4 /*yield*/,
                                dispatch('Assets/onNetworkChange', net, { root: true }),
                            ]
                        case 6:
                            _b.sent()
                            dispatch('Assets/updateUTXOs', null, { root: true })
                            dispatch('Platform/update', null, { root: true })
                            dispatch('Platform/updateMinStakeAmount', null, { root: true })
                            dispatch('updateTxFee')
                            // Update tx history
                            dispatch('History/updateTransactionHistory', null, { root: true })
                            return [4 /*yield*/, Network.getConfigFromUrl(net.getFullURL())]
                        case 7:
                            sdkNetConf = _b.sent()
                            return [
                                4 /*yield*/,
                                Network.setNetworkAsync(sdkNetConf),
                                // state.isConnected = true;
                            ]
                        case 8:
                            _b.sent()
                            // state.isConnected = true;
                            state.status = 'connected'
                            return [2 /*return*/, true]
                    }
                })
            })
        },
        updateTxFee: function (_a) {
            var state = _a.state
            return __awaiter(this, void 0, void 0, function () {
                var txFee
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            return [4 /*yield*/, infoApi.getTxFee()]
                        case 1:
                            txFee = _b.sent()
                            state.txFee = txFee.txFee
                            avm.setTxFee(txFee.txFee)
                            return [2 /*return*/]
                    }
                })
            })
        },
        init: function (_a) {
            var state = _a.state,
                commit = _a.commit,
                dispatch = _a.dispatch
            return __awaiter(this, void 0, void 0, function () {
                var mainnet, fuji, e_1, isSet, e_2
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mainnet = new AvaNetwork(
                                'EZChain MainNet',
                                'https://api.ezchain.com:443',
                                1,
                                'https://index-api.ezchain.com',
                                'https://explorer.ezchain.com',
                                true
                            )
                            fuji = new AvaNetwork(
                                'EZChain Testnet',
                                'https://testnet-api.ezchain.com:443',
                                5,
                                'https://testnet-index-api.ezchain.com',
                                'https://testnet-explorer.ezchain.com',
                                true
                            )
                            _b.label = 1
                        case 1:
                            _b.trys.push([1, 3, , 4])
                            return [4 /*yield*/, dispatch('load')]
                        case 2:
                            _b.sent()
                            return [3 /*break*/, 4]
                        case 3:
                            e_1 = _b.sent()
                            console.error(e_1)
                            return [3 /*break*/, 4]
                        case 4:
                            commit('addNetwork', mainnet)
                            commit('addNetwork', fuji)
                            _b.label = 5
                        case 5:
                            _b.trys.push([5, 9, , 10])
                            return [4 /*yield*/, dispatch('loadSelectedNetwork')]
                        case 6:
                            isSet = _b.sent()
                            if (isSet) return [3 /*break*/, 8]
                            return [4 /*yield*/, dispatch('setNetwork', state.networks[0])]
                        case 7:
                            _b.sent()
                            _b.label = 8
                        case 8:
                            return [2 /*return*/, true]
                        case 9:
                            e_2 = _b.sent()
                            console.log(e_2)
                            state.status = 'disconnected'
                            return [3 /*break*/, 10]
                        case 10:
                            return [2 /*return*/]
                    }
                })
            })
        },
    },
}
export default network_module
//# sourceMappingURL=network.js.map
