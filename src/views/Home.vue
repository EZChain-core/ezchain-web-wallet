<template>
    <div class="home">
        <div class="container mx-auto">
            <div class="max-w-md mx-auto">
                <div class="flex flex-col items-center text-center">
                    <div class="home_wrapper">
                        <h1 class="font-bold text-1.5xl">{{ $t('home.desc') }}</h1>
                        <div class="bg-EZC-bgDefault rounded-lg p-4 mt-4">
                            <router-link
                                class="flex items-center min-w-full shadow-lg rounded-lg p-4 h-auto lg:h-40 bg-white-a500"
                                data-cy="access"
                                to="/access"
                            >
                                <header
                                    class="flex flex-col lg:justify-center lg:flex-row items-center"
                                >
                                    <div class="img_container flex-shrink-0 mr-4">
                                        <img src="@/assets/create1.png" alt="access" />
                                    </div>
                                    <div class="mt-2">
                                        <h2
                                            class="text-xs lg:text-left text-EZC-grayText font-bold uppercase"
                                        >
                                            {{ $t('home.access.title') }}
                                        </h2>
                                        <p
                                            class="text-1.75xl font-medium text-EZC-defaultBlack lg:text-left leading-7 w-auto lg:w-56"
                                        >
                                            {{ $t('home.access.desc') }}
                                        </p>
                                    </div>
                                </header>
                            </router-link>
                            <router-link
                                class="flex items-center min-w-full shadow-lg rounded-lg mt-4 p-4 h-auto lg:h-40 bg-white-a500"
                                data-cy="create"
                                to="/create"
                            >
                                <header
                                    class="flex flex-col lg:justify-center lg:flex-row items-center"
                                >
                                    <div class="img_container flex-shrink-0 mr-4">
                                        <img src="@/assets/create2.png" alt="create" />
                                    </div>
                                    <div class="mt-2">
                                        <h2
                                            class="text-xs lg:text-left text-EZC-grayText font-bold uppercase"
                                        >
                                            {{ $t('home.create.title') }}
                                        </h2>
                                        <p
                                            class="text-1.75xl font-medium text-EZC-defaultBlack lg:text-left leading-7 w-auto lg:w-56"
                                        >
                                            {{ $t('home.create.desc') }}
                                        </p>
                                    </div>
                                </header>
                            </router-link>
                        </div>
                        <ToS class="tos" style="align-self: center; margin: 30px !important"></ToS>
                    </div>
                </div>
            </div>
        </div>
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

<style scoped lang="scss"></style>
