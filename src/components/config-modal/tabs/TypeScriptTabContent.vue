<template>
    <SettingsTabSection title="TypeScript settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <IdNamingStrategySettingRow :config="config.typescript.classModelGeneratorConfig"/>
            </tbody>
        </table>

        <TypeBindingsTable
                target-lang="TypeScript"
                :type-bindings="config.typescript.classModelToCodeConverterConfig.typeBindings"
                :default-type-bindings="defaultClassModelToCodeConverterConfig.typeBindings"
                :display-function="formatTypeScriptType"
                :parse-function="parseTypeScriptType"
        />

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {
        classModelGeneratorConfigManager,
        IdNamingStrategy,
        parseTypeScriptType,
        StandardIdNamingStrategies,
        typescriptClassModelToCodeConverterConfigManager,
        TypeScriptType
    } from '@nestorrente/erdiagram';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import IdNamingStrategySettingRow from '@/components/config-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'TypeScriptTabContent',
        components: {
            IdNamingStrategySettingRow,
            SettingsTabSection,
            TypeBindingsTable
        },
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps) {

            const props = uncastedProps as Props;

            const formatTypeScriptType = (typeScriptType: TypeScriptType) => typeScriptType.format();

            const idNamingStrategyOptions: SelectInputOption<IdNamingStrategy>[] = [
                {
                    text: 'Default ("id")',
                    value: StandardIdNamingStrategies.DEFAULT
                },
                {
                    text: 'Prefix entity name ("userId")',
                    value: StandardIdNamingStrategies.ENTITY_NAME_PREFIX
                }
            ];

            const selectedIdNamingStrategyOption = useSelectInputOptions(
                    idNamingStrategyOptions,
                    () => props.config.typescript.classModelGeneratorConfig.idNamingStrategy,
                    newValue => props.config.typescript.classModelGeneratorConfig.idNamingStrategy = newValue
            );

            const defaultClassModelGeneratorConfig = classModelGeneratorConfigManager.getDefaultConfig();
            const defaultClassModelToCodeConverterConfig = typescriptClassModelToCodeConverterConfigManager.getDefaultConfig();

            return {
                parseTypeScriptType,
                formatTypeScriptType,
                idNamingStrategyOptions,
                selectedIdNamingStrategyOption,
                defaultClassModelGeneratorConfig,
                defaultClassModelToCodeConverterConfig
            };

        }
    });
</script>
