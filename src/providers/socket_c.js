import { ethers } from 'ethers'
import store from '@/store'
var SOCKET_RECONNECT_TIMEOUT = 1000
export function connectSocketC(network) {
    try {
        var wsUrl = network.getWsUrlC()
        var wsProvider = new ethers.providers.WebSocketProvider(wsUrl)
        if (socketEVM) {
            socketEVM._websocket.onclose = function () {}
            socketEVM.destroy()
            socketEVM = wsProvider
        } else {
            socketEVM = wsProvider
        }
        updateEVMSubscriptions()
        // Save default function so we can keep calling it
        var defaultOnOpen_1 = wsProvider._websocket.onopen
        var defaultOnClose_1 = wsProvider._websocket.onclose
        wsProvider._websocket.onopen = function (ev) {
            if (defaultOnOpen_1) defaultOnOpen_1(ev)
        }
        wsProvider._websocket.onclose = function (ev) {
            if (defaultOnClose_1) defaultOnClose_1(ev)
            setTimeout(function () {
                connectSocketC(network)
            }, SOCKET_RECONNECT_TIMEOUT)
        }
    } catch (e) {
        console.info('EVM Websocket connection failed.')
    }
}
var evmSubscriptionTimeout
var SUBSCRIBE_TIMEOUT = 500
export function updateEVMSubscriptions() {
    if (!socketEVM) {
        // try again later
        if (evmSubscriptionTimeout) {
            clearTimeout(evmSubscriptionTimeout)
        }
        evmSubscriptionTimeout = setTimeout(function () {
            updateEVMSubscriptions()
        }, SUBSCRIBE_TIMEOUT)
        return
    }
    removeBlockHeaderListener(socketEVM)
    addBlockHeaderListener(socketEVM)
}
function removeBlockHeaderListener(provider) {
    provider.off('block', blockHeaderCallback)
}
function addBlockHeaderListener(provider) {
    provider.on('block', blockHeaderCallback)
}
function blockHeaderCallback() {
    updateWalletBalanceC()
}
function updateWalletBalanceC() {
    var wallet = store.state.activeWallet
    if (!wallet) return
    // Refresh the wallet balance
    wallet.getEthBalance()
}
export var socketEVM
//# sourceMappingURL=socket_c.js.map
