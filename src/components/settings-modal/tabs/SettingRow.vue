<template>
    <tr>
        <td class="setting-description" :class="{'disabled-setting': disabled}">
            {{ description }}:
        </td>
        <td class="setting-value">
            <slot/>
        </td>
        <td style="width: 58px">
            <Button
                    title="Restore default value"
                    rounded
                    small
                    icon="fas fa-undo-alt"
                    @click="$emit('restoreDefault')"
                    :disabled="disabled"
            ></Button>
        </td>
    </tr>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Button from '@/components/generic/form/Button.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'SettingRow',
        emits: ['restoreDefault'],
        components: {Button},
        props: {
            description: {
                type: String,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        }
    });
</script>

<style scoped>
    .disabled-setting {
        color: gray;
    }
</style>
