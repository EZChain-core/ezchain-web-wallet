<template>
    <div class="wallet_sidebar">
        <div class="stick">
            <div class="brand">
                <img v-if="$root.theme === 'day'" src="@/assets/logo_main.png" />
                <img v-else src="@/assets/wallet_logo_dark.png" />
            </div>
            <div class="links">
                <router-link to="/wallet" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/por.png" />
                    <img v-else src="@/assets/sidebar/portfolio_nav_night.png" />
                    {{ $t('wallet.sidebar.portfolio') }}
                </router-link>
                <router-link to="/wallet/transfer" data-cy="wallet_transfer" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/transfer1.png" />
                    <img v-else src="@/assets/sidebar/transfer_nav_night.svg" />
                    {{ $t('wallet.sidebar.send') }}
                </router-link>
                <router-link
                    to="/wallet/cross_chain"
                    data-cy="wallet_export"
                    class="wallet_export wallet_link"
                >
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/por1.png" />
                    {{ $t('wallet.sidebar.export') }}
                </router-link>
                <router-link to="/wallet/earn" data-cy="wallet_earn" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/chart1.png" />
                    <img v-else src="@/assets/sidebar/earn_nav_night.png" />
                    {{ $t('wallet.sidebar.earn') }}
                </router-link>
                <router-link to="/wallet/studio" data-cy="wallet_studio" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/por2.png" />
                    <img v-else src="@/assets/sidebar/studio_nav_night.svg" />
                    My NFT
                </router-link>
                <router-link to="/wallet/activity" data-cy="wallet_activity" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/por4.png" />
                    <img v-else src="@/assets/sidebar/activity_nav_night.svg" />
                    {{ $t('wallet.sidebar.activity') }}
                </router-link>
                <router-link to="/wallet/keys" data-cy="wallet_manage" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/manage_nav.png" />
                    <img v-else src="@/assets/sidebar/manage_nav_night.svg" />
                    {{ $t('wallet.sidebar.manage') }}
                </router-link>
                <router-link to="/wallet/advanced" data-cy="wallet_advanced" class="wallet_link">
                    <img v-if="$root.theme === 'day'" src="@/assets/sidebar/advanced_nav.png" />
                    <img v-else src="@/assets/sidebar/advanced_nav_night.png" />
                    {{ $t('wallet.sidebar.advanced') }}
                </router-link>
            </div>
            <div class="bottom">
                <transition name="fade" mode="out-in">
                    <main-panel class="panel"></main-panel>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import LanguageSelect from '@/components/misc/LanguageSelect/LanguageSelect'
import AccountMenu from '@/components/wallet/sidebar/AccountMenu'
import MainPanel from '@/components/SidePanels/MainPanel.vue'
export default {
    components: {
        AccountMenu,
        LanguageSelect,
        MainPanel,
    },
}
</script>
<style lang="scss" scoped>
@use "../../main";

.wallet_sidebar {
    .stick {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .alert_icon {
        color: #f00;
        flex-grow: 1;
        justify-content: flex-end;
    }

    .brand {
        height: 150px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 24px;

        img {
            width: 186px;
            height: 40px;
            object-fit: contain;
        }
    }

    .links {
        padding: 0 !important;
        display: flex;
        flex-direction: column;

        a {
            opacity: 0.6;
            color: var(--primary-color-light);
            text-decoration: none;
            margin: 0 24px;
            padding: 12px 16px;

            img {
                opacity: 0.5;
            }
        }

        .wallet_link {
            display: flex;
            align-items: center;
            padding: 14px 24px;
            white-space: nowrap;
        }

        a.router-link-exact-active {
            opacity: 1;
            position: static;
            font-weight: bold;
            height: 48px;
            background: #f5f5f5;
            box-shadow: inset 0px -1px 2px rgba(23, 23, 23, 0.06);
            border-radius: 8px;
            color: #262626;
            img {
                opacity: 1;
            }
        }

        img {
            width: 20px;
            margin-right: 15px;
            object-fit: contain;
        }
    }
}
.wallet_export {
    span {
        display: block;
        margin-right: 15px;
        width: 20px;
    }
}
.bottom {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-bottom: 30px;

    > * {
        padding: 0px 24px;
        margin-top: 4px;
    }
}

@include main.medium-device {
    .brand {
        height: 90px;
    }
    .links {
        font-size: 12px;
    }
}
</style>
