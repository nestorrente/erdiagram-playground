<template>
    <SettingsTabSection title="Java settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        description="Generated classes package"
                        @restore-default="config.java.classModelToCodeConverterConfig.generatedClassesPackage = defaultClassModelToCodeConverterConfig.generatedClassesPackage"
                >
                    <input
                            type="text"
                            class="input"
                            v-model="config.java.classModelToCodeConverterConfig.generatedClassesPackage"
                            placeholder="com.example"
                    >
                </SettingRow>
                <IdNamingStrategySettingRow :config="config.java.classModelGeneratorConfig"/>
                <SettingRow
                        description="Use Spring @Nullable and @NotNull annotations"
                        @restore-default="config.java.classModelToCodeConverterConfig.useSpringNullabilityAnnotations = defaultClassModelToCodeConverterConfig.useSpringNullabilityAnnotations"
                >
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                v-model="config.java.classModelToCodeConverterConfig.useSpringNullabilityAnnotations"
                                class="mr-1"
                        >
                    </label>
                </SettingRow>
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
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import SettingRow from '@/components/config-modal/tabs/SettingRow.vue';
    import IdNamingStrategySettingRow from '@/components/config-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'JavaTabContent',
        components: {
            IdNamingStrategySettingRow,
            SettingRow,
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
