<template>
    <SettingsTabSection title="PostgreSQL settings">
        <CommonDatabaseSettingsTable
                :database-model-generator-config="config.postgresql.databaseModelGeneratorConfig"
                :database-model-to-code-converter-config="config.postgresql.databaseModelToCodeConverterConfig"
                :default-database-model-to-code-converter-config="defaultDatabaseModelToCodeConverterConfig"
        />

        <TypeBindingsTable
                target-lang="PostgreSQL"
                :type-bindings="config.postgresql.databaseModelToCodeConverterConfig.typeBindings"
                :default-type-bindings="defaultDatabaseModelToCodeConverterConfig.typeBindings"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/config-modal/tabs/database/CommonDatabaseSettingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import {postgresqlDatabaseModelToCodeConverterConfigManager} from '@nestorrente/erdiagram';

    export default defineComponent({
        name: 'PostgresqlTabContent',
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
                defaultDatabaseModelToCodeConverterConfig: postgresqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
            };
        }
    });
</script>
