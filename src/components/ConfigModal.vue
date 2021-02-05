<template>
    <Modal
            :showing="showing"
            @update:showing="onModalShowingChange"
            width="800px"
            append-body-class="p-0"
            append-body-style="height: 680px"
    >
        <template #title>
            Settings
            <span
                    v-show="configChanged"
                    class="tag is-warning"
                    style="vertical-align: bottom"
            >
                unsaved
            </span>
        </template>
        <template #default>

            <!--<pre v-text="internalConfig"></pre>-->

            <div class="vertical-full-container">
                <TabsSection
                        :headers="['General', 'Type bindings']"
                        append-tabs-class="vfc-item mb-0"
                        append-tabs-content-class="vfc-item vfc-grow"
                        append-tabs-content-style="overflow-y: auto"
                >
                    <template #tab0>
                        <section class="section config-tab-section">

                            <h2>Input code</h2>

                            <div class="config-options">

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

                            </div>

                            <h2>MySQL</h2>

                            <div class="config-options">

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

                            </div>

                            <h2>Java</h2>

                            <div class="config-options">

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

                            </div>

                        </section>
                    </template>
                    <template #tab1>
                        <section class="section config-tab-section">

                            <article class="message is-warning">
                                <div class="message-body">
                                    <strong>Be careful editing those types.</strong>
                                    Any mistake can make your code uncompilable.
                                </div>
                            </article>

                            <table class="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th>Input type</th>
                                        <th>MySQL</th>
                                        <th>Java</th>
                                        <th>TypeScript</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                            v-for="inputType in inputTypes"
                                            :key="inputType"
                                    >
                                        <td>
                                            {{ inputType }}
                                        </td>
                                        <td>
                                            <input
                                                    type="text"
                                                    v-model="internalConfig.mysql.typesMap[inputType]"
                                                    class="input is-small"
                                            >
                                        </td>
                                        <td>
                                            <input
                                                    type="text"
                                                    :value="internalConfig.java.typesMap[inputType].canonicalName"
                                                    @change="internalConfig.java.typesMap[inputType] = parseJavaType($event.currentTarget.value)"
                                                    class="input is-small"
                                            >
                                        </td>
                                        <td>
                                            <input
                                                    type="text"
                                                    :value="internalConfig.typescript.typesMap[inputType].name"
                                                    @change="internalConfig.typescript.typesMap[inputType] = parseTypeScriptType($event.currentTarget.value)"
                                                    class="input is-small"
                                            >
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </section>
                    </template>
                </TabsSection>
            </div>

        </template>
        <template #footer>
            <div class="has-text-right">
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
    import {defineComponent, nextTick, Ref, ref, watch} from 'vue';
    import Modal from '@/components/Modal.vue';
    import ERDiagramPlaygroundConfig, {
        defaultERDiagramPlaygroundConfig,
        mergeERDiagramPlaygroundConfigs
    } from '@/config/ERDiagramPlaygroundConfig';
    import SelectInput from '@/components/SelectInput.vue';
    import {
        CaseFormat,
        createJavaType,
        createTypeScriptType,
        EntityPropertyType,
        IdNamingStrategy,
        StandardCaseFormats,
        StandardIdNamingStrategies
    } from '@nestorrente/erdiagram';
    import {showConfirmModal} from '@/store/globalConfirmModalStore';
    import TabsSection from '@/components/TabsSection.vue';

    interface Props {
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
            TabsSection,
            SelectInput,
            Modal
        },
        emits: ['update:showing', 'update:config'],
        props: {
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

            const configChanged = ref(false);
            watch(internalConfig, () => configChanged.value = true, {deep: true});

            watch(() => props.showing, showing => {
                if (showing) {
                    internalConfig.value = mergeERDiagramPlaygroundConfigs(props.config);
                    nextTick(() => configChanged.value = false);
                }
            });

            function onModalShowingChange(modalShowing: boolean) {
                if (!modalShowing) {
                    close();
                }
            }

            function saveChanges() {
                context.emit('update:config', internalConfig.value);
                configChanged.value = false;
                close();
            }

            async function close() {

                if (configChanged.value && !await confirmChangesDiscard()) {
                    return;
                }

                context.emit('update:showing', false);

            }

            function confirmChangesDiscard() {
                return showConfirmModal({
                    title: 'Do you really want to exit without saving changes?',
                    acceptButtonText: 'Yes, discard them',
                    cancelButtonText: 'No, take me back'
                });
            }

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

            const inputTypes: string[] = Object.values(EntityPropertyType);

            function parseJavaType(text: string) {
                const lastDotIndex = text.lastIndexOf('.');
                if (lastDotIndex === -1) {
                    createJavaType(text);
                } else {
                    const packageName = text.substring(0, lastDotIndex);
                    const className = text.substring(lastDotIndex + 1);
                    return createJavaType(className, packageName);
                }
            }

            function parseTypeScriptType(text: string) {
                return createTypeScriptType(text);
            }

            return {
                internalConfig,
                onModalShowingChange,
                saveChanges,
                close,
                caseFormatOptions,
                selectedTableNameCaseFormatOption,
                selectedColumnNameCaseFormatOption,
                idNamingStrategyOptions,
                selectedMysqlIdNamingStrategyOption,
                configChanged,
                inputTypes,
                parseJavaType,
                parseTypeScriptType
            };

        }
    });
</script>

<style lang="scss">
    .config-tab-section {
        padding-top: 1.5em;
        padding-bottom: 1.5em;

        h2 {
            font-weight: bold;
            font-size: 1.2em;
            margin-bottom: 1em;
        }

        .config-options {
            margin-left: 1em;

            &:not(:last-child) {
                margin-bottom: 1em;
            }
        }
    }
</style>
