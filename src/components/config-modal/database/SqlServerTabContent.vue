<template>
    <SettingsTabSection title="SQL Server settings">
        <CommonDatabaseSettingsTable
                :database-model-config="config.sqlServerDatabaseModel"
                :code-converter-config="config.sqlserver"
                :default-code-converter-config="defaultCodeConverterConfig"
        />

        <TypeBindingsTable
                target-lang="SQL Server"
                :type-bindings="config.sqlserver.typeMappings"
                :default-type-bindings="defaultCodeConverterConfig.typeMappings"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/config-modal/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/config-modal/database/CommonDatabaseSettingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/SettingsTabSection.vue';
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
                defaultCodeConverterConfig: sqlServerDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
            };
        }
    });
</script>
