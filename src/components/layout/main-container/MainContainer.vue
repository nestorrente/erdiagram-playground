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
                            :annotations="codeEditorAnnotations"
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
                                    :items="groupedOutputFormats"
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
                            v-if="selectedOutputFormat.id !== 'nomnomlDiagram'"
                            :lang="parseError ? 'plaintext' : selectedOutputFormat.codeBlockLang"
                            :code="parseErrorDisplayText ?? outputCode"
                            :wrap="parseError != null"
                            :custom-code-class="parseError ? 'has-text-danger' : undefined"
                            full-height
                    />
                    <EntityRelationshipModelDiagram
                            v-else
                            :model="entityRelationshipModel"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {computed, ComputedRef, defineComponent, ref, watch} from 'vue';
    import CodeBlock from '@/components/generic/code/CodeBlock.vue';
    import {
        EntityRelationshipModelParser,
        EntityRelationshipModelToCodeConverter,
        ERDiagramParseLineError
    } from '@nestorrente/erdiagram';
    import CodeEditor from '@/components/generic/code/CodeEditor.vue';
    import Button from '@/components/generic/form/Button.vue';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import ExamplesDropdown from '@/components/ExamplesDropdown.vue';
    import useBeforeUnload from '@/composition/event/useBeforeUnload';
    import {showConfirmModalDialog} from '@/store/globalModalDialogStore';
    import useDebouncedRef from '@/composition/util/useDebouncedRef';
    import SaveInputCodeButton from '@/components/layout/main-container/SaveInputCodeButton.vue';
    import OpenInputCodeButton from '@/components/layout/main-container/OpenInputCodeButton.vue';
    import Icon from '@/components/generic/form/Icon.vue';
    import localStorageAccessor from '@/storage/localStorageAccessor';
    import configStore from '@/store/configStore';
    import outputFormats from '@/common/outputFormats';
    import {Ace} from 'ace-builds';
    import EntityRelationshipModelDiagram from '@/components/EntityRelationshipModelDiagram.vue';

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
            EntityRelationshipModelDiagram,
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
            showingSettingsModal: {
                type: Boolean,
                requried: true
            }
        },
        setup: function () {

            const {
                liveRef: inputCodeLive,
                debouncedRef: inputCodeDebounced,
                synced: inputCodeSynced
            } = useDebouncedRef(localStorageAccessor.getInputCode(), 300);

            useBeforeUnload(() => !inputCodeSynced.value);

            const entityRelationshipModelParser = computed(() => {
                return new EntityRelationshipModelParser(configStore.config.erModelParser);
            });

            const parseResult = computed(() => {

                localStorageAccessor.setInputCode(inputCodeDebounced.value);

                try {
                    return {
                        erModel: entityRelationshipModelParser.value.parseModel(inputCodeDebounced.value),
                        error: null
                    };
                } catch (error) {
                    return {
                        erModel: null,
                        error
                    };
                }
            });

            const entityRelationshipModel = computed(() => parseResult.value.erModel);
            const parseError = computed(() => parseResult.value.error);
            const parseErrorDisplayText = computed((): string | null => {

                const error = parseError.value;

                if (!error) {
                    return null;
                }

                if (error instanceof ERDiagramParseLineError) {
                    return `There is an error in your code:\n\n${error.message}, line ${error.lineNumber}`;
                }

                return `Unexpected error when parsing input code:\n\n${error.message}`;

            });

            const codeEditorAnnotations = computed((): Ace.Annotation[] => {

                const error = parseError.value;

                if (!(error instanceof ERDiagramParseLineError)) {
                    return [];
                }

                return [{
                    type: 'error',
                    text: error.message,
                    row: error.lineNumber - 1
                }];

            });

            const groupedOutputFormats: Record<string, OutputFormat[]> = {
                'Database': [
                    outputFormats.mysql,
                    outputFormats.oracle,
                    outputFormats.sqlserver
                ],
                'OOP': [
                    outputFormats.java,
                    outputFormats.typescript
                ],
                'Diagram': [
                    outputFormats.nomnomlCode,
                    outputFormats.nomnomlDiagram
                ]
            };

            const selectedOutputFormat = ref(localStorageAccessor.getOutputFormat());

            watch(selectedOutputFormat, newValue => localStorageAccessor.setOutputFormat(newValue as unknown as OutputFormat));

            const outputCode = computed((): string => {

                if (!entityRelationshipModel.value) {
                    return '';
                }

                const erModelToCodeConverter = selectedOutputFormat.value.erModelToCodeConverter;

                return erModelToCodeConverter.generateCode(entityRelationshipModel.value);

            });

            // const entityRelationshipModelToNomnomlCodeConverter = new EntityRelationshipModelToNomnomlCodeConverter();
            // const pepe = computed(() => {
            //     if (!entityRelationshipModel.value) {
            //         return '';
            //     }
            //     return entityRelationshipModelToNomnomlCodeConverter.generateCode(entityRelationshipModel.value);
            // });

            async function loadExampleCode(exampleCode: string) {
                if (inputCodeSynced.value || await confirmExampleLoading()) {
                    inputCodeDebounced.value = exampleCode;
                }
            }

            function confirmExampleLoading() {
                return showConfirmModalDialog('Any unsaved changes will be lost. Do you want to continue?');
            }

            return {
                inputCodeLive,
                inputCodeDebounced,
                inputCodeSynced,
                parseError,
                parseErrorDisplayText,
                codeEditorAnnotations,
                groupedOutputFormats,
                selectedOutputFormat,
                outputCode,
                loadExampleCode,
                entityRelationshipModel
            };

        }
    });
</script>
