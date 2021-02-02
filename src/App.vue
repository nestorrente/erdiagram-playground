<template>
	<NavBar/>
	<section id="main-section" class="section">
		<pre>{{ entityRelationshipModel }}</pre>
		<div class="container is-full-height">
			<div class="toolbar">
				<div class="select">
					<select v-model="selectedOutputOptionUuid">
						<option
								v-for="option in outputOptions"
								:key="option.uuid"
								v-text="option.name"
								:value="option.uuid"
						></option>
					</select>
				</div>
				<button
						class="button is-primary"
						@click="runERDiagram"
				>Parse ER diagram
				</button>
			</div>
			<div class="columns is-full-height">
				<div class="column">
					<textarea
							class="textarea is-full-height"
							placeholder="Write your Entity-Relationship diagram here"
							v-model="inputCode"
					></textarea>
				</div>
				<div class="column">
					<CodeBlock
							:lang="selectedOutputOption.language"
							:code="outputCode"
							full-height
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
	import {computed, defineComponent, ref} from 'vue';
	import NavBar from '@/components/NavBar.vue';
	import CodeBlock from '@/components/CodeBlock.vue';
	import {EntityRelationshipModel} from '@nestorrente/erdiagram/dist/erdiagram/parser/EntityRelationshipModelParser';
	import {entityRelationshipModelParser, EntityRelationshipModelToClassCodeConverter, EntityRelationshipModelToDatabaseCodeConverter, JavaClassModelToCodeConverter, MySqlDatabaseModelToCodeConverter} from '@nestorrente/erdiagram';

	interface OutputOption {
		uuid: string;
		name: string;
		language: string;
	}

	export default defineComponent({
		name: 'App',
		components: {
			CodeBlock,
			NavBar
		},
		setup() {

			const outputOptions: OutputOption[] = [
				{
					uuid: 'mysql',
					name: 'MySQL',
					language: 'sql'
				},
				{
					uuid: 'java',
					name: 'Java',
					language: 'java'
				}
			];

			const selectedOutputOptionUuid = ref(outputOptions[0].uuid);

			const selectedOutputOption = computed(() => {
				return outputOptions.find(option => option.uuid === selectedOutputOptionUuid.value);
			});

			const inputCode = ref('');

			const entityRelationshipModel = ref<EntityRelationshipModel>();

			function runERDiagram() {
				if (inputCode.value.replace(/\s+/g, '').length !== 0) {
					try {
						entityRelationshipModel.value = entityRelationshipModelParser.parseModel(inputCode.value);
					} catch (e) {
						console.error(e);
					}
				} else {
					entityRelationshipModel.value = undefined;
				}
			}

			const mysqlConverter = new EntityRelationshipModelToDatabaseCodeConverter(
					new MySqlDatabaseModelToCodeConverter()
			);

			const javaConverter = new EntityRelationshipModelToClassCodeConverter(
					new JavaClassModelToCodeConverter()
			);

			const outputCode = computed(() => {
				if (entityRelationshipModel.value == null) {
					return '';
				}
				switch (selectedOutputOptionUuid.value) {
					case 'mysql':
						return mysqlConverter.generateCode(entityRelationshipModel.value);
					case 'java':
						return javaConverter.generateCode(entityRelationshipModel.value);
					default:
						return '';
				}
			});

			return {
				inputCode,
				outputCode,
				outputOptions,
				selectedOutputOptionUuid,
				selectedOutputOption,
				entityRelationshipModel,
				runERDiagram
			};

		}
	});
</script>

<style lang="scss">
	html,
	body,
	#app,
	.is-full-height {
		box-sizing: border-box;
		height: 100%;
	}

	#main-section {
		box-sizing: border-box;
		height: calc(100% - 56px);
	}
</style>
