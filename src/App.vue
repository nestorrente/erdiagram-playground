<template>
    <div class="vertical-full-container">
        <div class="vfc-item">
            <NavBar/>
        </div>
        <section class="section pb-3 vfc-item vfc-grow">
            <div class="container vertical-full-container">
                <div class="columns is-full-height">
                    <div class="column is-half">
                        <div class="vertical-full-container">
                            <div class="vfc-item pb-5">
                                <UpdateOutputCodeButton
                                        :model-outdated="modelOutdated"
                                        :has-errors="hasErrors"
                                        @click="runERDiagram"
                                />
                            </div>
                            <div class="vfc-item vfc-grow">
                                <CodeEditor
                                        v-model="inputCode"
                                        lang="erdiagram"
                                        @keydown="onCodeEditorKeydown"
                                        full-height
                                />
                            </div>
                        </div>
                    </div>
                    <div class="column is-half">
                        <div class="vertical-full-container">
                            <div class="vfc-item pb-5">
                                <div class="columns is-mobile">
                                    <div class="column">
                                        <SelectInput
                                                :items="outputFormats"
                                                v-model="selectedOutputFormat"
                                                id-field="id"
                                                text-field="name"
                                                block
                                        ></SelectInput>
                                    </div>
                                    <div class="column is-justify-content-flex-end is-flex-shrink-1 is-flex-grow-0">
                                        <li class="buttons">
                                            <Button
                                                    color="link"
                                                    small
                                                    rounded
                                                    class="is-button-text-hidden-mobile my-1"
                                                    icon="fas fa-wrench"
                                                    @click="showSettingsModal"
                                            >
                                                Settings
                                            </Button>
                                        </li>
                                    </div>
                                </div>
                            </div>
                            <div class="vfc-item vfc-grow">
                                <CodeBlock
                                        :lang="selectedOutputFormat.codeBlockLang"
                                        :code="outputCode"
                                        full-height
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <SettingsModal
            v-model:showing="showingSettingsModal"
            v-model:config="configFromModal"
            v-model:selected-tab-name="settingsModalSelectedTabName"
    />
    <GlobalModalDialog/>
</template>

<script lang="ts">
    import {computed, ComputedRef, defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue';
    import NavBar from '@/components/layout/NavBar.vue';
    import CodeBlock from '@/components/generic/code/CodeBlock.vue';
    import {
        ClassModelGenerator,
        DatabaseModelGenerator,
        EntityRelationshipModel,
        EntityRelationshipModelParser,
        EntityRelationshipModelToClassCodeConverter,
        EntityRelationshipModelToCodeConverter,
        EntityRelationshipModelToDatabaseCodeConverter,
        JavaClassModelToCodeConverter,
        MySqlDatabaseModelToCodeConverter,
        OracleDatabaseModelToCodeConverter,
        SqlServerDatabaseModelToCodeConverter,
        TypeScriptClassModelToCodeConverter
    } from '@nestorrente/erdiagram';
    import SettingsModal from '@/components/config-modal/SettingsModal.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import GlobalModalDialog from '@/components/generic/modal/GlobalModalDialog.vue';
    import CodeEditor from '@/components/generic/code/CodeEditor.vue';
    import pokemonSampleCode from '!!raw-loader!@/sample-erd-files/Pokemon.erd';
    import erdiagramPlaygroundConfigManager, {LAST_CONFIG_VERSION} from '@/config/ERDiagramPlaygroundConfigManager';
    import Button from '@/components/generic/form/Button.vue';
    import UpdateOutputCodeButton from '@/UpdateOutputCodeButton.vue';
    import {localJsonStorage} from '@/storage/JsonStorage';
    import ERDiagramPlaygroundSerializedConfig from '@/config/ERDiagramPlaygroundSerializedConfig';
    import SelectInput from '@/components/generic/form/SelectInput.vue';

    interface OutputFormat {
        id: string;
        name: string;
        codeBlockLang: string;
        erModelToCodeConverter: ComputedRef<EntityRelationshipModelToCodeConverter>;
    }

    export default defineComponent({
        name: 'App',
        components: {
            SelectInput,
            UpdateOutputCodeButton,
            Button,
            CodeEditor,
            GlobalModalDialog,
            SettingsModal,
            CodeBlock,
            NavBar
        },
        setup() {

            function getInitialConfig(): ERDiagramPlaygroundConfig {

                const serializedConfig = localJsonStorage.getItem<ERDiagramPlaygroundSerializedConfig>('erdiagramConfig');

                if (serializedConfig) {
                    const config = erdiagramPlaygroundConfigManager.convertFromSerializableObject(serializedConfig);

                    // Check you are using the last version of the config
                    if (config._version === LAST_CONFIG_VERSION) {
                        return config;
                    } else {
                        console.warn('Detected old version of settings: using default settings.');
                    }
                }

                return erdiagramPlaygroundConfigManager.getDefaultConfig();

            }

            const configFromModal = ref<ERDiagramPlaygroundConfig>(getInitialConfig());
            const config = ref<ERDiagramPlaygroundConfig>(configFromModal.value);

            const inputCode = ref(appendPoweredByText(pokemonSampleCode));
            onMounted(runERDiagram);

            const modelOutdated = ref(true);
            watch(inputCode, () => modelOutdated.value = true);
            watch(configFromModal, newValue => {
                localJsonStorage.setItem('erdiagramConfig', erdiagramPlaygroundConfigManager.convertToSerializableObject(newValue));
                return modelOutdated.value = true;
            });

            const hasErrors = ref(false);
            const entityRelationshipModel = ref<EntityRelationshipModel>();

            useBeforeUnload(() => modelOutdated.value);

            function useBeforeUnload(hasChanged: () => boolean) {

                const beforeUnloadHandler = () => {
                    return hasChanged() ? 'Are you sure you want to exit? Changes you made will not be saved' : undefined;
                };

                let previousBeforeUnloadHandler: any = null;

                onMounted(() => {
                    previousBeforeUnloadHandler = window.onbeforeunload;
                    window.onbeforeunload = beforeUnloadHandler;
                });

                onBeforeUnmount(() => {
                    window.onbeforeunload = previousBeforeUnloadHandler;
                    previousBeforeUnloadHandler = null;
                });

            }

            const entityRelationshipModelParser = computed(() => {
                return new EntityRelationshipModelParser(config.value.erModelParser);
            });

            function appendPoweredByText(code: string) {
                return '# Powered by Ace editor (https://ace.c9.io/)\n\n' + code;
            }

            function onCodeEditorKeydown(event: KeyboardEvent) {
                if (event.ctrlKey && (event.key === 's' || event.key === 'Enter')) {
                    event.preventDefault();
                    runERDiagram();
                }
            }

            function runERDiagram() {

                if (!modelOutdated.value) {
                    return;
                }

                modelOutdated.value = false;
                hasErrors.value = false;

                try {
                    entityRelationshipModel.value = entityRelationshipModelParser.value.parseModel(inputCode.value);
                    config.value = configFromModal.value;
                } catch (e) {
                    hasErrors.value = true;
                    entityRelationshipModel.value = undefined;

                    if (e instanceof Error) {
                        console.error(`Parse error: ${e.message}`);
                    }
                }
            }

            const mysqlDatabaseModelGenerator = computed(() => {
                return new DatabaseModelGenerator(config.value.mysql.databaseModelGeneratorConfig);
            });

            const mysqlConverter = computed(() => {
                return new EntityRelationshipModelToDatabaseCodeConverter(
                        mysqlDatabaseModelGenerator.value,
                        new MySqlDatabaseModelToCodeConverter(config.value.mysql.databaseModelToCodeConverterConfig)
                );
            });

            const sqlServerDatabaseModelGenerator = computed(() => {
                return new DatabaseModelGenerator(config.value.sqlserver.databaseModelGeneratorConfig);
            });

            const sqlserverConverter = computed(() => {
                return new EntityRelationshipModelToDatabaseCodeConverter(
                        sqlServerDatabaseModelGenerator.value,
                        new SqlServerDatabaseModelToCodeConverter(config.value.sqlserver.databaseModelToCodeConverterConfig)
                );
            });

            const oracleDatabaseModelGenerator = computed(() => {
                return new DatabaseModelGenerator(config.value.oracle.databaseModelGeneratorConfig);
            });

            const oracleConverter = computed(() => {
                return new EntityRelationshipModelToDatabaseCodeConverter(
                        oracleDatabaseModelGenerator.value,
                        new OracleDatabaseModelToCodeConverter(config.value.oracle.databaseModelToCodeConverterConfig)
                );
            });

            const classModelGenerator = computed(() => new ClassModelGenerator());

            const javaConverter = computed(() => {
                return new EntityRelationshipModelToClassCodeConverter(
                        classModelGenerator.value,
                        new JavaClassModelToCodeConverter(config.value.java.classModelToCodeConverterConfig)
                );
            });

            const typescriptConverter = computed(() => {
                return new EntityRelationshipModelToClassCodeConverter(
                        classModelGenerator.value,
                        new TypeScriptClassModelToCodeConverter(config.value.typescript.classModelToCodeConverterConfig)
                );
            });

            const generatedMysqlCode = createComputedCompiledCode(mysqlConverter);
            const generatedSqlServerCode = createComputedCompiledCode(sqlserverConverter);
            const generatedOracleCode = createComputedCompiledCode(oracleConverter);
            const generatedJavaCode = createComputedCompiledCode(javaConverter);
            const generatedTypeScriptCode = createComputedCompiledCode(typescriptConverter);

            function createComputedCompiledCode(converter: ComputedRef<EntityRelationshipModelToCodeConverter>) {
                return computed(() => {

                    if (!entityRelationshipModel.value) {
                        return '';
                    }

                    return converter.value.generateCode(entityRelationshipModel.value);

                });
            }

            const settingsModalSelectedTabName = ref('mysql');

            const showingSettingsModal = ref(false);

            function showSettingsModal() {
                settingsModalSelectedTabName.value = selectedOutputFormat.value.name;
                showingSettingsModal.value = true;
            }

            const outputFormats: Record<string, OutputFormat[]> = {
                'Database': [
                    {
                        id: 'mysql',
                        name: 'MySQL',
                        codeBlockLang: 'sql_more',
                        erModelToCodeConverter: mysqlConverter
                    },
                    {
                        id: 'oracle',
                        name: 'Oracle DB',
                        codeBlockLang: 'sql_more',
                        erModelToCodeConverter: oracleConverter
                    },
                    {
                        id: 'sqlserver',
                        name: 'SQL Server',
                        codeBlockLang: 'sql_more',
                        erModelToCodeConverter: sqlserverConverter
                    }
                ],
                'OOP': [
                    {
                        id: 'java',
                        name: 'Java POJO',
                        codeBlockLang: 'java',
                        erModelToCodeConverter: javaConverter
                    },
                    {
                        id: 'typescript',
                        name: 'TypeScript',
                        codeBlockLang: 'typescript',
                        erModelToCodeConverter: typescriptConverter
                    }
                ]
            };

            const selectedOutputFormat = ref(outputFormats['Database'][0]);

            const outputCode = computed((): string => {

                if (!entityRelationshipModel.value) {
                    return '';
                }

                const erModelToCodeConverter = selectedOutputFormat.value.erModelToCodeConverter;

                return erModelToCodeConverter.generateCode(entityRelationshipModel.value);

            });

            return {
                inputCode,
                modelOutdated,
                generatedMysqlCode,
                generatedSqlServerCode,
                generatedOracleCode,
                generatedJavaCode,
                generatedTypeScriptCode,
                onCodeEditorKeydown,
                runERDiagram,
                hasErrors,
                showSettingsModal,
                showingSettingsModal,
                configFromModal,
                settingsModalSelectedTabName,
                outputFormats,
                selectedOutputFormat,
                outputCode
            };

        }
    });
</script>

<style lang="scss">
    .background-transition {
        transition: background ease 0.3s;
    }
</style>
