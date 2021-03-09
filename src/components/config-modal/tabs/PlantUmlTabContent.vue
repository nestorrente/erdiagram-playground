<template>
    <SettingsTabSection title="PlantUml settings">

        <p class="is-italic">No configurable settings are available yet.</p>

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';

    export default defineComponent({
        name: 'PlantUmlTabContent',
        components: {
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
