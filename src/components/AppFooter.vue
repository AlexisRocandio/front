<template>
  <v-footer
    app
    :color="colorF"
    class="text-center text-white d-flex flex-column pa-4"
  >
    <div class="text-h6 font-weight-bold">CRUD-SPI</div>
    <div class="text-caption mt-1">
      Desarrollado por Alexis Rocandio · {{ new Date().getFullYear() }}
    </div>
    <div class="text-caption">
      CRUD - <a target="_blank" class="text-white text-decoration-underline">SPI</a>
    </div>
  </v-footer>
</template>

<script setup>
const colorF = '#002147'
</script>

<style scoped>
a {
  color: inherit;
}
</style>
