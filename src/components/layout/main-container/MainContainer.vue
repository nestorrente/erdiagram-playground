<template>
	<VerticalSplitPanel
			left-column-min-width="410px"
			right-column-min-width="410px"
			v-model:left-column-width-percent="leftColumnWidthPercent"
	>
		<template #left>
			<!-- We use overflow:hidden because Ace Editor was producing a horizontal overflow -->
			<div class="vertical-full-container" style="overflow: hidden">
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
		</template>

		<template #right>
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
							v-if="parseError"
							lang="text"
							:code="parseErrorDisplayText!"
							download-filename="erdiagram_error.txt"
							wrap
							custom-code-class="has-text-danger"
							full-height
					/>
					<CodeBlock
							v-else-if="isCodeOutput"
							:lang="(selectedOutputFormat as CodeOutputFormat).codeBlockLang"
							:code="outputCode"
							:download-filename="(selectedOutputFormat as CodeOutputFormat).downloadFilename"
							:download-callback="getFileContentsToDownloadOutputCode"
							full-height
					/>
					<SvgDiagramViewer
							v-else-if="isDiagramOutput"
							:svg-code="outputDiagramPromise"
					/>
				</div>
			</div>
		</template>
	</VerticalSplitPanel>
</template>

<script lang="ts">
	import {computed, defineComponent, ref, watch} from 'vue';
	import CodeBlock from '@/components/generic/code/CodeBlock.vue';
	import {
		EntityRelationshipModelParser,
		ERDiagramParseLineError,
		isMultipleFileSourceCodeGenerator,
		SourceFileInfo
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
	import outputFormats, {
		CodeOutputFormat,
		ImageOutputFormat,
		isCodeOutputFormat,
		isImageOutputFormat,
		OutputFormat
	} from '@/common/output/outputFormats';
	import {Ace} from 'ace-builds';
	import SvgDiagramViewer from '@/components/diagram-viewer/SvgDiagramViewer.vue';
	import VerticalSplitPanel from '@/components/generic/split-panel/VerticalSplitPanel.vue';
	import JSZip from 'jszip';
	import {FileContentsOrPromise} from '@/components/generic/file/types';

	export default defineComponent({
		name: 'MainContainer',
		emits: ['showSettingsModal'],
		components: {
			VerticalSplitPanel,
			SvgDiagramViewer,
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
				required: true
			}
		},
		setup() {

			const leftColumnWidthPercent = ref(localStorageAccessor.getVerticalSplitPanelLeftColumnWidthPercent());
			watch(leftColumnWidthPercent, newValue => localStorageAccessor.setVerticalSplitPanelLeftColumnWidthPercent(newValue));

			const {
				liveRef: inputCodeLive,
				debouncedRef: inputCodeDebounced,
				synced: inputCodeSynced
			} = useDebouncedRef(localStorageAccessor.getInputCode(), 300);

			useBeforeUnload(() => !inputCodeSynced.value);

			const entityRelationshipModelParser = computed(() => {
				return new EntityRelationshipModelParser(configStore.config.parser);
			});

			const parseResult = computed(() => {

				// FIXME do not update values in a computed callback!!!
				//  Create a watcher for this computed property, and do the update there
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

				return `Unexpected error when parsing input code:\n\n${error instanceof Error ? error.message : error}`;

			});

			const codeEditorAnnotations = computed((): Ace.Annotation[] => {

				const error = parseError.value;

				if (!(error instanceof ERDiagramParseLineError)) {
					return [];
				}

				return [{
					type: 'error',
					text: error.message,
					row: error.lineIndex
				}];

			});

			const groupedOutputFormats: Record<string, OutputFormat[]> = {
				'Database': [
					outputFormats.mysql,
					outputFormats.oracle,
					outputFormats.postgresql,
					outputFormats.sqlite,
					outputFormats.sqlserver
				],
				'OOP': [
					outputFormats.java,
					outputFormats.typescript
				],
				'Diagram': [
					outputFormats.plantumlCode,
					outputFormats.plantumlDiagram,
					outputFormats.nomnomlCode,
					outputFormats.nomnomlDiagram
				]
			};

			const selectedOutputFormat = ref(localStorageAccessor.getOutputFormat());

			const isCodeOutput = computed(() => isCodeOutputFormat(selectedOutputFormat.value));
			const isDiagramOutput = computed(() => isImageOutputFormat(selectedOutputFormat.value));

			watch(selectedOutputFormat, newValue => localStorageAccessor.setOutputFormat(newValue));

			const outputCode = computed((): string => {

				if (!entityRelationshipModel.value || !isCodeOutput.value) {
					return '';
				}

				const {erModelSourceCodeGenerator} = (selectedOutputFormat.value as CodeOutputFormat);

				return erModelSourceCodeGenerator.generateSourceCode(entityRelationshipModel.value);

			});

			const outputDiagramPromise = computed((): Promise<string> => {

				if (!entityRelationshipModel.value || !isDiagramOutput.value) {
					return Promise.resolve('');
				}

				const erModelToDiagramConverter = (selectedOutputFormat.value as ImageOutputFormat).erModelToImageConverter;

				return erModelToDiagramConverter.convertToDiagram(entityRelationshipModel.value) ?? '';

			});

			async function loadExampleCode(exampleCode: string) {
				if (inputCodeSynced.value || await confirmExampleLoading()) {
					inputCodeDebounced.value = exampleCode;
				}
			}

			function confirmExampleLoading() {
				return showConfirmModalDialog('Any unsaved changes will be lost. Do you want to continue?');
			}

			function getFileContentsToDownloadOutputCode(): FileContentsOrPromise {

				const {erModelSourceCodeGenerator} = (selectedOutputFormat.value as CodeOutputFormat);

				if (entityRelationshipModel.value && isMultipleFileSourceCodeGenerator(erModelSourceCodeGenerator)) {
					const sourceFilesInfo = erModelSourceCodeGenerator.generateSourceFiles(entityRelationshipModel.value);
					return prepareZipFileToDownload(sourceFilesInfo);
				}

				return outputCode.value;

			}

			function prepareZipFileToDownload(sourceFilesInfo: SourceFileInfo[]): Promise<Blob> {

				const zip = new JSZip();

				for (const sourceFileInfo of sourceFilesInfo) {

					const {folder, filename, contents} = sourceFileInfo;
					const filepath = folder.length > 0 ? folder.join('/') + '/' + filename : filename;

					zip.file(filepath, contents);

				}

				return zip.generateAsync({type: 'blob'});

			}

			return {
				leftColumnWidthPercent,
				inputCodeLive,
				inputCodeDebounced,
				inputCodeSynced,
				parseError,
				parseErrorDisplayText,
				codeEditorAnnotations,
				groupedOutputFormats,
				selectedOutputFormat,
				isCodeOutput,
				isDiagramOutput,
				outputCode,
				outputDiagramPromise,
				loadExampleCode,
				entityRelationshipModel,
				getFileContentsToDownloadOutputCode
			};

		}
	});
</script>
