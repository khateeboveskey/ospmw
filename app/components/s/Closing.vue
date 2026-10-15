<script setup lang="ts">
import gsap from 'gsap'
const props = defineProps<{ active: boolean; step: number }>()
const art = ref<HTMLElement>()
watch(() => props.active, (a) => {
  if (!a) return
  gsap.fromTo(art.value!.querySelectorAll('i'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: { each: 0.03, from: 'center' }, ease: 'expo.out', delay: 0.5 })
})
</script>

<template>
  <section class="slide end">
    <div ref="art" class="dots" aria-hidden="true"><i v-for="n in 48" :key="n" /></div>
    <div class="kicker" data-r>ختام الورشة</div>
    <h2 class="title xl" data-r>شكرًا <em>لكم</em></h2>
    <p class="lead" data-r>أسئلة؟ نقاش؟ — الكود الجيد يُكتب مرة، ويُراجَع دائمًا.</p>
    <div class="cmd mono" data-r>git commit -m "chore: workshop complete"</div>
  </section>
</template>

<style scoped>
.end { align-items: center; justify-content: center; text-align: center; gap: 28px; }
.cmd { font-size: 28px; color: var(--teal-l); padding: 16px 30px; border: 1px solid var(--line); background: rgba(4,33,47,.6); border-radius: 16px; margin-top: 20px; }
.dots { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(12, 1fr); place-items: center; padding: 120px; opacity: .22; pointer-events: none; }
.dots i { width: 14px; height: 14px; border-radius: 50%; background: var(--teal); }
.dots i:nth-child(5n) { background: #fff; width: 22px; height: 22px; }
</style>
