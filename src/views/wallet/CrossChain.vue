<template>
    <div>
        <h1 class="text-EZC-defaultBlack font-bold text-3.5xl mb-5">
            {{ $t('cross_chain.title') }}
        </h1>
        <div class="grid grid-cols-footer gap-x-3">
            <div>
                <ChainTransfer
                    class="top_cross_chain no_scroll_bar min-h-heightHomeTab bg-white-a500 px-4 py-6 shadow-md rounded-lg"
                ></ChainTransfer>
                <transition name="fade" mode="out-in">
                    <transaction-history-panel
                        class="panel_content mt-3"
                    ></transaction-history-panel>
                </transition>
            </div>
            <div>
                <top-info class="wallet_top shadow-lg"></top-info>
            </div>
        </div>
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
    .top_cross_chain {
        min-height: 600px;
    }
}
</style>
