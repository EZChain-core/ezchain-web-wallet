import Sockette from 'sockette'
import store from '@/store'
import { PubSub } from 'ezchainjs2'
var FILTER_ADDRESS_SIZE = 1000
export var socketX
export function connectSocketX(network) {
    if (socketX) {
        socketX.close()
    }
    // Setup the X chain socket connection
    var wsURL = network.getWsUrlX()
    socketX = new Sockette(wsURL, {
        onopen: xOnOpen,
        onclose: xOnClose,
        onmessage: xOnMessage,
        onerror: xOnError,
    })
}
export function updateFilterAddresses() {
    var wallet = store.state.activeWallet
    if (!socketX || !wallet) {
        return
    }
    var externalAddrs = wallet.getAllDerivedExternalAddresses()
    var addrsLen = externalAddrs.length
    var startIndex = Math.max(0, addrsLen - FILTER_ADDRESS_SIZE)
    var addrs = externalAddrs.slice(startIndex)
    var pubsub = new PubSub()
    var bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE)
    socketX.send(bloom)
    // Divide addresses by 100 and send multiple messages
    // There is a max msg size ~10kb
    var GROUP_AMOUNT = 100
    var index = 0
    while (index < addrs.length) {
        var chunk = addrs.slice(index, index + GROUP_AMOUNT)
        var addAddrs = pubsub.addAddresses(chunk)
        socketX.send(addAddrs)
        index += GROUP_AMOUNT
    }
}
// Clears the filter listening to X chain transactions
function clearFilter() {
    var pubsub = new PubSub()
    var bloom = pubsub.newBloom(FILTER_ADDRESS_SIZE)
    socketX.send(bloom)
}
function updateWalletBalanceX() {
    var wallet = store.state.activeWallet
    if (!wallet) return
    // Refresh the wallet balance
    store.dispatch('Assets/updateUTXOsExternal').then(function () {
        store.dispatch('History/updateTransactionHistory')
    })
}
// AVM Socket Listeners
function xOnOpen() {
    updateFilterAddresses()
}
function xOnMessage() {
    updateWalletBalanceX()
}
function xOnClose() {}
function xOnError() {}
//# sourceMappingURL=socket_x.js.map
