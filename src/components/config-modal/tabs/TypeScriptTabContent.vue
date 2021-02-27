<template>
    <SettingsTabSection title="TypeScript settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <tr>
                    <td class="setting-description">
                        ID naming strategy:
                    </td>
                    <td class="setting-value">
                        <SelectInput
                                :items="idNamingStrategyOptions"
                                v-model="selectedIdNamingStrategyOption"
                                text-field="text"
                                id-field="value"
                                block
                        ></SelectInput>
                    </td>
                    <td style="width: 58px">
                        <Button
                                title="Restore default value"
                                rounded
                                small
                                icon="fas fa-undo-alt"
                                @click="config.typescript.classModelGeneratorConfig.idNamingStrategy = defaultClassModelGeneratorConfig.idNamingStrategy"
                        ></Button>
                    </td>
                </tr>
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
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import Button from '@/components/generic/form/Button.vue';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'TypeScriptTabContent',
        components: {Button, SelectInput, SettingsTabSection, TypeBindingsTable},
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
