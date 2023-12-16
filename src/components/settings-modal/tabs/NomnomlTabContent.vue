<template>
    <SettingsTabSection title="Nomnoml settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <DiagramLevelSettingRow :config="config.nomnoml" />
            </tbody>
        </table>

        <h3 class="is-size-5 mb-5 has-text-weight-bold">Style directives</h3>

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        v-for="settingDescription in styleSettingsDescription"
                        :key="settingDescription.name"
                        :description="settingDescription.description"
                        @restore-default="resetSetting(settingDescription.name)"
                >
                    <input
                            v-if="settingDescription.type === 'string'"
                            type="text"
                            class="input"
                            placeholder="(use Nomnoml's default)"
                            v-model="config.nomnoml.style[settingDescription.name]"
                    >
                    <input
                            v-else-if="settingDescription.type === 'number'"
                            type="text"
                            class="input"
                            placeholder="(use Nomnoml's default)"
                            v-model.number="config.nomnoml.style[settingDescription.name]"
                    >
                    <label
                            v-else-if="settingDescription.type === 'boolean'"
                            class="checkbox"
                    >
                        <input
                                type="checkbox"
                                v-model="config.nomnoml.style[settingDescription.name]"
                                class="mr-1"
                        >
                    </label>
                    <SelectInput
                            v-else-if="settingDescription.type === 'enum'"
                            :items="[undefined, ...settingDescription.values]"
                            empty-value-text="(use Nomnoml's default)"
                            v-model="config.nomnoml.style[settingDescription.name]"
                            block
                    ></SelectInput>
                </SettingRow>
            </tbody>
        </table>

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent, PropType} from 'vue';
    import {DiagramLevel, nomnomlConfigManager, NomnomlStyleConfig} from '@nestorrente/erdiagram';
    import SettingsTabSection from '@/components/settings-modal/tabs/SettingsTabSection.vue';
    import SettingRow from '@/components/settings-modal/tabs/SettingRow.vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import DiagramLevelSettingRow from '@/components/settings-modal/tabs/common-rows/DiagramLevelSettingRow.vue';

    interface NomnomlSettingDescription {
        name: keyof NomnomlStyleConfig;
        description: string;
        type: string;
        values?: any[];
    }

    export default defineComponent({
        name: 'NomnomlTabContent',
        components: {
            DiagramLevelSettingRow,
            SelectInput,
            SettingRow,
            SettingsTabSection
        },
        props: {
            config: {
                type: Object as PropType<ERDiagramPlaygroundConfig>,
                required: true
            }
        },
        setup(props) {

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
                () => props.config.nomnoml.diagramLevel,
                newValue => props.config.nomnoml.diagramLevel = newValue
            );

            const styleSettingsDescription: NomnomlSettingDescription[] = [
                {name: 'arrowSize', description: 'Arrow size', type: 'number'},
                {name: 'bendSize', description: 'Bend size', type: 'number'},
                {name: 'direction', description: 'Direction', type: 'enum', values: ['down', 'right']},
                {name: 'gutter', description: 'Gutter', type: 'number'},
                {name: 'edgeMargin', description: 'Edge margin', type: 'number'},
                {name: 'gravity', description: 'Gravity', type: 'number'},
                {name: 'edges', description: 'Edges', type: 'enum', values: ['hard', 'rounded']},
                {name: 'background', description: 'Background', type: 'string'},
                {name: 'fill', description: 'Fill', type: 'string'},
                {name: 'fillArrows', description: 'Fill arrows', type: 'boolean'},
                {name: 'font', description: 'Font', type: 'string'},
                {name: 'fontSize', description: 'Font size', type: 'number'},
                {name: 'leading', description: 'Leading', type: 'number'},
                {name: 'lineWidth', description: 'Line width', type: 'number'},
                {name: 'padding', description: 'Padding', type: 'number'},
                {name: 'spacing', description: 'Spacing', type: 'number'},
                {name: 'stroke', description: 'Stroke', type: 'string'},
                {name: 'title', description: 'Title', type: 'string'},
                {name: 'zoom', description: 'Zoom', type: 'number'},
                {name: 'acyclicer', description: 'Acyclicer', type: 'enum', values: ['greedy']},
                {
                    name: 'ranker',
                    description: 'Ranker',
                    type: 'enum',
                    values: ['network-simplex', 'tight-tree', 'longest-path']
                },
            ];

            const defaultNomnomlConfig = nomnomlConfigManager.getDefaultConfig();

            function resetSetting<K extends keyof NomnomlStyleConfig>(name: K) {
                props.config.nomnoml.style[name] = defaultNomnomlConfig.style[name];
            }

            return {
                diagramLevelOptions,
                selectedDiagramLevelOption,
                styleSettingsDescription,
                resetSetting
            };

        }
    });
</script>
