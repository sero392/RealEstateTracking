<template>
    <div class="d-flex ml-1">
        <div v-for="(item, index) in agentList" v-bind:key="index">
            <v-avatar dark size="25" class="ml-1 mouse-pointer"
                v-bind:color="item.IsSelected ? 'blue-grey lighten-4' : item.fields.color"
                v-on:click="selectAvatar(item)">
                <span class="white--text caption">
                    {{ item.fields.agent_name[0] }}
                    {{ item.fields.agent_surname[0] }}
                </span>
            </v-avatar>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: Array,
            required: false,
        },
        agentIdList: {
            type: Array,
            required: false,
        },
        agentList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            selectedAgent: [],
        }
    },
    methods: {
        selectAvatar(item) {
            var th = this;
            var isSelectedBefore = th.selectedAgent.find(s => s == item.id);
            if (!isSelectedBefore) {
                th.selectedAgent.push(item.id);
                item.IsSelected = true;
            }
            else {
                th.selectedAgent.splice(th.selectedAgent.indexOf(item.id), 1);
                item.IsSelected = false;
            }
            th.$emit('input', th.selectedAgent)
            th.$emit('searched');
        },

    },

}
</script>