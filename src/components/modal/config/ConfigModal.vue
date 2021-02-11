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
                        append-tabs-class="vfc-item mb-0"
                        append-tabs-content-class="vfc-item vfc-grow"
                        append-tabs-content-style="overflow-y: auto"
                >
                    <Tab title="General">
                        <GeneralTabContent :config="internalConfig"/>
                    </Tab>
                    <Tab title="Type bindings">
                        <TypeBindingsTabContent :config="internalConfig"/>
                    </Tab>
                </Tabs>
            </div>

        </template>
        <template #footer>
            <div class="has-text-right">
                <Button color="success" @click="saveChanges">
                    Save changes
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
    import Modal from '@/components/modal/Modal.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import {showConfirmModal} from '@/store/globalConfirmModalStore';
    import Tabs from '@/components/tabs/Tabs.vue';
    import erdiagramPlaygroundConfigManager from '@/config/ERDiagramPlaygroundConfigManager';
    import Button from '@/components/Button.vue';
    import Tab from '@/components/tabs/Tab.vue';
    import GeneralTabContent from '@/components/modal/config/GeneralTabContent.vue';
    import TypeBindingsTabContent from '@/components/modal/config/TypeBindingsTabContent.vue';

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
        components: {
            TypeBindingsTabContent,
            GeneralTabContent,
            Tab,
            Button,
            Tabs,
            Modal
        },
        emits: ['update:showing', 'update:config'],
        props: {
            showing: {
                type: Boolean,
                default: false
            },
            config: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps, context) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const internalConfig = ref(erdiagramPlaygroundConfigManager.getDefaultConfig());

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

            return {
                internalConfig,
                configChanged,
                onModalShowingChange,
                saveChanges,
                close
            };

        }
    });
</script>

<style lang="scss">
    .settings-tab-section {
        padding-top: 1.5em;
        padding-bottom: 1.5em;
    }
</style>
