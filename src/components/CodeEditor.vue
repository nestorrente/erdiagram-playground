<template>
	<div
			class="code-editor-container"
			ref="editorContainer"
			:class="{'is-full-height': fullHeight}"
	></div>
</template>

<script lang="ts">
	import {defineComponent, onBeforeUnmount, onMounted, ref} from 'vue';
	import ace, {Ace} from 'ace-builds';
	import 'ace-builds/webpack-resolver';
	import 'ace-builds/src-noconflict/mode-json';
	import 'ace-builds/src-noconflict/ext-language_tools';
	import '@/ace/ErdMode';

	export default defineComponent({
		name: 'CodeEditor',
		emits: ['update:modelValue'],
		props: {
			// lang: {
			//     type: String,
			//     required: true
			// },
			modelValue: {
				type: String,
				default: ''
			},
			fullHeight: {
				type: Boolean,
				default: false
			}
		},
		setup(props, context) {

			const editorContainer = ref<HTMLElement>();
			const aceEditorRef = ref<Ace.Editor>();

			onMounted(initAce);
			onBeforeUnmount(destroyAce);

			function initAce() {

				const aceEditor = ace.edit(editorContainer.value!, {
					fontSize: 16
				});
				// aceEditor.session.setMode(JsonHighlightRules as unknown as Ace.SyntaxMode);

				aceEditor.setTheme('ace/theme/chrome');
				// aceEditor.setTheme('ace/theme/tomorrow');

				// aceEditor.session.setMode('ace/mode/r');
				// aceEditor.session.setMode('ace/mode/erd');

				aceEditor.setValue(props.modelValue);
				aceEditor.session.selection.clearSelection();

				aceEditor.on('input', () => onCodeChanged(aceEditor.getValue()));

				aceEditorRef.value = aceEditor;

			}

			function onCodeChanged(code: string) {
				context.emit('update:modelValue', code);
			}

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
		border: 1px solid lightgrey;
		border-radius: 4px;
		overflow: hidden;
	}
</style>
