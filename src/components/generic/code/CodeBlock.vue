<template>
	<div
			class="is-relative"
			:class="{'is-full-height': fullHeight}"
	>

		<div
				class="buttons-toolbar"
				:style="{
                    '--scrollbar-size': `${codeBlockScrollbarsSize.vertical}px`
                }"
		>
			<Button
					color="warning"
					small
					:icon="copiedState ? 'fas fa-clipboard-check' : 'fas fa-clipboard'"
					class="copy-button"
					:disabled="!code"
					@click="copyCode"
					@mouseleave="copiedState = false"
			>
				{{ copiedState ? 'Copied!' : 'Copy' }}
			</Button>

			<FileDownloadWrapper
					v-if="downloadFilename"
					:file-name="downloadFilename"
					:file-contents="getFileContentsToDownload"
					#default="{downloadFile}"
			>
				<Button
						color="default"
						small
						icon="fas fa-download"
						class="download-button"
						:disabled="!code"
						@click="downloadFile"
				>
				</Button>
			</FileDownloadWrapper>
		</div>

		<pre
				class="code-container"
				:class="[
					{
						'has-white-space-pre-wrap': wrap,
						'is-full-height': fullHeight
					}
				]"
		><code
				ref="codeBlock"
				:class="['language-' + lang, customCodeClass, {'is-full-height': fullHeight}]"
				v-text="code"
		></code></pre>

	</div>
</template>

<script lang="ts">
	import {defineComponent, onMounted, onUpdated, ref} from 'vue';
	import useElementScrollbarsSize from '@/composition/dom/size/useElementScrollbarsSize';
	import Button from '@/components/generic/form/Button.vue';
	import FileDownloadWrapper from '@/components/generic/file/FileDownloadWrapper.vue';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-java.min';
	import 'prismjs/components/prism-sql.min';
	import 'prismjs/components/prism-typescript.min';
	import 'prismjs/plugins/custom-class/prism-custom-class.min';

	Prism.plugins.customClass.prefix('prism--');

	export default defineComponent({
		name: 'CodeBlock',
		components: {FileDownloadWrapper, Button},
		props: {
			lang: {
				type: String,
				default: 'text'
			},
			code: {
				type: String,
				required: true
			},
			wrap: {
				type: Boolean,
				default: false
			},
			fullHeight: {
				type: Boolean,
				default: false
			},
			customCodeClass: {
				type: String,
				required: false
			},
			downloadFilename: {
				type: String,
				required: false
			},
			downloadCallback: {
				type: Function,
				required: false
			}
		},
		setup(props) {

			const codeBlock = ref<HTMLElement>();

			onMounted(highlightCode);
			onUpdated(highlightCode);

			function highlightCode() {
				Prism.highlightElement(codeBlock.value!);
			}

			const copiedState = ref(false);

			function copyCode() {
				navigator.clipboard.writeText(props.code);
				copiedState.value = true;
			}

			const codeBlockScrollbarsSize = useElementScrollbarsSize(codeBlock);

			function getFileContentsToDownload(): string {
				if (props.downloadCallback) {
					return props.downloadCallback();
				}
				return props.code;
			}

			return {
				codeBlock,
				copyCode,
				copiedState,
				codeBlockScrollbarsSize,
				getFileContentsToDownload
			};

		}
	});
</script>

<style lang="scss">
	pre[class*="language-"] {
		padding: 0;
		margin: 0;
	}

	.code-container {
		border-radius: 4px;
		overflow: hidden !important;
		padding: 0 !important;

		> code {
			display: block;
			overflow: auto !important;
			//width: 100% !important;
			padding: 1.25em !important;
		}
	}

	.buttons-toolbar {

		position: absolute;

		top: 1em;
		right: calc(1em + var(--scrollbar-size));

		button + button {
			margin-left: 1em;
		}

		> button {

			transition: opacity ease-in-out 0.15s;

			&:not(:hover) {
				opacity: 0.5;
			}

		}

		> .copy-button > .button-text {
			width: 3em;
		}

	}
</style>
