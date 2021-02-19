<template>
    <div class="vertical-full-container">
        <div class="vfc-item">
            <NavBar/>
        </div>
        <section class="section pb-3 vfc-item vfc-grow">
            <div class="container vertical-full-container">
                <div class="columns is-desktop is-full-height">
                    <div class="column is-half-desktop">
                        <div class="vertical-full-container">
                            <div class="vfc-item pb-5">
                                <div class="columns is-mobile">
                                    <div class="column">
                                        <UpdateOutputCodeButton
                                                :model-outdated="modelOutdated"
                                                :has-errors="parseError != null"
                                                @click="runERDiagramParser"
                                        />
                                    </div>
                                    <div class="column is-narrow">
                                        <ExamplesDropdown @load-example="loadExampleCode"/>
                                    </div>
                                </div>
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
                    <div class="column is-half-desktop">
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
    import {computed, ComputedRef, defineComponent, nextTick, onMounted, ref, watch} from 'vue';
    import NavBar from '@/components/layout/NavBar.vue';
    import CodeBlock from '@/components/generic/code/CodeBlock.vue';
    import {
        EntityRelationshipModel,
        EntityRelationshipModelParser,
        EntityRelationshipModelToCodeConverter,
        ERDiagramParseError,
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
    import ExamplesDropdown from '@/components/ExamplesDropdown.vue';
    import useBeforeUnload from '@/composition/useBeforeUnload';
    import useEntityRelationshipModelToClassCodeConverter
        from '@/composition/useEntityRelationshipModelToClassCodeConverter';
    import useEntityRelationshipModelToDatabaseCodeConverter
        from '@/composition/useEntityRelationshipModelToDatabaseCodeConverter';
    import {showConfirmModal} from '@/store/globalModalDialogStore';

    interface OutputFormat {
        id: string;
        name: string;
        codeBlockLang: string;
        erModelToCodeConverter: ComputedRef<EntityRelationshipModelToCodeConverter>;
    }

    export default defineComponent({
        name: 'App',
        components: {
            ExamplesDropdown,
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
            onMounted(runERDiagramParser);

            const modelOutdated = ref(true);
            watch(inputCode, () => modelOutdated.value = true);
            watch(configFromModal, newValue => {
                localJsonStorage.setItem('erdiagramConfig', erdiagramPlaygroundConfigManager.convertToSerializableObject(newValue));
                return modelOutdated.value = true;
            });

            const parseError = ref<ERDiagramParseError>();
            const entityRelationshipModel = ref<EntityRelationshipModel>();

            useBeforeUnload(() => modelOutdated.value);

            const entityRelationshipModelParser = computed(() => {
                return new EntityRelationshipModelParser(config.value.erModelParser);
            });

            function appendPoweredByText(code: string) {
                return '# Powered by Ace editor (https://ace.c9.io/)\n\n' + code;
            }

            function onCodeEditorKeydown(event: KeyboardEvent) {
                if (event.ctrlKey && event.key === 'Enter') {
                    event.preventDefault();
                    runERDiagramParser();
                }
            }

            function runERDiagramParser() {

                if (!modelOutdated.value) {
                    return;
                }

                modelOutdated.value = false;
                parseError.value = undefined;

                config.value = configFromModal.value;

                try {
                    entityRelationshipModel.value = entityRelationshipModelParser.value.parseModel(inputCode.value);
                    config.value = configFromModal.value;
                } catch (e) {
                    console.log('ERDiagramParseError:', ERDiagramParseError);
                    if (e instanceof Error) {
                        entityRelationshipModel.value = undefined;
                        parseError.value = e;

                        console.error(`Parse error: ${e.message}`);
                    }
                }
            }

            const mysqlConverter = useEntityRelationshipModelToDatabaseCodeConverter(
                    () => config.value.mysql.databaseModelGeneratorConfig,
                    () => new MySqlDatabaseModelToCodeConverter(config.value.mysql.databaseModelToCodeConverterConfig)
            );

            const sqlserverConverter = useEntityRelationshipModelToDatabaseCodeConverter(
                    () => config.value.sqlserver.databaseModelGeneratorConfig,
                    () => new SqlServerDatabaseModelToCodeConverter(config.value.sqlserver.databaseModelToCodeConverterConfig)
            );

            const oracleConverter = useEntityRelationshipModelToDatabaseCodeConverter(
                    () => config.value.oracle.databaseModelGeneratorConfig,
                    () => new OracleDatabaseModelToCodeConverter(config.value.oracle.databaseModelToCodeConverterConfig)
            );

            const javaConverter = useEntityRelationshipModelToClassCodeConverter(() => {
                return new JavaClassModelToCodeConverter(config.value.java.classModelToCodeConverterConfig);
            });

            const typescriptConverter = useEntityRelationshipModelToClassCodeConverter(() => {
                return new TypeScriptClassModelToCodeConverter(config.value.typescript.classModelToCodeConverterConfig);
            });

            const settingsModalSelectedTabName = ref('mysql');

            const showingSettingsModal = ref(false);

            function showSettingsModal() {
                settingsModalSelectedTabName.value = selectedOutputFormat.value.id;
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

            async function loadExampleCode(exampleCode: string) {

                if (modelOutdated.value && !await confirmExampleLoading()) {
                    return;
                }

                inputCode.value = appendPoweredByText(exampleCode);
                nextTick(runERDiagramParser);

            }

            function confirmExampleLoading() {
                return showConfirmModal({
                    message: 'Any unsaved changes will be lost. Do you want to continue?'
                });
            }

            return {
                inputCode,
                modelOutdated,
                onCodeEditorKeydown,
                runERDiagramParser,
                parseError,
                showSettingsModal,
                showingSettingsModal,
                configFromModal,
                settingsModalSelectedTabName,
                outputFormats,
                selectedOutputFormat,
                outputCode,
                loadExampleCode
            };

        }
    });
</script>

<style lang="scss">
    .background-transition {
        transition: background ease 0.3s;
    }
</style>
