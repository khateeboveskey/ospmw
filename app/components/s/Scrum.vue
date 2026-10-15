<script setup lang="ts">
import gsap from 'gsap'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const stage = ref<HTMLElement>()
const flow = ref<SVGPathElement>()
watch(() => [props.active, props.step] as const, ([a, s], [pa]) => {
  if (!a) return
  if (!pa) gsap.fromTo(flow.value!, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', delay: 0.6 })
  // cards travel from the product backlog into the sprint and out as an increment
  const cards = stage.value!.querySelectorAll('.fly')
  if (s >= 1) gsap.fromTo(cards, { x: 0, opacity: 1 }, { x: 450, duration: 1.2, stagger: 0.15, ease: 'expo.inOut' })
  else gsap.set(cards, { x: 0 })
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="منهجيات العمل" :time="time" title="إطار <em class='mono'>Scrum</em>" lead="العمل على دفعات قصيرة ثابتة الطول (Sprint: 1–4 أسابيع)، وفي نهاية كل دفعة جزء قابل للتسليم." />
    <div ref="stage" class="stage" dir="ltr">
      <svg class="flow" viewBox="0 0 1640 420" preserveAspectRatio="none" aria-hidden="true">
        <path ref="flow" d="M150 210 H520 M780 210 H1060 M1360 210 H1520" pathLength="1" />
      </svg>
      <div class="blk pb" data-r>
        <div class="stack"><i class="fly" /><i class="fly" /><i class="fly" /><i /><i /></div>
        <b>Product Backlog</b><span>قائمة كل ما نريد بناءه، مرتبة بالأولوية</span>
      </div>
      <div class="blk sp" data-step="1">
        <div class="stack sm"><i /><i /><i /></div>
        <b>Sprint Backlog</b><span>ما التزمنا به في هذا الـ Sprint</span>
        <em class="ev mono">Sprint Planning</em>
      </div>
      <div class="blk cyc" data-step="2">
        <div class="big"><div class="small"><span class="mono">24h</span></div><span class="lbl mono">1–4 weeks</span></div>
        <b>Sprint</b><span>Daily Scrum: 15 دقيقة يوميًا</span>
      </div>
      <div class="blk inc" data-step="3">
        <div class="gift" />
        <b>Increment</b><span>منتج يعمل وقابل للعرض</span>
        <em class="ev mono">Review · Retrospective</em>
      </div>
    </div>
    <div class="roles" data-step="3">
      <span class="pill"><b>الأحداث:</b> Planning · Daily · Review · Retro</span>
      <span class="pill"><b>الأدوار:</b> Product Owner · Scrum Master · Developers</span>
    </div>
  </section>
</template>

<style scoped>
.stage { position: relative; flex: 1; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
.flow { position: absolute; inset: 0; width: 100%; height: 100%; }
.flow path { fill: none; stroke: rgba(111,214,200,.5); stroke-width: 3; stroke-dasharray: 1; }
.blk { position: relative; width: 300px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.blk b { font-family: var(--mono); font-size: 28px; }
.blk span { font-size: 22px; color: var(--ink-2); direction: rtl; }
.stack { position: relative; width: 170px; height: 160px; }
.stack i { position: absolute; left: 0; width: 170px; height: 44px; border-radius: 10px; background: rgba(255,255,255,.1); border: 1px solid var(--line); }
.stack i:nth-child(1) { top: 0; } .stack i:nth-child(2) { top: 29px; } .stack i:nth-child(3) { top: 58px; } .stack i:nth-child(4) { top: 87px; } .stack i:nth-child(5) { top: 116px; }
.stack i.fly { background: rgba(28,157,142,.45); border-color: var(--teal-l); z-index: 2; }
.stack.sm i { background: rgba(28,157,142,.3); }
.ev { position: absolute; top: -60px; font-size: 19px; color: var(--teal-l); white-space: nowrap; }
.cyc .big { width: 220px; height: 220px; border-radius: 50%; border: 3px dashed var(--teal-l); position: relative; display: grid; place-items: center; animation: spin 12s linear infinite; }
.small { width: 84px; height: 84px; border-radius: 50%; border: 3px dashed #fff; display: grid; place-items: center; position: absolute; top: -20px; right: -10px; animation: spin 3s linear infinite reverse; background: var(--navy-d); }
.small span { font-size: 18px; }
.lbl { font-size: 20px; color: var(--ink-2); animation: spin 12s linear infinite reverse; }
.gift { width: 130px; height: 130px; border-radius: 26px; background: var(--teal); box-shadow: 0 0 80px rgba(28,157,142,.7); animation: pulse 2.4s ease-in-out infinite; }
.roles { display: flex; gap: 20px; justify-content: center; }
.roles b { color: var(--teal-l); }
@keyframes spin { to { rotate: 360deg; } }
@keyframes pulse { 50% { scale: 1.08; } }
</style>
