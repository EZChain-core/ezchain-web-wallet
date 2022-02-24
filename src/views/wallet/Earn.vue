<template>
    <div>
        <h1
            style="
                font-style: normal;
                font-weight: bold;
                font-size: 32px;
                line-height: 44px;
                color: #262626;
            "
        >
            {{ $t('earn.title') }}
        </h1>
        <div class="flex_three">
            <div class="earn_page no_scroll_bar">
                <div class="header">
                    <div v-if="pageNow" style="display: flex; align-items: center">
                        <img
                            style="width: 15px; height: 12px; cursor: pointer"
                            @click="cancel"
                            src="@/assets/back.png"
                            alt=""
                        />
                        <h1
                            style="
                                font-style: normal;
                                font-weight: bold;
                                font-size: 16px;
                                line-height: 24px;
                                color: #0c1527;
                                display: inline;
                                margin-left: 8px;
                            "
                        >
                            {{ subtitle }}
                        </h1>
                    </div>
                </div>
                <transition name="fade" mode="out-in">
                    <div v-if="!pageNow">
                        <div class="options">
                            <div>
                                <h4 class="title">
                                    {{ $t('earn.validate_card.title') }}
                                </h4>
                                <p style="flex-grow: 1">
                                    {{ $t('earn.validate_card.desc') }}
                                </p>
                                <p v-if="!canValidate" class="no_balance">
                                    {{ $t('earn.warning_1', [minStakeAmt.toLocaleString()]) }}
                                </p>
                                <v-btn
                                    class="button_secondary"
                                    data-cy="validate"
                                    @click="addValidator"
                                    depressed
                                    small
                                    :disabled="!canValidate"
                                >
                                    {{ $t('earn.validate_card.submit') }}
                                </v-btn>
                            </div>
                            <div>
                                <h4 class="title">
                                    {{ $t('earn.delegate_card.title') }}
                                </h4>
                                <p style="flex-grow: 1">
                                    {{ $t('earn.delegate_card.desc') }}
                                </p>
                                <p v-if="!canDelegate" class="no_balance">
                                    {{ $t('earn.warning_2', [minDelegationAmt.toLocaleString()]) }}
                                </p>
                                <v-btn
                                    class="button_secondary"
                                    data-cy="delegate"
                                    @click="addDelegator"
                                    depressed
                                    small
                                    :disabled="!canDelegate"
                                >
                                    {{ $t('earn.delegate_card.submit') }}
                                </v-btn>
                            </div>
                            <!--                            <div>-->
                            <!--                                <h4 class="title">-->
                            <!--                                    {{ $t('earn.transfer_card.title') }}-->
                            <!--                                </h4>-->
                            <!--                                <p style="flex-grow: 1">-->
                            <!--                                    {{ $t('earn.transfer_card.desc') }}-->
                            <!--                                </p>-->
                            <!--                                <v-btn-->
                            <!--                                    class="button_secondary"-->
                            <!--                                    data-cy="swap"-->
                            <!--                                    @click="transfer"-->
                            <!--                                    depressed-->
                            <!--                                    small-->
                            <!--                                >-->
                            <!--                                    {{ $t('earn.transfer_card.submit') }}-->
                            <!--                                </v-btn>-->
                            <!--                            </div>-->
                            <!--                            <div>-->
                            <!--                                <h4 class="title">-->
                            <!--                                    {{ $t('earn.rewards_card.title') }}-->
                            <!--                                </h4>-->
                            <!--                                <p style="flex-grow: 1">-->
                            <!--                                    {{ $t('earn.rewards_card.desc') }}-->
                            <!--                                </p>-->
                            <!--                                <v-btn-->
                            <!--                                    class="button_secondary"-->
                            <!--                                    data-cy="rewards"-->
                            <!--                                    @click="viewRewards"-->
                            <!--                                    depressed-->
                            <!--                                    small-->
                            <!--                                >-->
                            <!--                                    {{ $t('earn.rewards_card.submit') }}-->
                            <!--                                </v-btn>-->
                            <!--                            </div>-->
                        </div>
                        <div class="bottom_earn">
                            <button
                                style="margin-right: 12px"
                                class="button_earn"
                                @click="transfer"
                            >
                                Cross Chain Transfer
                            </button>
                            <button class="button_earn" @click="viewRewards">
                                Estimated Rewards
                            </button>
                        </div>
                        <!--                <v-btn @click="viewRewards" depressed small>View Estimated Rewards</v-btn>-->
                    </div>
                    <div v-else>
                        <component :is="pageNow" class="comp" @cancel="cancel"></component>
                    </div>
                </transition>
            </div>
            <transition name="fade" mode="out-in">
                <transaction-history-panel class="panel_content"></transaction-history-panel>
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import AddValidator from '@/components/wallet/earn/Validate/AddValidator.vue'
import AddDelegator from '@/components/wallet/earn/Delegate/AddDelegator.vue'
import { BN } from 'ezchainjs2/dist'
import UserRewards from '@/components/wallet/earn/UserRewards.vue'
import { bnToBig } from '@/helpers/helper'
import Big from 'big.js'
import TransactionHistoryPanel from '@/components/SidePanels/TransactionHistoryPanel.vue'

@Component({
    name: 'earn',
    components: {
        UserRewards,
        AddValidator,
        AddDelegator,
        TransactionHistoryPanel,
    },
})
export default class Earn extends Vue {
    pageNow: any = null
    subtitle: string = ''
    intervalID: any = null

    addValidator() {
        this.pageNow = AddValidator
        this.subtitle = this.$t('earn.subtitle1') as string
    }
    addDelegator() {
        this.pageNow = AddDelegator
        this.subtitle = this.$t('earn.subtitle2') as string
    }
    transfer() {
        this.$router.replace('/wallet/cross_chain')
    }

    viewRewards() {
        this.pageNow = UserRewards
        this.subtitle = this.$t('earn.subtitle4') as string
    }
    cancel() {
        this.pageNow = null
        this.subtitle = ''
    }

    updateValidators() {
        this.$store.dispatch('Platform/update')
    }

    created() {
        this.updateValidators()
        this.intervalID = setInterval(() => {
            this.updateValidators()
        }, 15000)
    }

    deactivated() {
        this.cancel()
    }

    destroyed() {
        clearInterval(this.intervalID)
    }

    get platformUnlocked(): BN {
        return this.$store.getters['Assets/walletPlatformBalance']
    }

    get platformLockedStakeable(): BN {
        // return this.$store.getters.walletPlatformBalanceLockedStakeable
        return this.$store.getters['Assets/walletPlatformBalanceLockedStakeable']
    }

    get totBal(): BN {
        return this.platformUnlocked.add(this.platformLockedStakeable)
    }

    get pNoBalance() {
        return this.platformUnlocked.add(this.platformLockedStakeable).isZero()
    }

    get canDelegate(): boolean {
        let bn = this.$store.state.Platform.minStakeDelegation
        if (this.totBal.lt(bn)) {
            return false
        }
        return true
    }

    get canValidate(): boolean {
        let bn = this.$store.state.Platform.minStake
        if (this.totBal.lt(bn)) {
            return false
        }
        return true
    }

    get minStakeAmt(): Big {
        let bn = this.$store.state.Platform.minStake
        return bnToBig(bn, 9)
    }

    get minDelegationAmt(): Big {
        let bn = this.$store.state.Platform.minStakeDelegation
        return bnToBig(bn, 9)
    }
}
</script>
<style scoped lang="scss">
@use '../../main';
.earn_page {
    display: grid;
    grid-template-rows: max-content 1fr;
    background: #ffffff;
    box-shadow: 0px 8px 40px -24px rgba(24, 38, 46, 0.3),
        inset 0px -1px 3px -2px rgba(24, 38, 46, 0.5);
    border-radius: 8px;
    padding: 24px 16px;
    overflow: overlay;
}
.bottom_earn {
    display: flex;
    align-items: center;
    margin-top: 202px;
}
.button_earn {
    border: 1px solid #525252;
    box-sizing: border-box;
    border-radius: 8px;
    padding: 8px 16px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #525252;
}
.button_earn:hover,
.button_earn:active {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 16px;
    background: #ef6825;
    border-radius: 8px;
    flex: none;
    order: 0;
    flex-grow: 0;
    color: #ffffff;
    border: none;
}
.flex_three {
    display: grid;
    grid-template-columns: 1fr 360px;
    grid-gap: 12px;
    height: 506px;
}
.header {
    h1 {
        font-weight: normal;
    }
    display: flex;
    /*justify-content: space-between;*/
    /*align-items: center;*/
    align-items: center;

    .subtitle {
        margin-left: 0.5em;
        /*font-size: 20px;*/
        color: var(--primary-color-light);
        font-weight: lighter;
    }

    span {
        margin-left: 1em;

        &:hover {
            color: var(--primary-color);
            cursor: pointer;
        }
    }
}
.options {
    margin: 30px 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 14px;
    //display: flex;
    //justify-content: space-evenly;
    //padding: 60px;

    > div {
        min-width: 326px;
        width: 100%;
        justify-self: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 16px;
        background: #fafafa;
        border-radius: 8px;
    }

    h4 {
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        color: #0c1527;
        margin-bottom: 8px;
    }

    p {
        /*color: var(--primary-color-light);*/
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.1px;

        /* Neutral/500 */

        color: #737373;
    }

    .no_balance {
        color: var(--secondary-color);
    }

    .v-btn {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 8px 16px;
        position: static;
        background: #ef6825;
        border-radius: 8px;
        height: 40px;
        margin-top: 24px;
        flex: none;
        order: 0;
        flex-grow: 0;
    }
}

span {
    color: var(--primary-color-light);
    opacity: 0.5;
    float: right;
    font-weight: lighter;
}

.cancel {
    font-size: 13px;
    color: var(--secondary-color);
    justify-self: flex-end;
}

.comp {
    margin-top: 14px;
}

@include main.medium-device {
    .options {
        grid-template-columns: 1fr 1fr;
    }
}

@include main.mobile-device {
    .options {
        grid-template-columns: none;
        grid-row-gap: 15px;
    }
}
</style>
