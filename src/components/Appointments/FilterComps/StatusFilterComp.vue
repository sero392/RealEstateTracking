<template>
    <div>
        <select class="main-combobox" v-bind:value="value" v-on:change="changeStatus">
            <option v-for="(item, index) in statusList" v-bind:key="index" v-bind:value="item.value">
                {{ item.text }}
            </option>
        </select>
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
    methods: {
        changeStatus: function (event) {
            var th = this;
            th.$emit('input', event.target.value)
            th.$emit('searched')
        }
    },
    data() {
        return {
            statusList: [{
                text: 'All Status',
                value: '',
            },
            {
                text: 'Cancelled',
                value: 1,
            },
            {
                text: 'Upcomming',
                value: 2,
            },
            {
                text: 'Completed',
                value: 3,
            }
            ]

        }
    }
}
</script>