<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from './views/user/components/NavBar.vue'
import Footer from './views/user/components/Footer.vue'

const route = useRoute()
</script>

<template>
  <div class="font-sans antialiased text-gray-900 bg-white">
    <NavBar v-if="!route.meta.hideLayout" />
    <RouterView />
    <Footer v-if="!route.meta.hideLayout" />
  </div>
</template>

<style scoped></style>
