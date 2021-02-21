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
                                        <div class="buttons">
                                            <FileReadWrapper
                                                    accept=".erd"
                                                    :max-size="10 * 1024 * 1024"
                                                    :listen-keyboard-open-shortcut="!showingSettingsModal"
                                                    @success="onOpenFileSuccess"
                                                    @error="onOpenFileError"
                                                    @max-size-error="onOpenFileMaxSizeError"
                                                    #default="{openFile}"
                                            >
                                                <Button
                                                        icon="far fa-folder-open"
                                                        class="is-button-text-hidden-mobile"
                                                        title="Ctrl + O"
                                                        @click="openFile"
                                                >
                                                    Open file
                                                </Button>
                                            </FileReadWrapper>
                                            <FileDownloadWrapper
                                                    file-name="ER_model.erd"
                                                    :file-contents="inputCodeLive"
                                                    :listen-keyboard-save-shortcut="!showingSettingsModal"
                                                    #default="{downloadFile}"
                                            >
                                                <Button
                                                        icon="far fa-save"
                                                        class="is-button-text-hidden-mobile"
                                                        title="Ctrl + S"
                                                        @click="downloadFile"
                                                >
                                                    Save file
                                                </Button>
                                            </FileDownloadWrapper>
                                        </div>
                                    </div>
                                    <div class="column is-narrow">
                                        <ExamplesDropdown @load-example="loadExampleCode"/>
                                    </div>
                                </div>
                            </div>
                            <div class="vfc-item vfc-grow">
                                <CodeEditor
                                        v-model="inputCodeLive"
                                        lang="erdiagram"
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
                                    <div class="column is-narrow">
                                        <div class="buttons">
                                            <Button
                                                    color="link"
                                                    icon="fas fa-wrench"
                                                    title="Settings"
                                                    @click="showSettingsModal"
                                            >
                                                Settings
                                            </Button>
                                        </div>
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
            v-model:config="config"
            v-model:selected-tab-name="settingsModalSelectedTabName"
    />
    <GlobalModalDialog/>
    <GlobalToastMessage/>
</template>

<script lang="ts">
    import {computed, ComputedRef, defineComponent, ref, watch} from 'vue';
    import NavBar from '@/components/layout/NavBar.vue';
    import CodeBlock from '@/components/generic/code/CodeBlock.vue';
    import {
        EntityRelationshipModelParser,
        EntityRelationshipModelToCodeConverter,
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
    import {localJsonStorage} from '@/storage/JsonStorage';
    import ERDiagramPlaygroundSerializedConfig from '@/config/ERDiagramPlaygroundSerializedConfig';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import ExamplesDropdown from '@/components/ExamplesDropdown.vue';
    import useBeforeUnload from '@/composition/useBeforeUnload';
    import useEntityRelationshipModelToClassCodeConverter from '@/composition/useEntityRelationshipModelToClassCodeConverter';
    import useEntityRelationshipModelToDatabaseCodeConverter from '@/composition/useEntityRelationshipModelToDatabaseCodeConverter';
    import {showConfirmModal, showErrorModal} from '@/store/globalModalDialogStore';
    import FileReadWrapper from '@/components/generic/file/FileReadWrapper.vue';
    import {useThrottledRef} from '@/composition/useThrottledRef';
    import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';
    import GlobalToastMessage from '@/components/generic/modal/GlobalToastMessage.vue';

    interface OutputFormat {
        id: string;
        name: string;
        codeBlockLang: string;
        erModelToCodeConverter: ComputedRef<EntityRelationshipModelToCodeConverter>;
    }

    export default defineComponent({
        name: 'App',
        components: {
            GlobalToastMessage,
            FileDownloadWrapper,
            FileReadWrapper,
            ExamplesDropdown,
            SelectInput,
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

            const config = ref<ERDiagramPlaygroundConfig>(getInitialConfig());

            watch(config, newValue => {
                localJsonStorage.setItem('erdiagramConfig', erdiagramPlaygroundConfigManager.convertToSerializableObject(newValue));
            });

            const {
                liveRef: inputCodeLive,
                throttledRef: inputCodeThrottled,
                synced: inputCodeSynced
            } = useThrottledRef(localStorage.getItem('inputCode') || pokemonSampleCode, 300);

            useBeforeUnload(() => !inputCodeSynced.value);

            const entityRelationshipModelParser = computed(() => {
                return new EntityRelationshipModelParser(config.value.erModelParser);
            });

            function onOpenFileSuccess(text: string) {
                inputCodeThrottled.value = text;
            }

            function onOpenFileError(error: any) {
                console.error('Cannot read file:', error);
                showErrorModal({
                    message: 'Cannot read file'
                });
            }

            const ONE_MEGABYTE_IN_BYTES = 1024 * 1024;

            function onOpenFileMaxSizeError(file: File) {
                const fileSizeInMegabytes = file.size / ONE_MEGABYTE_IN_BYTES;
                const formattedFileSize = fileSizeInMegabytes.toFixed(2);
                showErrorModal({
                    message: `File exceeds the maximum size allowed (file size: ${formattedFileSize} MB, maximum size allowed: 10 MB)`
                });
            }

            const parseResult = computed(() => {

                localStorage.setItem('inputCode', inputCodeThrottled.value);

                try {
                    return {
                        erModel: entityRelationshipModelParser.value.parseModel(inputCodeThrottled.value),
                        error: null
                    };
                } catch (error) {
                    console.error(`Parse error: ${error.message}`);
                    return {
                        erModel: null,
                        error
                    };
                }
            });

            const entityRelationshipModel = computed(() => parseResult.value.erModel);
            const parseError = computed(() => parseResult.value.error);

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
                if (inputCodeSynced.value || await confirmExampleLoading()) {
                    inputCodeThrottled.value = exampleCode;
                }
            }

            function confirmExampleLoading() {
                return showConfirmModal({
                    message: 'Any unsaved changes will be lost. Do you want to continue?'
                });
            }

            return {
                inputCodeLive,
                inputCodeSynced,
                parseError,
                showSettingsModal,
                showingSettingsModal,
                config,
                settingsModalSelectedTabName,
                outputFormats,
                selectedOutputFormat,
                outputCode,
                loadExampleCode,
                onOpenFileSuccess,
                onOpenFileError,
                onOpenFileMaxSizeError
            };

        }
    });
</script>

<style lang="scss">
    .background-transition {
        transition: background ease 0.3s;
    }
</style>
