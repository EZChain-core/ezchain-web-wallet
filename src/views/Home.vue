<template>
    <div class="home">
        <b-container>
            <b-row>
                <b-col class="flex_column">
                    <div class="home_wrapper">
                        <LogoCenter></LogoCenter>
                        <h1>{{ $t('home.desc') }}</h1>
                        <div class="login_wrapper">
                            <div class="login_option">
                                <router-link data-cy="access" to="/access">
                                    <header>
                                        <div class="img_container">
                                            <img src="@/assets/create1.png" alt />
                                            <!--                                        <img v-else src="@/assets/diamond-primary-night.svg" alt />-->
                                        </div>
                                        <div>
                                            <h2>{{ $t('home.access.title') }}</h2>
                                            <p>{{ $t('home.access.desc') }}</p>
                                        </div>
                                    </header>
                                </router-link>
                            </div>
                            <div class="login_option" style="margin-top: 16px">
                                <router-link data-cy="create" to="/create">
                                    <header>
                                        <div class="img_container">
                                            <img src="@/assets/create2.png" alt />
                                        </div>
                                        <div>
                                            <h2>{{ $t('home.create.title') }}</h2>
                                            <p>{{ $t('home.create.desc') }}</p>
                                        </div>
                                    </header>
                                </router-link>
                            </div>
                        </div>
                        <ToS class="tos" style="align-self: center; margin: 30px !important"></ToS>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import ToS from '@/components/misc/ToS.vue'
import LogoCenter from '@/components/LogoEzChain/Logo.vue'

@Component({
    name: 'home',
    components: { ToS, LogoCenter },
})
export default class Home extends Vue {}
</script>

<style scoped lang="scss">
@use "../main";
.flex_column {
    display: flex;
    justify-content: center;
    align-items: center;
}
.home {
    padding-top: 100px;
    /*background-color: #fff;*/
    display: flex;
    justify-content: center;
    align-items: flex-start;
    position: relative;

    a {
        margin: 10px;
        text-align: center;
        display: block;
    }

    .home_wrapper {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        max-width: 480px;

        h1 {
            font-style: normal;
            font-weight: bold;
            font-size: 18px;
            line-height: 28px;
            color: #262626;
            text-align: center;
            margin-top: 224px;
        }

        .login_wrapper {
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: #fafafa;
            border-radius: 8px;
            padding: 16px;

            .login_option {
                box-shadow: inset 0px -1px 2px rgba(23, 23, 23, 0.2);
                border-radius: 8px;
                display: flex;
                height: 138px;
                align-items: center;
                justify-content: center;
                background-color: var(--bg-wallet-light);
                padding: 25px 69px 40px 40px;

                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .img_container {
                        margin-right: 16px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    img {
                        width: 72px;
                        height: 72px;
                        max-height: none;
                    }

                    h2 {
                        text-align: left;
                        font-family: 'DM Sans', sans-serif;
                        font-size: 12px;
                        text-transform: uppercase;
                        color: var(--primary-color-light);
                    }

                    p {
                        text-align: left;
                        font-size: 20px;
                        line-height: 28px;
                    }
                }

                a {
                    margin: 0;
                    text-decoration: none;
                    color: #262626;
                }
            }
        }
    }
}

.tos {
    margin-top: 14px !important;
}

.submit_but {
    width: max-content;
}
/* ==========================================
   Nav
   ========================================== */

@include main.night-mode {
}
.logo {
    margin-bottom: 30px;
}

img {
    max-height: 50px;
    object-fit: contain;
}

@include main.medium-device {
    .login_option {
        padding: 30px 40px !important;
        p {
            font-size: 1.4rem !important;
        }
    }
}

@include main.mobile-device {
    .auth {
        border-radius: 0;
        box-shadow: none;
    }

    .menu_option {
        padding: 5vh 12px;
    }
    .menu_option button {
        width: 100%;
        padding: 8px;
    }

    .imgcover {
        display: none;
    }

    .home {
        .home_wrapper {
            h1 {
                font-size: main.$xl-size-mobile;
            }

            .login_wrapper {
                grid-template-columns: none;
                display: flex;
                flex-direction: column;

                .login_option {
                    margin-bottom: main.$vertical-padding;
                    padding: 30px 15px;
                    align-items: center;

                    header {
                        display: flex;
                        flex-direction: column;
                        align-items: center;

                        margin-bottom: 30px;

                        img {
                            width: 40px;
                            height: 40px;
                        }

                        h2 {
                            padding-top: main.$s-size-mobile;
                            font-size: main.$s-size-mobile;
                        }

                        p {
                            margin-top: 10px !important;
                            font-size: main.$l-size-mobile;
                            text-align: center;
                        }
                    }

                    a {
                        margin: 0;
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: 600px) {
}
</style>
