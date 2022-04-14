<template>
    <div>
        <p class="text-md text-EZC-grayText">
            <span v-if="nameNodeId" class="font-bold text-EZC-bgBlackButton">
                {{ nameNodeId }} -
            </span>
            {{ node.nodeID }}
        </p>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ValidatorListItem } from '@/store/modules/platform/types'
import { bnToBig, getNameValidator } from '@/helpers/helper'
import { AvaNetwork } from '@/js/AvaNetwork'

@Component
export default class NodeCard extends Vue {
    @Prop() node!: ValidatorListItem
    nameNodeId: string = ''
    get uptimeText(): string {
        return (this.node.uptime * 100).toFixed(2) + '%'
    }

    get nodeStakeBig() {
        return bnToBig(this.node.validatorStake, 9)
    }

    get delegatedStakeBig() {
        return bnToBig(this.node.delegatedStake, 9)
    }

    get remainingStakeBig() {
        return bnToBig(this.node.remainingStake, 9)
    }

    get totalStakeBig() {
        return bnToBig(this.node.validatorStake.add(this.node.delegatedStake), 9)
    }

    get avascanURL() {
        let activeNet: AvaNetwork = this.$store.state.Network.selectedNetwork

        if (activeNet.networkId === 1) {
            return `https://avascan.info/staking/validator/${this.node.nodeID}`
        } else {
            return `https://testnet.avascan.info/staking/validator/${this.node.nodeID}`
        }
    }

    get vscoutURL() {
        return `https://vscout.io/validator/${this.node.nodeID}`
    }
    async validatorNodeName() {
        let nameData = await getNameValidator(this.node.nodeID)
        this.nameNodeId = nameData.data.data[0].name
        return nameData.data.data[0].name
    }
    mounted() {
        this.validatorNodeName()
    }
}
</script>
<style scoped lang="scss">
.node_card {
    //background-color: rgba(0, 0, 0, 0.02);
    background-color: var(--bg-light);
    border-radius: 4px;
    //width: max-content;
    box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.2);

    > div {
        padding: 6px 14px;
        border-bottom: 1px solid var(--bg);
        &:last-of-type {
            border: none;
        }
    }
}

.node_id {
    word-break: break-all;
    //width: max-content;
    font-size: 13px;
    padding: 6px 14px;
    background-color: var(--bg-light);
    border-bottom: 2px solid var(--bg);
}

.meta_row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 14px;
}
label {
    font-size: 13px;
}
p {
    font-size: 15px;
    color: var(--primary-color-light);
}

.dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    p {
        font-size: 13px;
    }
}

.stake_row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 8px;
}
.date_row {
    label {
        display: block;
    }
    p {
        display: inline-block;

        &:first-of-type {
            margin-right: 24px !important;
        }
    }
}
</style>
