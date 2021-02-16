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
                >
                    <Tab name="mysql" title="MySQL">
                        <MysqlTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab name="oracle" title="Oracle DB">
                        <OracleTabContent :config="internalConfig"/>
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
                    <Tab name="other" title="Other">
                        <OtherTabContent :config="internalConfig"/>
                    </Tab>
                </Tabs>
            </div>

        </template>
        <template #footer>
            <SettingsModalFooter
                    @save-changes="saveChanges"
                    @cancel="close"
                    @import-config="importConfig"
                    @export-config="exportConfig"
                    @restore-default-config="restoreDefaultConfig"
            />
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent, nextTick, ref, watch} from 'vue';
    import Modal from '@/components/generic/modal/Modal.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import {showConfirmModal} from '@/store/globalConfirmModalStore';
    import Tabs from '@/components/tabs/Tabs.vue';
    import erdiagramPlaygroundConfigManager, {LAST_CONFIG_VERSION} from '@/config/ERDiagramPlaygroundConfigManager';
    import Tab from '@/components/tabs/Tab.vue';
    import OtherTabContent from '@/components/config-modal/tabs/OtherTabContent.vue';
    import MysqlTabContent from '@/components/config-modal/tabs/database/MysqlTabContent.vue';
    import OracleTabContent from '@/components/config-modal/tabs/database/OracleTabContent.vue';
    import SqlServerTabContent from '@/components/config-modal/tabs/database/SqlServerTabContent.vue';
    import JavaTabContent from '@/components/config-modal/tabs/JavaTabContent.vue';
    import TypeScriptTabContent from '@/components/config-modal/tabs/TypeScriptTabContent.vue';
    import SettingsModalFooter from '@/components/config-modal/SettingsModalFooter.vue';

    interface Props {
        showing: boolean;
        config: ERDiagramPlaygroundConfig;
    }

    interface SelectInputOption<T> {
        text: string;
        value: T;
    }

    export default defineComponent({
        name: 'SettingsModal',
        emits: [
            'update:showing',
            'update:config',
            'update:selectedTabName'
        ],
        components: {
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
            config: {
                type: Object,
                required: true
            },
            selectedTabName: {
                type: String,
                required: false
            }
        },
        setup(uncastedProps, context) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const internalConfig = ref(props.config);
            const configChanged = ref(false);

            watch(internalConfig, () => configChanged.value = true, {deep: true});

            watch(() => props.showing, showing => {
                if (showing) {
                    internalConfig.value = erdiagramPlaygroundConfigManager.cloneConfig(props.config);
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
                    context.emit('update:config', internalConfig.value);
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
                return showConfirmModal({
                    title: 'Do you really want to exit without saving changes?',
                    acceptButtonText: 'Yes, discard them',
                    cancelButtonText: 'No, take me back'
                });
            }

            async function restoreDefaultConfig() {
                internalConfig.value = erdiagramPlaygroundConfigManager.getDefaultConfig();
            }

            function exportConfig() {

                const serializedConfig = erdiagramPlaygroundConfigManager.convertToSerializableObject(internalConfig.value);
                const jsonConfig = JSON.stringify(serializedConfig, undefined, 2);

                const data = new Blob([jsonConfig], {type: 'text/plain'});
                const url = URL.createObjectURL(data);

                downloadUrl(url, 'erdiagram-config.json');

                URL.revokeObjectURL(url);
                // setTimeout(() => URL.revokeObjectURL(url), 10);

            }

            function downloadUrl(url: string, filename: string) {
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.style.display = 'none';
                document.body.append(link);
                link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
                link.remove();
            }

            function importConfig(promise: Promise<string>) {
                promise.then(text => {
                    try {
                        const importedConfig = erdiagramPlaygroundConfigManager.convertFromSerializableObject(JSON.parse(text));

                        if (importedConfig._version === LAST_CONFIG_VERSION) {
                            internalConfig.value = erdiagramPlaygroundConfigManager.mergeConfigs(internalConfig.value, importedConfig);
                        } else {
                            console.warn('Detected old version of settings');
                        }
                    } catch (error) {
                        console.error('Cannot parse config file:', error);
                    }
                }).catch(error => {
                    console.error('Cannot read config file:', error);
                });
            }

            return {
                internalConfig,
                configChanged,
                onModalShowingChange,
                saveChanges,
                close,
                restoreDefaultConfig,
                exportConfig,
                importConfig
            };

        }
    });
</script>
