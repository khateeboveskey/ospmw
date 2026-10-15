<script setup lang="ts">
defineProps<{ kicker?: string; title: string; lead?: string; time?: string }>()
</script>

<template>
  <header class="head">
    <div v-if="kicker" class="kicker" data-r>
      {{ kicker }}<span v-if="time" class="time">{{ time }}</span>
    </div>
    <h2 class="title" data-r v-html="title" />
    <p v-if="lead" class="lead" data-r v-html="lead" />
  </header>
</template>
