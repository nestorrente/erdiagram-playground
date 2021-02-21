<template>
    <div class="vertical-full-container">
        <div class="vfc-item">
            <NavBar/>
        </div>
        <section class="section pb-3 vfc-item vfc-grow">
            <div class="container vertical-full-container">
                <MainContainer
                        :config="config"
                        :showing-settings-modal="showingSettingsModal"
                        @show-settings-modal="showSettingsModal"
                />
            </div>
        </section>
    </div>
    <SettingsModal
            v-model:showing="showingSettingsModal"
            v-model:config="config"
            v-model:selected-tab-name="settingsModalSelectedTabName"
    />
    <GlobalModalDialog/>
    <GlobalToastMessage/>
</template>

<script lang="ts">
    import {ComputedRef, defineComponent, ref, watch} from 'vue';
    import NavBar from '@/components/layout/NavBar.vue';
    import {EntityRelationshipModelToCodeConverter} from '@nestorrente/erdiagram';
    import SettingsModal from '@/components/config-modal/SettingsModal.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import GlobalModalDialog from '@/components/generic/modal/GlobalModalDialog.vue';
    import erdiagramPlaygroundConfigManager, {LAST_CONFIG_VERSION} from '@/config/ERDiagramPlaygroundConfigManager';
    import {localJsonStorage} from '@/storage/JsonStorage';
    import ERDiagramPlaygroundSerializedConfig from '@/config/ERDiagramPlaygroundSerializedConfig';
    import GlobalToastMessage from '@/components/generic/modal/GlobalToastMessage.vue';
    import MainContainer from '@/components/layout/main-container/MainContainer.vue';

    interface OutputFormat {
        id: string;
        name: string;
        codeBlockLang: string;
        erModelToCodeConverter: ComputedRef<EntityRelationshipModelToCodeConverter>;
    }

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

            const config = ref<ERDiagramPlaygroundConfig>(getInitialConfig());

            watch(config, newValue => {
                localJsonStorage.setItem('erdiagramConfig', erdiagramPlaygroundConfigManager.convertToSerializableObject(newValue));
            });

            function getInitialConfig(): ERDiagramPlaygroundConfig {

                const serializedConfig = localJsonStorage.getItem<ERDiagramPlaygroundSerializedConfig>('erdiagramConfig');

                if (serializedConfig) {
                    const config = erdiagramPlaygroundConfigManager.convertFromSerializableObject(serializedConfig);

                    // Check you are using the last version of the config
                    if (config._version === LAST_CONFIG_VERSION) {
                        return config;
                    } else {
                        console.warn('Detected old version of settings: using default settings.');
                    }
                }

                return erdiagramPlaygroundConfigManager.getDefaultConfig();

            }

            const showingSettingsModal = ref(false);
            const settingsModalSelectedTabName = ref('mysql');

            function showSettingsModal(tab: string) {
                settingsModalSelectedTabName.value = tab;
                showingSettingsModal.value = true;
            }

            return {
                config,
                showingSettingsModal,
                settingsModalSelectedTabName,
                showSettingsModal
            };

        }
    });
</script>
