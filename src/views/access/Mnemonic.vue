<template>
    <div>
        <div class="flex flex-col-reverse lg:flex-row pb-14">
            <div class="mr-4 mt-4 mb-4 lg:mb-0 w-full lg:w-1/2">
                <header>
                    <h1
                        class="text-left mb-4 font-bold text-1.75xl leading-7 text-EZC-defaultBlack"
                    >
                        {{ $t('access.mnemonic.title') }}
                    </h1>
                </header>
                <textarea
                    placeholder="Hit ‘SPACE’ after every successful word entry."
                    @input="onPhraseIn"
                    translate="no"
                    class="w-full mb-20 h-80 rounded-lg bg-EZC-bgDefault p-4"
                ></textarea>
                <div class="w-full">
                    <p class="err" v-if="err">{{ err }}</p>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
                        <v-btn class="button_access" @click="access" depressed :loading="isLoading">
                            <span
                                class="text-white-a500 font-bold text-1.5xl text-center capitalize"
                            >
                                {{ $t('access.mnemonic.submit') }}
                            </span>
                        </v-btn>

                        <router-link
                            class="bg-white-a500 cursor-pointer border rounded-lg h-16 border-solid border-EZC-defaultBlack flex justify-center items-center w-full"
                            to="/access"
                            tag="div"
                        >
                            <span class="text-1.5xl text-EZC-defaultBlack font-bold leading-7">
                                {{ $t('access.mnemonic.cancel') }}
                            </span>
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="w-full mt-4 lg:w-1/2">
                <header>
                    <h1 class="mb-4 font-bold text-1.75xl leading-7 text-EZC-defaultBlack">
                        Preview
                    </h1>
                </header>
                <mnemonic-display
                    :phrase="phrase"
                    class="phrase_disp"
                    :rowSize="3"
                ></mnemonic-display>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import MnemonicDisplay from '@/components/misc/MnemonicDisplay.vue'
import * as bip39 from 'bip39'
import LogoCenter from '@/components/LogoEzChain/Logo.vue'
@Component({
    components: {
        MnemonicDisplay,
        LogoCenter,
    },
})
export default class Mnemonic extends Vue {
    phrase: string = ''
    isLoading: boolean = false
    err: string = ''

    beforeDestroy() {
        this.phrase = ''
    }

    onPhraseIn(ev: any) {
        this.phrase = ev.currentTarget.value
    }

    errCheck() {
        let phrase = this.phrase
        let words = phrase.split(' ')

        // not a valid key phrase
        if (words.length !== 24) {
            this.err = `${this.$t('access.mnemonic.error')}`
            return false
        }

        let isValid = bip39.validateMnemonic(phrase)
        if (!isValid) {
            this.err = 'Invalid mnemonic phrase. Make sure your mnemonic is all lowercase.'
            return false
        }

        return true
    }

    get wordCount(): number {
        return this.phrase.trim().split(' ').length
    }

    get canSubmit() {
        if (this.wordCount !== 24) {
            return false
        }

        return true
    }

    async access() {
        this.phrase = this.phrase.trim()
        let phrase = this.phrase

        this.isLoading = true

        if (!this.errCheck()) {
            this.isLoading = false
            return
        }

        setTimeout(async () => {
            try {
                await this.$store.dispatch('accessWallet', phrase)
                this.isLoading = false
            } catch (e) {
                this.isLoading = false
                this.err = `${this.$t('access.mnemonic.error')}`
            }
        }, 500)
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
