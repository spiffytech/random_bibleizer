<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

import type { Book, Passage } from '../books';

import Spinner from '../components/Spinner.vue';
import YouVersion from '@/components/YouVersion.vue';

const passage = ref(null) as Ref<Passage | null>;
</script>

<template>
  <Spinner @select-book="passage = $event" />
  <YouVersion v-if="passage" :passage="passage" />
</template>
