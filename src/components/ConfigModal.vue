<template>
	<Modal
			title="Configuration"
			:showing="showing"
			@update:showing="$emit('update:showing', $event)"
	>
		<template #default>

			<article class="message is-warning">
				<div class="message-body">
					This section is work-in-progress. New configurable properties will be added soon!
				</div>
			</article>

			<!--<pre v-text="internalConfig"></pre>-->

			<section class="er-model-config mb-6">

				<h2 class="is-size-5 has-text-weight-bold mb-3">General</h2>

				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input
									type="checkbox"
									v-model="internalConfig.erModel.allowUnknownEntities"
									class="mr-1"
							>
							Allow unknown entities
						</label>
					</div>
				</div>

			</section>

			<section class="mysql-config mb-6">

				<h2 class="is-size-5 has-text-weight-bold mb-3">MySQL</h2>

				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input
									type="checkbox"
									v-model="internalConfig.database.pluralizeTableNames"
									class="mr-1"
							>
							Plural table names
						</label>
					</div>
				</div>

			</section>

			<section class="java-config mb-6">

				<h2 class="is-size-5 has-text-weight-bold mb-3">Java</h2>

				<div class="field">
					<div class="control">
						<label class="checkbox">
							<input
									type="checkbox"
									v-model="internalConfig.java.useSpringNullabilityAnnotations"
									class="mr-1"
							>
							Use Spring @Nullable and @NotNull annotations
						</label>
					</div>
				</div>

				<div class="field">
					<label class="label">Generated classes package:</label>
					<div class="control">
						<input
								type="text"
								v-model="internalConfig.java.generatedClassesPackage"
								placeholder="com.example"
								class="input"
						>
					</div>
				</div>

			</section>

		</template>
		<template #footer>
			<div class="has-text-right" style="width: 100%">
				<button
						class="button is-success"
						@click="saveChanges"
				>
					Save changes
				</button>
				<button
						class="button"
						@click="close"
				>
					Cancel
				</button>
			</div>
		</template>
	</Modal>
</template>

<script lang="ts">
	import {defineComponent, ref, watch} from 'vue';
	import Modal from '@/components/Modal.vue';
	import ERDiagramPlaygroundConfig, {defaultERDiagramPlaygroundConfig, mergeERDiagramPlaygroundConfigs} from '@/config/ERDiagramPlaygroundConfig';

	interface Props {
		title: string;
		showing: boolean;
		config: ERDiagramPlaygroundConfig;
	}

	export default defineComponent({
		name: 'ConfigModal',
		components: {
			Modal
		},
		emits: ['update:showing', 'update:config'],
		props: {
			title: {
				type: String,
				required: true
			},
			showing: {
				type: Boolean,
				default: false
			},
			config: {
				type: Object,
				required: true
			}
		},
		setup(props, context) {

			const internalConfig = ref(mergeERDiagramPlaygroundConfigs(defaultERDiagramPlaygroundConfig));

			watch(() => (props as Props).showing, showing => {
				if (showing) {
					internalConfig.value = mergeERDiagramPlaygroundConfigs((props as Props).config);
				}
			});

			function saveChanges() {
				context.emit('update:config', internalConfig.value);
				close();
			}

			function close() {
				context.emit('update:showing', false);
			}

			return {
				internalConfig,
				saveChanges,
				close
			};

		}
	});
</script>
