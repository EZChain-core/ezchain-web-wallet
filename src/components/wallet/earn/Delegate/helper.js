import { DAY_MS } from '@/constants'
import { ONEAVAX } from 'ezchainjs2/dist/utils'
import { BN } from 'ezchainjs2'
function filterValidatorList(list, filter) {
    var now = Date.now()
    if (!filter) return list
    var minDurationMs = filter.minDuration * DAY_MS
    var res = list.filter(function (val) {
        // Filter by remaining stake amount
        var minSpace = ONEAVAX.mul(new BN(filter.availableSpace))
        if (val.remainingStake.lt(minSpace)) {
            return false
        }
        // Filter by time
        var endTime = val.endTime
        if (endTime.getTime() - now < minDurationMs) {
            return false
        }
        // Filter by fee
        if (val.fee > filter.maxFee) {
            return false
        }
        // Filter by uptime
        if (val.uptime < filter.minUptime / 100) {
            return false
        }
        return true
    })
    return res
}
export { filterValidatorList }
//# sourceMappingURL=helper.js.map
