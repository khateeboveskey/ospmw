<script setup lang="ts">
import type { GraphDef } from '~/data/types'
defineProps<{ active: boolean; step: number; kicker?: string; title: string; lead?: string; time?: string; graphs: GraphDef[] }>()
</script>

<template>
  <section class="slide">
    <SlideHead :kicker="kicker" :title="title" :lead="lead" :time="time" />
    <div class="graphs" :class="{ two: graphs.length > 1 }">
      <GitGraph v-for="(g, i) in graphs" :key="i" v-bind="g" :active="active" :step="step" />
    </div>
  </section>
</template>

<style scoped>
.graphs { flex: 1; min-height: 0; display: flex; gap: 70px; }
.graphs.two > * { flex: 1; }
</style>
