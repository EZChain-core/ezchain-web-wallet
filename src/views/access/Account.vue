<template>
    <div class="max-w-md mx-auto">
        <div
            class="content flex flex-col justify-center items-center shadow-lg bg-white-a400 rounded-lg p-8"
        >
            <div class="flex items-center mb-4">
                <Identicon
                    class="flex-shrink-0 mr-4"
                    :value="account.baseAddresses.join('')"
                ></Identicon>
                <h1 class="text-center font-bold text-base">{{ account.name }}</h1>
            </div>
            <form @submit.prevent="access">
                <input
                    class="single_line_input hover_border pass w-full"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                />
                <p class="err block">{{ error }}</p>
                <v-btn
                    style="height: 40px"
                    class="ava_button button_primary h-16 w-full mt-4 mb-4"
                    @click="access"
                    :loading="isLoading"
                    :disabled="!canSubmit"
                    depressed
                >
                    Access Wallet
                </v-btn>
                <small>{{ $t('keys.account_slow_warning') }}</small>
                <br />
            </form>
            <router-link to="/access" class="text-EZC-bgButton" tag="p">Cancel</router-link>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ImportKeyfileInput, iUserAccountEncrypted } from '@/store/types'
import Identicon from '@/components/misc/Identicon.vue'

@Component({
    components: { Identicon },
})
export default class Account extends Vue {
    password: string = ''
    isLoading: boolean = false
    error: string = ''

    get index() {
        return this.$route.params.index
    }
    get accounts() {
        return this.$store.state.Accounts.accounts
    }

    get account() {
        return this.accounts[this.index]
    }

    created() {
        if (!this.account) {
            this.$router.replace('/access')
            return
        }
    }

    async access() {
        const { account } = this
        if (!this.canSubmit || this.isLoading) return
        if (account == null) return
        let parent = this
        this.error = ''
        this.isLoading = true
        let data: ImportKeyfileInput = {
            password: this.password,
            data: account.wallet,
        }

        setTimeout(() => {
            this.$store
                .dispatch('Accounts/accessAccount', {
                    index: this.index,
                    pass: this.password,
                })
                .then((res) => {
                    parent.isLoading = false
                })
                .catch((err) => {
                    if (err === 'INVALID_PASS') {
                        parent.error = this.$t('access.password_error').toString()
                    } else if (err === 'INVALID_VERSION') {
                        parent.error = this.$t('access.keystore_error').toString()
                    } else {
                        parent.error = err.message
                    }
                    parent.isLoading = false
                })
        }, 200)
    }
    onsuccess() {
        this.isLoading = false
        this.password = ''
    }
    onerror(e: any) {
        this.error = e
        this.password = ''
        this.isLoading = false
    }
    get canSubmit(): boolean {
        if (!this.password) {
            return false
        }
        return true
    }
}
</script>
<style scoped lang="scss"></style>
