<template>
    <table class="table is-fullwidth is-striped is-hoverable settings-table">
        <tbody>
            <SettingRow
                    description="Plural table names"
                    @restore-default="databaseModelGeneratorConfig.usePluralTableNames = defaultDatabaseModelConfig.usePluralTableNames"
            >
                <label class="checkbox">
                    <input
                            type="checkbox"
                            v-model="databaseModelGeneratorConfig.usePluralTableNames"
                            class="mr-1"
                    >
                </label>
            </SettingRow>
            <IdNamingStrategySettingRow :config="databaseModelGeneratorConfig"/>
            <SettingRow
                    description="Table name case format"
                    @restore-default="databaseModelToCodeConverterConfig.tableNameCaseFormat = defaultSqlDialectConfig.tableNameCaseFormat"
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
                    @restore-default="databaseModelToCodeConverterConfig.columnNameCaseFormat = defaultSqlDialectConfig.columnNameCaseFormat"
            >
                <SelectInput
                        :items="caseFormatOptions"
                        v-model="selectedColumnNameCaseFormatOption"
                        text-field="text"
                        id-field="text"
                        block
                ></SelectInput>
            </SettingRow>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import {
        CaseFormat,
        DatabaseModelGeneratorConfig,
        databaseModelGeneratorConfigManager,
        IdNamingStrategy,
        SqlDialectConfig,
        StandardCaseFormats,
        StandardIdNamingStrategies
    } from '@nestorrente/erdiagram';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import SettingRow from '@/components/config-modal/tabs/SettingRow.vue';
    import IdNamingStrategySettingRow from '@/components/config-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';

    interface Props {
        databaseModelGeneratorConfig: DatabaseModelGeneratorConfig;
        databaseModelToCodeConverterConfig: SqlDialectConfig;
        defaultSqlDialectConfig: SqlDialectConfig;
    }

    export default defineComponent({
        name: 'CommonDatabaseSettingsTable',
        components: {
            IdNamingStrategySettingRow,
            SettingRow,
            SelectInput
        },
        props: {
            databaseModelGeneratorConfig: {
                type: Object,
                required: true
            },
            databaseModelToCodeConverterConfig: {
                type: Object,
                required: true
            },
            defaultSqlDialectConfig: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

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
                    () => props.databaseModelToCodeConverterConfig.tableNameCaseFormat,
                    newValue => props.databaseModelToCodeConverterConfig.tableNameCaseFormat = newValue
            );

            const selectedColumnNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.databaseModelToCodeConverterConfig.columnNameCaseFormat,
                    newValue => props.databaseModelToCodeConverterConfig.columnNameCaseFormat = newValue
            );

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
                    () => props.databaseModelGeneratorConfig.idNamingStrategy,
                    newValue => props.databaseModelGeneratorConfig.idNamingStrategy = newValue
            );

            const defaultDatabaseModelConfig = databaseModelGeneratorConfigManager.getDefaultConfig();

            return {
                caseFormatOptions,
                selectedTableNameCaseFormatOption,
                selectedColumnNameCaseFormatOption,
                idNamingStrategyOptions,
                selectedIdNamingStrategyOption,
                defaultDatabaseModelConfig
            };

        }
    });
</script>

<style lang="scss">
    .settings-table {

        font-size: 0.9em;

        td.setting-value {
            text-align: center;

            label.checkbox {
                width: 100%;
                padding: 0.5em;
            }

            .input {
                font-size: 1em;
            }

            .input[type="checkbox"] {
                $size: 1.2em;
                width: $size;
                height: $size;
            }
        }

        h2 {
            font-weight: bold;
            font-size: 1.2em;
        }

    }
</style>
