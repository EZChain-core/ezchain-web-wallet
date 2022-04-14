<template>
    <div>
        <h1 class="text-3.5xl font-bold text-EZC-defaultBlack mb-3">
            {{ $t('cross_chain.title') }}
        </h1>
        <div class="flex_two no_scroll_bar">
            <ChainTransfer class="top_crosschain"></ChainTransfer>
            <transition name="fade" mode="out-in">
                <transaction-history-panel class="panel_content"></transaction-history-panel>
            </transition>
        </div>
        <top-info class="wallet_top shadow-lg" style="margin-top: 12px"></top-info>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TopInfo from '@/components/wallet/TopInfo.vue'
import ChainTransfer from '@/components/wallet/earn/ChainTransfer/ChainTransfer.vue'
import TransactionHistoryPanel from '@/components/SidePanels/TransactionHistoryPanel.vue'
@Component({
    name: 'cross_chain',
    components: {
        ChainTransfer,
        TransactionHistoryPanel,
        TopInfo,
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
    overflow: overlay;
}
.head {
    margin-bottom: 14px;
    //display: flex;
    //align-items: center;
    //justify-content: space-between;
}
@media (max-width: 640px) {
    .flex_two {
        grid-template-columns: 1fr;
        height: auto;
    }
    .top_crosschain {
        min-height: 600px;
    }
}
</style>
