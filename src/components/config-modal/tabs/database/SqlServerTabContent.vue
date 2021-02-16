<template>
    <SettingsTabSection title="SQL Server settings">
        <CommonDatabaseSettingsTable
                :database-model-generator-config="config.sqlserver.databaseModelGeneratorConfig"
                :database-model-to-code-converter-config="config.sqlserver.databaseModelToCodeConverterConfig"
                :default-database-model-to-code-converter-config="defaultDatabaseModelToCodeConverterConfig"
        />

        <TypeBindingsTable
                target-lang="SQL Server"
                :type-bindings="config.sqlserver.databaseModelToCodeConverterConfig.typeBindings"
                :default-type-bindings="defaultDatabaseModelToCodeConverterConfig.typeBindings"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/config-modal/tabs/database/CommonDatabaseSettingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import {sqlServerDatabaseModelToCodeConverterConfigManager} from '@nestorrente/erdiagram';

    export default defineComponent({
        name: 'SqlServerTabContent',
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
                defaultDatabaseModelToCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
            };
        }
    });
</script>
