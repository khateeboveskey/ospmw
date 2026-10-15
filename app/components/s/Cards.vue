<script setup lang="ts">
import type { Component } from 'vue'
defineProps<{
  active: boolean; step: number
  kicker?: string; title: string; lead?: string; time?: string
  cards: { icon?: Component; t: string; en?: string; d?: string; code?: string }[]
  cols?: number; numbered?: boolean; stepwise?: boolean
}>()
</script>

<template>
  <section class="slide">
    <SlideHead :kicker="kicker" :title="title" :lead="lead" :time="time" />
    <div class="cards" :style="{ gridTemplateColumns: `repeat(${cols ?? 3}, 1fr)` }">
      <article v-for="(c, i) in cards" :key="c.t" class="card c" v-bind="stepwise ? { 'data-step': i } : { 'data-r': '' }">
        <div class="top">
          <div v-if="numbered" class="num mono">{{ String(i + 1).padStart(2, '0') }}</div>
          <div v-else-if="c.icon" class="ico"><component :is="c.icon" /></div>
          <span v-if="c.en" class="en mono">{{ c.en }}</span>
        </div>
        <h3>{{ c.t }}</h3>
        <p v-if="c.d" v-html="c.d" />
        <code v-if="c.code" class="code">{{ c.code }}</code>
      </article>
    </div>
  </section>
</template>

<style scoped>
.cards { display: grid; gap: 28px; flex: 1; align-content: start; }
.c { display: flex; flex-direction: column; gap: 16px; }
.top { display: flex; align-items: center; justify-content: space-between; }
.num { font-size: 40px; font-weight: 700; color: var(--teal-l); }
.en { font-size: 20px; color: var(--ink-3); }
h3 { font-size: 36px; font-weight: 700; line-height: 1.3; }
p { font-size: 25px; color: var(--ink-2); line-height: 1.55; }
.code { align-self: flex-start; font-size: 21px; color: var(--teal-l); background: rgba(4,33,47,.6); padding: 8px 14px; border-radius: 10px; }
</style>
