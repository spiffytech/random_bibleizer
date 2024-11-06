<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <nav>
    <ul class="flex -mx-4 px-4 py-4 gap-x-4 mb-8 shadow-lg">
      <li class="mr-auto text-xl font-bold jost">Random Bibleizer</li>
      <li>
        <a href="mailto:hello@spiffy.tech?subject=%5BRandom%20Bibleizer%5D">Contact Me</a>
      </li>
      <li>
        <a href="https://github.com/spiffytech/random_bibleizer">Source Code</a>
      </li>
    </ul>
  </nav>
  <RouterView />
</template>
