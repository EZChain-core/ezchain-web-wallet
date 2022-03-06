<template>
    <div class="radio_buts">
        <button
            v-for="(key, i) in keys"
            :key="key"
            @click="select(key)"
            :active="selection === key"
            class="hover_border"
        >
            {{ labels[i] }}
        </button>
    </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator'

@Component
export default class RadioButtons extends Vue {
    @Prop() labels!: string[]
    @Prop() keys!: string[]

    @Model('change', { type: String }) readonly selection!: string

    select(val: string) {
        this.$emit('change', val)
    }
}
</script>
<style scoped lang="scss">
@use '../../main';
.radio_buts {
    display: flex;
    flex-wrap: wrap;
}
button {
    word-break: normal;
    white-space: nowrap;
    font-weight: bold;
    padding: 4px 14px;
    border: 1px solid transparent;
    margin-right: 6px;
    margin-bottom: 6px;
    transition-duration: 0.2s;
    font-family: Inconsolata, monospace;
    height: 32px;
    left: 360px;
    top: 240px;
    background: #fafafa;
    box-sizing: border-box;
    border-radius: 24px;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    color: #a3a3a3;
    &:hover {
        border: 1px solid #ef6825 !important;
        color: #ef6825;
    }

    &[active] {
        border: 1px solid #ef6825;
        color: #ef6825;
    }
}

@include main.medium-device {
    button {
        font-size: 11px;
        padding: 4px 8px;
    }
}
</style>
