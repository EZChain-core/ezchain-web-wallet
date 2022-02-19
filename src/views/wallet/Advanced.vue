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
            Setting
        </h1>
        <TokenListModal ref="token_list"></TokenListModal>
        <!--        <div class="buts grid_box">-->
        <!--            <button @click="openTokenlist">Manage Token Lists</button>-->
        <!--        </div>-->
        <div class="grids">
            <ChainImport class="grid_box"></ChainImport>
            <SignMessage class="grid_box"></SignMessage>
            <VerifyMessage class="grid_box"></VerifyMessage>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'

import ChainImport from '@/components/wallet/advanced/ChainImport.vue'
import SignMessage from '@/components/wallet/advanced/SignMessage/SignMessage.vue'
import VerifyMessage from '@/components/wallet/advanced/VerifyMessage.vue'
import TokenListModal from '@/components/modals/TokenList/TokenListModal.vue'

@Component({
    name: 'advanced',
    components: {
        TokenListModal,
        ChainImport,
        SignMessage,
        VerifyMessage,
    },
})
export default class Advanced extends Vue {
    $refs!: {
        token_list: TokenListModal
    }
    openTokenlist() {
        this.$refs.token_list.open()
    }
}
</script>
<style scoped lang="scss">
@use '../../main';

h1 {
    font-weight: normal;
}
.grids {
    display: grid;
    column-gap: 14px;
    row-gap: 14px;
    grid-template-columns: repeat(3, 1fr);
    box-shadow: 0px 8px 40px -24px rgba(24, 38, 46, 0.3),
        inset 0px -1px 3px -2px rgba(24, 38, 46, 0.5);
    border-radius: 8px;
    height: 506px;
}

.grid_box {
    background-color: var(--bg-light);
    padding: 30px;
    border-radius: 4px;
    overflow: auto;
}

@include main.mobile-device {
    .grids {
        grid-template-columns: none;
    }
}

@include main.medium-device {
    .grids {
        grid-template-columns: none;
    }
}

.buts {
    margin-bottom: 12px;
    button {
        color: var(--primary-color);
        &:hover {
            color: var(--secondary-color);
        }
    }
}
</style>
