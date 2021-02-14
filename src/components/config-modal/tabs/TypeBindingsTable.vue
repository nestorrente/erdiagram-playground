<template>
    <h3 class="is-size-5 mb-5 has-text-weight-bold">Type bindings</h3>

    <article class="message is-warning">
        <div class="message-body">
            <strong>Be careful editing these types.</strong>
            Any mistake can make your code uncompilable.
        </div>
    </article>

    <table class="table is-fullwidth is-striped is-hoverable is-narrow type-bindings-table">
        <thead>
            <tr>
                <th>ERDiagram</th>
                <th>{{ targetLang }}</th>
                <th style="width: 52px"></th>
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
                            class="input type-binding-input"
                    >
                </td>
                <td>
                    <Button
                            title="Restore default value"
                            rounded
                            small
                            icon="fas fa-undo-alt"
                            @click="typeBindings[inputPropertyType] = defaultTypeBindings[inputPropertyType]"
                    ></Button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {EntityPropertyType} from '@nestorrente/erdiagram';
    import Button from '@/components/generic/form/Button.vue';

    function getIdentityFunction<T>() {
        return (value: T) => value;
    }

    export default defineComponent({
        name: 'TypeBindingsTable',
        components: {Button},
        props: {
            targetLang: {
                type: String,
                required: true
            },
            typeBindings: {
                type: Object,
                required: true
            },
            defaultTypeBindings: {
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

<style lang="scss">
    .type-bindings-table {
        font-size: 0.9em;

        .input {
            font-size: 1em;
        }
    }
</style>
