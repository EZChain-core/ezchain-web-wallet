<template>
    <div class="flex justify-center items-start">
        <create-wallet class="lg:mt-30"></create-wallet>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import CreateWallet from '@/components/CreateWalletWorkflow/CreateWallet.vue'

@Component({
    components: {
        CreateWallet,
    },
    metaInfo: () => {
        const description =
            "Here at EZChain, we've made storing digital assets easy. Create an EZChain wallet today is see what the buzz is all about!"
        return {
            meta: [
                {
                    vmid: 'description',
                    name: 'description',
                    content: description,
                },
                {
                    vmid: 'og:description',
                    name: 'description',
                    content: description,
                },
                {
                    vmid: 'og:title',
                    name: 'og:title',
                    content: 'Create | EZChain Wallet',
                },
            ],
            title: 'Create',
        }
    },
})
export default class Create extends Vue {}
</script>
<style scoped lang="scss">
.card {
    text-align: center;
}

a {
    color: #1d82bb !important;
}
</style>
