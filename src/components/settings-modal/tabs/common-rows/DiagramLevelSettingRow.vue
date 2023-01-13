<template>
    <SettingRow
            description="Diagram level"
            @restore-default="config.diagramLevel = defaultDiagramLevel"
    >
        <SelectInput
                :items="diagramLevelOptions"
                v-model="selectedDiagramLevelOption"
                text-field="text"
                id-field="value"
                block
        ></SelectInput>
    </SettingRow>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {DiagramLevel} from '@nestorrente/erdiagram';
    import SettingRow from '@/components/settings-modal/tabs/SettingRow.vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';

    interface Props {
        config: {
            diagramLevel: DiagramLevel;
        };
    }

    export default defineComponent({
        name: 'DiagramLevelSettingRow',
        emits: ['update:modelValue'],
        components: {
            SettingRow,
            SelectInput
        },
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const diagramLevelOptions: SelectInputOption<DiagramLevel>[] = [
                {
                    text: 'Conceptual',
                    value: DiagramLevel.CONCEPTUAL
                },
                {
                    text: 'Logical',
                    value: DiagramLevel.LOGICAL
                }
            ];

            const selectedDiagramLevelOption = useSelectInputOptions(
                diagramLevelOptions,
                () => props.config.diagramLevel,
                newValue => props.config.diagramLevel = newValue
            );

            const defaultDiagramLevel = DiagramLevel.LOGICAL;

            return {
                diagramLevelOptions,
                selectedDiagramLevelOption,
                defaultDiagramLevel
            };

        }
    });
</script>
