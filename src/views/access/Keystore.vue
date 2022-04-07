<template>
    <div class="max-w-md mx-auto">
        <h1 class="font-bold text-1.75xl leading-7 text-EZC-defaultBlack">
            {{ $t('keystore.title') }}
        </h1>
        <file-input class="file_in" @change="onfile"></file-input>
        <form @submit.prevent="access">
            <v-text-field
                class="pass bg-white-a400"
                :label="$t('password')"
                dense
                solo
                flat
                type="password"
                v-model="pass"
                v-if="file"
                hide-details
            ></v-text-field>
            <p class="err">{{ error }}</p>
            <!--                <remember-key class="remember" v-model="rememberPass" v-if="file" @is-valid="isRememberValid"></remember-key>-->
            <v-btn
                class="ava_button button_primary h-12 capitalize"
                @click="access"
                style="height: 48px !important; text-transform: capitalize"
                :loading="isLoading"
                v-if="file"
                depressed
            >
                {{ $t('access.mnemonic.submit') }}
            </v-btn>
        </form>

        <router-link
            class="bg-white-a500 cursor-pointer border rounded-lg h-12 border-solid border-EZC-defaultBlack flex justify-center items-center w-full"
            to="/access"
            tag="div"
        >
            <span class="text-1.5xl text-EZC-defaultBlack font-bold leading-7">
                {{ $t('access.cancel') }}
            </span>
        </router-link>
    </div>
</template>
<script lang="ts">
import LogoCenter from '@/components/LogoEzChain/Logo.vue'
import { Vue, Component } from 'vue-property-decorator'

import FileInput from '../../components/misc/FileInput.vue'
// import RememberKey from "../../components/misc/RememberKey.vue";
import { ImportKeyfileInput } from '@/store/types'
import { AllKeyFileTypes } from '@/js/IKeystore'

@Component({
    components: {
        // RememberKey,
        FileInput,
        LogoCenter,
    },
})
export default class Keystore extends Vue {
    pass: string = ''
    file: File | null = null
    fileText: string | null = null
    // rememberPass: string|null = null;
    // rememberValid: boolean = true;
    isLoading: boolean = false
    error: string = ''

    onfile(val: File) {
        this.file = val
        let parent = this

        let reader = new FileReader()
        reader.addEventListener('load', async () => {
            let res = reader.result as string
            parent.fileText = res
        })
        reader.readAsText(val)
    }

    // isRememberValid(val: boolean){
    //     this.rememberValid = val;
    // }
    access() {
        if (!this.canSubmit || this.isLoading) return

        let parent = this
        this.error = ''

        let fileData: AllKeyFileTypes
        try {
            fileData = JSON.parse(this.fileText as string)
        } catch (e) {
            this.error = `${this.$t('access.json_error')}`
            return
        }

        // console.log(this.fileText);
        // return;

        // let rememberPass = this.rememberPass;
        let data: ImportKeyfileInput = {
            password: this.pass,
            data: fileData,
        }

        this.isLoading = true

        setTimeout(() => {
            this.$store
                .dispatch('importKeyfile', data)
                .then((res) => {
                    parent.isLoading = false

                    // if(rememberPass){
                    //     parent.$store.dispatch('rememberWallets', rememberPass)
                    // }
                })
                .catch((err) => {
                    console.log(err)
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

    get canSubmit(): boolean {
        if (!this.file || !this.pass || !this.fileText) {
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
}
.ava_button {
    width: 100%;
    margin-bottom: 22px;
}
.access_card {
    /*max-width: 80vw;*/
    padding: main.$container-padding;
    width: 100%;
    /*max-width: 240px;*/
    /*max-width: 1000px;*/
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
}
.button_primary {
    height: 64px !important;
    border-radius: 8px;
}
.content {
    width: 340px;
    max-width: 100%;
    margin: 0px auto;
}

h1 {
    font-size: main.$m-size;
    font-weight: bold;
}

.file_in {
    margin: 30px auto 10px;
    color: white;
    font-size: 13px;
    border: none !important;
    height: 40px;
    background: #6bc688 !important;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    .access_card {
        padding: 0;
    }
}
</style>
