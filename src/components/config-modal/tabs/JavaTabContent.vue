<template>
    <SettingsTabSection title="Java settings">

        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <tr>
                    <td class="setting-description">
                        Generated classes package:
                    </td>
                    <td class="setting-value">
                        <input
                                type="text"
                                class="input"
                                v-model="config.java.generatedClassesPackage"
                                placeholder="com.example"
                        >
                    </td>
                    <td style="width: 58px">
                        <Button
                                title="Restore default value"
                                rounded
                                small
                                icon="fas fa-undo-alt"
                                @click="config.java.generatedClassesPackage = defaultCodeConverterConfig.generatedClassesPackage"
                        ></Button>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Use Spring @Nullable and @NotNull annotations:
                    </td>
                    <td class="setting-value">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="config.java.useSpringNullabilityAnnotations"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                    <td style="width: 58px">
                        <Button
                                title="Restore default value"
                                rounded
                                small
                                icon="fas fa-undo-alt"
                                @click="config.java.useSpringNullabilityAnnotations = defaultCodeConverterConfig.useSpringNullabilityAnnotations"
                        ></Button>
                    </td>
                </tr>
            </tbody>
        </table>

        <TypeBindingsTable
                target-lang="Java"
                :type-bindings="config.java.typeMappings"
                :default-type-bindings="defaultCodeConverterConfig.typeMappings"
                :display-function="formatJavaType"
                :parse-function="parseJavaType"
        />

    </SettingsTabSection>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {javaClassModelToCodeConverterConfigManager, JavaType, parseJavaType} from '@nestorrente/erdiagram';
    import TypeBindingsTable from '@/components/config-modal/tabs/TypeBindingsTable.vue';
    import SettingsTabSection from '@/components/config-modal/tabs/SettingsTabSection.vue';
    import Button from '@/components/generic/form/Button.vue';

    export default defineComponent({
        name: 'JavaTabContent',
        components: {Button, SettingsTabSection, TypeBindingsTable},
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup() {

            const formatJavaType = (javaType: JavaType) => javaType.formatCanonical();

            const defaultCodeConverterConfig = javaClassModelToCodeConverterConfigManager.getDefaultConfig();

            return {
                parseJavaType,
                formatJavaType,
                defaultCodeConverterConfig
            };

        }
    });
</script>
