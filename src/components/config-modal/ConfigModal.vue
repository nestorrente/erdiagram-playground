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
                        :selected-tab-index="selectedTabIndex"
                        @update:selected-tab-index="$emit('update:selectedTabIndex', $event)"
                        append-tabs-class="vfc-item mb-0"
                        append-tabs-content-class="vfc-item vfc-grow"
                        append-tabs-content-style="overflow-y: auto"
                >
                    <Tab title="MySQL">
                        <MysqlTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab title="Oracle DB">
                        <OracleTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab title="SQL Server">
                        <SqlServerTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab title="Java">
                        <JavaTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab title="TypeScript">
                        <TypeScriptTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab title="Other">
                        <OtherTabContent :config="internalConfig"/>
                    </Tab>
                </Tabs>
            </div>

        </template>
        <template #footer>
            <div class="has-text-right">
                <Button color="success" @click="saveChanges">
                    Save changes
                </Button>
                <Button @click="restoreDefaultConfig">
                    Restore default values
                </Button>
                <Button @click="close">
                    Cancel
                </Button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent, nextTick, ref, watch} from 'vue';
    import Modal from '@/components/generic/modal/Modal.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import {showConfirmModal} from '@/store/globalConfirmModalStore';
    import Tabs from '@/components/tabs/Tabs.vue';
    import erdiagramPlaygroundConfigManager from '@/config/ERDiagramPlaygroundConfigManager';
    import Button from '@/components/generic/form/Button.vue';
    import Tab from '@/components/tabs/Tab.vue';
    import OtherTabContent from '@/components/config-modal/OtherTabContent.vue';
    import MysqlTabContent from '@/components/config-modal/database/MysqlTabContent.vue';
    import OracleTabContent from '@/components/config-modal/database/OracleTabContent.vue';
    import SqlServerTabContent from '@/components/config-modal/database/SqlServerTabContent.vue';
    import JavaTabContent from '@/components/config-modal/JavaTabContent.vue';
    import TypeScriptTabContent from '@/components/config-modal/TypeScriptTabContent.vue';

    interface Props {
        showing: boolean;
        config: ERDiagramPlaygroundConfig;
    }

    interface SelectInputOption<T> {
        text: string;
        value: T;
    }

    export default defineComponent({
        name: 'ConfigModal',
        emits: [
            'update:showing',
            'update:config',
            'update:selectedTabIndex'
        ],
        components: {
            TypeScriptTabContent,
            JavaTabContent,
            SqlServerTabContent,
            OracleTabContent,
            MysqlTabContent,
            OtherTabContent,
            Tab,
            Button,
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
            selectedTabIndex: {
                type: Number,
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
                if (await confirmRestoreDefaultConfig()) {
                    internalConfig.value = erdiagramPlaygroundConfigManager.getDefaultConfig();
                }
            }

            function confirmRestoreDefaultConfig() {
                return showConfirmModal({
                    title: 'Do you really want restore the default values?',
                    acceptButtonText: 'Yes, go ahead',
                    cancelButtonText: 'No, take me back'
                });
            }

            return {
                internalConfig,
                configChanged,
                onModalShowingChange,
                saveChanges,
                restoreDefaultConfig,
                close
            };

        }
    });
</script>
