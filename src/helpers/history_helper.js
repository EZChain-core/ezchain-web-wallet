// interface IHistoryParsedBaseTx{
//     sent:
//     received:
// }
import { __read, __spread } from 'tslib'
import { BN } from 'ezchainjs2'
import { AVMConstants } from 'ezchainjs2/dist/apis/avm'
// Used with tokens
function addToDict(assetId, amount, dict, utxo, addresses) {
    var _a
    if (dict[assetId]) {
        dict[assetId].amount = dict[assetId].amount.add(amount)
        var addrDiff = addresses.filter(function (addr) {
            return !dict[assetId].addresses.includes(addr)
        })
        ;(_a = dict[assetId].addresses).push.apply(_a, __spread(addrDiff))
    } else {
        dict[assetId] = {
            amount: amount,
            payload: utxo.payload,
            groupNum: utxo.groupID,
            addresses: addresses,
        }
    }
}
function getNFTsSummary(tx, wallet) {
    var nftLoss = getLossNFT(tx, wallet)
    var nftGain = getGainNFT(tx, wallet)
    return {
        sent: nftLoss,
        received: nftGain,
    }
}
function getLossNFT(tx, wallet) {
    var _a
    var walletAddrs = wallet.getHistoryAddresses()
    var addrsStripped = walletAddrs.map(function (addr) {
        return addr.split('-')[1]
    })
    var inputs = tx.inputs || []
    var outputs = tx.outputs
    var loss = {
        assets: {},
        addresses: [],
    }
    var nfts = inputs.filter(function (input) {
        var type = input.output.outputType
        if (type === AVMConstants.NFTXFEROUTPUTID) return true
        return false
    })
    var nftsOuts = outputs.filter(function (output) {
        var type = output.outputType
        if (type === AVMConstants.NFTXFEROUTPUTID) return true
        return false
    })
    for (var i = 0; i < nfts.length; i++) {
        var utxo = nfts[i].output
        var owners = utxo.addresses
        var assetID = utxo.assetID
        var intersect = owners.filter(function (addr) {
            return addrsStripped.includes(addr)
        })
        // Did we lose it?
        if (intersect.length > 0) {
            if (loss.assets[assetID]) {
                loss.assets[assetID].push(utxo)
            } else {
                loss.assets[assetID] = [utxo]
            }
            // Who did we lose it to?
            for (var n = 0; i < nftsOuts.length; n++) {
                var nftOut = nftsOuts[n]
                var doesMatch = nftOut.groupID === utxo.groupID && nftOut.assetID === utxo.assetID
                var addrNotAdded = nftOut.addresses.filter(function (addr) {
                    return !loss.addresses.includes(addr)
                })
                if (doesMatch) {
                    ;(_a = loss.addresses).push.apply(_a, __spread(addrNotAdded))
                    break
                }
            }
        }
    }
    return loss
}
function getGainNFT(tx, wallet) {
    var _a
    var walletAddrs = wallet.getHistoryAddresses()
    var addrsStripped = walletAddrs.map(function (addr) {
        return addr.split('-')[1]
    })
    var inputs = tx.inputs || []
    var outputs = tx.outputs
    var gain = {
        assets: {},
        addresses: [],
    }
    var nftsIns = inputs.filter(function (input) {
        var type = input.output.outputType
        if (type === AVMConstants.NFTXFEROUTPUTID) return true
        return false
    })
    var nftsOuts = outputs.filter(function (output) {
        var type = output.outputType
        if (type === AVMConstants.NFTXFEROUTPUTID) return true
        return false
    })
    for (var i = 0; i < nftsOuts.length; i++) {
        var utxo = nftsOuts[i]
        var owners = utxo.addresses
        var assetID = utxo.assetID
        var intersect = owners.filter(function (addr) {
            return addrsStripped.includes(addr)
        })
        // Did we gain it?
        if (intersect.length > 0) {
            if (gain.assets[assetID]) {
                gain.assets[assetID].push(utxo)
            } else {
                gain.assets[assetID] = [utxo]
            }
            // Who did we gain it from?
            for (var n = 0; n < nftsIns.length; n++) {
                var nftIn = nftsIns[n].output
                var doesMatch = nftIn.groupID === utxo.groupID && nftIn.assetID === utxo.assetID
                var addrNotAdded = nftIn.addresses.filter(function (addr) {
                    return !gain.addresses.includes(addr)
                })
                if (doesMatch) {
                    ;(_a = gain.addresses).push.apply(_a, __spread(addrNotAdded))
                }
            }
        }
    }
    return gain
}
function getLoss(tx, wallet) {
    var ins = tx.inputs || []
    var outs = tx.outputs
    var walletAddrs = wallet.getHistoryAddresses()
    var addrsStripped = walletAddrs.map(function (addr) {
        return addr.split('-')[1]
    })
    var loss = {}
    if (ins) {
        var _loop_1 = function (i) {
            var input = ins[i]
            var utxo = input.output
            var outputType = utxo.outputType
            var isNft = outputType === AVMConstants.NFTXFEROUTPUTID
            if (isNft) return 'continue'
            var addrs = utxo.addresses
            var intersect = addrs.filter(function (addr) {
                return addrsStripped.includes(addr)
            })
            if (intersect.length === 0) return 'continue'
            var assetId = utxo.assetID
            var amount = utxo.amount
            var amountBN = new BN(amount)
            // Get who received this asset
            var receivers = []
            outs.forEach(function (utxo) {
                if (utxo.assetID === assetId) {
                    var outAddrs = utxo.addresses
                    // If not a wallet address and not added to receivers
                    var targets = outAddrs.filter(function (addr) {
                        return !addrsStripped.includes(addr) && !receivers.includes(addr)
                    })
                    receivers.push.apply(receivers, __spread(targets))
                }
            })
            addToDict(assetId, amountBN, loss, utxo, receivers)
        }
        for (var i = 0; i < ins.length; i++) {
            _loop_1(i)
        }
    }
    return loss
}
function getProfit(tx, wallet) {
    var outs = tx.outputs
    var ins = tx.inputs || []
    var walletAddrs = wallet.getHistoryAddresses()
    var addrsStripped = walletAddrs.map(function (addr) {
        return addr.split('-')[1]
    })
    var profit = {}
    if (outs) {
        var _loop_2 = function (i) {
            var utxo = outs[i]
            var outputType = utxo.outputType
            var isNft = outputType === AVMConstants.NFTXFEROUTPUTID
            // Skip NFTs
            if (isNft) return 'continue'
            var addrs = utxo.addresses
            var intersect = addrs.filter(function (addr) {
                return addrsStripped.includes(addr)
            })
            if (intersect.length === 0) return 'continue'
            var assetId = utxo.assetID
            var amount = utxo.amount
            var amountBN = new BN(amount)
            // Get who sent this to you
            var senders = []
            ins.forEach(function (input) {
                var utxo = input.output
                if (utxo.assetID === assetId) {
                    var outAddrs = utxo.addresses
                    // If not a wallet address and not added to senders
                    var targets = outAddrs.filter(function (addr) {
                        return !addrsStripped.includes(addr) && !senders.includes(addr)
                    })
                    senders.push.apply(senders, __spread(targets))
                }
            })
            addToDict(assetId, amountBN, profit, utxo, senders)
        }
        for (var i = 0; i < outs.length; i++) {
            _loop_2(i)
        }
    }
    return profit
}
// Finds the absolute gains and losses for the active wallet given transaction data from the explorer
function getTransactionSummary(tx, wallet) {
    var losses = getLoss(tx, wallet)
    var profits = getProfit(tx, wallet)
    var nftSummary = getNFTsSummary(tx, wallet)
    // let nftLoss = getLossNFT(tx, wallet)
    // let nftGain = getGainNFT()NFT(tx, wallet)
    // console.log(nftLoss)
    var sum = {
        tokens: {},
        collectibles: {
            sent: nftSummary.sent,
            received: nftSummary.received,
        },
    }
    // First the losses
    for (var assetId in losses) {
        var loss = losses[assetId]
        sum.tokens[assetId] = {
            amount: loss.amount.mul(new BN(-1)),
            payload: loss.payload,
            groupNum: loss.groupNum,
            addresses: loss.addresses,
        }
    }
    for (var assetId in profits) {
        var profit = profits[assetId]
        if (sum.tokens[assetId]) {
            sum.tokens[assetId].amount = sum.tokens[assetId].amount.add(profit.amount)
        } else {
            sum.tokens[assetId] = {
                amount: profit.amount,
                payload: profit.payload,
                groupNum: profit.groupNum,
                addresses: profit.addresses,
            }
        }
    }
    return sum
}
/**
 * Given an array of transactions from the explorer, filter out duplicate transactions
 * @param txs
 */
export function filterDuplicateTransactions(txs) {
    var txsIds = []
    var filtered = []
    for (var i = 0; i < txs.length; i++) {
        var tx = txs[i]
        var txId = tx.id
        if (txsIds.includes(txId)) {
            continue
        } else {
            txsIds.push(txId)
            filtered.push(tx)
        }
    }
    return filtered
}
export { getTransactionSummary }
//# sourceMappingURL=history_helper.js.map
