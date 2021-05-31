<template>
    <SettingsTabSection title="Java settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        description="Generated classes package"
                        @restore-default="config.java.code.generatedClassesPackage = defaultJavaClassModelGeneratorConfig.generatedClassesPackage"
                >
                    <input
                            type="text"
                            class="input"
                            v-model="config.java.code.generatedClassesPackage"
                            placeholder="com.example"
                    >
                </SettingRow>
                <IdNamingStrategySettingRow :config="config.java.classModel"/>
            </tbody>
        </table>

        <h3 class="is-size-5 mb-5 has-text-weight-bold">Java Validation API (JSR-303)</h3>

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        description="Use validation annotations"
                        @restore-default="config.java.transformers.validation.enabled = false"
                >
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                v-model="config.java.transformers.validation.enabled"
                                class="mr-1"
                        >
                    </label>
                </SettingRow>
                <!-- TODO disable other settings when enabled=false -->
                <SettingRow
                        description="Not-null text validation strategy"
                        @restore-default="config.java.transformers.validation.config.notNullTextValidationStrategy = defaultJavaxValidationTransformerConfig.notNullTextValidationStrategy"
                >
                    <SelectInput
                            :items="notNullTextValidationStrategyOptions"
                            v-model="selectedNotNullTextValidationStrategyOption"
                            text-field="text"
                            id-field="text"
                            block
                    ></SelectInput>
                </SettingRow>
                <SettingRow
                        description="Not-null blob validation strategy"
                        @restore-default="config.java.transformers.validation.config.notNullBlobValidationStrategy = defaultJavaxValidationTransformerConfig.notNullBlobValidationStrategy"
                >
                    <SelectInput
                            :items="notNullBlobValidationStrategyOptions"
                            v-model="selectedNotNullBlobValidationStrategyOption"
                            text-field="text"
                            id-field="text"
                            block
                    ></SelectInput>
                </SettingRow>
                <SettingRow
                        description="Annotate getters instead of fields"
                        @restore-default="config.java.transformers.validation.config.annotateGetters = defaultJavaxValidationTransformerConfig.annotateGetters"
                >
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                v-model="config.java.transformers.validation.config.annotateGetters"
                                class="mr-1"
                        >
                    </label>
                </SettingRow>
            </tbody>
        </table>

        <h3 class="is-size-5 mb-5 has-text-weight-bold">JPA</h3>

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        description="Use JPA annotations"
                        @restore-default="config.java.transformers.jpa.enabled = false"
                >
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                v-model="config.java.transformers.jpa.enabled"
                                class="mr-1"
                        >
                    </label>
                </SettingRow>
                <!-- TODO disable other settings when enabled=false -->
                <!-- TODO extract this to a component that represents the database model config -->
                <SettingRow
                        description="Plural table names"
                        @restore-default="config.java.transformers.jpa.databaseModel.usePluralTableNames = defaultDatabaseModelConfig.usePluralTableNames"
                >
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                v-model="config.java.transformers.jpa.databaseModel.usePluralTableNames"
                                class="mr-1"
                        >
                    </label>
                </SettingRow>
                <IdNamingStrategySettingRow :config="config.java.transformers.jpa.databaseModel"/>
                <!-- TODO extract this to a component that represents the table and column case format selectors -->
                <SettingRow
                        description="Table name case format"
                        @restore-default="config.java.transformers.jpa.config.tableNameCaseFormat = defaultJpaTransformerConfig.tableNameCaseFormat"
                >
                    <SelectInput
                            :items="caseFormatOptions"
                            v-model="selectedTableNameCaseFormatOption"
                            text-field="text"
                            id-field="text"
                            block
                    ></SelectInput>
                </SettingRow>
                <SettingRow
                        description="Column name case format"
                        @restore-default="config.java.transformers.jpa.config.columnNameCaseFormat = defaultJpaTransformerConfig.columnNameCaseFormat"
                >
                    <SelectInput
                            :items="caseFormatOptions"
                            v-model="selectedColumnNameCaseFormatOption"
                            text-field="text"
                            id-field="text"
                            block
                    ></SelectInput>
                </SettingRow>
                <SettingRow
                        description="Annotate getters instead of fields"
                        @restore-default="config.java.transformers.jpa.config.annotateGetters = defaultJavaxValidationTransformerConfig.annotateGetters"
                >
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                v-model="config.java.transformers.jpa.config.annotateGetters"
                                class="mr-1"
                        >
                    </label>
                </SettingRow>
            </tbody>
        </table>

        <TypeBindingsTable
                target-lang="Java"
                :type-bindings="config.java.code.typeBindings"
                :default-type-bindings="defaultJavaClassModelGeneratorConfig.typeBindings"
                :display-function="formatJavaType"
                :parse-function="parseJavaType"
        />

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {
        CaseFormat,
        classModelGeneratorConfigManager,
        databaseModelGeneratorConfigManager,
        javaClassModelGeneratorConfigManager,
        JavaType,
        javaxValidationTransformerConfigManager,
        jpaTransformerConfigManager,
        NotNullBlobValidationStrategy,
        NotNullTextValidationStrategy,
        parseJavaType,
        StandardCaseFormats
    } from '@nestorrente/erdiagram';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import SettingRow from '@/components/config-modal/tabs/SettingRow.vue';
    import IdNamingStrategySettingRow from '@/components/config-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import SelectInput from '@/components/generic/form/SelectInput.vue';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'JavaTabContent',
        components: {
            SelectInput,
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

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const formatJavaType = (javaType: JavaType) => javaType.formatCanonical();

            const defaultClassModelGeneratorConfig = classModelGeneratorConfigManager.getDefaultConfig();
            const defaultJavaClassModelGeneratorConfig = javaClassModelGeneratorConfigManager.getDefaultConfig();
            const defaultJavaxValidationTransformerConfig = javaxValidationTransformerConfigManager.getDefaultConfig();
            const defaultJpaTransformerConfig = jpaTransformerConfigManager.getDefaultConfig();

            const notNullTextValidationStrategyOptions: SelectInputOption<NotNullTextValidationStrategy>[] = [
                {
                    text: '@NotNull',
                    value: NotNullTextValidationStrategy.NOT_NULL
                },
                {
                    text: '@NotEmpty',
                    value: NotNullTextValidationStrategy.NOT_EMPTY
                },
                {
                    text: '@NotBlank',
                    value: NotNullTextValidationStrategy.NOT_BLANK
                }
            ];

            const selectedNotNullTextValidationStrategyOption = useSelectInputOptions(
                    notNullTextValidationStrategyOptions,
                    () => props.config.java.transformers.validation.config.notNullTextValidationStrategy,
                    newValue => props.config.java.transformers.validation.config.notNullTextValidationStrategy = newValue
            );

            const notNullBlobValidationStrategyOptions: SelectInputOption<NotNullBlobValidationStrategy>[] = [
                {
                    text: '@NotNull',
                    value: NotNullBlobValidationStrategy.NOT_NULL
                },
                {
                    text: '@NotEmpty',
                    value: NotNullBlobValidationStrategy.NOT_EMPTY
                }
            ];

            const selectedNotNullBlobValidationStrategyOption = useSelectInputOptions(
                    notNullBlobValidationStrategyOptions,
                    () => props.config.java.transformers.validation.config.notNullBlobValidationStrategy,
                    newValue => props.config.java.transformers.validation.config.notNullBlobValidationStrategy = newValue
            );

            // FIXME this is duplicated from CommonDatabaseSettingsTable
            const caseFormatOptions: SelectInputOption<CaseFormat>[] = [
                {
                    text: 'UpperCammelCase',
                    value: StandardCaseFormats.UPPER_CAMEL
                },
                {
                    text: 'lowerCammelCase',
                    value: StandardCaseFormats.LOWER_CAMEL
                },
                {
                    text: 'UPPER_UNDERSCORE_CASE',
                    value: StandardCaseFormats.UPPER_UNDERSCORE
                },
                {
                    text: 'lower_underscore_case',
                    value: StandardCaseFormats.LOWER_UNDERSCORE
                },
                {
                    text: 'Capitalized_Underscore_Case',
                    value: StandardCaseFormats.CAPITALIZED_UNDERSCORE
                }
            ];

            const selectedTableNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.config.java.transformers.jpa.config.tableNameCaseFormat,
                    newValue => props.config.java.transformers.jpa.config.tableNameCaseFormat = newValue
            );

            const selectedColumnNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.config.java.transformers.jpa.config.columnNameCaseFormat,
                    newValue => props.config.java.transformers.jpa.config.columnNameCaseFormat = newValue
            );

            const defaultDatabaseModelConfig = databaseModelGeneratorConfigManager.getDefaultConfig();

            return {
                parseJavaType,
                formatJavaType,
                notNullTextValidationStrategyOptions,
                selectedNotNullTextValidationStrategyOption,
                notNullBlobValidationStrategyOptions,
                selectedNotNullBlobValidationStrategyOption,
                defaultClassModelGeneratorConfig,
                defaultJavaClassModelGeneratorConfig,
                defaultJavaxValidationTransformerConfig,
                defaultJpaTransformerConfig,
                caseFormatOptions,
                selectedTableNameCaseFormatOption,
                selectedColumnNameCaseFormatOption,
                defaultDatabaseModelConfig
            };

        }
    });
</script>
