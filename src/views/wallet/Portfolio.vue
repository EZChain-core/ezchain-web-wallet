<template>
    <div>
        <h1 class="text-3.5xl text-EZC-defaultBlack font-bold mb-5">
            {{ $t('portfolio.assets') }}
        </h1>
        <div class="home_view">
            <div class="left_home_view no_scroll_bar">
                <div class="header">
                    <div>
                        <button
                            @click="tab = 'fungibles'"
                            :active="tab === `fungibles`"
                            data-cy="wallet_fungible"
                        >
                            {{ $t('portfolio.assets1') }}
                        </button>
                        <button
                            @click="tab = 'collectibles'"
                            :active="tab === `collectibles`"
                            data-cy="wallet_nft"
                        >
                            {{ $t('portfolio.assets2') }}
                        </button>
                    </div>
                    <div style="flex-grow: 1"></div>
                    <div class="search hover_border">
                        <img v-if="$root.theme === 'day'" src="@/assets/search.png" />
                        <img v-else src="@/assets/search_night.svg" />
                        <input :placeholder="$t('portfolio.search')" v-model="search" />
                    </div>
                </div>
                <div class="pages">
                    <transition-group name="fade" mode="out-in">
                        <fungibles
                            v-show="tab === `fungibles`"
                            key="fungibles"
                            :search="search"
                        ></fungibles>
                        <collectibles
                            v-show="tab === `collectibles`"
                            key="collectibles"
                            :search="search"
                        ></collectibles>
                    </transition-group>
                </div>
            </div>
            <transition name="fade" mode="out-in">
                <transaction-history-panel class="panel_content"></transaction-history-panel>
            </transition>
        </div>
        <top-info class="wallet_top shadow-lg" style="margin-top: 12px"></top-info>
    </div>
</template>
<script>
import Fungibles from '@/components/wallet/portfolio/Fungibles'
import TransactionHistoryPanel from '@/components/SidePanels/TransactionHistoryPanel'
import Collectibles from '@/components/wallet/portfolio/Collectibles'
import TopInfo from '@/components/wallet/TopInfo'
export default {
    name: 'WalletHome',
    data() {
        return {
            search: '',
            tab: 'fungibles',
        }
    },
    components: {
        Fungibles,
        TopInfo,
        Collectibles,
        TransactionHistoryPanel,
    },
    watch: {
        tab() {
            this.search = ''
        },
    },
}
</script>
<style scoped lang="scss">
@use '../../main';

.home_view {
    display: grid;
    grid-template-columns: 1fr 360px;
    grid-gap: 12px;
    height: 506px;
}
.left_home_view {
    padding: 16px;
    background: #ffffff;
    box-shadow: 0px 8px 40px -24px rgba(24, 38, 46, 0.3),
        inset 0px -1px 3px -2px rgba(24, 38, 46, 0.5);
    border-radius: 8px;
    overflow: auto;
}
.header {
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    flex-wrap: nowrap;
    white-space: nowrap;

    h1 {
        font-weight: normal;
        margin-right: 30px;
    }
    button {
        padding: 8px 24px;
        font-size: 14px;
        font-weight: bold;
        margin: 0px 5px;
        text-transform: uppercase;
        outline: none !important;
        color: var(--primary-color-light);

        &[active] {
            color: #262626;
            background: #e5e5e5;
            border-radius: 8px;
        }
    }
}

.search {
    /*flex-grow: 1;*/
    height: 40px;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 13px;
    flex-basis: 420px;
    flex-shrink: 1;
    border: 1px solid transparent;
    flex-direction: row-reverse;
    width: 268px;
    background: #f5f5f5;
    border-radius: 8px;
    $icon_w: 36px;

    img {
        border-radius: 4px;
        padding: 10px 0px;
        background-color: var(--bg-wallet-light);
        /*height: 100%;*/
        height: $icon_w;
        width: $icon_w;
        object-fit: contain;
    }

    input {
        padding: 0px 16px;
        outline: none;
        border: none !important;
        flex-grow: 1;
        color: var(--primary-color);

        &::placeholder {
            color: #b3b7d3;
        }
    }
}

.pages {
    /*margin-top: 30px;*/
}

@include main.mobile-device {
    .header {
        display: block;

        > div {
            overflow: hidden;
            display: flex;
        }
        button {
            flex-grow: 1;
            border-radius: 0px;
            margin: 0;
            font-size: 12px;
        }
    }

    .search {
        margin: 15px 0px;
    }

    .pages {
        /*min-height: 100vh;*/
        /*padding-bottom: 30px;*/
    }
}

@include main.medium-device {
    .header {
        button {
            font-size: 13px;

            &[active] {
                border-bottom-width: 2px;
            }
        }
    }

    .search {
        //margin: 15px 0px;
        //flex-basis: 100%;
        flex-grow: 1;
        height: 36px;
        flex-basis: auto;

        img {
            padding: 6px;
            height: 22px;
            width: 22px;
        }
    }
}
@media (max-width: 640px) {
    .home_view {
        grid-template-columns: 1fr;
        height: auto;
    }
    .left_home_view {
        min-height: 600px;
    }
}
</style>
