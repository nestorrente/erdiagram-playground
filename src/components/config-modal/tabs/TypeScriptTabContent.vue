<template>
	<SettingsTabSection title="TypeScript settings">

		<table class="table is-fullwidth is-striped is-hoverable settings-table">
			<tbody>
				<IdNamingStrategySettingRow :config="config.typescript.classModelGeneratorConfig"/>
			</tbody>
		</table>

		<TypeBindingsTable
				target-lang="TypeScript"
				:type-bindings="config.typescript.classModelToCodeConverterConfig.typeBindings"
				:default-type-bindings="defaultClassModelToCodeConverterConfig.typeBindings"
				:display-function="formatTypeScriptType"
				:parse-function="parseTypeScriptType"
		/>

	</SettingsTabSection>
</template>

<script lang="ts">
	import {defineComponent} from 'vue';
	import {classModelGeneratorConfigManager, parseTypeScriptType, typescriptClassModelToCodeConverterConfigManager, TypeScriptType} from '@nestorrente/erdiagram';
	import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
	import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
	import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
	import IdNamingStrategySettingRow from '@/components/config-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';

	interface Props {
		config: ERDiagramPlaygroundConfig;
	}

	export default defineComponent({
		name: 'TypeScriptTabContent',
		components: {
			IdNamingStrategySettingRow,
			SettingsTabSection,
			TypeBindingsTable
		},
		props: {
			config: {
				type: Object,
				required: true
			}
		},
		setup() {

			const formatTypeScriptType = (typeScriptType: TypeScriptType) => typeScriptType.format();

			const defaultClassModelGeneratorConfig = classModelGeneratorConfigManager.getDefaultConfig();
			const defaultClassModelToCodeConverterConfig = typescriptClassModelToCodeConverterConfigManager.getDefaultConfig();

			return {
				parseTypeScriptType,
				formatTypeScriptType,
				defaultClassModelGeneratorConfig,
				defaultClassModelToCodeConverterConfig
			};

		}
	});
</script>
