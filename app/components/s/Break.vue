<script setup lang="ts">
import gsap from 'gsap'
import { Coffee } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time: string; back: string; minutes?: number }>()
const total = (props.minutes ?? 15) * 60
const left = ref(total)
const ring = ref<SVGCircleElement>()
let timer: ReturnType<typeof setInterval> | undefined

watch(() => props.active, (a) => {
  clearInterval(timer)
  if (!a) return
  left.value = total
  gsap.fromTo(ring.value!, { strokeDashoffset: 0 }, { strokeDashoffset: 1, autoRound: false, duration: total, ease: 'none' })
  timer = setInterval(() => { left.value = Math.max(0, left.value - 1) }, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
const mmss = computed(() => `${String(Math.floor(left.value / 60)).padStart(2, '0')}:${String(left.value % 60).padStart(2, '0')}`)
</script>

<template>
  <section class="slide brk">
    <div class="txt">
      <div class="kicker" data-r>استراحة <span class="time">{{ time }}</span></div>
      <h2 class="title xl" data-r>وقت <em>القهوة</em></h2>
      <p class="lead" data-r>نعود الساعة <span class="mono">{{ back }}</span> — خذ نفسًا، وراجع ما تعلمناه.</p>
    </div>
    <div class="clock" data-r>
      <svg viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="180" class="track" />
        <circle ref="ring" cx="200" cy="200" r="180" class="ring" pathLength="1" />
      </svg>
      <div class="in">
        <Coffee class="cup" />
        <div class="mm mono">{{ mmss }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brk { flex-direction: row; align-items: center; justify-content: space-between; }
.txt { display: flex; flex-direction: column; gap: 26px; }
.clock { position: relative; width: 520px; height: 520px; }
.clock > svg { width: 100%; height: 100%; transform: rotate(-90deg) scaleY(-1); }
.track { fill: none; stroke: rgba(255,255,255,.08); stroke-width: 14; }
.ring { fill: none; stroke: var(--teal); stroke-width: 14; stroke-linecap: round; stroke-dasharray: 1; }
.in { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; gap: 12px; }
.cup { width: 80px; height: 80px; color: var(--teal-l); stroke-width: 1.5; animation: steam 3s ease-in-out infinite; }
.mm { font-size: 96px; font-weight: 500; letter-spacing: 0.02em; }
@keyframes steam { 50% { transform: translateY(-8px) rotate(-4deg); } }
</style>
