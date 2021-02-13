<template>
    <SettingsTabSection title="TypeScript settings">
        <TypeBindingsTable
                target-lang="TypeScript"
                :type-bindings="config.typescript.typeMappings"
                :default-type-bindings="defaultCodeConverterConfig.typeMappings"
                :display-function="formatTypeScriptType"
                :parse-function="parseTypeScriptType"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {
        parseTypeScriptType,
        typescriptClassModelToCodeConverterConfigManager,
        TypeScriptType
    } from '@nestorrente/erdiagram';
    import TypeBindingsTable from '@/components/config-modal/TypeBindingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/SettingsTabSection.vue';

    export default defineComponent({
        name: 'TypeScriptTabContent',
        components: {SettingsTabSection, TypeBindingsTable},
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup() {

            const formatTypeScriptType = (typeScriptType: TypeScriptType) => typeScriptType.format();

            const defaultCodeConverterConfig = typescriptClassModelToCodeConverterConfigManager.getDefaultConfig();

            return {
                parseTypeScriptType,
                formatTypeScriptType,
                defaultCodeConverterConfig
            };

        }
    });
</script>
