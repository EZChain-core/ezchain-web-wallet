<template>
    <div>
        <h1 class="text-3.5xl font-bold text-EZC-defaultBlack mb-3">Setting</h1>
        <div class="grids">
            <div style="margin: 0 auto">
                <div>
                    <div class="card_body">
                        <header>
                            <h2>{{ $t('keys.title') }}</h2>
                            <div class="button_container" v-if="canEncryptWallet">
                                <button
                                    v-if="!account"
                                    @click="openSaveAccount"
                                    class="save_account ava_button_secondary"
                                >
                                    <fa icon="exclamation-triangle"></fa>
                                    {{ $t('keys.button1') }}
                                </button>
                                <button
                                    v-if="hasVolatile && account"
                                    @click="openAccountSettings"
                                    class="save_account ava_button_secondary"
                                >
                                    <fa icon="exclamation-triangle"></fa>
                                    {{ $t('keys.button1') }}
                                </button>
                                <button
                                    class="but_primary ava_button_secondary"
                                    @click="exportKeys"
                                >
                                    <fa icon="upload"></fa>
                                    {{ $t('keys.button3') }}
                                </button>
                                <SaveAccountModal ref="account_modal"></SaveAccountModal>
                                <AccountSettingsModal ref="account_settings"></AccountSettingsModal>
                                <ExportKeys ref="export" :wallets="allWallets"></ExportKeys>
                            </div>
                        </header>
                        <my-keys></my-keys>
                    </div>
                </div>
                <h2>Advanced</h2>
                <ChainImport class="grid_box"></ChainImport>
                <SignMessage class="grid_box"></SignMessage>
                <VerifyMessage class="grid_box"></VerifyMessage>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import MyKeys from '@/components/wallet/manage/MyKeys.vue'
import ImportKeys from '@/components/modals/ImportKeys.vue'
import ExportKeys from '@/components/modals/ExportKeys.vue'
import MnemonicWallet from '@/js/wallets/MnemonicWallet'
import SaveAccountModal from '@/components/modals/SaveAccount/SaveAccountModal.vue'

import { WalletNameType } from '@/js/wallets/types'
import { iUserAccountEncrypted } from '@/store/types'
import AccountSettingsModal from '@/components/modals/AccountSettings/AccountSettingsModal.vue'
import ChainImport from '@/components/wallet/advanced/ChainImport.vue'
import SignMessage from '@/components/wallet/advanced/SignMessage/SignMessage.vue'
import VerifyMessage from '@/components/wallet/advanced/VerifyMessage.vue'
import TokenListModal from '@/components/modals/TokenList/TokenListModal.vue'
@Component({
    name: 'advanced',
    components: {
        TokenListModal,
        ChainImport,
        SignMessage,
        VerifyMessage,
        AccountSettingsModal,
        MyKeys,
        ImportKeys,
        ExportKeys,
        SaveAccountModal,
    },
})
export default class Advanced extends Vue {
    $refs!: {
        token_list: TokenListModal
        import: ImportKeys
        export: ExportKeys
        account_modal: SaveAccountModal
        account_settings: AccountSettingsModal
    }
    openTokenlist() {
        this.$refs.token_list.open()
    }
    get account() {
        return this.$store.getters['Accounts/account']
    }

    importKeys() {
        this.$refs.import.open()
    }

    exportKeys() {
        this.$refs.export.open()
    }

    openSaveAccount() {
        this.$refs.account_modal.open()
    }

    openAccountSettings() {
        this.$refs.account_settings.open()
    }

    get canEncryptWallet() {
        return ['mnemonic', 'singleton'].includes(this.walletType)
    }

    get walletType(): WalletNameType {
        return this.$store.state.activeWallet.type
    }

    get hasVolatile() {
        return this.$store.state.volatileWallets.length > 0
    }

    get allWallets(): MnemonicWallet[] {
        return this.$store.state.wallets
    }

    get warnUpdateKeyfile() {
        return this.$store.state.warnUpdateKeyfile
    }
}
</script>
<style scoped lang="scss">
@use '../../main';
.grids {
    display: flex;
    background: #ffffff;
    box-shadow: 0px 8px 40px -24px rgba(24, 38, 46, 0.3),
        inset 0px -1px 3px -2px rgba(24, 38, 46, 0.5);
    border-radius: 8px;
    padding: 30px 0;
    height: auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: auto;
}

.grid_box {
    background: #fafafa;
    border-radius: 8px;
    padding: 30px;
    width: 650px;
    margin-bottom: 32px;
}
.button_container {
    display: flex;
    flex-direction: row;
    align-items: center;
}
header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

h1 {
    font-weight: lighter;
}

.save_account {
    color: var(--warning);
}

@include main.mobile-device {
    header {
        display: block;
    }

    .button_container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        /*flex-wrap: wrap;*/

        button {
            padding: 8px 0;
        }
    }
}
@include main.mobile-device {
    .grids {
        grid-template-columns: none;
    }
}

@include main.medium-device {
    .grids {
        grid-template-columns: none;
    }
}

.buts {
    margin-bottom: 12px;
    button {
        color: var(--primary-color);
        &:hover {
            color: var(--secondary-color);
        }
    }
}
</style>
