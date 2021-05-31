<template>
    <SettingRow
            description="ID naming strategy"
            @restore-default="config.idNamingStrategy = defaultIdNamingStrategy"
    >
        <SelectInput
                :items="idNamingStrategyOptions"
                v-model="selectedIdNamingStrategyOption"
                text-field="text"
                id-field="value"
                block
        ></SelectInput>
    </SettingRow>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import {IdNamingStrategy, StandardIdNamingStrategies} from '@nestorrente/erdiagram';
    import useSelectInputOptions, {SelectInputOption} from '@/composition/form/useSelectInputOptions';
    import SelectInput from '@/components/generic/form/SelectInput.vue';
    import SettingRow from '@/components/config-modal/tabs/SettingRow.vue';

    interface Props {
        config: {
            idNamingStrategy: IdNamingStrategy;
        };
    }

    export default defineComponent({
        name: 'IdNamingStrategySettingRow',
        emits: ['update:modelValue'],
        components: {
            SettingRow,
            SelectInput
        },
        props: {
            config: {
                type: Object,
                required: true
            }
        },
        setup(uncastedProps) {

            // Workaround for an issue with TS types
            const props = uncastedProps as Props;

            const idNamingStrategyOptions: SelectInputOption<IdNamingStrategy>[] = [
                {
                    text: 'Default ("id")',
                    value: StandardIdNamingStrategies.DEFAULT
                },
                {
                    text: 'Prefix entity name ("userId")',
                    value: StandardIdNamingStrategies.ENTITY_NAME_PREFIX
                }
            ];

            const selectedIdNamingStrategyOption = useSelectInputOptions(
                    idNamingStrategyOptions,
                    () => props.config.idNamingStrategy,
                    newValue => props.config.idNamingStrategy = newValue
            );

            const defaultIdNamingStrategy = StandardIdNamingStrategies.DEFAULT;

            return {
                idNamingStrategyOptions,
                selectedIdNamingStrategyOption,
                defaultIdNamingStrategy
            };

        }
    });
</script>
