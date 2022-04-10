<template>
    <div class="wallet_view flex items-start h-full" ref="wallet_view">
        <UpdateKeystoreModal v-if="isManageWarning"></UpdateKeystoreModal>
        <transition name="fade" mode="out-in">
            <sidebar class="sidenav flex-shrink-0 w-sidebar h-full"></sidebar>
        </transition>
        <div class="w-full min-h-screen bg-EZC-bgDefault">
            <top-nav-bar class="top_nav_bar"></top-nav-bar>
            <div class="px-10 py-3">
                <transition name="page_fade" mode="out-in">
                    <keep-alive :exclude="['cross_chain', 'activity', 'earn', 'manage', 'studio']">
                        <router-view
                            class="no_scroll_bar"
                            id="wallet_router"
                            :key="$route.path"
                        ></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TopInfo from '@/components/wallet/TopInfo.vue'
import Sidebar from '@/components/wallet/Sidebar.vue'
import TopNavBar from '@/components/wallet/TopNavbar.vue'
import MainPanel from '@/components/SidePanels/MainPanel.vue'
import UpdateKeystoreModal from '@/components/modals/UpdateKeystore/UpdateKeystoreModal.vue'

const TIMEOUT_DURATION = 60 * 7 // in seconds
const TIMEOUT_DUR_MS = TIMEOUT_DURATION * 1000

@Component({
    components: {
        Sidebar,
        MainPanel,
        TopInfo,
        TopNavBar,
        UpdateKeystoreModal,
    },
})
export default class Wallet extends Vue {
    intervalId: NodeJS.Timeout | null = null
    logoutTimestamp = Date.now() + TIMEOUT_DUR_MS
    isLogOut = false
    // Set the logout timestamp to now + TIMEOUT_DUR_MS
    resetTimer() {
        this.logoutTimestamp = Date.now() + TIMEOUT_DUR_MS
    }

    checkLogout() {
        let now = Date.now()

        // Logout if current time is passed the logout timestamp
        if (now >= this.logoutTimestamp && !this.isLogOut) {
            this.isLogOut = true
            this.$store.dispatch('timeoutLogout')
        }
    }

    created() {
        this.resetTimer()
        this.intervalId = setInterval(() => {
            this.checkLogout()
        }, 1000)
    }

    unload(event: BeforeUnloadEvent) {
        // user has no wallet saved
        if (!localStorage.getItem('w') && this.hasVolatileWallets && this.isLogOut) {
            event.preventDefault()
            this.isLogOut = false
            event.returnValue = ''
            this.$router.push('/wallet/keys')
            this.resetTimer()
        }
    }

    mounted() {
        let view = this.$refs.wallet_view as HTMLDivElement
        console.log('hello', this.$route.path)
        view.addEventListener('mousemove', this.resetTimer)
        view.addEventListener('mousedown', this.resetTimer)

        window.addEventListener('beforeunload', this.unload)
    }

    beforeDestroy() {
        let view = this.$refs.wallet_view as HTMLDivElement
        // Remove Event Listeners
        view.removeEventListener('mousemove', this.resetTimer)
        view.removeEventListener('mousedown', this.resetTimer)
        window.removeEventListener('beforeunload', this.unload)
    }

    destroyed() {
        clearInterval(this.intervalId!)
    }

    get isManageWarning(): boolean {
        if (this.$store.state.warnUpdateKeyfile) {
            return true
        }
        return false
    }

    get hasVolatileWallets() {
        return this.$store.state.volatileWallets.length > 0
    }
}
</script>

<style lang="scss" scoped>
@use '../main';
.sidenav {
    background-color: var(--bg-wallet-light);
}

.panel {
    overflow: auto;
    height: 100%;
}
.page_fade-enter-active,
.page_fade-leave-active {
    transition: all 0.2s;
}
.page_fade-enter, .page_fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}

@include main.mobile-device {
    .wallet_view {
        display: block;
        column-gap: 9px;
    }
    .wallet_sidebar {
        display: none;
    }
}

@include main.medium-device {
    .wallet_view {
        grid-template-columns: 180px 1fr 240px !important;
        column-gap: 9px;
    }
    #wallet_router {
        padding: 12px 18px;
        overflow: overlay;
    }
}
@media (max-width: 640px) {
    .top_nav_bar {
        display: none;
    }
    .wallet_main {
        padding: 0;
    }
}
</style>
