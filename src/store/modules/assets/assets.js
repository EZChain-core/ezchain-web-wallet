import { __awaiter, __generator } from 'tslib'
import { ava, avm, bintools } from '@/AVA'
import Vue from 'vue'
import AvaAsset from '@/js/AvaAsset'
import { AvaNftFamily } from '@/js/AvaNftFamily'
import { UnixNow } from 'ezchainjs2/dist/utils'
import { BN } from 'ezchainjs2'
import axios from 'axios'
import Erc20Token from '@/js/Erc20Token'
import { web3 } from '@/evm'
// import ERC721Token from '@/js/ERC721Token'
var TOKEN_LISTS = [
    'https://raw.githubusercontent.com/pangolindex/tokenlists/main/ab.tokenlist.json',
]
import ERC721Module from './modules/erc721'
import ERC20_TOKEN_LIST from '@/ERC20Tokenlist.json'
import { any } from 'cypress/types/bluebird'
var assets_module = {
    namespaced: true,
    modules: {
        ERC721: ERC721Module,
    },
    state: {
        AVA_ASSET_ID: null,
        // isUpdateBalance: false,
        assets: [],
        assetsDict: {},
        nftFams: [],
        nftFamsDict: {},
        balanceDict: {},
        nftUTXOs: [],
        nftMintUTXOs: [],
        erc20Tokens: [],
        erc20TokensCustom: [],
        evmChainId: 0,
        tokenLists: [],
        tokenListUrls: [],
        tokenListsCustom: [],
    },
    mutations: {
        addAsset: function (state, asset) {
            if (state.assetsDict[asset.id]) {
                // console.info(`Failed to add asset. Asset already exists. (${asset.id})`)
                return
            }
            state.assets.push(asset)
            Vue.set(state.assetsDict, asset.id, asset)
        },
        addNftFamily: function (state, family) {
            if (state.nftFamsDict[family.id]) {
                // console.info(`Failed to add NFT Family. Asset already exists. (${family.id})`)
                return
            }
            state.nftFams.push(family)
            Vue.set(state.nftFamsDict, family.id, family)
        },
        removeAllAssets: function (state) {
            state.assets = []
            state.assetsDict = {}
            state.nftFams = []
            state.nftFamsDict = {}
            state.nftUTXOs = []
            state.nftMintUTXOs = []
            state.balanceDict = {}
            state.AVA_ASSET_ID = null
        },
        saveCustomErc20Tokens: function (state) {
            var tokens = state.erc20TokensCustom
            var tokenRawData = tokens.map(function (token) {
                return token.data
            })
            localStorage.setItem('erc20_tokens', JSON.stringify(tokenRawData))
        },
        loadCustomErc20Tokens: function (state) {
            var tokensRaw = localStorage.getItem('erc20_tokens') || '[]'
            var tokens = JSON.parse(tokensRaw)
            for (var i = 0; i < tokens.length; i++) {
                state.erc20TokensCustom.push(new Erc20Token(tokens[i]))
            }
        },
        saveCustomTokenLists: function (state) {
            var lists = JSON.stringify(state.tokenListsCustom)
            localStorage.setItem('token_lists', lists)
        },
    },
    actions: {
        onNetworkChange: function (_a, network) {
            var state = _a.state
            return __awaiter(this, void 0, void 0, function () {
                var id
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            return [4 /*yield*/, web3.eth.getChainId()]
                        case 1:
                            id = _b.sent()
                            state.evmChainId = id
                            return [2 /*return*/]
                    }
                })
            })
        },
        // Called on a logout event
        onlogout: function (_a) {
            var state = _a.state,
                commit = _a.commit
            // state.isUpdateBalance = false
            commit('removeAllAssets')
        },
        // Called when the active wallet finishes fetching utxos
        onUtxosUpdated: function (_a) {
            var state = _a.state,
                dispatch = _a.dispatch,
                rootState = _a.rootState
            return __awaiter(this, void 0, void 0, function () {
                var wallet
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            wallet = rootState.activeWallet
                            if (!wallet) return [2 /*return*/]
                            if (wallet.isFetchUtxos) {
                                setTimeout(function () {
                                    dispatch('onUtxosUpdated')
                                }, 500)
                                return [2 /*return*/]
                            }
                            return [4 /*yield*/, dispatch('updateBalanceDict')]
                        case 1:
                            _b.sent()
                            return [4 /*yield*/, dispatch('updateUtxoArrays')]
                        case 2:
                            _b.sent()
                            return [4 /*yield*/, dispatch('addUnknownAssets')]
                        case 3:
                            _b.sent()
                            return [2 /*return*/]
                    }
                })
            })
        },
        updateUtxoArrays: function (_a) {
            var state = _a.state,
                rootState = _a.rootState,
                getters = _a.getters
            var utxoSet = getters.walletAvmUtxoSet
            if (utxoSet === null) return {}
            var utxos = utxoSet.getAllUTXOs()
            var nftUtxos = []
            var nftMintUtxos = []
            for (var n = 0; n < utxos.length; n++) {
                var utxo = utxos[n]
                var outId = utxo.getOutput().getOutputID()
                if (outId === 11) {
                    nftUtxos.push(utxo)
                } else if (outId === 10) {
                    nftMintUtxos.push(utxo)
                }
            }
            state.nftUTXOs = nftUtxos
            state.nftMintUTXOs = nftMintUtxos
        },
        addErc20Token: function (_a, token) {
            var state = _a.state,
                rootState = _a.rootState
            return __awaiter(this, void 0, void 0, function () {
                var tokens, i, t_1, t
                return __generator(this, function (_b) {
                    tokens = state.erc20TokensCustom.concat(state.erc20Tokens)
                    // Make sure its not added before
                    for (i = 0; i < tokens.length; i++) {
                        t_1 = tokens[i]
                        if (
                            token.address === t_1.data.address &&
                            token.chainId === t_1.data.chainId
                        ) {
                            throw new Error('ERC20 Token already added.')
                        }
                    }
                    t = new Erc20Token(token)
                    state.erc20Tokens.push(t)
                    return [2 /*return*/]
                })
            })
        },
        addCustomErc20Token: function (_a, token) {
            var state = _a.state,
                rootState = _a.rootState,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var tokens, i, t_2, t, w
                return __generator(this, function (_b) {
                    tokens = state.erc20TokensCustom.concat(state.erc20Tokens)
                    // Make sure its not added before
                    for (i = 0; i < tokens.length; i++) {
                        t_2 = tokens[i]
                        if (
                            token.address === t_2.data.address &&
                            token.chainId === t_2.data.chainId
                        ) {
                            throw new Error('ERC20 Token already added.')
                        }
                    }
                    t = new Erc20Token(token)
                    // Save token state to storage
                    state.erc20TokensCustom.push(t)
                    w = rootState.activeWallet
                    if (w) {
                        t.updateBalance(w.ethAddress)
                    }
                    commit('saveCustomErc20Tokens')
                    return [2 /*return*/, t]
                })
            })
        },
        removeTokenList: function (_a, list) {
            var state = _a.state,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var i, l, index
                return __generator(this, function (_b) {
                    // Remove token list object
                    for (i = 0; i <= state.tokenLists.length; i++) {
                        l = state.tokenLists[i]
                        if (l.url === list.url) {
                            state.tokenLists.splice(i, 1)
                            break
                        }
                    }
                    index = state.tokenListsCustom.indexOf(list.url)
                    state.tokenListsCustom.splice(index, 1)
                    // Update local storage
                    commit('saveCustomTokenLists')
                    return [2 /*return*/]
                })
            })
        },
        addTokenListUrl: function (_a, data) {
            var dispatch = _a.dispatch,
                state = _a.state,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var url, res, tokenList
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // Make sure URL is not already added
                            if (state.tokenListUrls.includes(data.url)) throw 'Already added.'
                            if (state.tokenListsCustom.includes(data.url)) throw 'Already added.'
                            url = data.url
                            return [4 /*yield*/, axios.get(url)]
                        case 1:
                            res = _b.sent()
                            tokenList = res.data
                            tokenList.url = url
                            tokenList.readonly = data.readonly
                            dispatch('addTokenList', tokenList)
                            return [2 /*return*/]
                    }
                })
            })
        },
        addTokenList: function (_a, tokenList) {
            var state = _a.state,
                dispatch = _a.dispatch,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var tokens, i
                return __generator(this, function (_b) {
                    tokens = tokenList.tokens
                    state.tokenLists.push(tokenList)
                    for (i = 0; i < tokens.length; i++) {
                        dispatch('addErc20Token', tokens[i])
                    }
                    if (!tokenList.readonly) {
                        state.tokenListsCustom.push(tokenList.url)
                        commit('saveCustomTokenLists')
                    } else {
                        state.tokenListUrls.push(tokenList.url)
                    }
                    return [2 /*return*/]
                })
            })
        },
        loadCustomTokenLists: function (_a) {
            var state = _a.state,
                dispatch = _a.dispatch
            var listRaw = localStorage.getItem('token_lists')
            if (!listRaw) return
            var urls = JSON.parse(listRaw)
            urls.forEach(function (url) {
                dispatch('addTokenListUrl', {
                    url: url,
                    readonly: false,
                })
            })
        },
        initErc20List: function (_a) {
            var state = _a.state,
                dispatch = _a.dispatch,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var erc20Tokens, i
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            erc20Tokens = ERC20_TOKEN_LIST
                            erc20Tokens.readonly = true
                            erc20Tokens.url = 'Default'
                            return [4 /*yield*/, dispatch('addTokenList', erc20Tokens)]
                        case 1:
                            _b.sent()
                            i = 0
                            _b.label = 2
                            break
                        case 2:
                            if (!(i < TOKEN_LISTS.length)) return [3 /*break*/, 5]
                            return [
                                4 /*yield*/,
                                dispatch('addTokenListUrl', {
                                    url: TOKEN_LISTS[i],
                                    readonly: true,
                                }),
                            ]
                        case 3:
                            _b.sent()
                            _b.label = 4
                            break
                        case 4:
                            i++
                            return [3 /*break*/, 2]
                        case 5:
                            dispatch('loadCustomTokenLists')
                            commit('loadCustomErc20Tokens')
                            return [2 /*return*/]
                    }
                })
            })
        },
        // Gets the balances of the active wallet and gets descriptions for unknown asset ids
        addUnknownAssets: function (_a) {
            var state = _a.state,
                getters = _a.getters,
                rootGetters = _a.rootGetters,
                dispatch = _a.dispatch
            var balanceDict = state.balanceDict
            var nftDict = getters.walletNftDict
            var nftMintDict = getters.nftMintDict
            for (var id in balanceDict) {
                if (!state.assetsDict[id]) {
                    dispatch('addUnknownAsset', id)
                }
            }
            for (var nft_id in nftDict) {
                if (!state.nftFamsDict[nft_id]) {
                    dispatch('addUnknownNftFamily', nft_id)
                }
            }
            for (var familyId in nftMintDict) {
                if (!state.nftFamsDict[familyId]) {
                    dispatch('addUnknownNftFamily', familyId)
                }
            }
        },
        // Update the utxos for the current active wallet
        updateUTXOs: function (_a) {
            var state = _a.state,
                commit = _a.commit,
                dispatch = _a.dispatch,
                rootState = _a.rootState
            return __awaiter(this, void 0, void 0, function () {
                var wallet
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            wallet = rootState.activeWallet
                            if (!wallet) {
                                return [2 /*return*/, false]
                            }
                            return [4 /*yield*/, wallet.getUTXOs()]
                        case 1:
                            _b.sent()
                            dispatch('onUtxosUpdated')
                            dispatch('updateERC20Balances')
                            dispatch('ERC721/updateWalletBalance')
                            commit('updateActiveAddress', null, { root: true })
                            return [2 /*return*/]
                    }
                })
            })
        },
        // Only updates external utxos of the wallet
        updateUTXOsExternal: function (_a) {
            var commit = _a.commit,
                dispatch = _a.dispatch,
                rootState = _a.rootState
            return __awaiter(this, void 0, void 0, function () {
                var wallet
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            wallet = rootState.activeWallet
                            if (!wallet) {
                                return [2 /*return*/, false]
                            }
                            if (!(wallet.type === 'ledger' || wallet.type === 'mnemonic'))
                                return [3 /*break*/, 2]
                            return [4 /*yield*/, wallet.updateUTXOsExternal()]
                        case 1:
                            _b.sent()
                            return [3 /*break*/, 4]
                        case 2:
                            return [4 /*yield*/, wallet.updateUTXOsX()]
                        case 3:
                            _b.sent()
                            _b.label = 4
                            break
                        case 4:
                            dispatch('onUtxosUpdated')
                            commit('updateActiveAddress', null, { root: true })
                            return [2 /*return*/]
                    }
                })
            })
        },
        updateERC20Balances: function (_a) {
            var state = _a.state,
                rootState = _a.rootState,
                getters = _a.getters
            return __awaiter(this, void 0, void 0, function () {
                var wallet, networkID, tokens
                return __generator(this, function (_b) {
                    wallet = rootState.activeWallet
                    if (!wallet) return [2 /*return*/]
                    // Old ledger wallets do not have an eth address
                    if (!wallet.ethAddress) return [2 /*return*/]
                    networkID = state.evmChainId
                    tokens = getters.networkErc20Tokens
                    tokens.forEach(function (token) {
                        if (token.data.chainId !== networkID) return
                        token.updateBalance(wallet.ethAddress)
                    })
                    return [2 /*return*/]
                })
            })
        },
        // What is the AVA coin in the network
        updateAvaAsset: function (_a) {
            var state = _a.state,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var res, id, asset
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            return [4 /*yield*/, avm.getAssetDescription('EZC')]
                        case 1:
                            res = _b.sent()
                            id = bintools.cb58Encode(res.assetID)
                            state.AVA_ASSET_ID = id
                            asset = new AvaAsset(id, res.name, res.symbol, res.denomination)
                            commit('addAsset', asset)
                            return [2 /*return*/]
                    }
                })
            })
        },
        updateBalanceDict: function (_a) {
            var state = _a.state,
                rootState = _a.rootState,
                getters = _a.getters
            var utxoSet = getters.walletAvmUtxoSet
            if (utxoSet === null) return {}
            var dict = {}
            var unixNox = UnixNow()
            var ZERO = new BN(0)
            var addrUtxos = utxoSet.getAllUTXOs()
            for (var n = 0; n < addrUtxos.length; n++) {
                var utxo = addrUtxos[n]
                // Process only SECP256K1 Transfer Output utxos, outputid === 07
                var outId = utxo.getOutput().getOutputID()
                if (outId !== 7) continue
                var utxoOut = utxo.getOutput()
                var locktime = utxoOut.getLocktime()
                var amount = utxoOut.getAmount()
                var assetIdBuff = utxo.getAssetID()
                var assetId = bintools.cb58Encode(assetIdBuff)
                // if not locked
                if (locktime.lte(unixNox)) {
                    if (!dict[assetId]) {
                        dict[assetId] = {
                            locked: ZERO,
                            available: amount.clone(),
                        }
                    } else {
                        let amt = dict[assetId].available
                        dict[assetId].available = amt.add(amount)
                    }
                } else {
                    // If locked
                    if (!dict[assetId]) {
                        dict[assetId] = {
                            locked: amount.clone(),
                            available: ZERO,
                        }
                    } else {
                        let amt = dict[assetId].locked
                        dict[assetId].locked = amt.add(amount)
                    }
                }
            }
            state.balanceDict = dict
            return dict
        },
        // Adds an unknown asset id to the assets dictionary
        addUnknownAsset: function (_a, assetId) {
            var state = _a.state,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var desc, newAsset
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            return [4 /*yield*/, ava.XChain().getAssetDescription(assetId)]
                        case 1:
                            desc = _b.sent()
                            newAsset = new AvaAsset(
                                assetId,
                                desc.name,
                                desc.symbol,
                                desc.denomination
                            )
                            return [4 /*yield*/, commit('addAsset', newAsset)]
                        case 2:
                            _b.sent()
                            return [2 /*return*/, desc]
                    }
                })
            })
        },
        addUnknownNftFamily: function (_a, assetId) {
            var state = _a.state,
                commit = _a.commit
            return __awaiter(this, void 0, void 0, function () {
                var desc, newFam
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            return [4 /*yield*/, ava.XChain().getAssetDescription(assetId)]
                        case 1:
                            desc = _b.sent()
                            newFam = new AvaNftFamily(assetId, desc.name, desc.symbol)
                            return [4 /*yield*/, commit('addNftFamily', newFam)]
                        case 2:
                            _b.sent()
                            return [2 /*return*/, desc]
                    }
                })
            })
        },
    },
    getters: {
        networkErc20Tokens: function (state, getters, rootState) {
            var tokens = state.erc20Tokens.concat(state.erc20TokensCustom)
            var chainId = state.evmChainId
            var filt = tokens.filter(function (t) {
                if (t.data.chainId !== chainId) return false
                return true
            })
            return filt
        },
        findErc20: function (state) {
            return function (contractAddr) {
                var tokens = state.erc20Tokens.concat(state.erc20TokensCustom)
                for (var i = 0; i < tokens.length; i++) {
                    var t = tokens[i]
                    if (t.data.address === contractAddr) {
                        return t
                    }
                }
                return null
            }
        },
        // assset id -> utxos
        walletNftDict: function (state, getters, rootState) {
            var utxos = state.nftUTXOs
            var res = {}
            for (var i = 0; i < utxos.length; i++) {
                var utxo = utxos[i]
                var assetIdBuff = utxo.getAssetID()
                // TODO: Encoding might be taking too much time
                var assetId = bintools.cb58Encode(assetIdBuff)
                if (res[assetId]) {
                    res[assetId].push(utxo)
                } else {
                    res[assetId] = [utxo]
                }
            }
            return res
        },
        walletAssetsDict: function (state, getters, rootState, rootGetters) {
            // let balanceDict: IWalletBalanceDict = getters.walletBalanceDict
            //@ts-ignore
            var balanceDict = state.balanceDict
            // @ts-ignore
            var assetsDict = state.assetsDict
            var res = {}
            for (var assetId in assetsDict) {
                var balanceAmt = balanceDict[assetId]
                var asset = void 0
                if (!balanceAmt) {
                    asset = assetsDict[assetId]
                    asset.resetBalance()
                } else {
                    asset = assetsDict[assetId]
                    asset.resetBalance()
                    asset.addBalance(balanceAmt.available)
                    asset.addBalanceLocked(balanceAmt.locked)
                }
                // Add extras for AVAX token
                // @ts-ignore
                if (asset.id === state.AVA_ASSET_ID) {
                    asset.addExtra(getters.walletStakingBalance)
                    asset.addExtra(getters.walletPlatformBalance)
                    asset.addExtra(getters.walletPlatformBalanceLocked)
                    asset.addExtra(getters.walletPlatformBalanceLockedStakeable)
                }
                res[assetId] = asset
            }
            return res
        },
        walletAssetsArray: function (state, getters) {
            // let assetsDict: IWalletAssetsDict = getters.walletAssetsDict
            var assetsDict = getters.walletAssetsDict
            var res = []
            for (var id in assetsDict) {
                var asset = assetsDict[id]
                res.push(asset)
            }
            return res
        },
        walletAvmUtxoSet: function (state, getters, rootState) {
            var wallet = rootState.activeWallet
            if (!wallet) return null
            return wallet.utxoset
        },
        nftFamilies: function (state) {
            return state.nftFams
        },
        walletStakingBalance: function (state, getters, rootState, rootGetters) {
            var wallet = rootState.activeWallet
            if (!wallet) return new BN(0)
            return wallet.stakeAmount
        },
        walletPlatformBalance: function (state, getters, rootState) {
            var wallet = rootState.activeWallet
            if (!wallet) return new BN(0)
            var utxoSet
            utxoSet = wallet.getPlatformUTXOSet()
            var now = UnixNow()
            // The only type of asset is AVAX on the P chain
            var amt = new BN('0')
            var utxos = utxoSet.getAllUTXOs()
            for (var n = 0; n < utxos.length; n++) {
                var utxo = utxos[n]
                var utxoOut = utxo.getOutput()
                var outId = utxoOut.getOutputID()
                var locktime = void 0
                if (outId === 22) {
                    locktime = utxoOut.getStakeableLocktime()
                } else {
                    locktime = utxoOut.getLocktime()
                }
                // Filter out locked tokens and stakeable locked tokens
                if (locktime.lte(now)) {
                    amt.iadd(utxoOut.getAmount())
                }
            }
            return amt
        },
        walletPlatformBalanceLocked: function (state, getters, rootState) {
            var wallet = rootState.activeWallet
            if (!wallet) return new BN(0)
            var utxoSet
            utxoSet = wallet.getPlatformUTXOSet()
            var now = UnixNow()
            // The only type of asset is AVAX on the P chain
            var amt = new BN(0)
            var utxos = utxoSet.getAllUTXOs()
            for (var n = 0; n < utxos.length; n++) {
                var utxo = utxos[n]
                var utxoOut = utxo.getOutput()
                var locktime = utxoOut.getLocktime()
                // Filter unlocked tokens
                if (locktime.gt(now)) {
                    amt.iadd(utxoOut.getAmount())
                }
            }
            return amt
        },
        walletPlatformBalanceLockedStakeable: function (state, getters, rootState) {
            var wallet = rootState.activeWallet
            if (!wallet) return new BN(0)
            var utxoSet
            utxoSet = wallet.getPlatformUTXOSet()
            // The only type of asset is AVAX on the P chain
            var amt = new BN(0)
            var unixNow = UnixNow()
            var utxos = utxoSet.getAllUTXOs()
            for (var n = 0; n < utxos.length; n++) {
                var utxo = utxos[n]
                var utxoOut = utxo.getOutput()
                var outType = utxoOut.getOutputID()
                // Type ID 22 is stakeable but locked tokens
                if (outType === 22) {
                    var locktime = utxoOut.getStakeableLocktime()
                    // Make sure the locktime is in the future
                    if (locktime.gt(unixNow)) {
                        amt.iadd(utxoOut.getAmount())
                    }
                }
            }
            return amt
        },
        nftMintDict: function (state) {
            var res = {}
            var mintUTXOs = state.nftMintUTXOs
            for (var i = 0; i < mintUTXOs.length; i++) {
                var utxo = mintUTXOs[i]
                var assetId = bintools.cb58Encode(utxo.getAssetID())
                var target = res[assetId]
                if (target) {
                    target.push(utxo)
                } else {
                    res[assetId] = [utxo]
                }
            }
            // sort by groupID
            for (var id in res) {
                res[id].sort(function (a, b) {
                    var idA = a.getOutput().getGroupID()
                    var idB = b.getOutput().getGroupID()
                    return idA - idB
                })
            }
            return res
        },
        assetIds: function (state) {
            return state.assets.map(function (asset) {
                return asset.id
            })
        },
        AssetAVA: function (state, getters, rootState, rootGetters) {
            var walletBalanceDict = getters.walletAssetsDict
            var AVA_ASSET_ID = state.AVA_ASSET_ID
            if (AVA_ASSET_ID) {
                if (walletBalanceDict[AVA_ASSET_ID]) {
                    return walletBalanceDict[AVA_ASSET_ID]
                }
            }
            return null
        },
    },
}
export default assets_module
//# sourceMappingURL=assets.js.map
