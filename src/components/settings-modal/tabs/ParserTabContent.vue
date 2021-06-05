<template>
    <SettingsTabSection title="Parser settings">
        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <tr>
                    <td class="setting-description">
                        Allow using unknown entities in relationships:
                    </td>
                    <td class="setting-value">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="config.parser.allowUnknownEntities"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                </tr>
            </tbody>
        </table>
    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {EntityPropertyType, parseJavaType, parseTypeScriptType} from '@nestorrente/erdiagram';
    import SettingsTabSection from '@/components/settings-modal/tabs/SettingsTabSection.vue';

    export default defineComponent({
        name: 'OtherTabContent',
        components: {SettingsTabSection},
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup() {

            const inputPropertyTypes: string[] = Object.values(EntityPropertyType);

            return {
                inputPropertyTypes,
                parseJavaType,
                parseTypeScriptType
            };

        }
    });
</script>
