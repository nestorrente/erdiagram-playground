<template>
    <SettingsTabSection title="Nomnoml settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        description="Generated classes package"
                        @restore-default="config.nomnoml.background = defaultERModelToCodeConverterConfig.background"
                >
                    <input
                            type="text"
                            class="input"
                            v-model="config.nomnoml.background"
                    >
                </SettingRow>
            </tbody>
        </table>

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager, parseTypeScriptType, TypeScriptType} from '@nestorrente/erdiagram';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'NomnomlTabContent',
        components: {
            SettingsTabSection
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

            const formatTypeScriptType = (typeScriptType: TypeScriptType) => typeScriptType.format();

            // const idNamingStrategyOptions: SelectInputOption<IdNamingStrategy>[] = [
            //     {
            //         text: 'Default ("id")',
            //         value: StandardIdNamingStrategies.DEFAULT
            //     },
            //     {
            //         text: 'Prefix entity name ("userId")',
            //         value: StandardIdNamingStrategies.ENTITY_NAME_PREFIX
            //     }
            // ];
            //
            // const selectedIdNamingStrategyOption = useSelectInputOptions(
            //         idNamingStrategyOptions,
            //         () => props.config.typescript.classModelGeneratorConfig.idNamingStrategy,
            //         newValue => props.config.typescript.classModelGeneratorConfig.idNamingStrategy = newValue
            // );

            const defaultERModelToCodeConverterConfig = nomnomlEntityRelationshipModelToDiagramCodeConverterConfigManager.getDefaultConfig();

            return {
                parseTypeScriptType,
                formatTypeScriptType,
                // idNamingStrategyOptions,
                // selectedIdNamingStrategyOption,
                defaultERModelToCodeConverterConfig
            };

        }
    });
</script>
