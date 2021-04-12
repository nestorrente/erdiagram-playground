<template>
	<SettingsTabSection title="Java settings">

		<table class="table is-fullwidth is-striped is-hoverable settings-table">
			<tbody>
				<SettingRow
						description="Generated classes package"
						@restore-default="config.java.classModelToCodeConverterConfig.generatedClassesPackage = defaultClassModelToCodeConverterConfig.generatedClassesPackage"
				>
					<input
							type="text"
							class="input"
							v-model="config.java.classModelToCodeConverterConfig.generatedClassesPackage"
							placeholder="com.example"
					>
				</SettingRow>
				<IdNamingStrategySettingRow :config="config.java.classModelGeneratorConfig"/>
				<SettingRow
						description="Use Java Validation API (JSR-303) annotations"
						@restore-default="config.java.classModelToCodeConverterConfig.useValidationAnnotations = defaultClassModelToCodeConverterConfig.useValidationAnnotations"
				>
					<label class="checkbox">
						<input
								type="checkbox"
								v-model="config.java.classModelToCodeConverterConfig.useValidationAnnotations"
								class="mr-1"
						>
					</label>
				</SettingRow>
				<SettingRow
						description="Not-null text validation strategy"
						@restore-default="config.java.classModelToCodeConverterConfig.notNullTextValidationStrategy = defaultClassModelToCodeConverterConfig.notNullTextValidationStrategy"
				>
					<SelectInput
							:items="notNullTextValidationStrategyOptions"
							v-model="selectedNotNullTextValidationStrategyOption"
							text-field="text"
							id-field="text"
							block
					></SelectInput>
				</SettingRow>
				<SettingRow
						description="Not-null blob validation strategy"
						@restore-default="config.java.classModelToCodeConverterConfig.notNullBlobValidationStrategy = defaultClassModelToCodeConverterConfig.notNullBlobValidationStrategy"
				>
					<SelectInput
							:items="notNullBlobValidationStrategyOptions"
							v-model="selectedNotNullBlobValidationStrategyOption"
							text-field="text"
							id-field="text"
							block
					></SelectInput>
				</SettingRow>
			</tbody>
		</table>

		<TypeBindingsTable
				target-lang="Java"
				:type-bindings="config.java.classModelToCodeConverterConfig.typeBindings"
				:default-type-bindings="defaultClassModelToCodeConverterConfig.typeBindings"
				:display-function="formatJavaType"
				:parse-function="parseJavaType"
		/>

	</SettingsTabSection>
</template>

<script lang="ts">
	import {defineComponent} from 'vue';
	import {classModelGeneratorConfigManager, javaClassModelToCodeConverterConfigManager, JavaType, NotNullBlobValidationStrategy, NotNullTextValidationStrategy, parseJavaType} from '@nestorrente/erdiagram';
	import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
	import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
	import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
	import SettingRow from '@/components/config-modal/tabs/SettingRow.vue';
	import IdNamingStrategySettingRow from '@/components/config-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';
	import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
	import SelectInput from '@/components/generic/form/SelectInput.vue';

	interface Props {
		config: ERDiagramPlaygroundConfig;
	}

	interface Props {
		config: ERDiagramPlaygroundConfig;
	}

	export default defineComponent({
		name: 'JavaTabContent',
		components: {
			SelectInput,
			IdNamingStrategySettingRow,
			SettingRow,
			SettingsTabSection,
			TypeBindingsTable
		},
		props: {
			config: {
				type: Object,
				required: true
			}
		},
		setup(uncastedProps) {

			// Workaround for an issue with TS types
			const props = uncastedProps as Props;

			const formatJavaType = (javaType: JavaType) => javaType.formatCanonical();

			const defaultClassModelGeneratorConfig = classModelGeneratorConfigManager.getDefaultConfig();
			const defaultClassModelToCodeConverterConfig = javaClassModelToCodeConverterConfigManager.getDefaultConfig();

			const notNullTextValidationStrategyOptions: SelectInputOption<NotNullTextValidationStrategy>[] = [
				{
					text: '@NotNull',
					value: NotNullTextValidationStrategy.NOT_NULL
				},
				{
					text: '@NotEmpty',
					value: NotNullTextValidationStrategy.NOT_EMPTY
				},
				{
					text: '@NotBlank',
					value: NotNullTextValidationStrategy.NOT_BLANK
				}
			];

			const selectedNotNullTextValidationStrategyOption = useSelectInputOptions(
					notNullTextValidationStrategyOptions,
					() => props.config.java.classModelToCodeConverterConfig.notNullTextValidationStrategy,
					newValue => props.config.java.classModelToCodeConverterConfig.notNullTextValidationStrategy = newValue
			);

			const notNullBlobValidationStrategyOptions: SelectInputOption<NotNullBlobValidationStrategy>[] = [
				{
					text: '@NotNull',
					value: NotNullBlobValidationStrategy.NOT_NULL
				},
				{
					text: '@NotEmpty',
					value: NotNullBlobValidationStrategy.NOT_EMPTY
				}
			];

			const selectedNotNullBlobValidationStrategyOption = useSelectInputOptions(
					notNullBlobValidationStrategyOptions,
					() => props.config.java.classModelToCodeConverterConfig.notNullBlobValidationStrategy,
					newValue => props.config.java.classModelToCodeConverterConfig.notNullBlobValidationStrategy = newValue
			);

			return {
				parseJavaType,
				formatJavaType,
				notNullTextValidationStrategyOptions,
				selectedNotNullTextValidationStrategyOption,
				notNullBlobValidationStrategyOptions,
				selectedNotNullBlobValidationStrategyOption,
				defaultClassModelGeneratorConfig,
				defaultClassModelToCodeConverterConfig
			};

		}
	});
</script>
