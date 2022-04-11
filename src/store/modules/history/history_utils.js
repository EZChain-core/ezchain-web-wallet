import { __read, __spread } from 'tslib'
import { BN, Buffer } from 'ezchainjs2'
export function isArraysOverlap(arr1, arr2) {
    var overlaps = arr1.filter(function (item) {
        return arr2.includes(item)
    })
    return overlaps.length > 0
}
// To get the stake amount, sum the non-reward output utxos.
export function getStakeAmount(tx) {
    var nonRewardUtxos = tx.outputs.filter(function (utxo) {
        return !utxo.rewardUtxo && utxo.stake
    })
    var tot = getOutputTotals(nonRewardUtxos)
    return tot
}
export function getOwnedOutputs(outs, myAddrs) {
    return outs.filter(function (out) {
        var outAddrs = out.addresses
        return isArraysOverlap(myAddrs, outAddrs)
    })
}
export function getAddresses(outs) {
    var allAddrs = []
    for (var i = 0; i < outs.length; i++) {
        var out = outs[i]
        var addrs = out.addresses
        allAddrs.push.apply(allAddrs, __spread(addrs))
    }
    // Remove duplicated
    return allAddrs.filter(function (addr, i) {
        return allAddrs.indexOf(addr) === i
    })
}
/**
 * Returns only the UTXOs of the given asset id.
 * @param outs
 * @param assetID
 */
export function getAssetOutputs(outs, assetID) {
    return outs.filter(function (out) {
        return out.assetID === assetID
    })
}
export function getNotOwnedOutputs(outs, myAddrs) {
    return outs.filter(function (out) {
        var outAddrs = out.addresses
        return !isArraysOverlap(myAddrs, outAddrs)
    })
}
export function getOutputTotals(outs) {
    return outs.reduce(function (acc, out) {
        return acc.add(new BN(out.amount))
    }, new BN(0))
}
export function getRewardOuts(outs) {
    return outs.filter(function (out) {
        return out.rewardUtxo
    })
}
export function durationToString(dur) {
    var months = dur.months()
    var days = dur.days()
    var hours = dur.hours()
    var res = ''
    if (months) {
        var name_1 = months > 1 ? 'months' : 'month'
        res += months + ' ' + name_1 + ' '
    }
    if (days) {
        var name_2 = days > 1 ? 'days' : 'day'
        res += days + ' ' + name_2 + ' '
    }
    if (hours) {
        var name_3 = hours > 1 ? 'hours' : 'hour'
        res += hours + ' ' + name_3
    }
    return res
}
var NOT_REWARD_OWNER_MSG = 'Not The Reward Owner'
export function stakingDataToCsvRow(rowData) {
    var _a, _b
    var rewardAmtAvax = rowData.isRewardOwner
        ? rowData.rewardAmtAvax.toString()
        : NOT_REWARD_OWNER_MSG
    var rewardAmtUSD = rowData.isRewardOwner
        ? ((_a = rowData.rewardAmtUsd) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '-'
        : NOT_REWARD_OWNER_MSG
    return [
        rowData.txId,
        rowData.txType,
        rowData.nodeID,
        rowData.stakeAmount.toFixed(),
        rowData.stakeDate.format('MM/DD/YYYY'),
        durationToString(rowData.stakeDuration),
        rowData.rewardDate.format('MM/DD/YYYY'),
        ((_b = rowData.avaxPrice) === null || _b === void 0 ? void 0 : _b.toFixed(2)) || '-',
        rewardAmtAvax,
        rewardAmtUSD,
    ]
}
export function avaxTransferDataToCsvRow(rowData) {
    var _a, _b
    var memo = rowData.memo ? '"' + rowData.memo + '"' : '-'
    var froms = rowData.from
        ? '"' + ((_a = rowData.from) === null || _a === void 0 ? void 0 : _a.join('\n')) + '"'
        : '-'
    var tos = rowData.to
        ? '"' + ((_b = rowData.to) === null || _b === void 0 ? void 0 : _b.join('\n')) + '"'
        : '-'
    var sendReceive = rowData.isGain ? 'Received' : 'Sent'
    return [
        rowData.txId,
        rowData.date.toLocaleDateString(),
        memo,
        froms,
        tos,
        sendReceive,
        rowData.amount.toFixed(),
    ]
}
export function createCSVContent(rows) {
    var csvContent = 'data:text/csv;charset=utf-8,'
    rows.forEach(function (arr) {
        var row = arr.join(',')
        csvContent += row + '\r\n'
    })
    return csvContent
}
/**
 * Starts a download of the given the CSV file as a string
 * @param content The CSV file contents
 */
export function downloadCSVFile(content, fileName) {
    var encodedUri = encodeURI(content)
    var link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', fileName + '.csv')
    document.body.appendChild(link) // Required for FF
    link.click() // This will download the data file named "my_data.csv".
    link.remove()
}
/**
 * Parses the raw memo field to a human readable string.
 * @param memoRaw The base64 encoded memo string
 */
export function parseMemo(memoRaw) {
    var memoText = new Buffer(memoRaw, 'base64').toString('utf8')
    // Bug that sets memo to empty string (AAAAAA==) for some tx types
    if (!memoText.length || memoRaw === 'AAAAAA==') return ''
    return memoText
}
//# sourceMappingURL=history_utils.js.map
