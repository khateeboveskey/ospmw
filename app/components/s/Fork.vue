<script setup lang="ts">
import gsap from 'gsap'
import { Building2, User, Laptop } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
// arrows in order of the open-source contribution flow; geometry matches the 1640×540 stage (nodes 330×180)
const arrows = [
  { d: 'M445 66 H1192', lbl: 'Fork', lx: 818, ly: 66, say: 'انسخ المشروع إلى حسابك على GitHub بضغطة زر.' },
  { d: 'M1265 192 L1000 372', lbl: 'git clone', lx: 1172, ly: 255, say: 'انسخ نسختك (fork) إلى جهازك.' },
  { d: 'M1000 428 L1320 192', lbl: 'git push', lx: 1096, ly: 357, say: 'اعمل على فرع جديد، ثم ارفعه إلى نسختك.' },
  { d: 'M1192 114 H445', lbl: 'Pull Request', lx: 818, ly: 114, say: 'افتح PR من نسختك إلى المشروع الأصلي — وأصحابه يراجعون ويقررون.' },
  { d: 'M265 192 C265 330 440 450 640 450', lbl: 'git fetch upstream', lx: 378, ly: 372, say: 'حافظ على نسختك محدّثة من المشروع الأصلي (upstream).' },
]
const chipW = (l: string) => l.length * 15.6 + 36
const svg = ref<SVGSVGElement>()
watch(() => [props.active, props.step] as const, ([a, s], [pa]) => {
  if (!a) return
  const q = (sel: string) => svg.value!.querySelector(sel)!
  if (!pa) gsap.set(svg.value!.querySelectorAll('[data-a],[data-t]'), { opacity: 0 }) // entering: slide still hidden
  arrows.forEach((_, i) => {
    const p = q(`[data-a="${i}"]`)
    const t = q(`[data-t="${i}"]`)
    if (i < s) gsap.to([p, t], { opacity: 0.35, strokeDashoffset: 0, autoRound: false, duration: 0.5, delay: pa ? 0 : 0.6 })
    else if (i === s) {
      gsap.fromTo(p, { strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, autoRound: false, duration: 1, // arrowhead fades in with the draw
        ease: 'power2.inOut', delay: pa ? 0.2 : 0.8 })
      gsap.fromTo(t, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', delay: pa ? 0.7 : 1.3, svgOrigin: `${arrows[i]!.lx} ${arrows[i]!.ly}` })
    } else gsap.to([p, t], { opacity: 0, duration: 0.3 })
  })
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="سير العمل الجماعي" :time="time" title="<em class='mono'>Fork</em> والمساهمة في المشاريع المفتوحة" />
    <div class="stage" dir="ltr" data-r>
      <svg ref="svg" viewBox="0 0 1640 540">
        <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#6fd6c8" /></marker></defs>
        <path v-for="(a, i) in arrows" :key="'a' + i" :data-a="i" :d="a.d" pathLength="1" class="ar" marker-end="url(#ah)" opacity="0" />
        <g v-for="(a, i) in arrows" :key="'t' + i" :data-t="i" opacity="0">
          <rect :x="a.lx - chipW(a.lbl) / 2" :y="a.ly - 20" :width="chipW(a.lbl)" height="40" rx="20" class="chip" />
          <text :x="a.lx" :y="a.ly + 8" class="al">{{ a.lbl }}</text>
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
.stage { position: relative; width: 1640px; height: 540px; margin-block: auto; flex: none; }
svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.ar { fill: none; stroke: var(--teal-l); stroke-width: 4; stroke-dasharray: 1; stroke-linecap: round; }
.al { font-family: var(--mono); font-size: 24px; fill: #fff; text-anchor: middle; font-weight: 700; }
.chip { fill: #04212f; stroke: rgba(111,214,200,.55); stroke-width: 1.5; }
.nd { position: absolute; width: 330px; height: 180px; justify-content: center; padding: 22px; border-radius: 24px; background: var(--navy-d); border: 1px solid var(--line); display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
.nd svg { width: 48px; height: 48px; color: var(--teal-l); stroke-width: 1.5; position: static; }
.nd b { font-size: 26px; } .nd span { font-size: 21px; color: var(--ink-2); }
.up { left: 100px; top: 0; } .fk { left: 1210px; top: 0; border-color: rgba(111,214,200,.4); } .lc { left: 655px; top: 360px; }
.say { font-size: 30px; color: var(--ink-2); text-align: center; min-height: 48px; }
.say-enter-active, .say-leave-active { transition: all .35s var(--ease); }
.say-enter-from { opacity: 0; transform: translateY(12px); } .say-leave-to { opacity: 0; }
</style>
