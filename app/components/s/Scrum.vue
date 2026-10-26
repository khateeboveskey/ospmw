<script setup lang="ts">
import gsap from 'gsap'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const pb = ref<HTMLElement>()
const sb = ref<HTMLElement>()
// the top three backlog items travel into the empty Sprint Backlog slots during Sprint Planning
watch(() => [props.active, props.step] as const, ([a, s], [pa, ps]) => {
  if (!a) return
  const cards = pb.value!.querySelectorAll('.fly')
  const inSprint = s >= 1
  if (pa && inSprint === (ps ?? 0) >= 1) return
  if (!pa) gsap.set(cards, { x: 0, y: 0 }) // entering: start from the backlog (slide still hidden)
  const from = pb.value!.getBoundingClientRect()
  const to = sb.value!.getBoundingClientRect()
  const k = from.width / pb.value!.offsetWidth // undo the canvas scale
  const x = inSprint ? (to.left - from.left) / k : 0
  const y = inSprint ? (to.top - from.top) / k : 0
  gsap.to(cards, { x, y, duration: 1.2, stagger: inSprint ? 0.15 : -0.1, ease: 'expo.inOut', delay: pa ? 0.15 : 0.9 })
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="منهجيات العمل" :time="time" title="إطار <em class='mono'>Scrum</em>" lead="العمل على دفعات قصيرة ثابتة الطول تُسمّى Sprint (من أسبوع إلى أربعة أسابيع)، وفي نهاية كل دفعة جزء قابل للتسليم." />
    <div class="stage" dir="ltr">
      <div class="blk pb" data-r>
        <div class="ic"><div ref="pb" class="stack"><i class="fly" /><i class="fly" /><i class="fly" /><i /><i /></div></div>
        <b>Product Backlog</b><span>قائمة كل ما نريد بناءه، مرتبة بالأولوية</span>
      </div>
      <i class="conn" :class="{ on: step >= 1 }" />
      <div class="blk" data-step="1">
        <div class="ic"><em class="ev mono">Sprint Planning</em><div ref="sb" class="stack slots"><i /><i /><i /></div></div>
        <b>Sprint Backlog</b><span>ما التزمنا به في هذا الـ Sprint</span>
      </div>
      <i class="conn" :class="{ on: step >= 2 }" />
      <div class="blk cyc" data-step="2">
        <div class="ic"><div class="big"><span class="lbl mono">1–4 weeks</span></div><div class="small"><span class="mono">24h</span></div></div>
        <b>Sprint</b><span>اجتماع يومي قصير (Daily Scrum) لمدة ربع ساعة</span>
      </div>
      <i class="conn" :class="{ on: step >= 3 }" />
      <div class="blk" data-step="3">
        <div class="ic"><em class="ev mono">Review · Retrospective</em><div class="gift" /></div>
        <b>Increment</b><span>منتج يعمل وقابل للعرض</span>
      </div>
    </div>
    <div class="roles" data-step="3">
      <span class="pill"><b>الأحداث:</b> Planning · Daily · Review · Retro</span>
      <span class="pill"><b>الأدوار:</b> Product Owner · Scrum Master · Developers</span>
    </div>
  </section>
</template>

<style scoped>
.stage { --ic: 270px; display: flex; align-items: flex-start; margin-block: auto; padding: 0 10px; }
.blk { position: relative; width: 300px; flex: none; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.blk.pb { z-index: 3; } /* travelling cards stay above the later blocks */
.ic { position: relative; height: var(--ic); width: 100%; display: grid; place-items: center; }
.conn { flex: 1; height: 3px; margin-top: calc(var(--ic) / 2 - 1.5px); border-radius: 2px; background: linear-gradient(90deg, rgba(111,214,200,.25), rgba(111,214,200,.7)); transform: scaleX(0); transform-origin: left; transition: transform .9s var(--ease) .25s; }
.conn.on { transform: none; }
.blk b { font-family: var(--mono); font-size: 28px; }
.blk > span { font-size: 22px; color: var(--ink-2); direction: rtl; line-height: 1.45; }
.stack { position: relative; width: 170px; height: 160px; }
.stack i { position: absolute; left: 0; width: 170px; height: 44px; border-radius: 10px; background: rgba(255,255,255,.1); border: 1px solid var(--line); }
.stack i:nth-child(1) { top: 0; } .stack i:nth-child(2) { top: 29px; } .stack i:nth-child(3) { top: 58px; } .stack i:nth-child(4) { top: 87px; } .stack i:nth-child(5) { top: 116px; }
.stack i.fly { background: #1a6f6a; border-color: var(--teal-l); box-shadow: 0 10px 24px -12px rgba(0,0,0,.7); }
.stack i.fly:nth-child(1) { z-index: 3; } .stack i.fly:nth-child(2) { z-index: 2; } .stack i.fly:nth-child(3) { z-index: 1; }
.slots i { background: transparent; border: 2px dashed rgba(111,214,200,.35); }
.ev { position: absolute; top: 12px; font-size: 19px; color: var(--teal-l); white-space: nowrap; }
.big { width: 200px; height: 200px; border-radius: 50%; border: 3px dashed var(--teal-l); display: grid; place-items: center; animation: spin 14s linear infinite; }
.lbl { font-size: 20px; color: var(--ink-2); animation: spin 14s linear infinite reverse; }
/* the daily loop orbits on the sprint ring, staying inside the icon area */
.small { position: absolute; left: 50%; top: 50%; width: 64px; height: 64px; margin: -32px; border-radius: 50%; border: 3px dashed #fff; background: var(--navy-d); display: grid; place-items: center; animation: orbit 6s linear infinite; }
.small span { font-size: 15px; }
.gift { width: 130px; height: 130px; border-radius: 26px; background: var(--teal); box-shadow: 0 0 80px rgba(28,157,142,.7); animation: pulse 2.4s ease-in-out infinite; }
.roles { display: flex; gap: 20px; justify-content: center; }
.roles b { color: var(--teal-l); }
@keyframes spin { to { rotate: 360deg; } }
@keyframes orbit { from { transform: rotate(0deg) translateX(100px) rotate(0deg); } to { transform: rotate(360deg) translateX(100px) rotate(-360deg); } }
@keyframes pulse { 50% { scale: 1.08; } }
</style>
