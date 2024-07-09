<template>
    <div class="d-flex ml-1">
        <div v-for="(item, index) in agentList" v-bind:key="index">
            <v-avatar dark size="25" class="ml-1" v-bind:color="item.fields.color">
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
        agentList:{
            type: Array,
            required: true
        }
    }
}
</script>