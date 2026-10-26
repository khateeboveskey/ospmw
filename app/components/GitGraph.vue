<script setup lang="ts">
import gsap from 'gsap'

/* Data-driven animated commit graph.
   Each step is a delta on top of the previous one, so a slide only lists what changes. */
import type { GNode, GStep } from '~/data/types'

const props = defineProps<{ title?: string; lanes: { name: string; color: string }[]; nodes: GNode[]; steps: GStep[]; dx?: number; dy?: number; span?: [number, number]; active: boolean; step: number }>()

const DX = props.dx ?? 210
const DY = props.dy ?? 150
const R = 28
const PAD = 26
// ref labels stack away from their node: above on the top lane, below elsewhere
const refOff = (k: number) => 64 + k * 48
const byId = Object.fromEntries(props.nodes.map((n) => [n.id, n]))

const states = computed(() => {
  const on = new Set<string>(); const dim = new Set<string>()
  const pos: Record<string, [number, number]> = {}; const refs: Record<string, string> = {}
  let head = 'main'
  return props.steps.map((s) => {
    s.add?.forEach((i) => on.add(i)); s.hide?.forEach((i) => on.delete(i))
    s.dim?.forEach((i) => dim.add(i)); s.undim?.forEach((i) => dim.delete(i))
    Object.assign(pos, s.pos)
    for (const [k, v] of Object.entries(s.refs ?? {})) v === null ? delete refs[k] : (refs[k] = v)
    if (s.head) head = s.head
    return { on: new Set(on), dim: new Set(dim), pos: { ...pos }, refs: { ...refs }, head, cmd: s.cmd ?? '', say: s.say ?? '' }
  })
})
type State = (typeof states.value)[number]
const st = computed(() => states.value[Math.min(props.step, states.value.length - 1)]!)

const maxX = Math.max(props.span?.[0] ?? 0, ...props.nodes.map((n) => n.x), ...props.steps.flatMap((s) => Object.values(s.pos ?? {}).map((p) => p[0])))
const maxL = Math.max(props.span?.[1] ?? 0, props.lanes.length - 1)
/* fit the viewBox to what is actually drawn across all steps, so the graph scales as large as the slide allows */
const laneOf = (id: string, s: State) => s.pos[id]?.[1] ?? byId[id]!.l
const groupsOf = (s: State) => {
  const g: Record<string, string[]> = {}
  for (const [r, n] of Object.entries(s.refs)) (g[n] ??= []).push(r)
  return Object.entries(g).map(([n, rs]) => [n, rs.flatMap((r) => (r === s.head ? [r, 'HEAD'] : [r]))] as const)
}
let lo = -R; let hi = maxL * DY + R
for (const s of states.value) for (const [n, list] of groupsOf(s)) {
  const y = laneOf(n, s) * DY
  if (laneOf(n, s) === 0) lo = Math.min(lo, y - refOff(list.length - 1) - 20)
  else hi = Math.max(hi, y + refOff(list.length - 1) + 20)
}
const X0 = 24 + Math.max(...props.lanes.map((l) => l.name.length)) * 14.5 + 90
const Y0 = PAD - lo
const W = X0 + maxX * DX + 130
const H = Y0 + hi + PAD

const laneColor = (l: number) => props.lanes[Math.round(l)]?.color ?? '#fff'
const nodeColor = (n: GNode) => n.c ?? laneColor(n.l)
const xy = (id: string, s: State): [number, number] => {
  const n = byId[id]!; const [x, l] = s.pos[id] ?? [n.x, n.l]
  return [X0 + x * DX, Y0 + l * DY]
}
const edges = props.nodes.flatMap((n) => (n.p ?? []).map((p) => ({ id: `${p}>${n.id}`, from: p, to: n.id, color: laneColor(Math.max(byId[p]!.l, n.l)) })))
const edgeD = (e: { from: string; to: string }, s: State) => {
  const [x1, y1] = xy(e.from, s); const [x2, y2] = xy(e.to, s)
  const m = x1 + Math.min(DX * 0.8, (x2 - x1) * 0.6)
  return `M${x1},${y1} C${m},${y1} ${m},${y2} ${x2},${y2}`
}
const refNames = [...new Set(props.steps.flatMap((s) => Object.keys(s.refs ?? {})))]
const refColor = (r: string) => props.lanes.find((l) => l.name === r)?.color ?? '#ffffff'
const refW = (r: string) => 34 + r.length * 13

/* ref label placement: stacked above the node on the top lane, below elsewhere */
function refPos(s: State) {
  const out: Record<string, [number, number]> = {}
  for (const [n, list] of groupsOf(s)) {
    const [x, y] = xy(n, s)
    const up = laneOf(n, s) === 0
    list.forEach((r, k) => (out[r] = [x, up ? y - refOff(k) : y + refOff(k)]))
  }
  return out
}

const root = ref<SVGSVGElement>()
const { typed, type } = useTyper()
let prevOn = new Set<string>()

function apply(s: State, base = 0) {
  const svg = root.value; if (!svg) return
  const q = (sel: string) => svg.querySelector(sel) as SVGElement
  const fresh = new Set([...s.on].filter((i) => !prevOn.has(i)))
  let k = 0
  for (const e of edges) {
    const el = q(`[data-e="${e.id}"]`)
    const on = s.on.has(e.from) && s.on.has(e.to)
    const d = edgeD(e, s)
    const dim = s.dim.has(e.to)
    if (on && (fresh.has(e.to) || fresh.has(e.from))) {
      gsap.set(el, { attr: { d }, strokeDashoffset: 1, opacity: dim ? 0.25 : 1 })
      // pathLength units (1 → 0): px rounding would make the draw jump
      gsap.to(el, { strokeDashoffset: 0, autoRound: false, duration: 0.6, ease: 'power2.inOut', delay: base + k++ * 0.12 })
    } else gsap.to(el, { attr: { d }, opacity: on ? (dim ? 0.25 : 1) : 0, duration: 0.8, ease: 'expo.inOut', delay: base })
  }
  k = 0
  for (const n of props.nodes) {
    const g = q(`[data-n="${n.id}"]`)
    const c = g.querySelector('circle')!
    const [x, y] = xy(n.id, s)
    const on = s.on.has(n.id)
    const o = on ? (s.dim.has(n.id) ? 0.28 : 1) : 0
    if (fresh.has(n.id)) {
      gsap.set(g, { x, y, opacity: 1 })
      gsap.fromTo(c, { attr: { r: 0 } }, { attr: { r: R }, duration: 0.7, ease: 'back.out(2.2)', delay: base + 0.25 + k * 0.12 })
      gsap.fromTo(g.querySelectorAll('text'), { opacity: 0 }, { opacity: o, duration: 0.4, delay: base + 0.45 + k++ * 0.12 })
    } else {
      gsap.to(g, { x, y, opacity: o, duration: 0.9, ease: 'expo.inOut', delay: base })
      if (on) gsap.to(g.querySelectorAll('text'), { opacity: 1, duration: 0.3 })
    }
  }
  const rp = refPos(s)
  for (const r of [...refNames, 'HEAD']) {
    const g = q(`[data-ref="${r}"]`)
    const p = rp[r]
    if (!p) { gsap.to(g, { opacity: 0, duration: 0.3 }); continue }
    if (Number(gsap.getProperty(g, 'opacity')) < 0.05) {
      gsap.fromTo(g, { x: p[0], y: p[1] - 18, opacity: 0 }, { y: p[1], opacity: 1, duration: 0.6, ease: 'expo.out', delay: base + 0.5 })
    } else gsap.to(g, { x: p[0], y: p[1], opacity: 1, duration: 0.9, ease: 'expo.inOut', delay: base })
  }
  prevOn = new Set(s.on)

  type(s.cmd, base + 0.1, base > 0)
}

function reset() {
  const svg = root.value; if (!svg) return
  gsap.set(svg.querySelectorAll('[data-n],[data-ref],[data-e]'), { opacity: 0 })
  prevOn = new Set()
}

watch(() => [props.active, props.step] as const, ([a], [pa]) => {
  if (!a) return
  if (!pa) { reset(); apply(st.value, 0.55) } else apply(st.value)
})
onMounted(reset)
</script>

<template>
  <div class="gg">
    <div v-if="title" class="gt">{{ title }}</div>
    <svg ref="root" :viewBox="`0 0 ${W} ${H}`" class="svg" dir="ltr" role="img" :aria-label="st.say || title">
      <g v-for="(l, i) in lanes" :key="l.name" class="lane" :style="{ opacity: [...st.on].some(id => Math.round((st.pos[id]?.[1] ?? byId[id]!.l)) === i) ? 1 : 0.15 }">
        <line :x1="X0 - 70" :x2="W - 40" :y1="Y0 + i * DY" :y2="Y0 + i * DY" :stroke="l.color" />
        <text :x="24" :y="Y0 + i * DY + 7" :fill="l.color">{{ l.name }}</text>
      </g>
      <path v-for="e in edges" :key="e.id" :data-e="e.id" :stroke="e.color" pathLength="1" class="edge" />
      <g v-for="n in nodes" :key="n.id" :data-n="n.id">
        <circle :r="R" :fill="nodeColor(n)" />
        <text class="hash" y="6">{{ n.id.replace(/'/g, '′') }}</text>
        <text v-if="n.t" class="msg"  y="58">{{ n.t }}</text>
      </g>
      <g v-for="r in refNames" :key="r" :data-ref="r">
        <rect :x="-refW(r) / 2" y="-20" :width="refW(r)" height="40" rx="20" fill="#04212f" :stroke="refColor(r)" stroke-width="2" />
        <text class="ref" y="6" :fill="refColor(r)">{{ r }}</text>
      </g>
      <g data-ref="HEAD">
        <rect x="-46" y="-20" width="92" height="40" rx="11" fill="#1c9d8e" />
        <text class="ref head" y="6">HEAD</text>
      </g>
    </svg>
    <div class="foot">
      <div class="term mono"><span class="ps">$</span> {{ typed }}<span class="caret" /></div>
      <Transition name="say" mode="out-in"><p :key="st.say" class="say">{{ st.say }}</p></Transition>
    </div>
  </div>
</template>

<style scoped>
.gg { display: flex; flex-direction: column; gap: 22px; min-height: 0; flex: 1; }
.gt { font-size: 30px; font-weight: 700; color: var(--teal-l); }
.svg { width: 100%; flex: 1; min-height: 0; overflow: visible; }
.lane line { stroke-dasharray: 4 10; stroke-width: 1.5; opacity: 0.35; }
.lane text { font-family: var(--mono); font-size: 24px; font-weight: 500; }
.lane { transition: opacity 0.6s var(--ease); }
.edge { fill: none; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.hash { font-family: var(--mono); font-size: 17px; font-weight: 700; fill: #04212f; text-anchor: middle; }
.msg { font-size: 17px; fill: var(--ink-2); text-anchor: middle; font-family: var(--mono); }
.ref { font-family: var(--mono); font-size: 21px; font-weight: 700; text-anchor: middle; }
.ref.head { fill: #fff; }
.foot { display: flex; align-items: center; gap: 36px; }
.term { flex: none; direction: ltr; font-size: 26px; padding: 14px 24px; border-radius: 14px; background: rgba(4, 33, 47, 0.7); border: 1px solid var(--line); min-width: 600px; min-height: 64px; white-space: nowrap; }
.ps { color: var(--teal-l); margin-right: 8px; }
.caret { display: inline-block; width: 12px; height: 26px; background: var(--teal-l); vertical-align: -4px; margin-left: 4px; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.say { flex: 1; font-size: 29px; color: var(--ink-2); line-height: 1.5; }
/* two lines are always reserved so a longer caption never resizes (and jolts) the graph */
.foot { min-height: 87px; }
.say-enter-active, .say-leave-active { transition: opacity 0.35s var(--ease), transform 0.35s var(--ease); }
.say-enter-from { opacity: 0; transform: translateY(12px); }
.say-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
