<template>
    <SettingsTabSection title="Java settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <tr>
                    <td class="setting-description">
                        Generated classes package:
                    </td>
                    <td class="setting-value">
                        <input
                                type="text"
                                class="input"
                                v-model="config.java.classModelToCodeConverterConfig.generatedClassesPackage"
                                placeholder="com.example"
                        >
                    </td>
                    <td style="width: 58px">
                        <Button
                                title="Restore default value"
                                rounded
                                small
                                icon="fas fa-undo-alt"
                                @click="config.java.classModelToCodeConverterConfig.generatedClassesPackage = defaultClassModelToCodeConverterConfig.generatedClassesPackage"
                        ></Button>
                    </td>
                </tr>
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
                                @click="config.java.classModelGeneratorConfig.idNamingStrategy = defaultClassModelGeneratorConfig.idNamingStrategy"
                        ></Button>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Use Spring @Nullable and @NotNull annotations:
                    </td>
                    <td class="setting-value">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="config.java.classModelToCodeConverterConfig.useSpringNullabilityAnnotations"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                    <td style="width: 58px">
                        <Button
                                title="Restore default value"
                                rounded
                                small
                                icon="fas fa-undo-alt"
                                @click="config.java.classModelToCodeConverterConfig.useSpringNullabilityAnnotations = defaultClassModelToCodeConverterConfig.useSpringNullabilityAnnotations"
                        ></Button>
                    </td>
                </tr>
            </tbody>
        </table>

        <TypeBindingsTable
                target-lang="Java"
                :type-bindings="config.java.classModelToCodeConverterConfig.typeBindings"
                :default-type-bindings="defaultClassModelToCodeConverterConfig.typeBindings"
                :display-function="formatJavaType"
                :parse-function="parseJavaType"
        />

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {
        classModelGeneratorConfigManager,
        IdNamingStrategy,
        javaClassModelToCodeConverterConfigManager,
        JavaType,
        parseJavaType,
        StandardIdNamingStrategies
    } from '@nestorrente/erdiagram';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import Button from '@/components/generic/form/Button.vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'JavaTabContent',
        components: {SelectInput, Button, SettingsTabSection, TypeBindingsTable},
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps) {

            const props = uncastedProps as Props;

            const formatJavaType = (javaType: JavaType) => javaType.formatCanonical();

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
                    () => props.config.java.classModelGeneratorConfig.idNamingStrategy,
                    newValue => props.config.java.classModelGeneratorConfig.idNamingStrategy = newValue
            );

            const defaultClassModelGeneratorConfig = classModelGeneratorConfigManager.getDefaultConfig();
            const defaultClassModelToCodeConverterConfig = javaClassModelToCodeConverterConfigManager.getDefaultConfig();

            return {
                parseJavaType,
                formatJavaType,
                idNamingStrategyOptions,
                selectedIdNamingStrategyOption,
                defaultClassModelGeneratorConfig,
                defaultClassModelToCodeConverterConfig
            };

        }
    });
</script>
