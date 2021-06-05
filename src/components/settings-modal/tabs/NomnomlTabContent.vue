<template>
    <SettingsTabSection title="Nomnoml settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        v-for="settingDescription in settingsDescription"
                        :key="settingDescription.name"
                        :description="settingDescription.description"
                        @restore-default="config.nomnoml[settingDescription.name] = defaultERModelToCodeConverterConfig[settingDescription.name]"
                >
                    <input
                            v-if="settingDescription.type === 'string'"
                            type="text"
                            class="input"
                            placeholder="(use Nomnoml default)"
                            v-model="config.nomnoml[settingDescription.name]"
                    >
                    <input
                            v-else-if="settingDescription.type === 'number'"
                            type="text"
                            class="input"
                            placeholder="(use Nomnoml default)"
                            v-model.number="config.nomnoml[settingDescription.name]"
                    >
                    <label
                            v-else-if="settingDescription.type === 'boolean'"
                            class="checkbox"
                    >
                        <input
                                type="checkbox"
                                v-model="config.nomnoml[settingDescription.name]"
                                class="mr-1"
                        >
                    </label>
                    <SelectInput
                            v-else-if="settingDescription.type === 'enum'"
                            :items="[undefined, ...settingDescription.values]"
                            empty-value-text="(use Nomnoml default)"
                            v-model="config.nomnoml[settingDescription.name]"
                            block
                    ></SelectInput>
                </SettingRow>
            </tbody>
        </table>

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager} from '@nestorrente/erdiagram';
    import SettingsTabSection from '@/components/settings-modal/tabs/SettingsTabSection.vue';
    import SettingRow from '@/components/settings-modal/tabs/SettingRow.vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';

    interface SettingDescription {
        name: string;
        description: string;
        type: string;
        values?: any[];
    }

    export default defineComponent({
        name: 'NomnomlTabContent',
        components: {
            SelectInput,
            SettingRow,
            SettingsTabSection
        },
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup() {

            const settingsDescription: SettingDescription[] = [
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

            const defaultERModelToCodeConverterConfig = nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.getDefaultConfig();

            return {
                settingsDescription,
                defaultERModelToCodeConverterConfig
            };

        }
    });
</script>
