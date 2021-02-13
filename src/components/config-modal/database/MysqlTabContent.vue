<template>
    <SettingsTabSection title="MySQL settings">
        <CommonDatabaseSettingsTable
                :database-model-config="config.mysqlDatabaseModel"
                :code-converter-config="config.mysql"
                :default-code-converter-config="defaultCodeConverterConfig"
        />

        <TypeBindingsTable
                target-lang="MySQL"
                :type-bindings="config.mysql.typeMappings"
                :default-type-bindings="defaultCodeConverterConfig.typeMappings"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/config-modal/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/config-modal/database/CommonDatabaseSettingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/SettingsTabSection.vue';
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
                defaultCodeConverterConfig: mysqlDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
            };
        }
    });
</script>
