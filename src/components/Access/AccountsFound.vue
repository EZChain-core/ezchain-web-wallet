<template>
    <div v-if="accounts.length" class="bg-EZC-bgDefault rounded-lg shadow-lg p-4 mb-4">
        <div
            class="flex items-center bg-white-a500 shadow-lg rounded-lg my-2 p-4 cursor-pointer"
            v-for="(acct, i) in accounts"
            :key="i"
            @click="selectAccount(i)"
        >
            <Identicon
                class="flex-shrink-0 mr-4"
                :value="acct.baseAddresses.join('')"
                diameter="40"
            ></Identicon>
            <p>{{ acct.name }}</p>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { iUserAccountEncrypted } from '@/store/types'
import Identicon from '@/components/misc/Identicon.vue'

@Component({
    components: {
        Identicon,
    },
})
export default class AccountsFound extends Vue {
    accounts: iUserAccountEncrypted[] = []

    created() {
        this.refreshAccounts()
    }
    refreshAccounts() {
        let accountsRaw = localStorage.getItem('accounts') || '{}'
        this.accounts = JSON.parse(accountsRaw) || []
    }

    selectAccount(index: number) {
        this.$router.push(`/access/account/${index}`)
    }
}
</script>
<style scoped lang="scss"></style>
