<template>
    <h3 class="is-size-5 mb-5 has-text-weight-bold">Type bindings</h3>

    <article class="message is-warning">
        <div class="message-body">
            <strong>Be careful editing these types.</strong>
            Any mistake can break your code.
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
                    v-for="entityPropertyType in entityPropertyTypes"
                    :key="entityPropertyType"
            >
                <td>
                    {{ entityPropertyType }}
                </td>
                <td>
                    <input
                            ref="input"
                            type="text"
                            :value="displayFunction(typeBindings[entityPropertyType])"
                            @change="onTypeBindingChange(
                                entityPropertyType,
                                 ($event.currentTarget as HTMLInputElement).value,
                                  $forceUpdate
                            )"
                            class="input type-binding-input"
                    >
                </td>
                <td>
                    <Button
                            title="Restore default value"
                            rounded
                            small
                            icon="fas fa-undo-alt"
                            @click="typeBindings[entityPropertyType] = defaultTypeBindings[entityPropertyType]"
                    ></Button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import {defineComponent, ref} from 'vue';
    import {EntityPropertyType} from '@nestorrente/erdiagram';
    import Button from '@/components/generic/form/Button.vue';
    import {showErrorToastMessage} from '@/store/globalToastMessageStore';

    function getIdentityFunction<T>() {
        return (value: T) => value;
    }

    interface Props<T> {
        targetLang: string;
        typeBindings: Record<string, T>;
        defaultTypeBindings: Record<string, T>;
        displayFunction: (type: T) => string;
        parseFunction: (type: T) => string;
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
        setup(uncastedProps: any) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props<any>;

            const entityPropertyTypes: string[] = Object.values(EntityPropertyType);

            const input = ref<HTMLInputElement>();

            function onTypeBindingChange(entityPropertyType: string, newValue: string, forceUpdate: () => void) {

                const {
                    typeBindings,
                    parseFunction,
                    displayFunction
                } = props;

                try {
                    typeBindings[entityPropertyType] = parseFunction(newValue);
                } catch (error) {

                    const formattedPreviousType = displayFunction(typeBindings[entityPropertyType]);
                    const errorMessage = `Malformed type "${newValue}". Restored previous type "${formattedPreviousType}".`;

                    showErrorToastMessage(errorMessage, {
                        duration: 3000,
                        maxWidth: 800
                    });

                    // Force a re-render to recover the previous value
                    forceUpdate();

                }

            }

            return {
                entityPropertyTypes,
                input,
                onTypeBindingChange
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
