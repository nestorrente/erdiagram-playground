<template>
    <Modal
            :showing="showing"
            @update:showing="onModalShowingChange"
            max-width="800px"
            append-body-class="p-0"
            append-body-style="height: 680px"
    >
        <template #title>
            Settings
            <span
                    v-show="configChanged"
                    class="tag is-warning"
                    style="vertical-align: bottom"
            >
                unsaved
            </span>
        </template>
        <template #default>

            <!--<pre v-text="internalConfig"></pre>-->

            <div class="vertical-full-container">
                <Tabs
                        :selected-tab-name="selectedTabName"
                        @update:selected-tab-name="$emit('update:selectedTabName', $event)"
                        append-tabs-class="vfc-item mb-0"
                        append-tabs-content-class="vfc-item vfc-grow"
                        append-tabs-content-style="overflow-y: auto"
                        reset-scroll-on-tab-change
                >
                    <Tab name="parser" title="Parser">
                        <OtherTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="mysql" title="MySQL">
                        <MysqlTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="oracle" title="Oracle DB">
                        <OracleTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="postgresql" title="PostgreSQL">
                        <PostgresqlTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="sqlite" title="SQLite">
                        <SqliteTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="sqlserver" title="SQL Server">
                        <SqlServerTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="java" title="Java">
                        <JavaTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="typescript" title="TypeScript">
                        <TypeScriptTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="nomnoml" title="Nomnoml">
                        <NomnomlTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="plantuml" title="PlantUML">
                        <PlantUmlTabContent :config="internalConfig"/>
                    </Tab>
                </Tabs>
            </div>

        </template>
        <template #footer>
            <SettingsModalFooter
                    :listen-keyboard-shortcuts="showing"
                    :config-file-contents-supplier="getConfigFileContents"
                    @save-changes="saveChanges"
                    @cancel="close"
                    @import-config-success="onImportConfigSuccess"
                    @import-config-error="onImportConfigError"
                    @restore-default-config="restoreDefaultConfig"
            />
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent, nextTick, ref, watch} from 'vue';
    import Modal from '@/components/generic/modal/Modal.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import {showConfirmModalDialog} from '@/store/globalModalDialogStore';
    import Tabs from '@/components/tabs/Tabs.vue';
    import erdiagramPlaygroundConfigManager from '@/config/ERDiagramPlaygroundConfigManager';
    import Tab from '@/components/tabs/Tab.vue';
    import OtherTabContent from '@/components/settings-modal/tabs/ParserTabContent.vue';
    import MysqlTabContent from '@/components/settings-modal/tabs/database/MysqlTabContent.vue';
    import OracleTabContent from '@/components/settings-modal/tabs/database/OracleTabContent.vue';
    import SqlServerTabContent from '@/components/settings-modal/tabs/database/SqlServerTabContent.vue';
    import JavaTabContent from '@/components/settings-modal/tabs/JavaTabContent.vue';
    import TypeScriptTabContent from '@/components/settings-modal/tabs/TypeScriptTabContent.vue';
    import SettingsModalFooter from '@/components/settings-modal/SettingsModalFooter.vue';
    import {showErrorToastMessage, showSuccessToastMessage} from '@/store/globalToastMessageStore';
    import configStore from '@/store/configStore';
    import NomnomlTabContent from '@/components/settings-modal/tabs/NomnomlTabContent.vue';
    import PlantUmlTabContent from '@/components/settings-modal/tabs/PlantUmlTabContent.vue';
    import PostgresqlTabContent from '@/components/settings-modal/tabs/database/PostgresqlTabContent.vue';
    import SqliteTabContent from '@/components/settings-modal/tabs/database/SqliteTabContent.vue';
    import configCompatibilityAdapter from '@/config/ERDiagramPlaygroundConfigCompatibilityAdapter';
    import {APP_VERSION} from "@/AppInfo.ts";

    export default defineComponent({
        name: 'SettingsModal',
        emits: [
            'update:showing',
            'update:selectedTabName'
        ],
        components: {
            SqliteTabContent,
            PostgresqlTabContent,
            PlantUmlTabContent,
            NomnomlTabContent,
            SettingsModalFooter,
            TypeScriptTabContent,
            JavaTabContent,
            SqlServerTabContent,
            OracleTabContent,
            MysqlTabContent,
            OtherTabContent,
            Tab,
            Tabs,
            Modal
        },
        props: {
            showing: {
                type: Boolean,
                default: false
            },
            selectedTabName: {
                type: String,
                required: false
            }
        },
        setup(props, context) {

            const internalConfig = ref<ERDiagramPlaygroundConfig>(configStore.config);
            const configChanged = ref(false);

            watch(internalConfig, () => configChanged.value = true, {deep: true});

            watch(() => props.showing, showing => {
                if (showing) {
                    // Clone the config
                    internalConfig.value = erdiagramPlaygroundConfigManager.mergeConfigs(configStore.config, {});
                    nextTick(() => configChanged.value = false);
                }
            });

            function onModalShowingChange(modalShowing: boolean) {
                if (!modalShowing) {
                    close();
                }
            }

            function saveChanges() {

                if (configChanged.value) {
                    configStore.updateConfig(internalConfig.value);
                    configChanged.value = false;
                }

                close();

            }

            async function close() {

                if (configChanged.value && !await confirmChangesDiscard()) {
                    return;
                }

                context.emit('update:showing', false);

            }

            function confirmChangesDiscard() {
                return showConfirmModalDialog({
                    message: 'Do you really want to exit without saving changes?',
                    acceptButtonText: 'Yes, discard them',
                    cancelButtonText: 'No, take me back'
                });
            }

            async function restoreDefaultConfig() {
                internalConfig.value = erdiagramPlaygroundConfigManager.getDefaultConfig();
            }

            function onImportConfigSuccess(text: string) {
                try {
                    const importedConfig = erdiagramPlaygroundConfigManager.convertFromSerializableObject(
                        configCompatibilityAdapter.adaptIfPossible(
                            JSON.parse(text)
                        )
                    );

                    if (importedConfig._version === APP_VERSION) {
                        internalConfig.value = erdiagramPlaygroundConfigManager.mergeConfigs(internalConfig.value, importedConfig);
                        showSuccessToastMessage('Settings imported successfully');
                    } else {
                        console.warn('Detected an invalid version of settings:', importedConfig._version);
                        showErrorToastMessage('Invalid settings file');
                    }
                } catch (error) {
                    console.error('Cannot parse config file:', error);
                    showErrorToastMessage('There was an error parsing the settings file');
                }
            }

            function onImportConfigError(error: any) {
                console.error('Cannot read config file:', error);
                showErrorToastMessage('There was an error reading the settings file');
            }

            function getConfigFileContents() {
                const serializableConfig = erdiagramPlaygroundConfigManager.convertToSerializableObject(internalConfig.value);
                return JSON.stringify(serializableConfig, undefined, 2);
            }

            return {
                internalConfig,
                configChanged,
                onModalShowingChange,
                saveChanges,
                close,
                restoreDefaultConfig,
                onImportConfigSuccess,
                onImportConfigError,
                getConfigFileContents
            };

        }
    });
</script>
