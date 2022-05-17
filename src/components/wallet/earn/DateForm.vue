<template>
    <div class="dates_form">
        <div class="hover_border">
            <datetime
                input-id="vueDateTime"
                style="background-color: #f5f5f5"
                v-model="localEnd"
                type="datetime"
                class="date"
                :min-datetime="endDateMin"
                :max-datetime="endDateMax"
            ></datetime>
            <div style="display: flex; align-items: center">
                <button
                    class="max_but"
                    style="background-color: #f5f5f5; margin-right: 20px"
                    @click="maxoutEndDate"
                >
                    MAX
                </button>
                <div
                    @click="showModal"
                    style="
                        background: #ffffff;
                        box-shadow: inset 0px -1px 2px rgba(23, 23, 23, 0.06);
                        border-radius: 4px;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    "
                >
                    <img class="cursor-pointer" src="@/assets/max.png" alt="max.png" />
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { DAY_MS, MINUTE_MS } from '../../../constants'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

const MIN_STAKE_DURATION = DAY_MS * 14

@Component
export default class DateForm extends Vue {
    // timeNow = 0

    localStart = this.startDateMin
    localEnd = this.endDateMin

    @Prop() maxEndDate?: string

    // @Watch('localStart')
    // startChange(val: string) {
    //     this.setStartDate(val)
    //
    //     if (this.stakeDuration < MIN_STAKE_DURATION) {
    //         this.localEnd = this.endDateMin
    //     }
    // }

    @Watch('localEnd')
    endChange(val: string) {
        this.setEndDate(val)

        let endTime = new Date(val).getTime()
        let minDateTime = new Date(this.endDateMin).getTime()

        if (endTime < minDateTime) {
            this.localEnd = this.endDateMin
        }
    }

    mounted() {
        this.localStart = this.startDateMin

        // default end date is 3 weeks
        this.localEnd = this.defaultEndDate

        // this.setStartDate(this.localStart)
        this.setEndDate(this.localEnd)
    }
    showModal() {
        const dateTime: HTMLElement | null = document.getElementById('vueDateTime')
        if (dateTime) {
            dateTime.click()
        }
    }
    // updateTimeNow() {
    //     this.timeNow = Date.now()
    //
    //     let remaining = MINUTE_MS - (this.timeNow % MINUTE_MS)
    //     // If current start date is less than now
    //     let startCurrent = new Date(this.localStart)
    //     if (startCurrent.getTime() <= this.timeNow + remaining) {
    //         this.localStart = this.startDateMin
    //     }
    //     setTimeout(() => {
    //         this.updateTimeNow()
    //     }, 10000)
    // }

    // setStartDate(val: string) {
    //     this.$emit('change_start', val)
    // }

    setEndDate(val: string) {
        this.$emit('change_end', val)
    }

    maxoutEndDate() {
        this.localEnd = this.endDateMax
    }

    get stakeDuration(): number {
        let start = new Date(this.localStart)
        let end = new Date(this.localEnd)
        let diff = end.getTime() - start.getTime()
        return diff
    }

    // 15 minutes from now
    // In reality it will be 5 minutes after the form is submitted
    get startDateMin() {
        let now = Date.now()
        let res = now + MINUTE_MS * 15
        return new Date(res).toISOString()
    }

    // 2 weeks
    // get startDateMax() {
    //     let startDate = new Date()
    //     // add 2 weeks
    //     let endTime = startDate.getTime() + 60000 * 60 * 24 * 14
    //     let endDate = new Date(endTime)
    //     return endDate.toISOString()
    // }

    // now + 15 minutes + 2 weeks (Min Staking Duration)
    get endDateMin() {
        let start = this.localStart
        let startDate = new Date(start)

        let end = startDate.getTime() + MIN_STAKE_DURATION
        let endDate = new Date(end)
        return endDate.toISOString()
    }

    // Start date + 1 year, or the prop
    get endDateMax() {
        if (this.maxEndDate) return this.maxEndDate

        let start = this.localStart
        let startDate = new Date(start)

        let end = startDate.getTime() + DAY_MS * 365
        let endDate = new Date(end)
        return endDate.toISOString()
    }

    get defaultEndDate() {
        let start = this.localStart
        let startDate = new Date(start)

        let end = startDate.getTime() + DAY_MS * 21
        let endDate = new Date(end)
        return endDate.toISOString()
    }
}
</script>
<style lang="scss">
.dates_form {
    .date input {
        border: none !important;
        text-align: left;
        width: 100%;
    }
}
</style>
<style scoped lang="scss">
.dates_form {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 15px;
    width: 100%;
    border-radius: 8px;
    background-color: #f5f5f5;
    box-sizing: border-box;
    padding: 0 4px;
    height: 40px;
    > div {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr max-content;
        background-color: #f5f5f5;
    }

    label > span {
        float: right;
        opacity: 0.4;
        cursor: pointer;
        &:hover {
            opacity: 1;
        }
    }
}

.max_but {
    padding-left: 12px;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #737373;
}
</style>
