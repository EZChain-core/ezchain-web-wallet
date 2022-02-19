<template>
    <div class="top_nav">
        <network-menu class="net_menu"></network-menu>
        <router-link to="/wallet/advanced" class="wallet_links">
            <img src="@/assets/sidebar/setting.png" />
        </router-link>
    </div>
</template>
<script>
import NetworkMenu from '@/components/NetworkSettings/NetworkMenu'

export default {
    components: {
        NetworkMenu,
    },
}
</script>
<style lang="scss" scoped>
@use '../../main';
.top_nav {
    height: 96px;
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