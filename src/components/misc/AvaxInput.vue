<template>
    <div class="avax_input">
        <div class="col1 hover_border">
            <BigNumInput
                style="text-align: left !important"
                ref="amt_in"
                class="amt_in"
                contenteditable="amt_in"
                :denomination="9"
                :max="max"
                placeholder="0 EZC"
                @change="amount_in"
            ></BigNumInput>
            <button class="max_but" @click="maxOut" v-if="max">MAX</button>
        </div>
        <div v-if="balance" class="balance">
            <div>
                <p>
                    <b>{{ $t('misc.balance') }}:</b>
                    {{ balance.toLocaleString() }}
                </p>
                <p>
                    <b>$</b>
                    {{ amountUSD.toLocaleString(2) }}
                </p>
            </div>
            <div></div>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Model } from 'vue-property-decorator'
import { Utils, Big } from 'ezchain-wallet-sdk'
//@ts-ignore
import { BigNumInput } from 'ezchain-vue_components'
import { BN } from 'ezchainjs2'
import { priceDict } from '../../store/types'

@Component({
    components: {
        BigNumInput,
    },
})
export default class AvaxInput extends Vue {
    @Model('change', { type: Object }) readonly amount!: BN

    @Prop({
        default: null,
    })
    max?: BN | null

    @Prop() balance?: Big | null

    maxOut(ev: MouseEvent) {
        ev.preventDefault()
        ev.stopPropagation()
        //@ts-ignore
        this.$refs.amt_in.maxout()
    }

    amount_in(val: BN) {
        this.$emit('change', val)
    }

    get amountUSD(): Big {
        let usdPrice = this.priceDict.usd
        let amount = Utils.bnToBig(this.amount, 9)
        let usdBig = amount.times(usdPrice)
        return usdBig
    }

    get priceDict(): priceDict {
        return this.$store.state.prices
    }
}
</script>
<style scoped lang="scss">
@use '../../main';

.avax_input {
    display: grid;
    grid-template-rows: 1fr max-content;
    color: var(--primary-color);
    width: 100%;
    height: 40px;
    background-color: #f5f5f5;
    border-radius: 8px;

    .amt_in {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        color: #262626;
        font-family: monospace;
        flex-grow: 1;
        flex-shrink: 1;
        display: block;
        box-sizing: content-box;
        outline: none !important;
        border: none !important;
        //padding: 0 12px !important;
    }
    .amt_in::placeholder {
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        color: #262626;
    }
    .max_but {
        background-color: var(--bg-light);
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        color: #737373;
    }
}

.balance {
    display: grid;
    column-gap: 10px;
    font-size: 14px;
    color: var(--primary-color-light);
    padding: 2px 0px;

    > div {
        display: flex;
        justify-content: space-between;
    }

    p {
        text-align: left;
        padding: 2px 0px;
    }

    p:last-child {
        text-align: right;
    }

    span {
        font-family: monospace;
        padding-left: 14px;
    }
}

.col1 {
    background-color: #f5f5f5;
    border: 1px solid transparent;
    border-radius: 8px;
    //display: flex;
    display: grid;
    grid-template-columns: 1fr max-content;
    width: 100%;
    box-sizing: border-box;
    //overflow: auto;
    padding: 8px 14px;
    position: relative;

    //&:hover {
    //    border-color: var(--primary-color-light);
    //}
    //&:focus-within {
    //    border-color: var(--secondary-color);
    //}
}

.ticker {
    border-radius: 3px;
    padding: 8px 14px;
}

p {
    text-align: center;
}
.max_but {
    font-size: 13px;
    color: #737373;
}

@include main.mobile-device {
    .balance {
        font-size: 12px;
    }
}
</style>
