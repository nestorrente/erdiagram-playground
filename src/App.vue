<template>
	<div class="vertical-full-container">
		<div class="vfc-item">
			<NavBar @show-config="showingConfigModal = true"/>
		</div>
		<section class="section pb-3 vfc-item vfc-grow">
			<!--		<pre>{{ entityRelationshipModel }}</pre>-->
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
                                        Update output code (ctrl + &#9166;)
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
                                <textarea
										class="textarea is-family-code is-full-height code-editor"
										placeholder="Write your Entity-Relationship diagram here..."
										autocomplete="off"
										autocorrect="off"
										autocapitalize="off"
										spellcheck="false"
										v-model="inputCode"
										@keypress.ctrl.enter.prevent="runERDiagram"
										@keydown.tab.prevent="handleTextAreaTab"
								></textarea>
							</div>
						</div>
					</div>
					<div class="column is-half">
						<TabsSection
								:headers="['MySQL', 'Java POJO', 'TypeScript']"
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
		</section>
	</div>
	<ConfigModal
			title="Test modal"
			v-model:showing="showingConfigModal"
			v-model:config="config"
	/>
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

	export default defineComponent({
		name: 'App',
		components: {
			ConfigModal,
			TabsSection,
			CodeBlock,
			NavBar
		},
		setup() {

			const config = ref<ERDiagramPlaygroundConfig>(defaultERDiagramPlaygroundConfig);

			const inputCode = ref(`

Pokemon
    name text(20)
    pokedexNumber int
    legendary bool

Move
    name text(30)
    attackStat short
    defenseStat short
    specialAttackStat short
    specialDefenseStat short

Region
    name text(30)

Pokemon *->* Move

Pokemon *<-> Region

`.trim());
			onMounted(runERDiagram);

			const modelOutdated = ref(true);
			watch(inputCode, () => modelOutdated.value = true);
			watch(config, () => modelOutdated.value = true);

			const hasErrors = ref(false);
			const entityRelationshipModel = ref<EntityRelationshipModel>();

			const entityRelationshipModelParser = computed(() => {
				return new EntityRelationshipModelParser(config.value.erModel);
			});

			function runERDiagram() {

				if (!modelOutdated.value) {
					return;
				}

				modelOutdated.value = false;
				hasErrors.value = false;

				try {
					entityRelationshipModel.value = entityRelationshipModelParser.value.parseModel(inputCode.value);
				} catch (e) {
					hasErrors.value = true;
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

			// FIXME move to another place (custom directive?)
			function handleTextAreaTab(event: KeyboardEvent) {

				const textarea = event.currentTarget as HTMLTextAreaElement;
				const {selectionStart, selectionEnd, value: text} = textarea;

				const textBeforeSelection = text.substring(0, selectionStart);
				const textAfterSelection = text.substring(selectionEnd);

				if (event.shiftKey) {

					const currentLineStartIndex = textBeforeSelection.lastIndexOf('\n') + 1;
					const endOfLineIndex = text.indexOf('\n', currentLineStartIndex);
					const currentLineEndIndex = endOfLineIndex === -1 ? text.length : endOfLineIndex;
					const currentLine = text.substring(currentLineStartIndex, currentLineEndIndex);

					if (currentLine[0] === '\t') {
						const textBeforeTab = text.substring(0, currentLineStartIndex);
						const textAfterTab = text.substring(currentLineStartIndex + 1);
						textarea.value = textBeforeTab + textAfterTab;
						textarea.setSelectionRange(Math.max(currentLineStartIndex, selectionStart - 1), Math.max(currentLineStartIndex, selectionEnd - 1));
						triggerInputEvent(textarea);
					} else if (currentLine.startsWith(' ')) {
						const howManySpaces = /^ {1,4}/.exec(currentLine)![0].length;
						const textBeforeSpaces = text.substring(0, currentLineStartIndex);
						const textAfterSpaces = text.substring(currentLineStartIndex + howManySpaces);
						textarea.value = textBeforeSpaces + textAfterSpaces;
						textarea.setSelectionRange(Math.max(currentLineStartIndex, selectionStart - howManySpaces), Math.max(currentLineStartIndex, selectionEnd - howManySpaces));
						triggerInputEvent(textarea);
					}
				} else {
					textarea.value = textBeforeSelection + '\t' + textAfterSelection;
					textarea.selectionEnd = selectionStart + 1;
					triggerInputEvent(textarea);
				}

			}

			function triggerInputEvent(element: HTMLElement) {
				element.dispatchEvent(new Event('input', {
					bubbles: true,
					cancelable: true,
				}));
			}

			const showingConfigModal = ref(false);

			return {
				inputCode,
				modelOutdated,
				generatedMysqlCode,
				generatedJavaCode,
				generatedTypeScriptCode,
				entityRelationshipModel,
				runERDiagram,
				hasErrors,
				handleTextAreaTab,
				showingConfigModal,
				config
			};

		}
	});
</script>

<style lang="scss">
	.background-transition {
		transition: background ease 0.3s;
	}
</style>
