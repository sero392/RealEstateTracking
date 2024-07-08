<template>
  <div id="app">
    <AppointmentList></AppointmentList>
  </div>
</template>

<script>
import AppointmentList from './components/Appointments/AppointmentList.vue';

export default {
  name: 'App',
  components: {
    AppointmentList
  },
};
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>