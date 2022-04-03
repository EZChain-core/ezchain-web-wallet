<template>
    <div class="max-w-md mx-auto">
        <div class="access_card">
            <h1 class="text-center text-1.5xl font-bold leading-7 not-italic mb-4">
                {{ $t('access.title') }}
            </h1>
            <div class="menus">
                <AccountsFound class="accounts_menu"></AccountsFound>
                <div class="rounded-lg bg-EZC-bgDefault p-4">
                    <router-link
                        to="/access/privatekey"
                        class="my-2 bg-white-a500 rounded-lg shadow-lg flex justify-between items-center h-16 p-5"
                    >
                        <span class="text-1.5xl text-black-a400">
                            {{ $t('access.but_private_key') }}
                        </span>
                        <ImageDayNight
                            day="/img/access_icons/day/key.svg"
                            night="/img/access_icons/night/privatekey.svg"
                        ></ImageDayNight>
                    </router-link>
                    <router-link
                        to="/access/mnemonic"
                        class="my-2 bg-white-a500 rounded-lg shadow-lg flex justify-between items-center text-1.5xl text-black-a400 h-16 p-5"
                    >
                        <span class="text-1.5xl text-black-a400">
                            {{ $t('access.but_mnemonic') }}
                        </span>
                        <ImageDayNight
                            day="/img/access_icons/day/document-text.svg"
                            night="/img/access_icons/night/mnemonic.svg"
                        ></ImageDayNight>
                    </router-link>
                    <router-link
                        to="/access/keystore"
                        class="my-2 bg-white-a500 rounded-lg shadow-lg flex justify-between items-center text-1.5xl text-black-a400 h-16 p-5"
                    >
                        <span class="text-1.5xl text-black-a400">
                            {{ $t('access.but_keystore') }}
                        </span>
                        <ImageDayNight
                            day="/img/access_icons/day/folder-open.svg"
                            night="/img/access_icons/night/keystore.svg"
                        ></ImageDayNight>
                    </router-link>
                    <LedgerButton class="my-2"></LedgerButton>
                </div>
            </div>

            <ToS style="margin: 20px !important"></ToS>
            <router-link
                to="/"
                tag="p"
                class="leading-6 font-bold not-italic text-EZC-bgButton text-base"
            >
                {{ $t('access.cancel') }}
            </router-link>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import LedgerButton from '@/components/Ledger/LedgerButton.vue'
import AccountsFound from '@/components/Access/AccountsFound.vue'
import ToS from '@/components/misc/ToS.vue'
import ImageDayNight from '@/components/misc/ImageDayNight.vue'
import LogoCenter from '@/components/LogoEzChain/Logo.vue'
@Component({
    components: {
        ImageDayNight,
        ToS,
        LedgerButton,
        AccountsFound,
        LogoCenter,
    },
})
export default class Menu extends Vue {}
</script>

<style scoped lang="scss"></style>
