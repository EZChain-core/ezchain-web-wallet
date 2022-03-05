<template>
    <div class="confirmation">
        <div>
            <label>{{ $t('earn.validate.confirmation.id') }}</label>
            <p style="word-break: break-all">{{ nodeID }}</p>
        </div>
        <div>
            <label>{{ $t('earn.validate.confirmation.amount') }}</label>
            <p>{{ amtText }} EZC</p>
        </div>
        <div>
            <label>{{ $t('earn.validate.confirmation.start') }}</label>
            <p>{{ $t('earn.validate.confirmation.start_desc') }}</p>
        </div>
        <div>
            <label>{{ $t('earn.validate.confirmation.end') }}</label>
            <p>{{ end.toLocaleString() }}</p>
        </div>
        <div>
            <label>{{ $t('earn.validate.confirmation.fee') }}</label>
            <p>{{ delegationFee }} %</p>
        </div>
        <div>
            <label>{{ $t('earn.validate.confirmation.reward') }} ({{ walletType }})</label>
            <p style="word-break: break-all">{{ rewardAddress }}</p>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { BN } from 'ezchainjs2'
import Big from 'big.js'

@Component
export default class ConfirmPage extends Vue {
    @Prop() nodeID!: string
    @Prop() end!: Date
    @Prop() delegationFee!: number
    @Prop() amount!: BN
    @Prop() rewardAddress!: string
    @Prop() rewardDestination!: string

    // amountCopy: BN = new BN(0);

    // @Watch('amount')
    // onAmountChange(val: BN){
    //     console.log(val.toString(), val);
    //     this.amountCopy = val.clone()
    //     this.amountCopy = val.
    // }

    // get startDate(){
    //     return new Date(this.start);
    // }
    //
    // get endDate(){
    //     return new Date(this.end);
    // }

    get amtBig(): Big {
        let stakeAmt = Big(this.amount.toString()).div(Math.pow(10, 9))
        return stakeAmt
    }

    get walletType() {
        if (this.rewardDestination === 'local') {
            return this.$t('earn.validate.confirmation.type_local')
        }
        return this.$t('earn.validate.confirmation.type_custom')
    }

    get amtText(): string {
        let amt = this.amtBig
        return amt.toLocaleString(9)
    }
}
</script>
<style scoped lang="scss">
.confirmation {
    > div {
        margin: 14px 0;
        padding: 6px 14px;
        border-bottom: 1px solid #f5f5f5;

        label {
            font-style: normal;
            font-weight: bold;
            font-size: 14px;
            line-height: 16px;
            color: #171717;
        }
        p {
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            color: #737373;
        }
    }

    .err {
        font-size: 14px;
    }
}
</style>
