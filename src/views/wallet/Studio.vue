<template>
    <div>
        <h1
            style="
                font-style: normal;
                font-weight: bold;
                font-size: 32px;
                line-height: 44px;
                color: #262626;
            "
        >
            My NFT
        </h1>
        <div class="flex_four">
            <div class="my_nft">
                <div class="header">
                    <div v-if="pageNow" style="display: flex; align-items: center">
                        <img
                            style="width: 15px; height: 12px; cursor: pointer"
                            @click="cancel"
                            src="@/assets/back.png"
                            alt=""
                        />
                        <h1
                            style="
                                font-style: normal;
                                font-weight: bold;
                                font-size: 16px;
                                line-height: 24px;
                                color: #0c1527;
                                display: inline;
                                margin-left: 8px;
                            "
                        >
                            {{ subtitle }}
                        </h1>
                    </div>
                </div>
                <template v-if="!pageNow">
                    <div class="menu">
                        <div class="options">
                            <div>
                                <h4 class="title">{{ $t('studio.menu1.title') }}</h4>
                                <p>{{ $t('studio.menu1.desc') }}</p>
                                <v-btn
                                    @click="goNewNftFamily"
                                    class="button_secondary"
                                    small
                                    depressed
                                >
                                    {{ $t('studio.menu1.submit') }}
                                </v-btn>
                            </div>
                            <div>
                                <h4 class="title">{{ $t('studio.menu2.title') }}</h4>
                                <p>{{ $t('studio.menu2.desc') }}</p>
                                <div>
                                    <p v-if="!canMint" class="err">
                                        {{ $t('studio.menu2.empty') }}
                                    </p>
                                    <v-btn
                                        @click="goMint"
                                        class="button_secondary"
                                        small
                                        depressed
                                        :disabled="!canMint"
                                    >
                                        {{ $t('studio.menu2.submit') }}
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <Component v-else :is="pageNow" @cancel="cancel"></Component>
            </div>
            <transition name="fade" mode="out-in">
                <transaction-history-panel class="panel_content"></transaction-history-panel>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NewCollectibleFamily from '@/components/wallet/studio/NewCollectibleFamily.vue'
import MintNft from '@/components/wallet/studio/mint/MintNft.vue'
import { IWalletNftMintDict } from '@/store/types'
import Big from 'big.js'
import { bnToBig } from '@/helpers/helper'
import { avm } from '@/AVA'
import { BN } from 'ezchainjs2'
import TransactionHistoryPanel from '@/components/SidePanels/TransactionHistoryPanel.vue'
@Component({
    name: 'studio',
    components: {
        NewCollectibleFamily,
        TransactionHistoryPanel,
    },
})
export default class Studio extends Vue {
    pageNow: any = null
    subtitle: string = ''

    goNewNftFamily() {
        this.pageNow = NewCollectibleFamily
        this.subtitle = 'New Family'
    }

    goMint() {
        this.pageNow = MintNft
        this.subtitle = 'Mint Collectible'
    }

    get nftMintDict(): IWalletNftMintDict {
        // return this.$store.getters.walletNftMintDict
        return this.$store.getters['Assets/nftMintDict']
    }

    get canMint(): boolean {
        const keys = Object.keys(this.nftMintDict)
        if (keys.length > 0) return true
        return false
    }

    deactivated() {
        this.clearPage()
    }

    activated() {
        let utxoId = this.$route.query.utxo

        if (utxoId) {
            this.goMint()
        }
    }

    // If url has a utxo id, clears it
    clearUrl() {
        let utxoId = this.$route.query.utxo

        if (utxoId) {
            //@ts-ignore
            this.$router.replace({ query: null })
        }
    }

    clearPage() {
        this.pageNow = null
        this.subtitle = ''
    }

    cancel() {
        this.clearUrl()
        this.clearPage()
    }
}
</script>
<style scoped lang="scss">
.flex_four {
    display: grid;
    grid-template-columns: 1fr 360px;
    grid-gap: 12px;
    height: 506px;
}
.my_nft {
    background: #ffffff;
    /* Card Style */

    box-shadow: 0px 8px 40px -24px rgba(24, 38, 46, 0.3),
        inset 0px -1px 3px -2px rgba(24, 38, 46, 0.5);
    border-radius: 8px;
    padding: 24px 16px;
}
.header {
    display: flex;
    /*justify-content: space-between;*/
    /*align-items: center;*/
    align-items: center;

    h1 {
        font-weight: lighter;
    }

    .subtitle {
        margin-left: 0.5em;
        /*font-size: 20px;*/
        color: var(--primary-color-light);
        font-weight: lighter;
    }

    span {
        margin-left: 1em;

        &:hover {
            color: var(--primary-color);
            cursor: pointer;
        }
    }
}

.menu {
    h2 {
        margin: 20px 0;
        color: var(--primary-color-light);
        font-weight: normal;
        font-size: 2em;
    }
}

.options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 14px;
    > div {
        border: 1px solid var(--bg-light);
        padding: 16px;
        display: flex;
        flex-direction: column;
        background: #fafafa;
        border-radius: 8px;
    }

    p {
        flex-grow: 1;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        /* or 150% */

        letter-spacing: 0.1px;

        /* Neutral/500 */

        color: #737373;
    }

    h4 {
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        color: #0c1527;
        margin-bottom: 9px;
    }

    .v-btn {
        width: max-content;
        height: 40px;
        margin-top: 24px;
        background: #ffffff;
        /* Card Style */

        box-shadow: 0px 8px 40px -24px rgba(24, 38, 46, 0.3),
            inset 0px -1px 3px -2px rgba(24, 38, 46, 0.5);
        border-radius: 8px;
    }
}
</style>
