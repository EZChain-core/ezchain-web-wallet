<template>
    <div class="h-24 w-full bg-white-a500 flex justify-between py-6 px-5 items-center">
        <network-menu class="net_menu" style="margin-right: 40px"></network-menu>
        <div class="flex items-center justify-end">
            <AccountMenu class="wallet_link"></AccountMenu>
            <router-link to="/wallet/advanced" class="ml-10">
                <img src="@/assets/sidebar/setting.png" />
            </router-link>
        </div>
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
<style lang="scss" scoped></style>
