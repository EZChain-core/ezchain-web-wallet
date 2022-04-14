<template>
    <div class="top_nav h-14 bg-white-a500 w-full flex justify-end items-center px-5 py-6">
        <network-menu class="net_menu mr-10"></network-menu>
        <AccountMenu class="wallet_link"></AccountMenu>
        <router-link to="/wallet/advanced" class="wallet_links ml-5">
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
</style>
