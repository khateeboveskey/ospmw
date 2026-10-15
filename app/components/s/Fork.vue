<script setup lang="ts">
import gsap from 'gsap'
import { Building2, User, Laptop } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
// arrows in order of the open-source contribution flow
const arrows = [
  { d: 'M520 150 H1100', lbl: 'Fork', lx: 810, ly: 120, say: 'انسخ المشروع إلى حسابك على GitHub بضغطة زر.' },
  { d: 'M1250 260 C1250 420 1100 520 940 560', lbl: 'git clone', lx: 1210, ly: 470, say: 'انسخ نسختك (fork) إلى جهازك.' },
  { d: 'M980 640 C1180 640 1360 520 1360 270', lbl: 'git push', lx: 1340, ly: 600, say: 'اعمل على فرع جديد، ثم ارفعه إلى نسختك.' },
  { d: 'M1100 210 H520', lbl: 'Pull Request', lx: 810, ly: 250, say: 'افتح PR من نسختك إلى المشروع الأصلي — وأصحابه يراجعون ويقررون.' },
  { d: 'M330 260 C330 460 500 600 680 600', lbl: 'git fetch upstream', lx: 360, ly: 520, say: 'حافظ على نسختك محدّثة من المشروع الأصلي (upstream).' },
]
const svg = ref<SVGSVGElement>()
watch(() => [props.active, props.step] as const, ([a, s]) => {
  if (!a) return
  arrows.forEach((_, i) => {
    const p = svg.value!.querySelector(`[data-a="${i}"]`)!
    const t = svg.value!.querySelector(`[data-t="${i}"]`)!
    if (i < s) gsap.to([p, t], { opacity: 0.35, strokeDashoffset: 0, duration: 0.4 })
    else if (i === s) { gsap.fromTo(p, { strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', delay: 0.3 }); gsap.fromTo(t, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.8 }) }
    else gsap.to([p, t], { opacity: 0, duration: 0.3 })
  })
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="سير العمل الجماعي" :time="time" title="<em class='mono'>Fork</em> والمساهمة في المشاريع المفتوحة" />
    <div class="stage" dir="ltr" data-r>
      <svg ref="svg" viewBox="0 0 1640 720">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#6fd6c8" /></marker></defs>
        <g v-for="(a, i) in arrows" :key="i">
          <path :data-a="i" :d="a.d" pathLength="1" class="ar" marker-end="url(#ah)" opacity="0" />
          <text :data-t="i" :x="a.lx" :y="a.ly" class="al" opacity="0">{{ a.lbl }}</text>
        </g>
      </svg>
      <div class="nd up"><Building2 /><b class="mono">org/project</b><span>المشروع الأصلي (upstream)</span></div>
      <div class="nd fk"><User /><b class="mono">you/project</b><span>نسختك (origin)</span></div>
      <div class="nd lc"><Laptop /><b class="mono">~/project</b><span>جهازك</span></div>
    </div>
    <Transition name="say" mode="out-in"><p :key="step" class="say">{{ arrows[step]?.say }}</p></Transition>
  </section>
</template>

<style scoped>
.stage { position: relative; flex: 1; }
svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.ar { fill: none; stroke: var(--teal-l); stroke-width: 4; stroke-dasharray: 1; stroke-linecap: round; }
.al { font-family: var(--mono); font-size: 26px; fill: #fff; text-anchor: middle; font-weight: 700; }
.nd { position: absolute; width: 330px; padding: 26px; border-radius: 24px; background: var(--navy-d); border: 1px solid var(--line); display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
.nd svg { width: 48px; height: 48px; color: var(--teal-l); stroke-width: 1.5; position: static; }
.nd b { font-size: 26px; } .nd span { font-size: 21px; color: var(--ink-2); }
.up { left: 6%; top: 4%; } .fk { right: 6%; top: 4%; border-color: rgba(111,214,200,.4); } .lc { left: 50%; translate: -50% 0; bottom: 2%; }
.say { font-size: 30px; color: var(--ink-2); text-align: center; min-height: 48px; }
.say-enter-active, .say-leave-active { transition: all .35s var(--ease); }
.say-enter-from { opacity: 0; transform: translateY(12px); } .say-leave-to { opacity: 0; }
</style>
