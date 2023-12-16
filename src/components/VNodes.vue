<script lang="ts">
    export default {
        name: 'VNodes',
        props: {
            // A VNode or an array of them
            nodes: [Object, Array]
        },
        render() {
            return this.nodes;
        }
    };
</script>
