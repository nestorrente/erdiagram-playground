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
                                v-model="databaseModelGeneratorConfig.usePluralTableNames"
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
                            @click="databaseModelGeneratorConfig.usePluralTableNames = defaultDatabaseModelConfig.usePluralTableNames"
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
                            @click="databaseModelGeneratorConfig.idNamingStrategy = defaultDatabaseModelConfig.idNamingStrategy"
                    ></Button>
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
                <td style="width: 58px">
                    <Button
                            title="Restore default value"
                            rounded
                            small
                            icon="fas fa-undo-alt"
                            @click="databaseModelToCodeConverterConfig.tableNameCaseFormat = defaultDatabaseModelToCodeConverterConfig.tableNameCaseFormat"
                    ></Button>
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
                <td style="width: 58px">
                    <Button
                            title="Restore default value"
                            rounded
                            small
                            icon="fas fa-undo-alt"
                            @click="databaseModelToCodeConverterConfig.columnNameCaseFormat = defaultDatabaseModelToCodeConverterConfig.columnNameCaseFormat"
                    ></Button>
                </td>
            </tr>
            <slot name="rows-after"></slot>
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
        DatabaseModelToCodeConverterConfig,
        IdNamingStrategy,
        StandardCaseFormats,
        StandardIdNamingStrategies
    } from '@nestorrente/erdiagram';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import Button from '@/components/generic/form/Button.vue';

    interface Props {
        databaseModelGeneratorConfig: DatabaseModelGeneratorConfig;
        databaseModelToCodeConverterConfig: DatabaseModelToCodeConverterConfig;
        defaultDatabaseModelToCodeConverterConfig: DatabaseModelToCodeConverterConfig;
    }

    export default defineComponent({
        name: 'CommonDatabaseSettingsTable',
        components: {
            Button,
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
            defaultDatabaseModelToCodeConverterConfig: {
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
