<template>
    <SettingsTabSection title="TypeScript settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <IdNamingStrategySettingRow :config="config.typescript.classModel"/>
            </tbody>
        </table>

        <TypeBindingsTable
                target-lang="TypeScript"
                :type-bindings="config.typescript.code.typeBindings"
                :default-type-bindings="defaultTypeScriptConfig.typeBindings"
                :display-function="formatTypeScriptType"
                :parse-function="parseTypeScriptType"
        />

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent, PropType} from 'vue';
    import {parseTypeScriptType, typescriptConfigManager, TypeScriptType} from '@nestorrente/erdiagram';
    import TypeBindingsTable from '@/components/settings-modal/tabs/TypeBindingsTable.vue';
    import SettingsTabSection from '@/components/settings-modal/tabs/SettingsTabSection.vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import IdNamingStrategySettingRow
        from '@/components/settings-modal/tabs/common-rows/IdNamingStrategySettingRow.vue';

    export default defineComponent({
        name: 'TypeScriptTabContent',
        components: {
            IdNamingStrategySettingRow,
            SettingsTabSection,
            TypeBindingsTable
        },
        props: {
            config: {
                type: Object as PropType<ERDiagramPlaygroundConfig>,
                required: true
            }
        },
        setup() {

            function formatTypeScriptType(typeScriptType: TypeScriptType) {
                return typeScriptType.format();
            }

            const defaultTypeScriptConfig = typescriptConfigManager.getDefaultConfig();

            return {
                parseTypeScriptType,
                formatTypeScriptType,
                defaultTypeScriptConfig
            };

        }
    });
</script>
