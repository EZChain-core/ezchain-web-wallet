import { ava, pChain } from '@/AVA'

import {
    KeyChain as AVMKeyChain,
    KeyPair as AVMKeyPair,
    NFTTransferOutput,
    UTXO,
} from 'ezchainjs2/dist/apis/avm'

import {
    Defaults,
    getPreferredHRP,
    ONEAVAX,
    PayloadBase,
    PayloadTypes,
} from 'ezchainjs2/dist/utils'
import Big from 'big.js'

import { Buffer, BN } from 'avalanche'
import createHash from 'create-hash'

const SECONDS_PER_YEAR = 31536000 //31556952

const RAT_1 = new Big(1)
const RAT_0 = new Big(1)
const BIG_2 = new Big(2)
const BASE_TS = new BN('1000000000000000000000000')

const PC_BASE = new Big(50).div(100)
const PC_STEP = new Big(-4).div(100)
const REWARD_POOL = new Big(15).div(100)

function bnToBig(val: BN, denomination = 0): Big {
    return new Big(val.toString()).div(Math.pow(10, denomination))
}

function keyToKeypair(key: string, chainID: string = 'X'): AVMKeyPair {
    let hrp = getPreferredHRP(ava.getNetworkID())
    let keychain = new AVMKeyChain(hrp, chainID)
    return keychain.importKey(key)
}

function calculateStakingReward(amount: BN, duration: number, currentSupply: BN, result: string) {
    let networkID = ava.getNetworkID()
    let defValues = Defaults.network[networkID]

    if (!defValues) {
        console.error('Network default values not found.')
        return new BN(0)
    }
    let _amount: number = parseInt(amount.toString())
    let _currentSupply: number = parseInt(currentSupply.toString())
    const defPlatformVals = defValues.P
    let maxSupply: BN = defPlatformVals.maxSupply
    let remainingSupply: number = parseInt(maxSupply.sub(currentSupply).toString())
    var totalOfStake: any = result
    let num: number = reward(duration, _amount, parseInt(totalOfStake.toString()), remainingSupply)
    return new BN(num)
}

function convert(n: any): any {
    let sign: string = +n < 0 ? '-' : ''
    let toStr: string = n.toString()
    if (!/e/i.test(toStr)) {
        return n
    }
    toStr = toStr.replace(/^-/, '')
    let data: Array<any> = toStr.replace(/^([0-9]+)(e.*)/, '$1.$2').split(/e|\./)
    let [lead, decimal, pow]: Array<any> = data
    if (+pow < 0) {
        return sign + '0.' + '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
    } else {
        let p: string
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
function rewardPercent(ts: number): Big {
    let _b: BN
    let x: Big = new Big(ts).div(new Big(BASE_TS.toString()))
    let tsLen: number = parseInt(convert(ts), 10).toString(2).length
    let baseLen: number = parseInt(convert(BASE_TS), 10).toString(2).length
    let bitLength: number = tsLen - baseLen
    let b: BN = new BN(bitLength)
    if (b.cmp(new BN(0)) == -1) {
        _b = new BN(-1)
    } else {
        _b = b
    }
    let a: BN = new BN(BIG_2.div(1).toString()).pow(_b)
    let r: Big = x.div(a.toString())
    r = r.add(b.toString())
    r = r.sub(RAT_1)
    let p: Big = r.mul(PC_STEP)
    p = p.add(PC_BASE)
    if (p.s < 0) {
        p = RAT_1
    }
    return p
}

function reward(duration: number, stake: number, totalStake: number, rewardPool: number): number {
    let _duration = duration
    if (_duration < 0) {
        _duration = 0
    }
    let _stake: Big = new Big(stake)
    let _totalStake: Big = new Big(totalStake)
    let _rewardPool: Big = new Big(rewardPool)
    let ts: Big = _totalStake.add(_stake)
    if (ts.sub(new Big(BASE_TS.toString())).cmp(new Big(0)) == -1) {
        ts = new Big(BASE_TS.toString())
    }
    let p: Big = rewardPercent(parseInt(ts.toString()))
    // total rate (tr) = min(rp*20%, ts * p)
    let tr: any = p.mul(ts)
    let cap: any = _rewardPool
    cap = cap.mul(REWARD_POOL)
    if (tr - cap > 0) {
        tr = cap
    }
    // reward = tr * s / ts
    let reward: any = tr.mul(_stake).div(ts)
    // reward *= duration / SECONDS_PER_YEAR
    reward = reward.mul(_duration).div(SECONDS_PER_YEAR)
    return parseInt(reward.mul(Math.pow(10, 18)))
}

function digestMessage(msgStr: string) {
    let mBuf = Buffer.from(msgStr, 'utf8')
    let msgSize = Buffer.alloc(4)
    msgSize.writeUInt32BE(mBuf.length, 0)
    let msgBuf = Buffer.from(`\x1AAvalanche Signed Message:\n${msgSize}${msgStr}`, 'utf8')
    return createHash('sha256').update(msgBuf).digest()
}

let payloadtypes = PayloadTypes.getInstance()

function getPayloadFromUTXO(utxo: UTXO): PayloadBase {
    let out = utxo.getOutput() as NFTTransferOutput
    let payload = out.getPayloadBuffer()
    let typeId = payloadtypes.getTypeID(payload)
    let pl: Buffer = payloadtypes.getContent(payload)
    let payloadbase: PayloadBase = payloadtypes.select(typeId, pl)
    return payloadbase
}

export { keyToKeypair, calculateStakingReward, bnToBig, digestMessage, getPayloadFromUTXO }
