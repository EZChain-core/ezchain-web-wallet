<template>
    <div>
        <h1>{{ $t('cross_chain.title') }}</h1>
        <div class="flex_two">
            <ChainTransfer></ChainTransfer>
            <transition name="fade" mode="out-in">
                <transaction-history-panel class="panel_content"></transaction-history-panel>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import ChainTransfer from '@/components/wallet/earn/ChainTransfer/ChainTransfer.vue'
import TransactionHistoryPanel from '@/components/SidePanels/TransactionHistoryPanel.vue'
@Component({
    name: 'cross_chain',
    components: {
        ChainTransfer,
        TransactionHistoryPanel,
    },
})
export default class CrossChain extends Vue {}
</script>
<style scoped lang="scss">
.flex_two {
    display: grid;
    grid-template-columns: 1fr 360px;
    grid-gap: 12px;
    height: 506px;
}
h1 {
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 44px;
    /* identical to box height */

    /* Neutral/800 */

    color: #262626;
}
.head {
    margin-bottom: 14px;
    //display: flex;
    //align-items: center;
    //justify-content: space-between;
}
</style>
