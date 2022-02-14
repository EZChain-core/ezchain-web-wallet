<template>
    <div>
        <LogoCenter></LogoCenter>
        <div class="access_card">
            <div class="content">
                <h1>Private Key</h1>
                <form @submit.prevent="access">
                    <v-text-field
                        class="pass"
                        label="Private Key"
                        dense
                        solo
                        flat
                        type="password"
                        v-model="privatekey"
                        hide-details
                    ></v-text-field>
                    <p class="err">{{ error }}</p>
                    <div style="display: flex; justify-content: space-between">
                        <v-btn
                            style="
                                background: #ef6825 !important;
                                border-radius: 8px;
                                width: 49%;
                                height: 60px;
                            "
                            class="ava_button button_primary"
                            @click="access"
                            :loading="isLoading"
                            depressed
                        >
                            Access Wallet
                        </v-btn>
                        <button
                            style="
                                background: #ffffff;
                                border: 1px solid #262626;
                                box-sizing: border-box;
                                border-radius: 8px;
                                height: 60px;
                                width: 49%;
                            "
                        >
                            <router-link
                                style="
                                    display: inline-block;
                                    width: 100%;
                                    height: 100%;
                                    line-height: 60px;
                                "
                                to="/access"
                                tag="span"
                            >
                                Cancel
                            </router-link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ImportKeyfileInput } from '@/store/types'
import { SingletonWallet } from '@/js/wallets/SingletonWallet'
import { privateToAddress } from 'ethereumjs-util'
import { bintools } from '@/AVA'
import { Buffer } from 'avalanche'
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
@use '../../main';
.pass {
    background-color: #f5f5f5 !important;
    border-radius: 8px;
}
.ava_button {
    width: 100%;
    margin-bottom: 22px;
}
.access_card {
    /*max-width: 80vw;*/
    background-color: white;
    padding: main.$container-padding;
    width: 100%;
    /*max-width: 240px;*/
    /*max-width: 1000px;*/
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    margin-top: 150px;
}
.content {
    width: 340px;
    max-width: 100%;
    margin: 0px auto;
}
h1 {
    font-size: main.$m-size;
    font-weight: 400;
    margin-bottom: 30px;
}
.file_in {
    margin: 30px auto 10px;
    font-size: 13px;
    border: none !important;
    background-color: var(--bg) !important;
    /*min-width: 200px*/
}
a {
    color: main.$primary-color-light !important;
    text-decoration: underline !important;
    margin: 10px 0 20px;
}
.link {
    color: var(--secondary-color);
}
.remember {
    margin: 12px 0;
}
.err {
    font-size: 13px;
    color: var(--error);
    margin: 14px 0px !important;
}
@media only screen and (max-width: main.$mobile_width) {
    h1 {
        font-size: main.$m-size-mobile;
    }
    .but_primary {
        width: 100%;
    }
}
</style>
