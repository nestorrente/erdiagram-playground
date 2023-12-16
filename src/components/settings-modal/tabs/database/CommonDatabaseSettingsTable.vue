<template>
    <table class="table is-fullwidth is-striped is-hoverable settings-table">
        <tbody>
            <!-- TODO extract this to a component that represents the database model config -->
            <SettingRow
                    description="Plural table names"
                    @restore-default="databaseModelConfig.usePluralTableNames = defaultDatabaseModelConfig.usePluralTableNames"
            >
                <label class="checkbox">
                    <input
                            type="checkbox"
                            v-model="databaseModelConfig.usePluralTableNames"
                            class="mr-1"
                    >
                </label>
            </SettingRow>
            <IdNamingStrategySettingRow :config="databaseModelConfig"/>
            <!-- TODO extract this to a component that represents the table and column case format selectors -->
            <SettingRow
                    description="Table name case format"
                    @restore-default="sqlDialectConfig.tableNameCaseFormat = defaultSqlDialectConfig.tableNameCaseFormat"
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
                    @restore-default="sqlDialectConfig.columnNameCaseFormat = defaultSqlDialectConfig.columnNameCaseFormat"
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
    import {defineComponent, PropType} from 'vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import {
        CaseFormat,
        DatabaseModelConfig,
        databaseModelConfigManager,
        SqlDialectConfig,
        StandardCaseFormats
    } from '@nestorrente/erdiagram';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import SettingRow from '@/components/settings-modal/tabs/SettingRow.vue';
    import IdNamingStrategySettingRow
        from '@/components/settings-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';

    export default defineComponent({
        name: 'CommonDatabaseSettingsTable',
        components: {
            IdNamingStrategySettingRow,
            SettingRow,
            SelectInput
        },
        props: {
            databaseModelConfig: {
                type: Object as PropType<DatabaseModelConfig>,
                required: true
            },
            sqlDialectConfig: {
                type: Object as PropType<SqlDialectConfig>,
                required: true
            },
            defaultSqlDialectConfig: {
                type: Object as PropType<SqlDialectConfig>,
                required: true
            }
        },
        setup(props) {

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
                    () => props.sqlDialectConfig.tableNameCaseFormat,
                    newValue => props.sqlDialectConfig.tableNameCaseFormat = newValue
            );

            const selectedColumnNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.sqlDialectConfig.columnNameCaseFormat,
                    newValue => props.sqlDialectConfig.columnNameCaseFormat = newValue
            );

            const defaultDatabaseModelConfig = databaseModelConfigManager.getDefaultConfig();

            return {
                caseFormatOptions,
                selectedTableNameCaseFormatOption,
                selectedColumnNameCaseFormatOption,
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
