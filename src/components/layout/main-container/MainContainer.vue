<template>
    <div class="columns is-desktop is-full-height">
        <div class="column is-half-desktop">
            <div class="vertical-full-container">
                <div class="vfc-item pb-5">
                    <div class="columns is-mobile">
                        <div class="column">
                            <div class="buttons">
                                <OpenInputCodeButton
                                        :disable-shortcut-listener="showingSettingsModal"
                                        @load-code="inputCodeDebounced = $event"
                                />
                                <SaveInputCodeButton
                                        :input-code="inputCodeLive"
                                        :disable-shortcut-listener="showingSettingsModal"
                                />
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
                        <div class="column is-narrow">
                            <SelectInput
                                    :items="outputFormats"
                                    v-model="selectedOutputFormat"
                                    id-field="id"
                                    text-field="name"
                                    block
                            ></SelectInput>
                        </div>
                        <div class="column is-align-self-center">
                            <span v-show="!inputCodeSynced">
                                <Icon icon="fas fa-sync fa-spin-fast"/>
                                Syncing...
                            </span>
                        </div>
                        <div class="column is-narrow">
                            <div class="buttons">
                                <Button
                                        color="link"
                                        icon="fas fa-wrench"
                                        title="Settings"
                                        @click="$emit('showSettingsModal', selectedOutputFormat.id)"
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
</template>

<script lang="ts">
    import {computed, ComputedRef, defineComponent, ref} from 'vue';
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
    import CodeEditor from '@/components/generic/code/CodeEditor.vue';
    import pokemonSampleCode from '!!raw-loader!@/sample-erd-files/Pokemon.erd';
    import Button from '@/components/generic/form/Button.vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import ExamplesDropdown from '@/components/ExamplesDropdown.vue';
    import useBeforeUnload from '@/composition/event/useBeforeUnload';
    import useEntityRelationshipModelToClassCodeConverter
        from '@/composition/erdiagram/useEntityRelationshipModelToClassCodeConverter';
    import useEntityRelationshipModelToDatabaseCodeConverter
        from '@/composition/erdiagram/useEntityRelationshipModelToDatabaseCodeConverter';
    import {showConfirmModal} from '@/store/globalModalDialogStore';
    import useDebouncedRef from '@/composition/util/useDebouncedRef';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import SaveInputCodeButton from '@/components/layout/main-container/SaveInputCodeButton.vue';
    import OpenInputCodeButton from '@/components/layout/main-container/OpenInputCodeButton.vue';
    import Icon from '@/components/generic/form/Icon.vue';

    interface Props {
        config: ERDiagramPlaygroundConfig;
        showingSettingsModal: boolean;
    }

    interface OutputFormat {
        id: string;
        name: string;
        codeBlockLang: string;
        erModelToCodeConverter: ComputedRef<EntityRelationshipModelToCodeConverter>;
    }

    export default defineComponent({
        name: 'MainContainer',
        emits: ['showSettingsModal'],
        components: {
            Icon,
            OpenInputCodeButton,
            SaveInputCodeButton,
            ExamplesDropdown,
            SelectInput,
            Button,
            CodeEditor,
            CodeBlock,
        },
        props: {
            config: {
                type: Object,
                required: true
            },
            showingSettingsModal: {
                type: Boolean,
                requried: true
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const {
                liveRef: inputCodeLive,
                debouncedRef: inputCodeDebounced,
                synced: inputCodeSynced
            } = useDebouncedRef(localStorage.getItem('inputCode') || pokemonSampleCode, 300);

            useBeforeUnload(() => !inputCodeSynced.value);

            const entityRelationshipModelParser = computed(() => {
                return new EntityRelationshipModelParser(props.config.erModelParser);
            });

            const parseResult = computed(() => {

                localStorage.setItem('inputCode', inputCodeDebounced.value);

                try {
                    return {
                        erModel: entityRelationshipModelParser.value.parseModel(inputCodeDebounced.value),
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
                    () => props.config.mysql.databaseModelGeneratorConfig,
                    () => new MySqlDatabaseModelToCodeConverter(props.config.mysql.databaseModelToCodeConverterConfig)
            );

            const sqlserverConverter = useEntityRelationshipModelToDatabaseCodeConverter(
                    () => props.config.sqlserver.databaseModelGeneratorConfig,
                    () => new SqlServerDatabaseModelToCodeConverter(props.config.sqlserver.databaseModelToCodeConverterConfig)
            );

            const oracleConverter = useEntityRelationshipModelToDatabaseCodeConverter(
                    () => props.config.oracle.databaseModelGeneratorConfig,
                    () => new OracleDatabaseModelToCodeConverter(props.config.oracle.databaseModelToCodeConverterConfig)
            );

            const javaConverter = useEntityRelationshipModelToClassCodeConverter(() => {
                return new JavaClassModelToCodeConverter(props.config.java.classModelToCodeConverterConfig);
            });

            const typescriptConverter = useEntityRelationshipModelToClassCodeConverter(() => {
                return new TypeScriptClassModelToCodeConverter(props.config.typescript.classModelToCodeConverterConfig);
            });

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
                    inputCodeDebounced.value = exampleCode;
                }
            }

            function confirmExampleLoading() {
                return showConfirmModal('Any unsaved changes will be lost. Do you want to continue?');
            }

            return {
                inputCodeLive,
                inputCodeDebounced,
                inputCodeSynced,
                parseError,
                outputFormats,
                selectedOutputFormat,
                outputCode,
                loadExampleCode
            };

        }
    });
</script>
