<template>
    <div class="flex justify-center items-center container mx-auto">
        <transition name="fade" mode="out-in">
            <!-- PHASE 1 -->
            <div v-if="!keyPhrase" class="flex-col flex items-center">
                <div class="max-w-md">
                    <h1
                        class="text-EZC-defaultBlack font-bold leading-7 text-center text-1.5xl p-5"
                    >
                        {{ $t('create.generate') }}
                    </h1>

                    <button
                        class="h-12 rounded-lg bg-EZC-bgButton w-full text-white-a500 flex justify-center items-center font-bold"
                        @click="createKey"
                    >
                        {{ $t('create.submit') }}
                    </button>
                    <router-link
                        to="/"
                        class="h-12 rounded-lg border-solid bg-white-a500 w-full text-EZC-defaultBlack flex justify-center items-center font-bold mt-4 border border-EZC-defaultBlack"
                        tag="button"
                    >
                        {{ $t('create.cancel') }}
                    </router-link>
                </div>
            </div>
            <!-- PHASE 2 -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                <div class="mneumonic_disp_col xl:max-w-xl">
                    <div class="mnemonic_disp">
                        <mnemonic-display
                            :phrase="keyPhrase"
                            :bgColor="verificatiionColor"
                            class="mnemonic_display"
                        ></mnemonic-display>
                        <p
                            class="mt-4 rounded-lg bg-EZC-bgDefault px-4 py-6 text-base text-EZC-defaultBlack font-normal"
                            v-bind:class="{
                                verified: isVerified,
                            }"
                        >
                            {{ keyPhrase.getValue() }}
                        </p>
                    </div>
                </div>
                <!-- RIGHT -->
                <div class="phrase_disp_col xl:max-w-xl mt-4">
                    <template v-if="!isVerified">
                        <div class="flex">
                            <div class="mr-5 flex-shrink-0">
                                <img src="@/assets/create3.png" alt />
                            </div>
                            <h1 class="text-4.5xl text-EZC-defaultBlack font-semibold leading-12.5">
                                This is your
                                <br />
                                key phrase
                            </h1>
                        </div>
                    </template>
                    <template v-else>
                        <img src="@/assets/success.svg" alt />
                    </template>
                    <header v-if="!isVerified" class="mb-18">
                        <p class="text-1.75xl leading-8 text-black-a400 font-normal">
                            {{ $t('create.mnemonic_desc') }}
                        </p>
                    </header>
                    <header v-else>
                        <h1
                            class="text-4.5xl text-EZC-defaultBlack font-semibold leading-12.5 mt-4"
                        >
                            {{ $t('create.success_title') }}
                        </h1>
                        <p class="text-1.75xl leading-8 text-black-a400 font-normal">
                            {{ $t('create.success_desc') }}
                        </p>
                    </header>
                    <p
                        class="warn bg-EZC-bgCreate text-EZC-blueText rounded-lg p-4 mb-4"
                        v-if="!isVerified"
                    >
                        <span class="description">{{ $t('create.warning') }}</span>
                    </p>
                    <!-- STEP 2a - VERIFY -->
                    <div class="verify_cont" v-if="!isVerified">
                        <MnemonicCopied
                            v-model="isSecured"
                            :explain="$t('create.confirm')"
                        ></MnemonicCopied>
                        <VerifyMnemonic
                            :mnemonic="keyPhrase"
                            ref="verify"
                            @complete="complete"
                        ></VerifyMnemonic>
                        <div class="grid grid-cols-2 gap-x-4 mt-8 lg:mt-16 mb-8">
                            <button
                                class="mr-4 cursor-pointer bg-EZC-bgButton rounded-lg h-12 flex justify-center w-full items-center"
                                @click="verifyMnemonic"
                                :disabled="!canVerify"
                            >
                                <span class="text-1.75xl text-center text-white-a500">
                                    {{ $t('create.success_submit') }}
                                </span>
                            </button>
                            <div class="mneumonic_button_container w-full" v-if="!isVerified">
                                <button
                                    @click="createKey"
                                    class="bg-white-a500 cursor-pointer rounded-lg w-full border border-EZC-defaultBlack border-solid h-12"
                                >
                                    <span class="text-black-a500 text-1.75xl text-center">
                                        {{ $t('create.regenerate') }}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- STEP 2b - ACCESS -->
                    <div class="access_cont" v-if="isVerified">
                        <div class="submit">
                            <transition name="fade" mode="out-in">
                                <Spinner v-if="isLoad" class="spinner"></Spinner>
                                <div v-else>
                                    <div class="grid grid-cols-2 gap-x-4">
                                        <button
                                            class="bg-EZC-bgButton rounded-lg h-12 flex justify-center w-full items-center"
                                            @click="access"
                                            :disabled="!canSubmit"
                                        >
                                            <span class="text-1.75xl text-center text-white-a500">
                                                {{ $t('create.success_submit') }}
                                            </span>
                                        </button>
                                        <router-link
                                            tag="button"
                                            to="/"
                                            class="bg-white-a500 rounded-lg w-full border border-EZC-defaultBlack border-solid h-12"
                                        >
                                            <span class="text-black-a500 text-1.75xl text-center">
                                                Cancel
                                            </span>
                                        </router-link>
                                    </div>
                                    <ToS style="margin: 30px 0 !important"></ToS>
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TextDisplayCopy from '@/components/misc/TextDisplayCopy.vue'
import Spinner from '@/components/misc/Spinner.vue'
// import TorusGoogle from "@/components/Torus/TorusGoogle.vue";
import MnemonicDisplay from '@/components/misc/MnemonicDisplay.vue'
import CopyText from '@/components/misc/CopyText.vue'
import * as bip39 from 'bip39'

import VerifyMnemonic from '@/components/modals/VerifyMnemonic.vue'
import MnemonicCopied from '@/components/CreateWalletWorkflow/MnemonicCopied.vue'
import ToS from '@/components/misc/ToS.vue'
import MnemonicPhrase from '@/js/wallets/MnemonicPhrase'
import LogoCenter from '@/components/LogoEzChain/Logo.vue'
@Component({
    components: {
        ToS,
        CopyText,
        // RememberKey,
        TextDisplayCopy,
        MnemonicDisplay,
        Spinner,
        // TorusGoogle,
        VerifyMnemonic,
        MnemonicCopied,
        LogoCenter,
    },
})
export default class CreateWallet extends Vue {
    // TODO: We do not need to create keyPair, only mnemonic is sufficient
    isLoad: boolean = false
    keyPhrase: MnemonicPhrase | null = null
    isSecured: boolean = false
    isVerified: boolean = false

    get canVerify(): boolean {
        return this.isSecured ? true : false
    }

    get verificatiionColor() {
        return this.isVerified ? '#a9efbf' : '#F5F6FA'
    }

    createKey(): void {
        this.isSecured = false
        let mnemonic = bip39.generateMnemonic(256)
        this.keyPhrase = new MnemonicPhrase(mnemonic)
    }

    // Will be true if the values in remember wallet checkbox are valid
    // isRememberValid(val: boolean){
    //     this.rememberValid = val;
    // }

    get canSubmit(): boolean {
        // if(!this.rememberValid) return false;
        return true
    }
    verifyMnemonic() {
        // @ts-ignore
        this.$refs.verify.open()
    }

    complete() {
        this.isVerified = true
    }

    async access(): Promise<void> {
        if (!this.keyPhrase) return

        this.isLoad = true

        let parent = this

        setTimeout(async () => {
            await parent.$store.dispatch('accessWallet', this.keyPhrase!.getValue())
        }, 500)
    }
}
</script>
<style scoped lang="scss"></style>
<style lang="scss"></style>
