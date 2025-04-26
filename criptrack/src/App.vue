<template>
  <div id="app">
    <AppHeader />
    <router-view />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'

export default {
  components: {
    AppHeader,
  },
}
</script>

<style>
/* Estilo global para la aplicación */
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: #1b2a2f; /* Fondo más oscuro */
  color: #dbeff0; /* Color de texto base */
}

#app {
  max-width: 1000px;
  margin: auto;
  padding: 20px;
}
</style>
