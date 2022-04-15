<template>
    <div class="node_selection">
        <div style="display: flex; align-items: center; justify-content: space-between">
            <div class="search hover_border">
                <img v-if="$root.theme === 'day'" src="@/assets/search.png" />
                <input
                    type="text"
                    :placeholder="$t('earn.delegate.list.search')"
                    v-model="search"
                />
            </div>
        </div>
        <ValidatorsList
            class="val_list"
            :search="search"
            @select="onselect"
            ref="val_list"
        ></ValidatorsList>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import ValidatorsList from '@/components/misc/ValidatorList/ValidatorsList.vue'
import { ValidatorListItem } from '@/store/modules/platform/types'

@Component({
    components: {
        ValidatorsList,
    },
})
export default class NodeSelection extends Vue {
    search: string = ''

    openFilters() {
        //@ts-ignore
        this.$refs.val_list.openFilters()
    }

    onselect(val: ValidatorListItem) {
        this.$emit('select', val)
    }
}
</script>
<style scoped lang="scss">
.node_selection {
    display: grid;
    overflow: auto;
    row-gap: 14px;
    grid-template-rows: max-content 1fr;
}

.val_list {
    overflow: auto;
    height: 100%;
    /*margin-top: 14px;*/
}

.search {
    /*flex-grow: 1;*/
    height: 40px;
    padding: 5px;
    display: flex;
    align-items: center;
    font-size: 13px;
    flex-basis: 420px;
    flex-shrink: 1;
    border: 1px solid transparent;
    flex-direction: row-reverse;
    width: 268px;
    background: #f5f5f5;
    border-radius: 8px;
    $icon_w: 36px;

    img {
        border-radius: 4px;
        padding: 10px 0px;
        background-color: var(--bg-wallet-light);
        /*height: 100%;*/
        height: $icon_w;
        width: $icon_w;
        object-fit: contain;
    }

    input {
        padding: 0px 16px;
        outline: none;
        border: none !important;
        flex-grow: 1;
        color: var(--primary-color);

        &::placeholder {
            color: #b3b7d3;
        }
    }
}

.rigt_but {
    float: right;

    button {
        color: var(--primary-color-light);

        &:hover {
            color: var(--primary-color);
        }
    }
}
</style>
