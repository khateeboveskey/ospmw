<script setup lang="ts">
import gsap from 'gsap'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { slides } from '~/data/slides'

const route = useRoute()
const mirror = route.query.mirror !== undefined // embedded preview inside presenter view
const offset = Number(route.query.offset || 0)

const idx = ref(-1) // -1 until mounted, so the first go() animates in
const step = ref(0)
const scale = ref(1)
const canvas = ref<HTMLElement>()
const bar = ref<HTMLElement>()
const blobs = ref<HTMLElement>()
const total = slides.length
const cur = computed(() => slides[Math.max(0, idx.value)]!)
const stepsOf = (i: number) => slides[i]?.steps ?? 1

let slots: HTMLElement[] = []
let tl: gsap.core.Timeline | null = null

const reduced = import.meta.client && matchMedia('(prefers-reduced-motion: reduce)').matches
// ponytail: reduced motion = speed everything up globally instead of per-animation branches
if (reduced) gsap.globalTimeline.timeScale(20)

function fit() {
  scale.value = Math.min(innerWidth / 1920, innerHeight / 1080)
}

/* builds: elements with data-step="n" appear once step >= n */
function applySteps(el: HTMLElement, s: number, delay = 0) {
  el.querySelectorAll<HTMLElement>('[data-step]').forEach((n) => {
    const on = Number(n.dataset.step) <= s
    gsap.to(n, on
      ? { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', delay }
      : { autoAlpha: 0, y: 28, filter: 'blur(6px)', duration: 0.3, ease: 'power2.in' })
  })
}

function moveBlobs(i: number) {
  if (!blobs.value) return
  const kids = blobs.value.children
  for (let k = 0; k < kids.length; k++) {
    const a = (i * 47 + k * 120) * (Math.PI / 180)
    gsap.to(kids[k]!, { xPercent: Math.cos(a) * 30, yPercent: Math.sin(a) * 25, scale: 0.9 + ((i + k) % 3) * 0.12, duration: 2.4, ease: 'sine.inOut' })
  }
}

function syncOut() {
  if (mirror) return
  post({ t: 'state', i: idx.value, s: step.value })
  history.replaceState(null, '', `#${idx.value + 1}${step.value ? '.' + step.value : ''}`)
}

function setStep(s: number) {
  step.value = s
  applySteps(slots[idx.value]!, s)
  syncOut()
}

function go(to: number, s = 0, instant = false) {
  to = Math.max(0, Math.min(total - 1, to))
  if (to === idx.value) return setStep(s)
  const from = idx.value
  const dir = to > from ? 1 : -1
  tl?.progress(1).kill()
  const a = slots[from]
  const b = slots[to]!
  idx.value = to
  step.value = s
  syncOut()
  moveBlobs(to)
  gsap.to(bar.value!, { scaleX: (to + 1) / total, duration: 1, ease: 'expo.inOut' })

  // hide future builds on the incoming slide before it is revealed
  b.querySelectorAll<HTMLElement>('[data-step]').forEach((n) => {
    if (Number(n.dataset.step) > s) gsap.set(n, { autoAlpha: 0, y: 28 })
  })
  if (instant) {
    if (a) gsap.set(a, { autoAlpha: 0 })
    gsap.set(b, { autoAlpha: 1, clipPath: 'none', y: 0, scale: 1 })
    applySteps(b, s)
    return
  }
  const divider = slides[to]!.kind === 'divider'
  tl = gsap.timeline()
  if (a) tl.to(a, { autoAlpha: 0, y: -70 * dir, scale: 0.97, filter: 'blur(8px)', duration: 0.55, ease: 'power3.in' })
  tl.fromTo(b,
    { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: divider ? 1.2 : 0.95, ease: 'expo.inOut' }, 0.12)
  const rev = b.querySelectorAll('[data-r]')
  if (rev.length) tl.fromTo(rev, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.55)
  tl.call(() => applySteps(b, step.value), [], 0.75)
}

function next() {
  if (step.value < stepsOf(idx.value) - 1) setStep(step.value + 1)
  else if (idx.value < total - 1) go(idx.value + 1, 0)
}
function prev() {
  if (step.value > 0) setStep(step.value - 1)
  else if (idx.value > 0) go(idx.value - 1, stepsOf(idx.value - 1) - 1)
}

const post = import.meta.client
  ? useDeckChannel((m) => {
      if (mirror) {
        if (m.t === 'state') {
          const i = m.i + offset
          if (i < total) go(i, offset ? 0 : m.s)
        }
        return
      }
      if (m.t === 'hello') syncOut()
      else if (m.t === 'cmd') m.a === 'next' ? next() : prev()
      else if (m.t === 'go') go(m.i, m.s)
    })
  : () => {}

function onKey(e: KeyboardEvent) {
  if (mirror || e.metaKey || e.ctrlKey || e.altKey) return
  const k = e.key
  if ((k === ' ' && e.shiftKey) || ['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev() }
  else if ([' ', 'Enter', 'ArrowRight', 'ArrowDown', 'PageDown'].includes(k)) { e.preventDefault(); next() }
  else if (k === 'Home') go(0)
  else if (k === 'End') go(total - 1)
  else if (k === 'f' || k === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
  else if (k === 'p' || k === 'P') window.open('/presenter', 'ospmw-presenter', 'width=1400,height=860')
}

// one slide per wheel gesture (trackpad inertia keeps firing events, so gate on gesture gaps)
let lastWheel = 0
let fired = 0
function onWheel(e: WheelEvent) {
  if (mirror) return
  e.preventDefault()
  const now = performance.now()
  const newGesture = now - lastWheel > 220
  lastWheel = now
  if (Math.abs(e.deltaY) + Math.abs(e.deltaX) < 6) return
  if (newGesture || now - fired > 1300) {
    fired = now
    ;(e.deltaY || e.deltaX) > 0 ? next() : prev()
  }
}

let touchY = 0
let touchX = 0
function onTouchStart(e: TouchEvent) { touchY = e.touches[0]!.clientY; touchX = e.touches[0]!.clientX }
function onTouchEnd(e: TouchEvent) {
  if (mirror) return
  const dy = touchY - e.changedTouches[0]!.clientY
  const dx = touchX - e.changedTouches[0]!.clientX
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return
  if (Math.abs(dy) > Math.abs(dx)) dy > 0 ? next() : prev()
  else dx < 0 ? next() : prev() // RTL: swipe right reveals the next slide
}

onMounted(() => {
  fit()
  addEventListener('resize', fit)
  addEventListener('keydown', onKey)
  addEventListener('wheel', onWheel, { passive: false })
  slots = Array.from(canvas.value!.querySelectorAll<HTMLElement>('.slot'))
  gsap.set(slots, { autoAlpha: 0 })
  gsap.set(bar.value!, { scaleX: 1 / total, transformOrigin: 'right center' })
  const [hi, hs] = location.hash.slice(1).split('.')
  const i0 = Math.max(0, Math.min(total - 1, (Number(hi) || 1) - 1 + offset))
  go(i0, Number(hs) || 0)
  if (mirror) post({ t: 'hello' })
})
onBeforeUnmount(() => {
  removeEventListener('resize', fit)
  removeEventListener('keydown', onKey)
  removeEventListener('wheel', onWheel)
})

const pad = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <main class="deck" :class="{ mirror }" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <div class="bg" aria-hidden="true">
      <div ref="blobs" class="blobs"><i /><i /><i /></div>
      <div class="grid" />
      <div class="grain" />
    </div>

    <div ref="canvas" class="canvas" :style="{ '--s': scale }">
      <div v-for="(s, i) in slides" :key="i" class="slot" :aria-hidden="i !== idx">
        <component :is="s.c" v-bind="s.props" :active="i === idx" :step="i === idx ? step : 0" />
      </div>

      <header class="chrome-top">
        <img src="/logo-org.svg" alt="مبادرة أسس — OSSOS Initiative" class="logo-org">
        <img src="/logo-me.svg" alt="Khateeb" class="logo-me">
      </header>

      <footer v-if="!mirror" class="chrome-bottom">
        <div class="where">
          <span class="sec">{{ cur.section }}</span>
          <span v-if="cur.time" class="time">{{ cur.time }}</span>
        </div>
        <div v-if="stepsOf(idx) > 1" class="dots" aria-hidden="true">
          <i v-for="n in stepsOf(idx)" :key="n" :class="{ on: n - 1 <= step }" />
        </div>
        <nav class="nav" aria-label="التنقل بين الشرائح">
          <button aria-label="الشريحة السابقة" @click="prev"><ChevronRight /></button>
          <span class="count mono">{{ pad(Math.max(0, idx) + 1) }} <b>/ {{ pad(total) }}</b></span>
          <button aria-label="الشريحة التالية" @click="next"><ChevronLeft /></button>
        </nav>
      </footer>
      <div class="progress"><div ref="bar" class="bar" /></div>
    </div>
  </main>
</template>

<style scoped>
.deck { position: fixed; inset: 0; overflow: hidden; background: radial-gradient(120% 90% at 85% 10%, #0d5676 0%, var(--navy) 35%, var(--navy-d) 65%, var(--navy-dd) 100%); touch-action: none; }
.bg { position: absolute; inset: 0; pointer-events: none; }
.blobs i { position: absolute; width: 70vmax; height: 70vmax; border-radius: 50%; }
.blobs i:nth-child(1) { top: -30vmax; left: -20vmax; background: radial-gradient(circle, rgba(28, 157, 142, 0.38), transparent 62%); }
.blobs i:nth-child(2) { bottom: -35vmax; right: -15vmax; background: radial-gradient(circle, rgba(28, 157, 142, 0.24), transparent 60%); }
.blobs i:nth-child(3) { top: 10vmax; right: 20vmax; width: 50vmax; height: 50vmax; background: radial-gradient(circle, rgba(143, 195, 221, 0.12), transparent 60%); }
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%); }
.grain { position: absolute; inset: 0; opacity: 0.07; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

.canvas { position: absolute; left: 50%; top: 50%; width: 1920px; height: 1080px; transform: translate(-50%, -50%) scale(var(--s)); }
.slot { position: absolute; inset: 0; will-change: transform, clip-path; }

.chrome-top { position: absolute; top: 44px; inset-inline: 140px; display: flex; justify-content: space-between; align-items: center; pointer-events: none; z-index: 5; }
.logo-org { height: 82px; width: auto; }
.logo-me { height: 34px; width: auto; }

.chrome-bottom { position: absolute; bottom: 44px; inset-inline: 140px; display: flex; align-items: center; justify-content: space-between; z-index: 5; }
.where { display: flex; align-items: center; gap: 18px; font-size: 22px; color: var(--ink-2); }
.sec { font-weight: 500; }
.dots { display: flex; gap: 10px; }
.dots i { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.18); transition: background .3s var(--ease), transform .3s var(--ease); }
.dots i.on { background: var(--teal-l); transform: scale(1.2); }
.nav { display: flex; align-items: center; gap: 14px; }
.nav button { width: 52px; height: 52px; border-radius: 50%; border: 1px solid var(--line); background: var(--glass); display: grid; place-items: center; cursor: pointer; transition: background .2s, transform .2s; }
.nav button:hover { background: rgba(28,157,142,.3); }
.nav button:active { transform: scale(.94); }
.nav button svg { width: 26px; height: 26px; }
.count { font-size: 22px; min-width: 110px; text-align: center; direction: ltr; }
.count b { color: var(--ink-3); font-weight: 400; }
.progress { position: absolute; bottom: 0; inset-inline: 0; height: 5px; background: rgba(255,255,255,.06); }
.bar { height: 100%; background: linear-gradient(270deg, var(--teal), var(--teal-l)); }
.mirror .chrome-top { opacity: .5; }
</style>
