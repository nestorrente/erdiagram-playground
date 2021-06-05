<template>
    <SettingsTabSection title="Java settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <SettingRow
                        description="Generated classes package"
                        @restore-default="config.java.code.generatedClassesPackage = defaultJavaClassModelConfig.generatedClassesPackage"
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
                    <BlockCheckbox
                            v-model="config.java.transformers.validation.enabled"
                    />
                </SettingRow>
                <SettingRow
                        description="Not-null text validation strategy"
                        :disabled="!config.java.transformers.validation.enabled"
                        @restore-default="config.java.transformers.validation.config.notNullTextValidationStrategy = defaultBeanValidationConfig.notNullTextValidationStrategy"
                >
                    <SelectInput
                            :items="notNullTextValidationStrategyOptions"
                            v-model="selectedNotNullTextValidationStrategyOption"
                            text-field="text"
                            id-field="text"
                            block
                            :disabled="!config.java.transformers.validation.enabled"
                    ></SelectInput>
                </SettingRow>
                <SettingRow
                        description="Not-null blob validation strategy"
                        :disabled="!config.java.transformers.validation.enabled"
                        @restore-default="config.java.transformers.validation.config.notNullBlobValidationStrategy = defaultBeanValidationConfig.notNullBlobValidationStrategy"
                >
                    <SelectInput
                            :items="notNullBlobValidationStrategyOptions"
                            v-model="selectedNotNullBlobValidationStrategyOption"
                            text-field="text"
                            id-field="text"
                            block
                            :disabled="!config.java.transformers.validation.enabled"
                    ></SelectInput>
                </SettingRow>
                <SettingRow
                        description="Move annotations to getter methods"
                        :disabled="!config.java.transformers.validation.enabled"
                        @restore-default="config.java.transformers.validation.config.annotateGetters = defaultBeanValidationConfig.annotateGetters"
                >
                    <BlockCheckbox
                            v-model="config.java.transformers.validation.config.annotateGetters"
                            :disabled="!config.java.transformers.validation.enabled"
                    />
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
                    <BlockCheckbox
                            v-model="config.java.transformers.jpa.enabled"
                    />
                </SettingRow>
                <SettingRow
                        description="Table name case format"
                        :disabled="!config.java.transformers.jpa.enabled"
                        @restore-default="config.java.transformers.jpa.config.tableNameCaseFormat = defaultJpaConfig.tableNameCaseFormat"
                >
                    <SelectInput
                            :items="caseFormatOptions"
                            v-model="selectedTableNameCaseFormatOption"
                            text-field="text"
                            id-field="text"
                            block
                            :disabled="!config.java.transformers.jpa.enabled"
                    ></SelectInput>
                </SettingRow>
                <SettingRow
                        description="Column name case format"
                        :disabled="!config.java.transformers.jpa.enabled"
                        @restore-default="config.java.transformers.jpa.config.columnNameCaseFormat = defaultJpaConfig.columnNameCaseFormat"
                >
                    <SelectInput
                            :items="caseFormatOptions"
                            v-model="selectedColumnNameCaseFormatOption"
                            text-field="text"
                            id-field="text"
                            block
                            :disabled="!config.java.transformers.jpa.enabled"
                    ></SelectInput>
                </SettingRow>
                <IdNamingStrategySettingRow
                        :config="config.java.transformers.jpa.databaseModel"
                        description="ID column naming strategy"
                        :disabled="!config.java.transformers.jpa.enabled"
                />
                <SettingRow
                        description="Use explicit table names"
                        :disabled="!config.java.transformers.jpa.enabled"
                        @restore-default="config.java.transformers.jpa.config.useExplicitTableName = false"
                >
                    <BlockCheckbox
                            v-model="config.java.transformers.jpa.config.useExplicitTableName"
                            :disabled="!config.java.transformers.jpa.enabled"
                    />
                </SettingRow>
                <SettingRow
                        description="Plural table names"
                        :disabled="!config.java.transformers.jpa.enabled || !config.java.transformers.jpa.config.useExplicitTableName"
                        @restore-default="config.java.transformers.jpa.databaseModel.usePluralTableNames = defaultDatabaseModelConfig.usePluralTableNames"
                >
                    <BlockCheckbox
                            v-model="config.java.transformers.jpa.databaseModel.usePluralTableNames"
                            :disabled="!config.java.transformers.jpa.enabled || !config.java.transformers.jpa.config.useExplicitTableName"
                    />
                </SettingRow>
                <SettingRow
                        description="Use explicit column names"
                        :disabled="!config.java.transformers.jpa.enabled"
                        @restore-default="config.java.transformers.jpa.config.useExplicitColumnName = false"
                >
                    <BlockCheckbox
                            v-model="config.java.transformers.jpa.config.useExplicitColumnName"
                            :disabled="!config.java.transformers.jpa.enabled"
                    />
                </SettingRow>
                <SettingRow
                        description="Move annotations to getter methods"
                        :disabled="!config.java.transformers.jpa.enabled"
                        @restore-default="config.java.transformers.jpa.config.annotateGetters = defaultBeanValidationConfig.annotateGetters"
                >
                    <BlockCheckbox
                            v-model="config.java.transformers.jpa.config.annotateGetters"
                            :disabled="!config.java.transformers.jpa.enabled"
                    />
                </SettingRow>
            </tbody>
        </table>

        <TypeBindingsTable
                target-lang="Java"
                :type-bindings="config.java.code.typeBindings"
                :default-type-bindings="defaultJavaClassModelConfig.typeBindings"
                :display-function="formatJavaType"
                :parse-function="parseJavaType"
        />

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {
        beanValidationConfigManager,
        CaseFormat,
        classModelConfigManager,
        databaseModelConfigManager,
        javaClassModelConfigManager,
        JavaType,
        jpaConfigManager,
        NotNullBlobValidationStrategy,
        NotNullTextValidationStrategy,
        parseJavaType,
        StandardCaseFormats
    } from '@nestorrente/erdiagram';
    import TypeBindingsTable from '@/components/settings-modal/tabs/TypeBindingsTable.vue';
    import SettingsTabSection from '@/components/settings-modal/tabs/SettingsTabSection.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import SettingRow from '@/components/settings-modal/tabs/SettingRow.vue';
    import IdNamingStrategySettingRow
        from '@/components/settings-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import BlockCheckbox from '@/components/generic/form/BlockCheckbox.vue';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'JavaTabContent',
        components: {
            BlockCheckbox,
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

            const defaultClassModelConfig = classModelConfigManager.getDefaultConfig();
            const defaultJavaClassModelConfig = javaClassModelConfigManager.getDefaultConfig();
            const defaultBeanValidationConfig = beanValidationConfigManager.getDefaultConfig();
            const defaultJpaConfig = jpaConfigManager.getDefaultConfig();

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

            const defaultDatabaseModelConfig = databaseModelConfigManager.getDefaultConfig();

            return {
                parseJavaType,
                formatJavaType,
                notNullTextValidationStrategyOptions,
                selectedNotNullTextValidationStrategyOption,
                notNullBlobValidationStrategyOptions,
                selectedNotNullBlobValidationStrategyOption,
                defaultClassModelConfig,
                defaultJavaClassModelConfig,
                defaultBeanValidationConfig,
                defaultJpaConfig,
                caseFormatOptions,
                selectedTableNameCaseFormatOption,
                selectedColumnNameCaseFormatOption,
                defaultDatabaseModelConfig
            };

        }
    });
</script>
