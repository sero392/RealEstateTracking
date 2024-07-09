<template>
    <div class="ml-auto">
        <input placeholder="arama yap" class="main-text-field" type="text" v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)" />
        <v-btn icon x-small v-on:click="search">
            <v-icon>
                mdi-magnify
            </v-icon>
        </v-btn>
    </div>
</template>
<script>
export default {

    props: {
        value: {
            type: String,
            required: true,
        },
        records: {
            type: Array,
            required: false,
            default: null
        }
    },
    data() {
        return {
        }
    },
    methods: {
        search() {
            var th = this;
            th.$emit('searched');
        },
    }
}
</script>