<template>
    <section class="section settings-tab-section">

        <article class="message is-warning">
            <div class="message-body">
                <strong>Be careful editing these types.</strong>
                Any mistake can make your code uncompilable.
            </div>
        </article>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
            <thead>
                <tr>
                    <th>Input type</th>
                    <th>MySQL</th>
                    <th>SQL Server</th>
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
                                v-model="config.mysql.typeMappings[inputPropertyType]"
                                class="input is-small"
                        >
                    </td>
                    <td>
                        <input
                                type="text"
                                v-model="config.sqlserver.typeMappings[inputPropertyType]"
                                class="input is-small"
                        >
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
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import {createJavaType, createTypeScriptType, EntityPropertyType} from '@nestorrente/erdiagram';

    interface Props {
        showing: boolean;
        config: ERDiagramPlaygroundConfig;
    }

    export default defineComponent({
        name: 'TypeBindingsTabContent',
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
    .settings-tab-section {
        padding-top: 1.5em;
        padding-bottom: 1.5em;
    }
</style>
