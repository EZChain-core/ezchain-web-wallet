import {
    DelegatorPendingRaw,
    DelegatorRaw,
    ValidatorPendingRaw,
    ValidatorRaw,
} from '@/components/misc/ValidatorList/types'
import { BN } from 'ezchainjs2'

export interface PlatformState {
    nameNodeId: []
    validators: ValidatorRaw[]
    validatorsPending: ValidatorPendingRaw[]
    delegatorsPending: DelegatorPendingRaw[]
    minStake: BN
    minStakeDelegation: BN
    currentSupply: BN
}

export interface GetValidatorsResponse {
    validators: ValidatorRaw[]
}

export interface GetPendingValidatorsResponse {
    validators: ValidatorPendingRaw[]
    delegators: DelegatorPendingRaw[]
}

export interface ValidatorGroup {
    data: ValidatorRaw
    // delegators: DelegatorRaw[]
}

export interface ValidatorDelegatorDict {
    [key: string]: DelegatorRaw[]
}

export interface ValidatorDelegatorPendingDict {
    [key: string]: DelegatorPendingRaw[]
}

export interface ValidatorDict {
    [nodeId: string]: ValidatorRaw
}

export interface ValidatorListItem {
    nodeID: string
    logoUrl: string | undefined
    name: string | undefined
    validatorStake: BN
    delegatedStake: BN
    remainingStake: BN
    numDelegators: number
    startTime: Date
    endTime: Date
    uptime: number
    fee: number
}
