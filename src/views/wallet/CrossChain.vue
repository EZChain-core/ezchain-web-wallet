<template>
    <div>
        <h1 class="text-3.5xl font-bold text-EZC-defaultBlack mb-3">
            {{ $t('cross_chain.title') }}
        </h1>
        <div class="flex_two">
            <ChainTransfer class="top_cross_chain no_scroll_bar"></ChainTransfer>
            <transition name="fade" mode="out-in">
                <transaction-history-panel class="panel_content h-full"></transaction-history-panel>
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
    grid-template-columns: 1fr 348px;
    grid-gap: 12px;
    max-height: 506px;
}
.top_cross_chain {
    max-height: 506px;
    overflow: scroll;
}
.head {
    margin-bottom: 14px;
}
.no_scroll_bar {
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

@media (max-width: 640px) {
    .flex_two {
        grid-template-columns: 1fr;
        height: auto;
    }
    .top_cross_chain {
        min-height: 600px;
    }
}
</style>
