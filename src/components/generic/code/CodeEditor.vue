<template>
    <div
            class="code-editor-container"
            ref="editorContainer"
            :class="{'is-full-height': fullHeight}"
    ></div>
</template>

<script lang="ts">
    import {defineComponent, onBeforeUnmount, onMounted, ref, watch} from 'vue';
    import ace, {Ace} from 'ace-builds';
    import 'ace-builds/esm-resolver';
    import 'ace-builds/src-noconflict/mode-json';
    import 'ace-builds/src-noconflict/ext-language_tools';
    import '@/ace/mode/ERDiagramMode';
    import {isDesktopDevice} from '@/device-type-detection';

    interface Props {
        lang: string;
        modelValue: string;
        fullHeight: boolean;
        annotations: Ace.Annotation[];
    }

    export default defineComponent({
        name: 'CodeEditor',
        emits: ['update:modelValue'],
        props: {
            lang: {
                type: String,
                required: true
            },
            modelValue: {
                type: String,
                default: ''
            },
            fullHeight: {
                type: Boolean,
                default: false
            },
            annotations: {
                type: Array,
                default: () => []
            }
        },
        setup(uncastedProps, context) {

            const props = uncastedProps as Props;

            const editorContainer = ref<HTMLElement>();
            const aceEditorRef = ref<Ace.Editor>();

            onMounted(initAce);
            onBeforeUnmount(destroyAce);

            function initAce() {

                const aceEditor = ace.edit(editorContainer.value!, {
                    fontSize: 16
                });

                // Release Ctrl+L shortcut
                aceEditor.commands.removeCommand('gotoline');

                aceEditor.setTheme('ace/theme/clouds');
                updateAceEditorMode(aceEditor);

                aceEditor.setValue(props.modelValue);
                aceEditor.session.selection.clearSelection();
                aceEditor.session.setAnnotations(props.annotations);

                aceEditor.on('change', () => onCodeChanged(aceEditor.getValue()));
                focusEditorOnDesktopDevice(aceEditor);

                aceEditorRef.value = aceEditor;

            }

            watch(() => props.modelValue, newValue => {
                const aceEditor = aceEditorRef.value;
                if (aceEditor && aceEditor.getValue() !== newValue) {
                    aceEditor.setValue(newValue);
                    aceEditor.session.selection.clearSelection();
                    aceEditor.session.setScrollTop(0);
                    focusEditorOnDesktopDevice(aceEditor);
                }
            });

            function focusEditorOnDesktopDevice(aceEditor: Ace.Editor) {
                if (isDesktopDevice()) {
                    aceEditor.focus();
                }
            }

            watch(() => props.lang, () => {
                const aceEditor = aceEditorRef.value;

                if (aceEditor) {
                    updateAceEditorMode(aceEditor);
                }
            });

            function updateAceEditorMode(editor: Ace.Editor) {
                const aceMode = 'ace/mode/' + props.lang;
                editor.session.setMode(aceMode);
            }

            function onCodeChanged(code: string) {
                context.emit('update:modelValue', code);
            }

            watch(() => props.annotations, annotations => {
                const aceEditor = aceEditorRef.value;

                if (aceEditor) {
                    aceEditor.session.setAnnotations(annotations);
                }
            });

            function destroyAce() {
                aceEditorRef.value?.destroy();
                aceEditorRef.value = undefined;
            }

            return {
                editorContainer
            };

        }
    });
</script>

<style lang="scss">

    .code-editor-container {
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        overflow: hidden;
    }

    .ace_variable.ace_other {
        font-style: italic;
        color: blue;
    }

</style>
