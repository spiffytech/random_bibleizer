<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";

const isRouteMatch = (route: string) => useRoute().name === route;
</script>

<template>
  <nav>
    <ul class="flex -mx-4 px-4 py-4 gap-x-4 mb-8 shadow-lg">
      <li class="mr-auto text-xl font-bold jost">
        <RouterLink :to="{ name: 'home' }">Random Bibleizer</RouterLink>
        <span id="title-suffix" class="ml-2 text-gray-600 italic"></span>
      </li>
      <li v-if="!isRouteMatch('home')">
        <RouterLink :to="{ name: 'home' }">Home</RouterLink>
      </li>
      <li v-if="!isRouteMatch('about')">
        <RouterLink :to="{ name: 'about' }">About</RouterLink>
      </li>
    </ul>
  </nav>
  <RouterView :key="$route.fullPath" />
</template>
