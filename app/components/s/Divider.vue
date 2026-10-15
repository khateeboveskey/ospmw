<script setup lang="ts">
import gsap from 'gsap'
const props = defineProps<{ active: boolean; step: number; n: string; label: string; title: string; sessions: { t: string; name: string }[] }>()
const num = ref<HTMLElement>()
const line = ref<HTMLElement>()
watch(() => props.active, (a) => {
  if (!a) return
  gsap.fromTo(num.value!, { scale: 1.25, opacity: 0, filter: 'blur(20px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out', delay: 0.4 })
  gsap.fromTo(line.value!, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', delay: 0.7 })
})
</script>

<template>
  <section class="slide div">
    <div ref="num" class="num" aria-hidden="true" data-own>{{ n }}</div>
    <div class="txt">
      <div class="kicker" data-r>{{ label }}</div>
      <h2 class="title xl" data-r v-html="title" />
    </div>
    <div class="tl">
      <div ref="line" class="line" />
      <div v-for="s in sessions" :key="s.t" class="ses" data-r>
        <span class="dot" />
        <span class="t mono">{{ s.t }}</span>
        <span class="nm">{{ s.name }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.div { justify-content: center; }
.num { position: absolute; left: 80px; top: 50%; translate: 0 -56%; font-family: var(--serif); font-weight: 900; font-size: 640px; line-height: 1; color: transparent; -webkit-text-stroke: 3px rgba(111, 214, 200, 0.55); background: linear-gradient(180deg, rgba(28,157,142,.35), transparent 70%); -webkit-background-clip: text; background-clip: text; pointer-events: none; direction: ltr; }
.txt { display: flex; flex-direction: column; gap: 22px; max-width: 1100px; position: relative; }
.tl { position: absolute; bottom: 150px; inset-inline: 140px; display: flex; justify-content: space-between; padding-top: 34px; }
.line { position: absolute; top: 0; inset-inline: 0; height: 2px; background: linear-gradient(270deg, var(--teal), rgba(111,214,200,.15)); transform-origin: right; }
.ses { position: relative; display: flex; flex-direction: column; gap: 8px; max-width: 300px; }
.dot { position: absolute; top: -42px; inset-inline-start: 0; width: 16px; height: 16px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 0 6px rgba(28,157,142,.25); }
.t { font-size: 22px; color: var(--teal-l); }
.nm { font-size: 26px; color: var(--ink-2); line-height: 1.4; }
</style>
