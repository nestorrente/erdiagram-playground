<template>
    <Modal
            title="Configuration"
            :showing="showing"
            @update:showing="$emit('update:showing', $event)"
    >
        <template #default>

            <pre style="font-size: 0.5em" v-text="config"></pre>

            <h2 class="is-size-5 has-text-weight-bold mb-3">Pepe</h2>

            <div class="field">
                <div class="control">
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                :checked="config.erModel.allowUnknownEntities"
                                @input="$emit('update:config', {
                                    ...config,
                                    erModel: {
                                        ...config.erModel,
                                        allowUnknownEntities: true
                                    }
                                })"
                        >
                        Allow unknown entities
                    </label>
                </div>
            </div>

        </template>
        <template #footer>
            <div class="has-text-right" style="width: 100%">
                <button
                        class="button is-success"
                >
                    Save changes
                </button>
                <button
                        class="button"
                        @click="$emit('update:showing', false)"
                >
                    Cancel
                </button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Modal from '@/components/Modal.vue';
    import ERDiagramPlaygroundConfig from '@/ERDiagramPlaygroundConfig';

    interface Props {
        title: string;
        showing: boolean;
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'ConfigModal',
        components: {
            Modal
        },
        emits: ['update:showing', 'update:config'],
        props: {
            title: {
                type: String,
                required: true
            },
            showing: {
                type: Boolean,
                default: false
            },
            config: {
                type: Object,
                required: true
            }
        },
        setup() {

            // const internalConfig = mergeERDiagramPlagroundConfigs()
            // mergeERDiagramPlagroundConfigs()
            return {};

        }
    });
</script>
