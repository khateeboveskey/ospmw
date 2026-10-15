<script setup lang="ts">
import gsap from 'gsap'
import { ClipboardList, Search, PenTool, CodeXml, FlaskConical, Rocket } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const phases = [
  { i: ClipboardList, t: 'التخطيط', en: 'Planning', d: 'ما المشكلة؟ ما الهدف؟ ما الميزانية والوقت المتاح؟' },
  { i: Search, t: 'تحليل المتطلبات', en: 'Requirements', d: 'نجمع ما يحتاجه المستخدم فعلًا ونوثّقه بوضوح.' },
  { i: PenTool, t: 'التصميم', en: 'Design', d: 'معمارية النظام، قواعد البيانات، وتجربة المستخدم.' },
  { i: CodeXml, t: 'التطوير', en: 'Development', d: 'كتابة الكود — وهنا يبدأ دور Git.' },
  { i: FlaskConical, t: 'الاختبار', en: 'Testing', d: 'نتأكد أن ما بنيناه يعمل كما يجب، قبل المستخدم.' },
  { i: Rocket, t: 'النشر والصيانة', en: 'Deploy & Maintain', d: 'الإطلاق، ثم الإصلاح والتحسين المستمر… وتعود الدورة.' },
]
const R = 330
const pos = phases.map((_, k) => { const a = (k / phases.length) * Math.PI * 2 - Math.PI / 2; return { x: 420 + Math.cos(a) * R, y: 420 + Math.sin(a) * R } })
const orb = ref<SVGCircleElement>()
const ring = ref<SVGCircleElement>()
watch(() => [props.active, props.step] as const, ([a, s], [pa]) => {
  if (!a) return
  if (!pa) gsap.fromTo(ring.value!, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'expo.inOut', delay: 0.4 })
  gsap.to(orb.value!, { attr: { cx: pos[s]!.x, cy: pos[s]!.y }, duration: 0.9, ease: 'expo.inOut' })
})
const cur = computed(() => phases[props.step]!)
</script>

<template>
  <section class="slide">
    <div class="wrap">
      <div class="txt">
        <SlideHead kicker="مدخل إلى إدارة المشاريع البرمجية" :time="time" title="دورة حياة<br>تطوير البرمجيات" lead="<span class='mono'>SDLC — Software Development Life Cycle</span>" />
        <Transition name="ph" mode="out-in">
          <div :key="step" class="card cur">
            <div class="row1"><div class="ico"><component :is="cur.i" /></div><span class="mono en">{{ String(step + 1).padStart(2, '0') }} · {{ cur.en }}</span></div>
            <h3>{{ cur.t }}</h3>
            <p>{{ cur.d }}</p>
          </div>
        </Transition>
      </div>
      <div class="wheel" data-r>
        <svg viewBox="0 0 840 840">
          <circle ref="ring" cx="420" cy="420" :r="R" class="ring" pathLength="1" />
          <circle ref="orb" :cx="pos[0]!.x" :cy="pos[0]!.y" r="70" class="orb" />
        </svg>
        <div v-for="(p, k) in phases" :key="k" class="node" :class="{ on: k === step, past: k < step }" :style="{ left: pos[k]!.x + 'px', top: pos[k]!.y + 'px' }">
          <component :is="p.i" />
          <span>{{ p.t }}</span>
        </div>
        <div class="hub"><span class="mono">SDLC</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap { display: flex; justify-content: space-between; align-items: center; height: 100%; margin-top: -40px; }
.txt { width: 760px; }
.cur { display: flex; flex-direction: column; gap: 14px; }
.row1 { display: flex; align-items: center; justify-content: space-between; }
.en { color: var(--teal-l); font-size: 22px; }
.cur h3 { font-family: var(--serif); font-size: 52px; }
.cur p { font-size: 28px; color: var(--ink-2); line-height: 1.55; }
.wheel { position: relative; width: 840px; height: 840px; flex: none; }
.wheel svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.ring { fill: none; stroke: rgba(111,214,200,.35); stroke-width: 3; stroke-dasharray: 1; }
.orb { fill: rgba(28,157,142,.25); stroke: var(--teal-l); stroke-width: 2; }
.node { position: absolute; translate: -50% -50%; width: 120px; height: 120px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; background: var(--navy-d); border: 1px solid var(--line); transition: all .6s var(--ease); }
.node svg { width: 34px; height: 34px; color: var(--ink-3); transition: color .6s; }
.node span { font-size: 17px; color: var(--ink-3); text-align: center; line-height: 1.2; max-width: 100px; }
.node.past svg, .node.past span { color: var(--ink-2); }
.node.on { background: var(--teal); border-color: var(--teal-l); scale: 1.18; box-shadow: 0 0 60px rgba(28,157,142,.6); }
.node.on svg, .node.on span { color: #fff; }
.hub { position: absolute; left: 50%; top: 50%; translate: -50% -50%; width: 200px; height: 200px; border-radius: 50%; display: grid; place-items: center; border: 1px dashed rgba(255,255,255,.2); animation: spin 30s linear infinite; }
.hub span { font-size: 34px; font-weight: 700; color: var(--teal-l); animation: spin 30s linear infinite reverse; }
@keyframes spin { to { rotate: 360deg; } }
.ph-enter-active, .ph-leave-active { transition: all .4s var(--ease); }
.ph-enter-from { opacity: 0; transform: translateY(20px); } .ph-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
