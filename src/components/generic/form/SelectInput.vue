<template>
    <div class="select" :class="{'is-block': block}">
        <select
                v-model="selectedValue"
                :class="{'has-empty-value': selectedValue === ''}"
                :disabled="disabled"
        >
            <template v-if="hasOptionGroups">
                <option
                        v-for="item in items"
                        :key="getItemId(item)"
                        :value="getItemId(item)"
                        v-text="getItemText(item)"
                ></option>
            </template>
            <template v-else>
                <optgroup
                        v-for="(groupItems, groupName) in items"
                        :key="groupName"
                        :label="groupName"
                >
                    <option
                            v-for="item in groupItems"
                            :key="getItemId(item)"
                            :value="getItemId(item)"
                            v-text="getItemText(item)"
                    ></option>
                </optgroup>
            </template>
        </select>
    </div>
</template>

<script lang="ts">
    import {computed, defineComponent, ref, watch} from 'vue';

    type MapperCallback<T, U> = (obj: T) => U;

    interface Props<T> {
        emptyOption: boolean;
        items: T[] | Record<string, T[]>;
        idField?: string | MapperCallback<T, any>;
        textField?: string | MapperCallback<T, any>;
        modelValue: any;
        block: boolean;
        emptyValueText: string;
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
                type: [Array, Object],
                default: () => []
            },
            idField: {
                type: [String, Function],
                required: false
            },
            textField: {
                type: [String, Function],
                required: false
            },
            modelValue: {
                required: false
            },
            block: {
                type: Boolean,
                default: false
            },
            emptyValueText: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        setup(uncastedProps, context) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props<any>;

            const idFieldCallback = computed((): MapperCallback<any, any> => {
                const {idField} = props;

                if (typeof idField === 'function') {
                    return idField as MapperCallback<any, any>;
                } else if (typeof idField === 'string') {
                    return obj => obj[String(idField)];
                } else {
                    return obj => obj != null ? obj : '';
                }
            });

            const textFieldCallback = computed((): MapperCallback<any, any> => {
                const {textField} = props;

                if (typeof textField === 'function') {
                    return textField as MapperCallback<any, any>;
                } else if (typeof textField === 'string') {
                    return obj => obj[String(textField)];
                } else {
                    return obj => obj != null ? obj : props.emptyValueText;
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

            const hasOptionGroups = computed(() => Array.isArray(props.items));

            const itemsAsArray = computed((): any[] => {
                if (Array.isArray(props.items)) {
                    return props.items;
                } else {
                    return Object.values(props.items).flat();
                }
            });

            const selectedValue = ref<string>();

            watch(
                    () => props.modelValue,
                    value => selectedValue.value = getItemId(value),
                    {immediate: true}
            );

            watch(
                    selectedValue,
                    value => {
                        const selectedItem = itemsAsArray.value.find(item => getItemId(item) === value);
                        context.emit('update:modelValue', selectedItem);
                    }
            );

            return {
                getItemId,
                getItemText,
                hasOptionGroups,
                selectedValue
            };

        }
    });
</script>

<style lang="scss" scoped>

    $empty-value-color: #bbb;

    select {
        color: black;

        &.has-empty-value {
            color: $empty-value-color;
        }
    }

    option {
        color: black;

        &:not([value]), &[value=''] {
            color: $empty-value-color;
        }
    }

</style>
