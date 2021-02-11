<template>
    <section class="section settings-tab-section">
        <CommonDatabaseSettingsTable
                :database-model-config="config.oracleDatabaseModel"
                :code-converter-config="config.oracle"
        />

        <TypeBindingsTable
                target-lang="MySQL"
                :type-bindings="config.oracle.typeMappings"
        />
    </section>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/modal/config/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/modal/config/database/CommonDatabaseSettingsTable.vue';

    export default defineComponent({
        name: 'OracleTabContent',
        components: {
            CommonDatabaseSettingsTable,
            TypeBindingsTable
        },
        props: {
            config: {
                type: Object,
                required: true
            }
        }
    });
</script>
