import { __awaiter, __generator, __read } from 'tslib'
import { ava, pChain } from '@/AVA'
import { KeyChain as AVMKeyChain } from 'ezchainjs2/dist/apis/avm'
import { Defaults, getPreferredHRP, PayloadTypes } from 'ezchainjs2/dist/utils'
import Big from 'big.js'
import { Buffer, BN } from 'avalanche'
import createHash from 'create-hash'
import axios from 'axios'
var SECONDS_PER_YEAR = 31536000 //31556952
var RAT_1 = new Big(1)
var RAT_0 = new Big(1)
var BIG_2 = new Big(2)
var BASE_TS = new BN('1000000000000000000000000')
var PC_BASE = new Big(50).div(100)
var PC_STEP = new Big(-4).div(100)
var REWARD_POOL = new Big(15).div(100)
function bnToBig(val, denomination) {
    if (denomination === void 0) {
        denomination = 0
    }
    return new Big(val.toString()).div(Math.pow(10, denomination))
}
function keyToKeypair(key, chainID) {
    if (chainID === void 0) {
        chainID = 'X'
    }
    var hrp = getPreferredHRP(ava.getNetworkID())
    var keychain = new AVMKeyChain(hrp, chainID)
    return keychain.importKey(key)
}
function calculateStakingReward(amount, duration, currentSupply) {
    return __awaiter(this, void 0, void 0, function () {
        var result,
            networkID,
            defValues,
            _amount,
            _currentSupply,
            defPlatformVals,
            maxSupply,
            remainingSupply,
            totalOfStake,
            num
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, pChain.getTotalOfStake()]
                case 1:
                    result = _a.sent()
                    networkID = ava.getNetworkID()
                    defValues = Defaults.network[networkID]
                    if (!defValues) {
                        console.error('Network default values not found.')
                        return [2 /*return*/, 0]
                    }
                    _amount = parseInt(amount.toString())
                    _currentSupply = parseInt(currentSupply.toString())
                    defPlatformVals = defValues.P
                    maxSupply = defPlatformVals.maxSupply
                    remainingSupply = parseInt(maxSupply.sub(currentSupply).toString())
                    totalOfStake = result.totalStake
                    num = reward(
                        duration,
                        _amount,
                        parseInt(totalOfStake.toString()),
                        remainingSupply
                    )
                    return [2 /*return*/, num]
            }
        })
    })
}
function convert(n) {
    var sign = +n < 0 ? '-' : ''
    var toStr = n.toString()
    if (!/e/i.test(toStr)) {
        return n
    }
    toStr = toStr.replace(/^-/, '')
    var data = toStr.replace(/^([0-9]+)(e.*)/, '$1.$2').split(/e|\./)
    var _a = __read(data, 3),
        lead = _a[0],
        decimal = _a[1],
        pow = _a[2]
    if (+pow < 0) {
        return sign + '0.' + '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
    } else {
        var p = void 0
        if (+pow >= decimal.length) {
            p = decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))
        } else {
            p = decimal.slice(0, +pow) + '.' + decimal.slice(+pow)
        }
        return sign + lead + p
    }
}
// x = ts / BASE_TS
// b = floor(log2(x))
// a = 2^b
// r = b-1+x/a
// p = 65% - 5%*r
function rewardPercent(ts) {
    var _b
    var x = new Big(ts).div(new Big(BASE_TS.toString()))
    var tsLen = parseInt(convert(ts), 10).toString(2).length
    var baseLen = parseInt(convert(BASE_TS), 10).toString(2).length
    var bitLength = tsLen - baseLen
    var b = new BN(bitLength)
    if (b.cmp(new BN(0)) == -1) {
        _b = new BN(-1)
    } else {
        _b = b
    }
    var a = new BN(BIG_2.div(1).toString()).pow(_b)
    var r = x.div(a.toString())
    r = r.add(b.toString())
    r = r.sub(RAT_1)
    var p = r.mul(PC_STEP)
    if (p.gte(PC_BASE)) {
        p = PC_BASE
    } else {
        p = p.add(PC_BASE)
        if (p.s < 0) {
            p = RAT_1
        }
    }
    return p
}
function reward(duration, stake, totalStake, rewardPool) {
    var _duration = duration
    if (_duration < 0) {
        _duration = 0
    }
    var _stake = new Big(stake * Math.pow(10, 9))
    var _totalStake = new Big(totalStake * Math.pow(10, 9))
    var _rewardPool = new Big(rewardPool * Math.pow(10, 9))
    var ts = _totalStake.add(_stake)
    if (ts.sub(new Big(BASE_TS.toString())).cmp(new Big(0)) == -1) {
        ts = new Big(BASE_TS.toString())
    }
    var p = rewardPercent(parseInt(ts.toString()))
    // total rate (tr) = min(rp*20%, ts * p)
    var tr = p.mul(ts)
    var cap = _rewardPool
    cap = cap.mul(REWARD_POOL)
    if (tr - cap > 0) {
        tr = cap
    }
    // reward = tr * s / ts
    var reward = tr.mul(_stake).div(ts)
    // reward *= duration / SECONDS_PER_YEAR
    reward = reward.mul(_duration).div(SECONDS_PER_YEAR)
    return reward
}
function digestMessage(msgStr) {
    var mBuf = Buffer.from(msgStr, 'utf8')
    var msgSize = Buffer.alloc(4)
    msgSize.writeUInt32BE(mBuf.length, 0)
    var msgBuf = Buffer.from('\u001AEZChain Signed Message:\n' + msgSize + msgStr, 'utf8')
    return createHash('sha256').update(msgBuf).digest()
}
var payloadtypes = PayloadTypes.getInstance()
function getPayloadFromUTXO(utxo) {
    var out = utxo.getOutput()
    var payload = out.getPayloadBuffer()
    var typeId = payloadtypes.getTypeID(payload)
    var pl = payloadtypes.getContent(payload)
    var payloadbase = payloadtypes.select(typeId, pl)
    return payloadbase
}
function getNameValidator(Node_ids) {
    return __awaiter(this, void 0, void 0, function () {
        var dataNameNodeId
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [
                        4 /*yield*/,
                        axios.get(
                            'https://api.ezchain.com/v1/service/validators?node_ids=' + Node_ids
                        ),
                    ]
                case 1:
                    dataNameNodeId = _a.sent()
                    return [2 /*return*/, dataNameNodeId]
            }
        })
    })
}
export {
    keyToKeypair,
    calculateStakingReward,
    bnToBig,
    digestMessage,
    getPayloadFromUTXO,
    getNameValidator,
}
//# sourceMappingURL=helper.js.map
