<template>
    <div class="vertical-full-container">
        <div class="vfc-item">
            <NavBar @show-config="showingConfigModal = true"/>
        </div>
        <section class="section pb-3 vfc-item vfc-grow">
            <div class="container vertical-full-container">
                <div class="columns is-full-height">
                    <div class="column is-half">
                        <div class="vertical-full-container">
                            <div class="vfc-item">
                                <button
                                        class="button is-fullwidth mb-5 background-transition"
                                        :class="{
                                            'is-warning': modelOutdated,
                                            'is-danger is-light': !modelOutdated && hasErrors,
                                            'is-primary is-light': !modelOutdated && !hasErrors
                                        }"
                                        @click="runERDiagram"
                                >
                                    <span v-show="modelOutdated">
                                        Update output code
                                        (<span class="is-family-code">Ctrl + S</span>
                                        or <span class="is-family-code">Ctrl + &#9166;</span>)
                                    </span>
                                    <span v-show="!modelOutdated && hasErrors">
                                        There's an error in your code (see console for more details)
                                    </span>
                                    <span v-show="!modelOutdated && !hasErrors">
                                        Output code is up-to-date :)
                                    </span>
                                </button>
                            </div>
                            <div class="vfc-item vfc-grow">
                                <CodeEditor
                                        v-model="inputCode"
                                        @keydown="onCodeEditorKeydown"
                                        full-height
                                />
                            </div>
                        </div>
                    </div>
                    <div class="column is-half">
                        <div class="vertical-full-container">
                            <TabsSection
                                    :headers="['MySQL', 'Java POJO', 'TypeScript']"
                                    append-tabs-class="vfc-item"
                                    append-tabs-content-class="vfc-item vfc-grow"
                            >
                                <template #tab0>
                                    <CodeBlock
                                            lang="mysql"
                                            :code="generatedMysqlCode"
                                            full-height
                                    />
                                </template>
                                <template #tab1>
                                    <CodeBlock
                                            lang="java"
                                            :code="generatedJavaCode"
                                            full-height
                                    />
                                </template>
                                <template #tab2>
                                    <CodeBlock
                                            lang="typescript"
                                            :code="generatedTypeScriptCode"
                                            full-height
                                    />
                                </template>
                            </TabsSection>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <ConfigModal
            v-model:showing="showingConfigModal"
            v-model:config="configFromModal"
    />
    <GlobalConfirmModal/>
</template>

<script lang="ts">
    import {computed, ComputedRef, defineComponent, onMounted, ref, watch} from 'vue';
    import NavBar from '@/components/NavBar.vue';
    import CodeBlock from '@/components/CodeBlock.vue';
    import TabsSection from '@/components/TabsSection.vue';
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
        TypeScriptClassModelToCodeConverter
    } from '@nestorrente/erdiagram';
    import ConfigModal from '@/components/ConfigModal.vue';
    import ERDiagramPlaygroundConfig, {defaultERDiagramPlaygroundConfig} from '@/config/ERDiagramPlaygroundConfig';
    import GlobalConfirmModal from '@/components/GlobalConfirmModal.vue';
    import CodeEditor from '@/components/CodeEditor.vue';
    import pokemonSampleCode from '!!raw-loader!@/erd-samples/Pokemon.erd';

    export default defineComponent({
        name: 'App',
        components: {
            CodeEditor,
            GlobalConfirmModal,
            ConfigModal,
            TabsSection,
            CodeBlock,
            NavBar
        },
        setup() {

            const configFromModal = ref<ERDiagramPlaygroundConfig>(defaultERDiagramPlaygroundConfig);
            const config = ref<ERDiagramPlaygroundConfig>(configFromModal.value);

            const inputCode = ref(appendPoweredByText(pokemonSampleCode));
            onMounted(runERDiagram);

            const modelOutdated = ref(true);
            watch(inputCode, () => modelOutdated.value = true);
            watch(configFromModal, () => modelOutdated.value = true);

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
                    console.error(e);
                }
            }

            const databaseModelGenerator = computed(() => {
                return new DatabaseModelGenerator(config.value.database);
            });

            const mysqlConverter = computed(() => {
                return new EntityRelationshipModelToDatabaseCodeConverter(
                        databaseModelGenerator.value,
                        new MySqlDatabaseModelToCodeConverter(config.value.mysql)
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

            const showingConfigModal = ref(false);

            return {
                inputCode,
                modelOutdated,
                generatedMysqlCode,
                generatedJavaCode,
                generatedTypeScriptCode,
                onCodeEditorKeydown,
                runERDiagram,
                hasErrors,
                showingConfigModal,
                configFromModal
            };

        }
    });
</script>

<style lang="scss">
    .background-transition {
        transition: background ease 0.3s;
    }
</style>
