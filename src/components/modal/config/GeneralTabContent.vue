<template>
    <section class="section settings-tab-section">
        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <tr>
                    <td colspan="2">
                        <h2>Input code</h2>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Allow using unknown entities in relationships:
                    </td>
                    <td class="setting-value">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="config.erModel.allowUnknownEntities"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <h2>MySQL</h2>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Plural table names:
                    </td>
                    <td class="setting-value">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="config.mysqlDatabaseModel.pluralizeTableNames"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        ID naming strategy:
                    </td>
                    <td class="setting-value">
                        <SelectInput
                                :items="idNamingStrategyOptions"
                                v-model="selectedMysqlIdNamingStrategyOption"
                                text-field="text"
                                id-field="value"
                                block
                        ></SelectInput>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Table name case format:
                    </td>
                    <td class="setting-value">
                        <SelectInput
                                :items="caseFormatOptions"
                                v-model="selectedMysqlTableNameCaseFormatOption"
                                text-field="text"
                                id-field="text"
                                block
                        ></SelectInput>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Column name case format:
                    </td>
                    <td class="setting-value">
                        <SelectInput
                                :items="caseFormatOptions"
                                v-model="selectedMysqlColumnNameCaseFormatOption"
                                text-field="text"
                                id-field="text"
                                block
                        ></SelectInput>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <h2>SQL Server</h2>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Plural table names:
                    </td>
                    <td class="setting-value">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="config.sqlServerDatabaseModel.pluralizeTableNames"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        ID naming strategy:
                    </td>
                    <td class="setting-value">
                        <SelectInput
                                :items="idNamingStrategyOptions"
                                v-model="selectedSqlServerIdNamingStrategyOption"
                                text-field="text"
                                id-field="value"
                                block
                        ></SelectInput>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Table name case format:
                    </td>
                    <td class="setting-value">
                        <SelectInput
                                :items="caseFormatOptions"
                                v-model="selectedSqlServerTableNameCaseFormatOption"
                                text-field="text"
                                id-field="text"
                                block
                        ></SelectInput>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Column name case format:
                    </td>
                    <td class="setting-value">
                        <SelectInput
                                :items="caseFormatOptions"
                                v-model="selectedSqlServerColumnNameCaseFormatOption"
                                text-field="text"
                                id-field="text"
                                block
                        ></SelectInput>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <h2>Java</h2>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Generated classes package:
                    </td>
                    <td class="setting-value">
                        <input
                                type="text"
                                class="input"
                                v-model="config.java.generatedClassesPackage"
                                placeholder="com.example"
                        >
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
                                    v-model="config.java.useSpringNullabilityAnnotations"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
    import {defineComponent, Ref, ref, watch} from 'vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import SelectInput from '@/components/SelectInput.vue';
    import {CaseFormat, IdNamingStrategy, StandardCaseFormats, StandardIdNamingStrategies} from '@nestorrente/erdiagram';

    interface Props {
        config: ERDiagramPlaygroundConfig;
    }

    interface SelectInputOption<T> {
        text: string;
        value: T;
    }

    export default defineComponent({
        name: 'GeneralTabContent',
        components: {
            SelectInput
        },
        // emits: ['update:showing', 'update:config'],
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps, context) {

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

            const selectedMysqlTableNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.config.mysql.tableNameCaseFormat,
                    newValue => props.config.mysql.tableNameCaseFormat = newValue
            );

            const selectedMysqlColumnNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.config.mysql.columnNameCaseFormat,
                    newValue => props.config.mysql.columnNameCaseFormat = newValue
            );

            const selectedSqlServerTableNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.config.sqlserver.tableNameCaseFormat,
                    newValue => props.config.sqlserver.tableNameCaseFormat = newValue
            );

            const selectedSqlServerColumnNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.config.sqlserver.columnNameCaseFormat,
                    newValue => props.config.sqlserver.columnNameCaseFormat = newValue
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

            const selectedMysqlIdNamingStrategyOption = useSelectInputOptions(
                    idNamingStrategyOptions,
                    () => props.config.mysql.idNamingStrategy,
                    newValue => props.config.mysql.idNamingStrategy = newValue
            );

            const selectedSqlServerIdNamingStrategyOption = useSelectInputOptions(
                    idNamingStrategyOptions,
                    () => props.config.sqlserver.idNamingStrategy,
                    newValue => props.config.sqlserver.idNamingStrategy = newValue
            );

            function useSelectInputOptions<T>(
                    options: SelectInputOption<T>[],
                    valueGetter: () => T,
                    valueSetter: (newValue: T) => void
            ) {

                const selectedOption = ref(findOptionFromValue(valueGetter())) as Ref<SelectInputOption<T>>;

                watch(valueGetter, value => selectedOption.value = findOptionFromValue(value));
                watch(selectedOption, option => valueSetter(option.value));

                function findOptionFromValue(value: T) {
                    return options.find(option => option.value === value)!;
                }

                return selectedOption;

            }

            return {
                caseFormatOptions,
                selectedMysqlTableNameCaseFormatOption,
                selectedMysqlColumnNameCaseFormatOption,
                selectedSqlServerTableNameCaseFormatOption,
                selectedSqlServerColumnNameCaseFormatOption,
                idNamingStrategyOptions,
                selectedMysqlIdNamingStrategyOption,
                selectedSqlServerIdNamingStrategyOption
            };

        }
    });
</script>

<style lang="scss">
    .settings-table {

        th, td {
            vertical-align: middle;
        }

        td.setting-value {
            text-align: center;

            label.checkbox {
                width: 100%;
            }

            input[type="checkbox"] {
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
