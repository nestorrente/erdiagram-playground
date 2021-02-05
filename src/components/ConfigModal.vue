<template>
    <Modal
            title="Configuration"
            :showing="showing"
            @update:showing="$emit('update:showing', $event)"
    >
        <template #default>

            <article class="message is-warning">
                <div class="message-body">
                    This section is work-in-progress. New configurable properties will be added soon!
                </div>
            </article>

            <!--<pre v-text="internalConfig"></pre>-->

            <section class="er-model-config mb-6">

                <h2 class="is-size-5 has-text-weight-bold mb-3">Input code</h2>

                <div class="field">
                    <div class="control">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="internalConfig.erModel.allowUnknownEntities"
                                    class="mr-1"
                            >
                            Allow using unknown entities in relationships
                        </label>
                    </div>
                </div>

            </section>

            <section class="mysql-config mb-6">

                <h2 class="is-size-5 has-text-weight-bold mb-3">MySQL</h2>

                <div class="field">
                    <div class="control">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="internalConfig.database.pluralizeTableNames"
                                    class="mr-1"
                            >
                            Plural table names
                        </label>
                    </div>
                </div>

                <div class="field">
                    <label class="label">ID naming strategy:</label>
                    <div class="control">
                        <SelectInput
                                :items="idNamingStrategyOptions"
                                v-model="selectedMysqlIdNamingStrategyOption"
                                text-field="text"
                                id-field="value"
                        ></SelectInput>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Table name case format:</label>
                    <div class="control">
                        <SelectInput
                                :items="caseFormatOptions"
                                v-model="selectedTableNameCaseFormatOption"
                                text-field="text"
                                id-field="text"
                        ></SelectInput>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Column name case format:</label>
                    <div class="control">
                        <SelectInput
                                :items="caseFormatOptions"
                                v-model="selectedColumnNameCaseFormatOption"
                                text-field="text"
                                id-field="text"
                        ></SelectInput>
                    </div>
                </div>

            </section>

            <section class="java-config mb-6">

                <h2 class="is-size-5 has-text-weight-bold mb-3">Java</h2>

                <div class="field">
                    <div class="control">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="internalConfig.java.useSpringNullabilityAnnotations"
                                    class="mr-1"
                            >
                            Use Spring @Nullable and @NotNull annotations
                        </label>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Generated classes package:</label>
                    <div class="control">
                        <input
                                type="text"
                                v-model="internalConfig.java.generatedClassesPackage"
                                placeholder="com.example"
                                class="input"
                        >
                    </div>
                </div>

            </section>

        </template>
        <template #footer>
            <div class="has-text-right" style="width: 100%">
                <button
                        class="button is-success"
                        @click="saveChanges"
                >
                    Save changes
                </button>
                <button
                        class="button"
                        @click="close"
                >
                    Cancel
                </button>
            </div>
        </template>
    </Modal>
</template>

<script lang="ts">
    import {defineComponent, reactive, Ref, ref, watch} from 'vue';
    import Modal from '@/components/Modal.vue';
    import ERDiagramPlaygroundConfig, {
        defaultERDiagramPlaygroundConfig,
        mergeERDiagramPlaygroundConfigs
    } from '@/config/ERDiagramPlaygroundConfig';
    import SelectInput from '@/components/SelectInput.vue';
    import {
        CaseFormat,
        IdNamingStrategy,
        StandardCaseFormats,
        StandardIdNamingStrategies
    } from '@nestorrente/erdiagram';

    type MapperCallback<T, U> = (obj: T) => U;

    interface Props {
        title: string;
        showing: boolean;
        config: ERDiagramPlaygroundConfig;
    }

    interface SelectInputOption<T> {
        text: string;
        value: T;
    }

    export default defineComponent({
        name: 'ConfigModal',
        components: {
            SelectInput,
            Modal
        },
        emits: ['update:showing', 'update:config'],
        props: {
            title: {
                type: String,
                required: true
            },
            showing: {
                type: Boolean,
                default: false
            },
            config: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps, context) {

            const props = uncastedProps as Props;

            const internalConfig = ref(mergeERDiagramPlaygroundConfigs(defaultERDiagramPlaygroundConfig));

            watch(() => props.showing, showing => {
                if (showing) {
                    internalConfig.value = mergeERDiagramPlaygroundConfigs(props.config);
                }
            });

            function saveChanges() {
                context.emit('update:config', internalConfig.value);
                close();
            }

            function close() {
                context.emit('update:showing', false);
            }

            const reactiveCaseFormats = reactive(StandardCaseFormats);

            const caseFormatOptions: SelectInputOption<CaseFormat>[] = [
                {
                    text: 'UpperCammelCase',
                    value: reactiveCaseFormats.UPPER_CAMEL
                },
                {
                    text: 'lowerCammelCase',
                    value: reactiveCaseFormats.LOWER_CAMEL
                },
                {
                    text: 'UPPER_UNDERSCORE_CASE',
                    value: reactiveCaseFormats.UPPER_UNDERSCORE
                },
                {
                    text: 'lower_underscore_case',
                    value: reactiveCaseFormats.LOWER_UNDERSCORE
                },
                {
                    text: 'Capitalized_Underscore_Case',
                    value: reactiveCaseFormats.CAPITALIZED_UNDERSCORE
                }
            ];

            const selectedTableNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => internalConfig.value.mysql.tableNameCaseFormat,
                    newValue => internalConfig.value.mysql.tableNameCaseFormat = newValue
            );

            const selectedColumnNameCaseFormatOption = useSelectInputOptions(
                    caseFormatOptions,
                    () => internalConfig.value.mysql.columnNameCaseFormat,
                    newValue => internalConfig.value.mysql.columnNameCaseFormat = newValue
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
                    () => internalConfig.value.mysql.idNamingStrategy,
                    newValue => internalConfig.value.mysql.idNamingStrategy = newValue
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
                internalConfig,
                saveChanges,
                close,
                caseFormatOptions,
                selectedTableNameCaseFormatOption,
                selectedColumnNameCaseFormatOption,
                idNamingStrategyOptions,
                selectedMysqlIdNamingStrategyOption
            };

        }
    });
</script>
