<template>
    <div>
        <div class="addr_card xl:max-w-full max-w-mobile">
            <div class="bottom_tabs">
                <ChainSelect v-model="chainNow"></ChainSelect>
            </div>
            <q-r-modal ref="qr_modal" :address="activeAddress"></q-r-modal>
            <paper-wallet
                ref="print_modal"
                v-if="walletType === 'mnemonic'"
                :wallet="activeWallet"
            ></paper-wallet>
            <div class="bottom">
                <div class="col_qr">
                    <canvas
                        style="width: 96px !important; height: 96px !important"
                        ref="qr"
                    ></canvas>
                </div>
                <div class="bottom_rest">
                    <!--                    <p class="subtitle">{{ addressLabel }}</p>-->
                    <span class="text-xs text-EZC-grayText mt-3">Wallet Address</span>

                    <p
                        style="word-break: break-all"
                        class="text-md xl:text-base text-EZC-bgBlackButton"
                        data-cy="wallet_address"
                    >
                        {{ activeAddress }}
                    </p>
                    <div class="grid grid-cols-2 gap-x-2 mt-2">
                        <button @click="viewQRModal" class="flex flex-row items-center">
                            <img class="mr-2" src="@/assets/eyes.svg" alt="" />
                            <span class="text-sm text-EZC-bgButton font-bold">View</span>
                        </button>
                        <CopyText
                            :tooltip="$t('top.hover3')"
                            :value="activeAddress"
                            class="copy_but"
                        ></CopyText>
                    </div>
                </div>
            </div>
            <p
                style="
                    font-style: normal;
                    font-weight: normal;
                    font-size: 16px;
                    line-height: 24px;
                    color: #737373;
                "
            >
                <!-- This is your X-Chain address to receive funds. -->
                {{ addressMsg }}
            </p>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

import CopyText from '@/components/misc/CopyText.vue'
import QRModal from '@/components/modals/QRModal.vue'
import PaperWallet from '@/components/modals/PaperWallet/PaperWallet.vue'
import QRCode from 'qrcode'
import { KeyPair as AVMKeyPair } from 'ezchainjs2/dist/apis/avm'
import { WalletType, WalletNameType } from '@/js/wallets/types'

import MnemonicWallet, {
    AVA_ACCOUNT_PATH,
    LEDGER_ETH_ACCOUNT_PATH,
} from '@/js/wallets/MnemonicWallet'
import { LedgerWallet } from '@/js/wallets/LedgerWallet'

import ChainSelect from '@/components/wallet/TopCards/AddressCard/ChainSelect.vue'
import { ChainIdType } from '@/constants'
import { ava } from '@/AVA'
import { getPreferredHRP } from 'ezchainjs2/dist/utils'
@Component({
    components: {
        CopyText,
        PaperWallet,
        QRModal,
        ChainSelect,
    },
})
export default class AddressCard extends Vue {
    colorLight: string = '#FFF'
    colorDark: string = '#242729'
    chainNow: ChainIdType = 'X'

    $refs!: {
        qr_modal: QRModal
        print_modal: PaperWallet
        qr: HTMLCanvasElement
    }

    @Watch('activeAddress')
    onaddrchange() {
        this.updateQR()
    }

    @Watch('$root.theme', { immediate: true })
    onthemechange(val: string) {
        if (val === 'night') {
            this.colorDark = '#E5E5E5'
            this.colorLight = '#242729'
        } else {
            this.colorDark = '#242729'
            this.colorLight = '#FFF'
        }
        this.updateQR()
    }

    get addressLabel(): string {
        switch (this.chainNow) {
            default:
                return this.$t('top.address.title_x') as string
            case 'P':
                return this.$t('top.address.title_p') as string
            case 'C':
                return this.$t('top.address.title_c') as string
        }
    }

    get addressMsg(): string {
        switch (this.chainNow) {
            default:
                return this.getAddressMsgX()
            case 'P':
                return this.$t('top.address.desc_p') as string
            case 'C':
                return this.$t('top.address.desc_c') as string
        }
    }

    getAddressMsgX() {
        if (this.activeWallet?.type === 'singleton') {
            return this.$t('top.address.desc_x_1') as string
        } else {
            return `${this.$t('top.address.desc_x_1')} ${this.$t('top.address.desc_x_2')}` as string
        }
    }

    get isDayTheme(): boolean {
        //@ts-ignore
        return this.$root.theme === 'day'
    }

    get walletType(): WalletNameType {
        let wallet = this.activeWallet
        if (!wallet) return 'mnemonic'
        return wallet.type
    }

    get activeWallet(): WalletType | null {
        return this.$store.state.activeWallet
    }
    get address() {
        let wallet = this.activeWallet
        if (!wallet) {
            return '-'
        }
        return wallet.getCurrentAddressAvm()
    }

    get addressPVM() {
        let wallet = this.activeWallet
        if (!wallet) {
            return '-'
        }

        return wallet.getCurrentAddressPlatform()
    }

    get addressEVM() {
        let wallet = this.activeWallet
        if (!wallet) {
            return '-'
        }

        return '0x' + wallet.getEvmAddress()
    }

    get activeAddress(): string {
        switch (this.chainNow) {
            case 'X':
                return this.address
            case 'P':
                return this.addressPVM
            case 'C':
                return this.addressEVM
        }
        return this.address
    }

    get activeIdx(): number {
        const wallet = this.activeWallet as MnemonicWallet
        const walletType = wallet.type

        if (walletType === 'singleton') return 0

        switch (this.chainNow) {
            case 'X':
                return wallet.getExternalActiveIndex()
            case 'P':
                return wallet.getPlatformActiveIndex()
            default:
                return 0
        }
    }

    viewQRModal() {
        // @ts-ignore
        this.$refs.qr_modal.open()
    }
    viewPrintModal() {
        let modal = this.$refs.print_modal
        // @ts-ignore
        modal.open()
    }
    updateQR() {
        let canvas = this.$refs.qr as HTMLCanvasElement
        if (!canvas) return

        let size = canvas.clientWidth
        QRCode.toCanvas(
            canvas,
            this.activeAddress,
            {
                scale: 6,
                color: {
                    light: this.colorLight,
                    dark: this.colorDark,
                },
                width: size,
                // height: size,
            },
            function (error: any) {
                if (error) console.error(error)
            }
        )
    }

    async verifyLedgerAddress() {
        const wallet = this.activeWallet as LedgerWallet

        let networkId = ava.getNetworkID()
        let hrp = getPreferredHRP(networkId)

        switch (this.chainNow) {
            case 'X':
            case 'P':
                wallet.app.getWalletAddress(`${AVA_ACCOUNT_PATH}/0/${this.activeIdx}`, hrp)
                break
            case 'C':
                wallet.ethApp.getAddress(`${LEDGER_ETH_ACCOUNT_PATH}`)
        }
    }

    mounted() {
        this.updateQR()
    }
}
</script>
<style scoped lang="scss">
@use '../../../../main';

.addr_card {
    display: flex;
    flex-direction: column;
    background: #fafafa;
    border-radius: 8px;
    height: 100%;
}
.buts {
    width: 100%;
    display: flex;
    align-items: center;
    color: var(--primary-color-light);
    justify-content: flex-start;
    margin-top: 15px;

    > * {
        font-size: 16px;
        position: relative;
        outline: none;
        height: 18px;
        opacity: 0.6;

        background-size: contain;
        background-position: center;
        &:hover {
            opacity: 1;
        }
    }
}
.copy_but {
    color: var(--primary-color);
}

.col_qr {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.addr_info {
    margin: 19px !important;
    margin-bottom: 0 !important;
    background-color: var(--bg-light);
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    padding: 12px 16px;
}

$qr_width: 110px;

.bottom {
    display: grid;
    grid-template-columns: $qr_width 1fr;
    column-gap: 14px;
    margin-top: 4px;
    margin-bottom: 4px;
    padding-left: 8px;
    flex-grow: 1;

    canvas {
        width: $qr_width !important;
        height: $qr_width !important;
        background-color: transparent;
    }

    .bottom_rest {
        padding-top: 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}

.sub {
    margin: 0px 10px !important;
    text-align: center;
    font-size: 0.7rem;
    background-color: main.$secondary-color;
    color: #fff;
    padding: 3px 6px;
    border-radius: 3px;
}

.subtitle {
    font-size: 0.7rem;
    color: var(--primary-color-light);
}

.addr_text {
    font-size: 12px;
    word-break: break-all;
    color: var(--primary-color);
    min-height: 55px;
}

@include main.medium-device {
    //.bottom{
    //    display: block;
    //}
    .bottom_rest {
        justify-content: space-between;
    }

    .addr_info {
        display: none;
    }
    canvas {
        display: block;
        margin: 0px auto;
    }

    .buts {
        justify-content: space-evenly;

        > * {
            margin: 0;
        }
    }

    .addr_text {
        font-size: 13px;
    }
}

.bottom_tabs {
    width: 100%;
}

@include main.mobile-device {
    .addr_info {
        display: none;
    }
}
</style>
