<template>
    <Dropdown right>
        <template #trigger>
            <Button icon="fas fa-angle-down" fullwidth>
                Examples
            </Button>
        </template>
        <template #items>
            <DropdownItem @click="$emit('loadExample', basicEntitiesExampleCode)">
                <Icon icon="fas fa-list"/>
                Basic entities
            </DropdownItem>
            <DropdownItem @click="$emit('loadExample', dataTypesExampleCode)">
                <Icon icon="fas fa-shapes"/>
                Supported data types
            </DropdownItem>
            <DropdownItem @click="$emit('loadExample', propertyModifiersExampleCode)">
                <Icon icon="fas fa-wrench"/>
                Property modifiers
            </DropdownItem>

            <DropdownDivider/>

            <DropdownItem @click="$emit('loadExample', cardinalitiesExampleCode)">
                <Icon icon="fas fa-users"/>
                Relationship cardinalities
            </DropdownItem>
            <DropdownItem @click="$emit('loadExample', directionsExampleCode)">
                <Icon icon="fas fa-arrows-alt-h"/>
                Relationship directions
            </DropdownItem>
            <DropdownItem @click="$emit('loadExample', relationshipModifiersExampleCode)">
                <Icon icon="fas fa-wrench"/>
                Relationship modifiers (pending)
            </DropdownItem>
            <DropdownItem @click="$emit('loadExample', relationshipAliasesExampleCode)">
                <Icon icon="fas fa-at"/>
                Relationship aliases (pending)
            </DropdownItem>

            <DropdownDivider/>

            <DropdownItem @click="$emit('loadExample', pokemonExampleCode)">
                <Icon icon="fas fa-gamepad"/>
                Pokemon
            </DropdownItem>
        </template>
    </Dropdown>
</template>

<script lang="ts">
    import {defineComponent} from 'vue';
    import Button from '@/components/generic/form/Button.vue';
    import Dropdown from '@/components/generic/form/Dropdown.vue';
    import DropdownItem from '@/components/generic/form/DropdownItem.vue';
    import Icon from '@/components/generic/form/Icon.vue';
    import DropdownDivider from '@/components/generic/form/DropdownDivider.vue';
    import basicEntitiesExampleCode from '!!raw-loader!@/sample-erd-files/entities/BasicEntities.erd';
    import dataTypesExampleCode from '!!raw-loader!@/sample-erd-files/entities/DataTypes.erd';
    import propertyModifiersExampleCode from '!!raw-loader!@/sample-erd-files/entities/PropertyModifiers.erd';
    import cardinalitiesExampleCode from '!!raw-loader!@/sample-erd-files/relationships/Cardinalities.erd';
    import directionsExampleCode from '!!raw-loader!@/sample-erd-files/relationships/Directions.erd';
    import relationshipModifiersExampleCode from '!!raw-loader!@/sample-erd-files/relationships/Modifiers.erd';
    import relationshipAliasesExampleCode from '!!raw-loader!@/sample-erd-files/relationships/Aliases.erd';
    import pokemonExampleCode from '!!raw-loader!@/sample-erd-files/Pokemon.erd';

    export default defineComponent({
        name: 'ExamplesDropdown',
        emits: ['loadExample'],
        components: {
            Button,
            DropdownDivider,
            DropdownItem,
            Dropdown,
            Icon
        },
        setup() {
            return {
                basicEntitiesExampleCode,
                dataTypesExampleCode,
                propertyModifiersExampleCode,
                cardinalitiesExampleCode,
                directionsExampleCode,
                relationshipModifiersExampleCode,
                relationshipAliasesExampleCode,
                pokemonExampleCode
            };
        }
    });
</script>
