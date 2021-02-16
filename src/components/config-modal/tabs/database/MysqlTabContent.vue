<template>
    <SettingsTabSection title="MySQL settings">
        <CommonDatabaseSettingsTable
                :database-model-generator-config="config.mysql.databaseModelGeneratorConfig"
                :database-model-to-code-converter-config="config.mysql.databaseModelToCodeConverterConfig"
                :default-database-model-to-code-converter-config="defaultDatabaseModelToCodeConverterConfig"
        />

        <TypeBindingsTable
                target-lang="MySQL"
                :type-bindings="config.mysql.databaseModelToCodeConverterConfig.typeBindings"
                :default-type-bindings="defaultDatabaseModelToCodeConverterConfig.typeBindings"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/config-modal/tabs/database/CommonDatabaseSettingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import {mysqlDatabaseModelToCodeConverterConfigManager} from '@nestorrente/erdiagram';

    export default defineComponent({
        name: 'MysqlTabContent',
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
                defaultDatabaseModelToCodeConverterConfig: mysqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
            };
        }
    });
</script>
