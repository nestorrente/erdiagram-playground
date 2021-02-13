<template>
    <SettingsTabSection title="Oracle settings">
        <CommonDatabaseSettingsTable
                :database-model-config="config.oracleDatabaseModel"
                :code-converter-config="config.oracle"
                :default-code-converter-config="defaultCodeConverterConfig"
        />

        <TypeBindingsTable
                target-lang="Oracle"
                :type-bindings="config.oracle.typeMappings"
                :default-type-bindings="defaultCodeConverterConfig.typeMappings"
        />
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/config-modal/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/config-modal/database/CommonDatabaseSettingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/SettingsTabSection.vue';
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
                defaultCodeConverterConfig: oracleDatabaseModelToCodeConverterConfigManager.getDefaultConfig()
            };
        }
    });
</script>
