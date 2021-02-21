<template>
    <div class="toast-container is-flex is-justify-content-center">
        <transition name="slide-down">
            <div
                    v-if="showing"
                    class="notification p-4 is-success is-light"
            >
                Settings successfully imported
            </div>
        </transition>
        <transition name="slide-down">
            <div
                    v-if="showing"
                    class="notification p-4 is-success is-light"
            >
                Settings successfully imported
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';

    export default defineComponent({
        name: 'GlobalToastMessage',
        setup() {

            const showing = ref(false);

            // @ts-ignore
            window.showToast = () => {
                showing.value = true;
                setTimeout(() => {
                    showing.value = false;
                }, 20000);
            };

            return {
                showing
            };

        }
    });
</script>

<style lang="scss">
    .toast-container {

        position: fixed;
        top: 1.5rem;
        left: 0;
        right: 0;
        z-index: 1000;

        > .notification {
            max-width: min(50%, 400px);
        }

    }
</style>
