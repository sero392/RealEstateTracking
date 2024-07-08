<template>
  <div id="app">
    <v-app>
      <v-main>
        <v-container>
          <AppointmentList></AppointmentList>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import AppointmentList from './components/Appointments/ListComps/AppointmentList.vue';

export default {
  name: 'App',
  components: {
    AppointmentList
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>