<script setup lang="ts">
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-vue-next'
import { slides } from '~/data/slides'

useHead({ title: 'عرض المقدّم' })
const i = ref(0)
const s = ref(0)
const connected = ref(false)
const cur = computed(() => slides[i.value]!)
const nxt = computed(() => slides[i.value + 1])
const steps = computed(() => cur.value.steps ?? 1)

const post = useDeckChannel((m) => {
  if (m.t === 'state') { i.value = m.i; s.value = m.s; connected.value = true }
})

const start = ref(Date.now())
const now = ref(Date.now())
let tick: ReturnType<typeof setInterval>
const fmt = (ms: number) => { const t = Math.floor(ms / 1000); return `${String(Math.floor(t / 3600)).padStart(2, '0')}:${String(Math.floor(t / 60) % 60).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}` }
const clock = computed(() => new Date(now.value).toLocaleTimeString('ar-SA-u-nu-latn', { hour: '2-digit', minute: '2-digit' }))

function onKey(e: KeyboardEvent) {
  if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); post({ t: 'cmd', a: 'prev' }) }
  else if ([' ', 'Enter', 'ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); post({ t: 'cmd', a: 'next' }) }
}
onMounted(() => {
  post({ t: 'hello' })
  tick = setInterval(() => (now.value = Date.now()), 1000)
  addEventListener('keydown', onKey)
})
onBeforeUnmount(() => { clearInterval(tick); removeEventListener('keydown', onKey) })
</script>

<template>
  <main class="pv">
    <section class="views">
      <div class="v cur">
        <div class="lbl">الآن · <span class="mono">{{ i + 1 }} / {{ slides.length }}</span></div>
        <iframe src="/?mirror" title="الشريحة الحالية" />
      </div>
      <div class="v nx">
        <div class="lbl">التالي · {{ nxt?.title ?? '—' }}</div>
        <iframe src="/?mirror&offset=1" title="الشريحة التالية" />
      </div>
    </section>
    <aside class="side">
      <div class="meta">
        <div><small>الوقت المنقضي</small><b class="mono">{{ fmt(now - start) }}</b></div>
        <button class="ic" aria-label="إعادة ضبط المؤقت" @click="start = Date.now()"><RotateCcw /></button>
        <div><small>الساعة</small><b class="mono">{{ clock }}</b></div>
      </div>
      <div class="sec">{{ cur.section }} <span v-if="cur.time" class="time">{{ cur.time }}</span></div>
      <h1>{{ cur.title }}</h1>
      <div v-if="steps > 1" class="steps">الخطوة <span class="mono">{{ s + 1 }} / {{ steps }}</span></div>
      <ul class="notes"><li v-for="n in cur.notes" :key="n">{{ n }}</li></ul>
      <p v-if="!connected" class="warn">افتح العرض الرئيسي في تبويب آخر من نفس المتصفح (أو اضغط P من العرض).</p>
      <nav class="nav">
        <button aria-label="السابق" @click="post({ t: 'cmd', a: 'prev' })"><ChevronRight /> السابق</button>
        <button aria-label="التالي" class="pri" @click="post({ t: 'cmd', a: 'next' })">التالي <ChevronLeft /></button>
      </nav>
    </aside>
  </main>
</template>

<style scoped>
.pv { position: fixed; inset: 0; display: grid; grid-template-columns: 1fr 520px; background: var(--navy-dd); overflow: auto; }
.views { padding: 24px; display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.v { display: flex; flex-direction: column; gap: 8px; }
.v.nx { width: 55%; }
.lbl { font-size: 15px; color: var(--ink-3); }
iframe { width: 100%; aspect-ratio: 16 / 9; border: 1px solid var(--line); border-radius: 12px; background: var(--navy); pointer-events: none; }
.side { border-inline-start: 1px solid var(--line); padding: 28px; display: flex; flex-direction: column; gap: 18px; overflow: auto; }
.meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
.meta small { display: block; font-size: 13px; color: var(--ink-3); }
.meta b { font-size: 30px; }
.ic { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: var(--glass); display: grid; place-items: center; cursor: pointer; }
.ic svg { width: 20px; height: 20px; }
.sec { font-size: 15px; color: var(--teal-l); display: flex; gap: 10px; align-items: center; }
.time { font-size: 13px; padding: 3px 10px; }
h1 { font-family: var(--serif); font-size: 34px; }
.steps { font-size: 16px; color: var(--ink-2); }
.notes { margin: 0; padding-inline-start: 22px; display: flex; flex-direction: column; gap: 12px; font-size: 19px; line-height: 1.6; color: var(--ink-2); }
.warn { font-size: 15px; color: var(--amber); }
.nav { margin-top: auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 12px; }
.nav button { height: 56px; border-radius: 14px; border: 1px solid var(--line); background: var(--glass); display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 18px; cursor: pointer; }
.nav button.pri { background: var(--teal); border-color: var(--teal); }
.nav svg { width: 22px; height: 22px; }
@media (max-width: 1000px) { .pv { grid-template-columns: 1fr; } .v.nx { width: 100%; } }
</style>
