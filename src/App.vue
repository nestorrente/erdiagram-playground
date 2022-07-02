<template>
    <div class="vertical-full-container">
        <div class="vfc-item">
            <NavBar/>
        </div>
        <section class="section pb-0 vfc-item vfc-grow">
            <div class="vertical-full-container">
                <MainContainer
                        :showing-settings-modal="showingSettingsModal"
                        @show-settings-modal="showSettingsModal"
                />
            </div>
        </section>
    </div>
    <SettingsModal
            v-model:showing="showingSettingsModal"
            v-model:selected-tab-name="settingsModalSelectedTabName"
    />
    <GlobalModalDialog/>
    <GlobalToastMessage/>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import NavBar from '@/components/layout/NavBar.vue';
    import SettingsModal from '@/components/settings-modal/SettingsModal.vue';
    import GlobalModalDialog from '@/components/generic/modal/GlobalModalDialog.vue';
    import GlobalToastMessage from '@/components/generic/modal/GlobalToastMessage.vue';
    import MainContainer from '@/components/layout/main-container/MainContainer.vue';
    import configStore from '@/store/configStore';

    export default defineComponent({
        name: 'App',
        components: {
            MainContainer,
            GlobalToastMessage,
            GlobalModalDialog,
            SettingsModal,
            NavBar
        },
        setup() {

            const showingSettingsModal = ref(false);
            const settingsModalSelectedTabName = ref('mysql');

            function showSettingsModal(outputFormatId: string) {
                // FIXME find a clearer way to map each output format to its settings tab
                settingsModalSelectedTabName.value = outputFormatId.startsWith('nomnoml')
                        ? 'nomnoml'
                        : outputFormatId.startsWith('plantuml')
                                ? 'plantuml'
                                : outputFormatId;
                showingSettingsModal.value = true;
            }

            return {
                configStore,
                showingSettingsModal,
                settingsModalSelectedTabName,
                showSettingsModal
            };

        }
    });
</script>
