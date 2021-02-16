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
                            <div class="vfc-item">
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
                            <Tabs
                                    v-model:selected-tab-name="outputCodeSelectedTabName"
                                    toggle
                                    append-tabs-class="vfc-item"
                                    append-tabs-content-class="vfc-item vfc-grow"
                            >
                                <Tab name="mysql" title="MySQL">
                                    <CodeBlock
                                            lang="sql_more"
                                            :code="generatedMysqlCode"
                                            full-height
                                    />
                                </Tab>
                                <!--<Tab name="postgresql" title="PostgreSQL">-->
                                <!--    Not supported yet.-->
                                <!--</Tab>-->
                                <!--<Tab name="sqlite" title="SQLite">-->
                                <!--    Not supported yet.-->
                                <!--</Tab>-->
                                <Tab name="oracle" title="Oracle DB">
                                    <CodeBlock
                                            lang="sql_more"
                                            :code="generatedOracleCode"
                                            full-height
                                    />
                                </Tab>
                                <Tab name="sqlserver" title="SQL Server">
                                    <CodeBlock
                                            lang="sql_more"
                                            :code="generatedSqlServerCode"
                                            full-height
                                    />
                                </Tab>
                                <Tab name="java" title="Java POJO">
                                    <CodeBlock
                                            lang="java"
                                            :code="generatedJavaCode"
                                            full-height
                                    />
                                </Tab>
                                <Tab name="typescript" title="TypeScript">
                                    <CodeBlock
                                            lang="typescript"
                                            :code="generatedTypeScriptCode"
                                            full-height
                                    />
                                </Tab>
                                <template #afterTabs>
                                    <ul class="is-justify-content-flex-end is-flex-shrink-1 is-flex-grow-0 pl-4">
                                        <li class="buttons">
                                            <Button
                                                    color="link"
                                                    small
                                                    rounded
                                                    class="is-button-text-hidden-mobile"
                                                    icon="fas fa-cog"
                                                    @click="showConfirmModal"
                                            >
                                                Settings
                                            </Button>
                                        </li>
                                    </ul>
                                </template>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <SettingsModal
            v-model:showing="showingSettingsModal"
            v-model:config="configFromModal"
            v-model:selected-tab-name="configModalSelectedTabName"
    />
    <GlobalConfirmModal/>
</template>

<script lang="ts">
    import {computed, ComputedRef, defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue';
    import NavBar from '@/components/layout/NavBar.vue';
    import CodeBlock from '@/components/generic/code/CodeBlock.vue';
    import Tabs from '@/components/tabs/Tabs.vue';
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
    import GlobalConfirmModal from '@/components/generic/modal/GlobalConfirmModal.vue';
    import CodeEditor from '@/components/generic/code/CodeEditor.vue';
    import pokemonSampleCode from '!!raw-loader!@/sample-erd-files/Pokemon.erd';
    import erdiagramPlaygroundConfigManager, {LAST_CONFIG_VERSION} from '@/config/ERDiagramPlaygroundConfigManager';
    import Button from '@/components/generic/form/Button.vue';
    import Tab from '@/components/tabs/Tab.vue';
    import UpdateOutputCodeButton from '@/UpdateOutputCodeButton.vue';

    export default defineComponent({
        name: 'App',
        components: {
            UpdateOutputCodeButton,
            Tab,
            Button,
            CodeEditor,
            GlobalConfirmModal,
            SettingsModal,
            Tabs,
            CodeBlock,
            NavBar
        },
        setup() {

            function getInitialConfig(): ERDiagramPlaygroundConfig {

                const serializedConfig = localStorage.getItem('erdiagramConfig');

                if (serializedConfig) {
                    const config = erdiagramPlaygroundConfigManager.convertFromSerializableObject(JSON.parse(serializedConfig));

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
                localStorage.setItem('erdiagramConfig', JSON.stringify(erdiagramPlaygroundConfigManager.convertToSerializableObject(newValue)));
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

            const sqlServerConverter = computed(() => {
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

            const typeScriptConverter = computed(() => {
                return new EntityRelationshipModelToClassCodeConverter(
                        classModelGenerator.value,
                        new TypeScriptClassModelToCodeConverter(config.value.typescript.classModelToCodeConverterConfig)
                );
            });

            const generatedMysqlCode = createComputedCompiledCode(mysqlConverter);
            const generatedSqlServerCode = createComputedCompiledCode(sqlServerConverter);
            const generatedOracleCode = createComputedCompiledCode(oracleConverter);
            const generatedJavaCode = createComputedCompiledCode(javaConverter);
            const generatedTypeScriptCode = createComputedCompiledCode(typeScriptConverter);

            function createComputedCompiledCode(converter: ComputedRef<EntityRelationshipModelToCodeConverter>) {
                return computed(() => {

                    if (!entityRelationshipModel.value) {
                        return '';
                    }

                    return converter.value.generateCode(entityRelationshipModel.value);

                });
            }

            const outputCodeSelectedTabName = ref('mysql');
            const configModalSelectedTabName = ref('mysql');

            const showingSettingsModal = ref(false);

            function showConfirmModal() {
                configModalSelectedTabName.value = outputCodeSelectedTabName.value;
                showingSettingsModal.value = true;
            }

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
                showConfirmModal,
                showingSettingsModal,
                configFromModal,
                outputCodeSelectedTabName,
                configModalSelectedTabName
            };

        }
    });
</script>

<style lang="scss">
    .background-transition {
        transition: background ease 0.3s;
    }
</style>
