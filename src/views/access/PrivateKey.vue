<template>
    <div>
        <div class="max-w-md mx-auto">
            <div>
                <h1 class="font-bold text-1.75xl leading-7 text-EZC-defaultBlack">Private Key</h1>
                <form @submit.prevent="access">
                    <v-text-field
                        class="pass bg-EZC-bgDefault block my-4 rounded-lg"
                        label="Private Key"
                        dense
                        solo
                        flat
                        type="password"
                        v-model="privatekey"
                        hide-details
                    ></v-text-field>
                    <p class="err">{{ error }}</p>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
                        <v-btn class="button_access" @click="access" :loading="isLoading" depressed>
                            <span
                                class="text-white-a500 font-bold text-1.5xl text-center capitalize"
                            >
                                Access Wallet
                            </span>
                        </v-btn>
                        <router-link
                            class="border border-EZC-defaultBlack rounded-lg w-full cursor-pointer h-16 flex justify-center border-solid items-center font-bold text-1.5xl leading-7"
                            to="/access"
                            tag="div"
                        >
                            Cancel
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LogoCenter from '@/components/LogoEzChain/Logo.vue'
@Component({
    components: {
        LogoCenter,
    },
})
export default class PrivateKey extends Vue {
    privatekey: string = ''
    isLoading: boolean = false
    error: string = ''
    async access() {
        if (!this.canSubmit || this.isLoading) return
        let parent = this
        this.error = ''
        this.isLoading = true
        let key = this.privatekey

        try {
            let res = await this.$store.dispatch('accessWalletSingleton', key)
            this.onsuccess()
        } catch (e) {
            this.onerror('Invalid Private Key.')
        }
    }
    onsuccess() {
        this.isLoading = false
        this.privatekey = ''
    }
    onerror(e: any) {
        this.error = e
        this.privatekey = ''
        this.isLoading = false
    }
    get canSubmit(): boolean {
        if (!this.privatekey) {
            return false
        }
        return true
    }
}
</script>
<style scoped lang="scss">
.button_access {
    width: 100%;
    background-color: #ef6825 !important;
    height: 64px !important;
    font-size: 18px;
    font-weight: bold;
    font-style: normal;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
}
</style>
