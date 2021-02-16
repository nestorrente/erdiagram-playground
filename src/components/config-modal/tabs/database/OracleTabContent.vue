<template>
    <SettingsTabSection title="Oracle settings">
        <CommonDatabaseSettingsTable
                :database-model-generator-config="config.oracle.databaseModelGeneratorConfig"
                :database-model-to-code-converter-config="config.oracle.databaseModelToCodeConverterConfig"
                :default-database-model-to-code-converter-config="defaultDatabaseModelToCodeConverterConfig"
        />

        <TypeBindingsTable
                target-lang="Oracle"
                :type-bindings="config.oracle.databaseModelToCodeConverterConfig.typeBindings"
                :default-type-bindings="defaultDatabaseModelToCodeConverterConfig.typeBindings"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/config-modal/tabs/database/CommonDatabaseSettingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import {oracleDatabaseModelToCodeConverterConfigManager} from '@nestorrente/erdiagram';

    export default defineComponent({
        name: 'OracleTabContent',
        components: {
            SettingsTabSection,
            CommonDatabaseSettingsTable,
            TypeBindingsTable
        },
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup() {
            return {
                defaultDatabaseModelToCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
            };
        }
    });
</script>
