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

        <h2 class="is-size-4 mt-6 mb-5">Java & TypeScript type bindings</h2>

        <article class="message is-warning">
            <div class="message-body">
                <strong>Be careful editing these types.</strong>
                Any mistake can make your code uncompilable.
            </div>
        </article>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
                <tr>
                    <th>ERDiagram</th>
                    <th>Java</th>
                    <th>TypeScript</th>
                </tr>
            </thead>
            <tbody>
                <tr
                        v-for="inputPropertyType in inputPropertyTypes"
                        :key="inputPropertyType"
                >
                    <td>
                        {{ inputPropertyType }}
                    </td>
                    <td>
                        <input
                                type="text"
                                :value="config.java.typeMappings[inputPropertyType].canonicalName"
                                @change="config.java.typeMappings[inputPropertyType] = parseJavaType($event.currentTarget.value)"
                                class="input is-small"
                        >
                    </td>
                    <td>
                        <input
                                type="text"
                                :value="config.typescript.typeMappings[inputPropertyType].name"
                                @change="config.typescript.typeMappings[inputPropertyType] = parseTypeScriptType($event.currentTarget.value)"
                                class="input is-small"
                        >
                    </td>
                </tr>
            </tbody>
        </table>

    </section>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {createJavaType, createTypeScriptType, EntityPropertyType} from '@nestorrente/erdiagram';

    export default defineComponent({
        name: 'OtherTabContent',
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup() {

            const inputPropertyTypes: string[] = Object.values(EntityPropertyType);

            function parseJavaType(text: string) {
                const lastDotIndex = text.lastIndexOf('.');
                if (lastDotIndex === -1) {
                    return createJavaType(text);
                } else {
                    const packageName = text.substring(0, lastDotIndex);
                    const className = text.substring(lastDotIndex + 1);
                    return createJavaType(className, packageName);
                }
            }

            function parseTypeScriptType(text: string) {
                return createTypeScriptType(text);
            }

            return {
                inputPropertyTypes,
                parseJavaType,
                parseTypeScriptType
            };

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
