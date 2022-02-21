<template>
    <div class="top_nav">
        <network-menu class="net_menu" style="margin-right: 40px"></network-menu>
        <AccountMenu class="wallet_link"></AccountMenu>
        <router-link to="/wallet/advanced" class="wallet_links">
            <img src="@/assets/sidebar/setting.png" />
        </router-link>
    </div>
</template>
<script>
import NetworkMenu from '@/components/NetworkSettings/NetworkMenu'
import AccountMenu from '@/components/wallet/sidebar/AccountMenu'
export default {
    components: {
        NetworkMenu,
        AccountMenu,
    },
}
</script>
<style lang="scss" scoped>
@use '../../main';
.top_nav {
    height: 55px;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 24px 40px;
    .wallet_links {
        margin-left: 40px;
    }
}
</style>
