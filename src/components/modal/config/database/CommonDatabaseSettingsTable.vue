<template>
    <table class="table is-fullwidth is-striped is-hoverable settings-table">
        <tbody>
            <slot name="rows-before"></slot>
            <tr>
                <td class="setting-description">
                    Plural table names:
                </td>
                <td class="setting-value">
                    <label class="checkbox">
                        <input
                                type="checkbox"
                                v-model="databaseModelConfig.usePluralTableNames"
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
                            v-model="selectedIdNamingStrategyOption"
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
                            v-model="selectedTableNameCaseFormatOption"
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
                            v-model="selectedColumnNameCaseFormatOption"
                            text-field="text"
                            id-field="text"
                            block
                    ></SelectInput>
                </td>
            </tr>
            <slot name="rows-after"></slot>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import SelectInput from '@/components/SelectInput.vue';
    import {
        CaseFormat,
        DatabaseModelGeneratorConfig,
        DatabaseModelToCodeConverterConfig,
        IdNamingStrategy,
        StandardCaseFormats,
        StandardIdNamingStrategies
    } from '@nestorrente/erdiagram';
    import useSelectInputOptions, {SelectInputOption} from '@/components/useSelectInputOptions';

    interface Props {
        databaseModelConfig: DatabaseModelGeneratorConfig;
        codeConverterConfig: DatabaseModelToCodeConverterConfig;
    }

    export default defineComponent({
        name: 'CommonDatabaseSettingsTable',
        components: {
            SelectInput
        },
        props: {
            databaseModelConfig: {
                type: Object,
                required: true
            },
            codeConverterConfig: {
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
                    () => props.codeConverterConfig.tableNameCaseFormat,
                    newValue => props.codeConverterConfig.tableNameCaseFormat = newValue
            );

            const selectedColumnNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => props.codeConverterConfig.columnNameCaseFormat,
                    newValue => props.codeConverterConfig.columnNameCaseFormat = newValue
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
                    () => props.databaseModelConfig.idNamingStrategy,
                    newValue => props.databaseModelConfig.idNamingStrategy = newValue
            );

            return {
                caseFormatOptions,
                selectedTableNameCaseFormatOption,
                selectedColumnNameCaseFormatOption,
                idNamingStrategyOptions,
                selectedIdNamingStrategyOption
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
