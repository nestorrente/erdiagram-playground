<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <div class="navbar-item">
                <img src="../../assets/img/logo.svg" class="mr-3">
                <strong>ERDiagram</strong>
            </div>

            <a
                    role="button"
                    class="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    @click="expanded = !expanded"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div class="navbar-menu" :class="{'is-active': expanded}">
            <div class="navbar-start">
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        GitHub
                    </a>

                    <div class="navbar-dropdown">
                        <a class="navbar-item" href="https://github.com/nestorrente/erdiagram" target="_blank">
                            ERDiagram library
                        </a>
                        <a class="navbar-item" href="https://github.com/nestorrente/erdiagram-cli" target="_blank">
                            ERDiagram CLI
                        </a>
                        <a class="navbar-item" href="https://github.com/nestorrente/erdiagram-playground"
                           target="_blank">
                            ERDiagram playground - this app 😀
                        </a>
                    </div>
                </div>
            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <article class="message is-small" :class="isProduction ? 'is-info' : 'is-warning'">
                        <div class="message-body">
                            Version {{ appVersion }}
                            <template v-if="!isProduction">({{ environment }})</template>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import {APP_VERSION} from "@/AppInfo.ts";

    export default defineComponent({
        name: 'NavBar',
        setup() {

            const expanded = ref(false);
            const environment = import.meta.env.VITE_APP_ENV;
            const isProduction = environment === 'production';

            return {
                expanded,
                environment,
                isProduction,
                appVersion: APP_VERSION
            };

        }
    });
</script>
