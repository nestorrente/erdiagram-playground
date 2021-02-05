<template>
    <div class="select" :class="{'is-block': block}">
        <select v-model="selectedValue">
            <option
                    v-for="item in items"
                    :key="getItemId(item)"
                    :value="getItemId(item)"
                    v-text="getItemText(item)"
            ></option>
        </select>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, ref, watch} from 'vue';

    type MapperCallback<T, U> = (obj: T) => U;

    interface Props<T> {
        emptyOption: boolean;
        items: T[];
        idField: string | MapperCallback<T, any>;
        textField: string | MapperCallback<T, any>;
        modelValue: any;
        block: boolean;
    }

    function getIdentityCallback<T>(): MapperCallback<T, T> {
        return obj => obj;
    }

    export default defineComponent({
        name: 'SelectInput',
        emits: ['update:modelValue'],
        props: {
            emptyOption: {
                type: Boolean,
                default: false
            },
            items: {
                type: Array,
                default: () => []
            },
            idField: {
                type: [String, Function],
                default: getIdentityCallback
            },
            textField: {
                type: [String, Function],
                default: getIdentityCallback
            },
            modelValue: {
                required: false
            },
            block: {
                type: Boolean,
                default: false
            }
        },
        setup(uncastedProps, context) {

            const props = uncastedProps as Props<any>;

            const idFieldCallback = computed((): MapperCallback<any, any> => {
                const {idField} = props;

                if (typeof idField === 'function') {
                    return idField as MapperCallback<any, any>;
                } else {
                    return obj => obj[String(idField)];
                }
            });

            const textFieldCallback = computed((): MapperCallback<any, any> => {
                const {textField} = props;

                if (typeof textField === 'function') {
                    return textField as MapperCallback<any, any>;
                } else {
                    return obj => obj[String(textField)];
                }
            });

            function getItemId(item: any): string {
                const {value} = idFieldCallback;
                return String(value(item));
            }

            function getItemText(item: any): string {
                const {value} = textFieldCallback;
                return String(value(item));
            }

            const selectedValue = ref<string>();

            watch(
                    () => props.modelValue,
                    value => selectedValue.value = getItemId(value),
                    {immediate: true}
            );

            watch(
                    selectedValue,
                    value => {
                        const selectedItem = props.items.find(item => getItemId(item) === value);
                        context.emit('update:modelValue', selectedItem);
                    }
            );

            return {
                getItemId,
                getItemText,
                selectedValue
            };

        }
    });
</script>
