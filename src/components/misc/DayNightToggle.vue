<template>
    <div class="container_button">
        <button @click="toggle1" :class="val ? 'button_active' : ''">
            <img src="@/assets/sidebar/sun.png" />
        </button>
        <button @click="toggle2" :class="night ? 'button_active' : ''">
            <img src="@/assets/sidebar/moon.png" />
        </button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            val: true,
            night: false,
            sun: false,
        }
    },
    methods: {
        setNight() {
            this.val = false
            this.night = true
            localStorage.setItem('theme', 'night')
            document.documentElement.setAttribute('data-theme', 'night')
            this.$root.theme = 'night'
        },
        setDay() {
            this.val = true
            this.night = false
            localStorage.setItem('theme', 'day')
            document.documentElement.setAttribute('data-theme', 'day')
            this.$root.theme = 'day'
        },
        toggle1() {
            this.setDay()
        },
        toggle2() {
            this.setNight()
        },
    },
    mounted() {
        let theme = localStorage.getItem('theme')

        if (!theme) {
            this.setDay()
            return
        }

        if (theme === 'night') {
            this.setNight()
        }
    },
}
</script>
<style scoped lang="scss">
.container_button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 156px;
    height: 48px;
    padding: 4px;
    background: #f5f5f5;
    border-radius: 24px !important;
    button {
        width: 72px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 21px;
            height: 21px;
        }
    }
    .button_active {
        background: #ffffff;
        box-shadow: inset 0px -1px 2px rgba(23, 23, 23, 0.06);
        border-radius: 20px;
    }
}
</style>
