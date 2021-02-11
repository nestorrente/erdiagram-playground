<template>
    <section class="section settings-tab-section">
        <table class="table is-fullwidth is-striped is-hoverable settings-table">
            <tbody>
                <tr>
                    <td colspan="2">
                        <h2>Input code</h2>
                    </td>
                </tr>
                <tr>
                    <td class="setting-description">
                        Allow using unknown entities in relationships:
                    </td>
                    <td class="setting-value">
                        <label class="checkbox">
                            <input
                                    type="checkbox"
                                    v-model="config.erModel.allowUnknownEntities"
                                    class="mr-1"
                            >
                        </label>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <h2>Java</h2>
                    </td>
                </tr>
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
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';

    export default defineComponent({
        name: 'GeneralTabContent',
        props: {
            config: {
                type: Object,
                required: true
            }
        }
    });
</script>

<style lang="scss">
    .settings-table {

        th, td {
            vertical-align: middle;
        }

        td.setting-value {
            text-align: center;

            label.checkbox {
                width: 100%;
            }

            input[type="checkbox"] {
                $size: 1.2em;
                width: $size;
                height: $size;
            }
        }

        h2 {
            font-weight: bold;
            font-size: 1.2em;
        }

    }
</style>
