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
                                    v-model:selected-tab-index="outputCodeSelectedTabIndex"
                                    toggle
                                    append-tabs-class="vfc-item"
                                    append-tabs-content-class="vfc-item vfc-grow"
                            >
                                <Tab title="MySQL">
                                    <CodeBlock
                                            lang="sql_more"
                                            :code="generatedMysqlCode"
                                            full-height
                                    />
                                </Tab>
                                <!--<Tab title="PostgreSQL">-->
                                <!--    Not supported yet.-->
                                <!--</Tab>-->
                                <!--<Tab title="SQLite">-->
                                <!--    Not supported yet.-->
                                <!--</Tab>-->
                                <Tab title="Oracle DB">
                                    <CodeBlock
                                            lang="sql_more"
                                            :code="generatedOracleCode"
                                            full-height
                                    />
                                </Tab>
                                <Tab title="SQL Server">
                                    <CodeBlock
                                            lang="sql_more"
                                            :code="generatedSqlServerCode"
                                            full-height
                                    />
                                </Tab>
                                <Tab title="Java POJO">
                                    <CodeBlock
                                            lang="java"
                                            :code="generatedJavaCode"
                                            full-height
                                    />
                                </Tab>
                                <Tab title="TypeScript">
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
    <ConfigModal
            v-model:showing="showingConfigModal"
            v-model:config="configFromModal"
            v-model:selected-tab-index="configModalSelectedTabIndex"
    />
    <GlobalConfirmModal/>
</template>

<script lang="ts">
    import {computed, ComputedRef, defineComponent, onMounted, ref, watch} from 'vue';
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
    import ConfigModal from '@/components/config-modal/ConfigModal.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import GlobalConfirmModal from '@/components/generic/modal/GlobalConfirmModal.vue';
    import CodeEditor from '@/components/generic/code/CodeEditor.vue';
    import companySampleCode from '!!raw-loader!@/sample-erd-files/Company.erd';
    import erdiagramPlaygroundConfigManager from '@/config/ERDiagramPlaygroundConfigManager';
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
            ConfigModal,
            Tabs,
            CodeBlock,
            NavBar
        },
        setup() {

            function getInitialConfig(): ERDiagramPlaygroundConfig {

                const serializedConfig = localStorage.getItem('erdiagramConfig');

                if (serializedConfig) {
                    return erdiagramPlaygroundConfigManager.convertFromSerializableObject(JSON.parse(serializedConfig));
                }

                return erdiagramPlaygroundConfigManager.getDefaultConfig();

            }

            const configFromModal = ref<ERDiagramPlaygroundConfig>(getInitialConfig());
            const config = ref<ERDiagramPlaygroundConfig>(configFromModal.value);

            const inputCode = ref(appendPoweredByText(companySampleCode));
            onMounted(runERDiagram);

            const modelOutdated = ref(true);
            watch(inputCode, () => modelOutdated.value = true);
            watch(configFromModal, newValue => {
                localStorage.setItem('erdiagramConfig', JSON.stringify(erdiagramPlaygroundConfigManager.convertToSerializableObject(newValue)));
                return modelOutdated.value = true;
            });

            const hasErrors = ref(false);
            const entityRelationshipModel = ref<EntityRelationshipModel>();

            const entityRelationshipModelParser = computed(() => {
                return new EntityRelationshipModelParser(config.value.erModel);
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
                return new DatabaseModelGenerator(config.value.mysqlDatabaseModel);
            });

            const mysqlConverter = computed(() => {
                return new EntityRelationshipModelToDatabaseCodeConverter(
                        mysqlDatabaseModelGenerator.value,
                        new MySqlDatabaseModelToCodeConverter(config.value.mysql)
                );
            });

            const sqlServerDatabaseModelGenerator = computed(() => {
                return new DatabaseModelGenerator(config.value.sqlServerDatabaseModel);
            });

            const sqlServerConverter = computed(() => {
                return new EntityRelationshipModelToDatabaseCodeConverter(
                        sqlServerDatabaseModelGenerator.value,
                        new SqlServerDatabaseModelToCodeConverter(config.value.sqlserver)
                );
            });

            const oracleDatabaseModelGenerator = computed(() => {
                return new DatabaseModelGenerator(config.value.oracleDatabaseModel);
            });

            const oracleConverter = computed(() => {
                return new EntityRelationshipModelToDatabaseCodeConverter(
                        oracleDatabaseModelGenerator.value,
                        new OracleDatabaseModelToCodeConverter(config.value.oracle)
                );
            });

            const classModelGenerator = computed(() => new ClassModelGenerator());

            const javaConverter = computed(() => {
                return new EntityRelationshipModelToClassCodeConverter(
                        classModelGenerator.value,
                        new JavaClassModelToCodeConverter(config.value.java)
                );
            });

            const typeScriptConverter = computed(() => {
                return new EntityRelationshipModelToClassCodeConverter(
                        classModelGenerator.value,
                        new TypeScriptClassModelToCodeConverter(config.value.typescript)
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

            const outputCodeSelectedTabIndex = ref(0);
            const configModalSelectedTabIndex = ref(0);

            const showingConfigModal = ref(false);

            function showConfirmModal() {
                configModalSelectedTabIndex.value = outputCodeSelectedTabIndex.value;
                showingConfigModal.value = true;
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
                showingConfigModal,
                configFromModal,
                outputCodeSelectedTabIndex,
                configModalSelectedTabIndex
            };

        }
    });
</script>

<style lang="scss">
    .background-transition {
        transition: background ease 0.3s;
    }
</style>
