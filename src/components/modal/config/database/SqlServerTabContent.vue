<template>
    <section class="section settings-tab-section">
        <CommonDatabaseSettingsTable
                :database-model-config="config.sqlServerDatabaseModel"
                :code-converter-config="config.sqlserver"
        />

        <TypeBindingsTable
                target-lang="MySQL"
                :type-bindings="config.sqlserver.typeMappings"
        />
    </section>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import TypeBindingsTable from '@/components/modal/config/TypeBindingsTable.vue';
    import CommonDatabaseSettingsTable from '@/components/modal/config/database/CommonDatabaseSettingsTable.vue';

    export default defineComponent({
        name: 'SqlServerTabContent',
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
