<template>
    <SettingsTabSection title="PlantUML settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <DiagramLevelSettingRow :config="config.plantuml" />
            </tbody>
        </table>
<!--        <p class="is-italic">No configurable settings are available yet.</p>-->

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import SettingsTabSection from '@/components/settings-modal/tabs/SettingsTabSection.vue';
    import DiagramLevelSettingRow from '@/components/settings-modal/tabs/common-rows/DiagramLevelSettingRow.vue';

    export default defineComponent({
        name: 'PlantUmlTabContent',
        components: {
            DiagramLevelSettingRow,
            SettingsTabSection
        },
        props: {
            config: {
                type: Object,
                required: true
            }
        }
    });
</script>
