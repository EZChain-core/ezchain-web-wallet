<template>
    <div class="list_row">
        <p class="col_index" style="text-align: center">{{ index }}</p>
        <p class="col_addr">
            <span>{{ address }}</span>
            &nbsp;
            <span class="verify" v-if="walletType === 'ledger'" @click="verifyLedgerAddress">
                {{ $t('create.verify') }}
            </span>
        </p>
        <div class="col_bal">
            <p v-if="noBalance">-</p>
            <template v-else>
                <p v-for="(bal, assetId) in cleanBalance" :key="assetId">
                    {{ bal.toLocaleString(assetsDict[assetId].denomination) }}
                    <span>{{ assetsDict[assetId].symbol }}</span>
                </p>
            </template>
        </div>
        <a
            style="color: white"
            class="rounded-lg h-8 text-center p-2 bg-EZC-bgButton text-xs mr-4"
            title="Show PrivateKey of this address"
            @click="showPrivateKeyModals()"
        >
            Show
        </a>
        <PrivateKey :privateKey="privateKey" ref="modal_priv_keys"></PrivateKey>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Big from 'big.js'
import { DerivationListBalanceDict } from '@/components/modals/HdDerivationList/types'
import { LedgerWallet } from '@/js/wallets/LedgerWallet'
import { WalletType } from '@/js/wallets/types'

import { ava } from '@/AVA'
import { getPreferredHRP } from 'ezchainjs2/dist/utils'
import MnemonicWallet, { AVA_ACCOUNT_PATH } from '../../../js/wallets/MnemonicWallet'
import PrivateKey from '@/components/modals/PrivateKey.vue'

@Component({
    components: {
        PrivateKey,
    },
})
export default class HdDerivationListRow extends Vue {
    @Prop() index!: number
    @Prop() path!: number
    @Prop() address!: string
    @Prop() balance!: DerivationListBalanceDict

    get cleanBalance(): DerivationListBalanceDict {
        let res: DerivationListBalanceDict = {}
        for (var bal in this.balance) {
            let balance: Big = this.balance[bal]
            if (balance.gt(Big(0))) {
                res[bal] = balance
            }
        }
        return res
    }
    $refs!: {
        modal_priv_keys: PrivateKey
    }
    get noBalance(): boolean {
        return Object.keys(this.cleanBalance).length === 0
    }
    get privateKey(): string | null {
        if (this.walletType !== 'mnemonic') return null
        let wallet = this.wallet as MnemonicWallet
        return wallet.ethKeyBech
    }
    get assetsDict() {
        return this.$store.state.Assets.assetsDict
    }

    get wallet() {
        return this.$store.state.activeWallet as WalletType
    }

    get walletType() {
        return this.wallet.type
    }
    showPrivateKeyModals() {
        this.$refs.modal_priv_keys.open()
    }
    async verifyLedgerAddress() {
        const wallet = this.wallet as LedgerWallet
        let networkId = ava.getNetworkID()
        let hrp = getPreferredHRP(networkId)

        wallet.app.getWalletAddress(`${AVA_ACCOUNT_PATH}/${this.path}/${this.index}`, hrp)
    }
}
</script>
<style scoped lang="scss">
.col_index {
    color: var(--primary-color-light);
}

.col_addr {
    /*white-space: nowrap;*/
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    font-family: monospace;
    color: var(--primary-color-light);

    .verify {
        opacity: 0;
        cursor: pointer;
        color: var(--primary-color);
        transition: opacity 0.1s;
        font-size: 11px;
        padding: 2px 4px;
        background: var(--bg-light);
    }

    &:hover {
        .verify {
            opacity: 1;
            transition: opacity 0.2s;
        }
    }
}

.col_bal {
    text-align: right;
    padding-right: 15px;
    padding-left: 15px;
    font-family: monospace;
    word-break: keep-all;
    white-space: nowrap;
}

span {
    /*background-color: #ddd;*/
    /*padding: 2px 6px;*/
    border-radius: 8px;
    font-weight: bold;
}
</style>
