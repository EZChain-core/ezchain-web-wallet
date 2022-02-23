<template>
    <div>
        <div v-if="isEVMSupported">
            <label
                style="
                    font-style: normal;
                    font-weight: bold;
                    font-size: 14px;
                    line-height: 16px;
                    color: #171717;
                "
            >
                {{ $t('transfer.source_chain.title') }}
            </label>
            <div class="chain_select" style="margin-top: 16px">
                <button style="margin-right: 8px" :active="formType === 'X'" @click="set('X')">
                    X Chain
                </button>
                <button :active="formType === 'C'" @click="set('C')">C Chain</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator'
import { ChainIdType } from '@/constants'
import { CurrencyType } from '@/components/misc/CurrencySelect/types'

@Component
export default class ChainInput extends Vue {
    @Model('change', { type: String }) readonly formType!: CurrencyType
    @Prop({ default: false }) disabled!: boolean

    set(val: ChainIdType) {
        if (this.disabled) return
        this.$emit('change', val)
    }

    get wallet() {
        return this.$store.state.activeWallet
    }

    get isEVMSupported() {
        return this.wallet.ethAddress
    }
}
</script>
<style scoped lang="scss">
@use '../../../main';
label {
    color: var(--primary-color-light);
}
.chain_select {
    display: flex;
    width: max-content;
    > button {
        transition-duration: 0.1s;
        cursor: pointer;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        color: #a3a3a3;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 104px;
        height: 32px;
        background: #fafafa;
        border-radius: 24px;
        &:hover {
            background: #fef6f2;
            border: 1px solid #ef6825;
            box-sizing: border-box;
            border-radius: 24px;
            color: #ef6825;
        }
        &[active] {
            background: #fef6f2;
            border: 1px solid #ef6825;
            box-sizing: border-box;
            border-radius: 24px;
            color: #ef6825;
        }
    }
}

@include main.mobile-device {
    .chain_select {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 14px;
        > button {
            margin: 0;
            justify-content: center;
            text-align: center;
            background-color: var(--bg-light);
            color: var(--primary-color-light);

            &[active] {
                //background-color: var(--secondary-color);
                color: var(--primary-color);
                //color: #fff;
            }
        }
    }
}
</style>
