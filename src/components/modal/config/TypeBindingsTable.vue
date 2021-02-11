<template>
    <h2 class="is-size-4 mb-5">Type bindings</h2>

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
                <th>{{ targetLang }}</th>
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
                            :value="displayFunction(typeBindings[inputPropertyType])"
                            @change="typeBindings[inputPropertyType] = parseFunction($event.currentTarget.value)"
                            class="input is-small"
                    >
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import ERDiagramPlaygroundConfig from '@/config/ERDiagramPlaygroundConfig';
    import {EntityPropertyType} from '@nestorrente/erdiagram';

    interface Props {
        showing: boolean;
        config: ERDiagramPlaygroundConfig;
    }

    function getIdentityFunction<T>() {
        return (value: T) => value;
    }

    export default defineComponent({
        name: 'TypeBindingsTable',
        props: {
            targetLang: {
                type: String,
                required: true
            },
            typeBindings: {
                type: Object,
                required: true
            },
            displayFunction: {
                type: Function,
                default: getIdentityFunction()
            },
            parseFunction: {
                type: Function,
                default: getIdentityFunction()
            }
        },
        setup() {

            const inputPropertyTypes: string[] = Object.values(EntityPropertyType);

            return {
                inputPropertyTypes
            };

        }
    });
</script>
