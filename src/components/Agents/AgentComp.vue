<template>
    <v-layout wrap class="mw-200 ml-2">
      <v-flex class="pa-0" v-for="(item, index) in openAgents" v-bind:key="index">
        <v-avatar
          dark
          size="25"
          class="ml-1 mouse-pointer"
          v-bind:color="
            item.IsSelected ? 'blue-grey lighten-4' : item.fields.color
          "
          v-on:click="selectAvatar(item)"
        >
          <span class="white--text caption">
            {{ item.fields.agent_name[0] }}
            {{ item.fields.agent_surname[0] }}
          </span>
        </v-avatar>
      </v-flex>

      <v-flex class="pa-0">
        <v-avatar
          dark
          size="25"
          color="blue-grey lighten-2"
          class="ml-1 mouse-pointer"
          v-on:click="toggleAvatar"
        >
          <span v-if="!openAll" class="white--text caption">
            +{{ agentList.length - openAgents.length }}
          </span>
          <span v-else class="caption">
            <v-icon small color="white"> mdi-close </v-icon></span
          >
        </v-avatar>
      </v-flex>
    </v-layout>
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
      required: true,
    },
  },
  computed: {
    openAgents: function () {
      var th = this;
      const length = 5;
      if (!th.openAll) {
        return th.agentList.slice(0, length);
      }
      return th.agentList;
    },
  },
  data() {
    return {
      selectedAgent: [],
      openAll: false,
    };
  },
  methods: {
    toggleAvatar() {
      var th = this;
      th.openAll = !th.openAll;
    },
    selectAvatar(item) {
      var th = this;
      var isSelectedBefore = th.selectedAgent.find((s) => s == item.id);
      if (!isSelectedBefore) {
        th.selectedAgent.push(item.id);
        item.IsSelected = true;
      } else {
        th.selectedAgent.splice(th.selectedAgent.indexOf(item.id), 1);
        item.IsSelected = false;
      }
      th.$emit("input", th.selectedAgent);
      th.$emit("searched");
    },
  },
};
</script>
