<script setup lang="ts">
import gsap from 'gsap'
type Item = { cmd: string; out?: string[]; label: string; note: string }
const props = defineProps<{ active: boolean; step: number; kicker?: string; title: string; time?: string; lead?: string; items: Item[]; path?: string }>()

const shown = computed(() => props.items.slice(0, props.step + 1))
const typed = ref(0)
const outOn = ref(false)
const body = ref<HTMLElement>()
let tw: gsap.core.Tween | null = null

function type() {
  tw?.kill()
  const cmd = props.items[props.step]!.cmd
  const o = { n: 0 }
  typed.value = 0
  outOn.value = false
  tw = gsap.to(o, {
    n: cmd.length, duration: Math.min(1.4, cmd.length * 0.04), ease: 'none', delay: 0.2,
    onUpdate: () => { typed.value = Math.round(o.n) },
    onComplete: () => {
      outOn.value = true
      nextTick(() => {
        const lines = body.value?.querySelectorAll('.last .o')
        if (lines?.length) gsap.fromTo(lines, { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3 })
        body.value?.scrollTo({ top: body.value.scrollHeight, behavior: 'smooth' })
      })
    },
  })
}
watch(() => [props.active, props.step] as const, ([a]) => { if (a) type() })
const prompt = computed(() => props.path ?? '~/my-app')
</script>

<template>
  <section class="slide">
    <SlideHead :kicker="kicker" :title="title" :lead="lead" :time="time" />
    <div class="wrap">
      <div class="term" data-r>
        <div class="bar"><i /><i /><i /><span class="mono">bash — {{ prompt }}</span></div>
        <div ref="body" class="body mono">
          <TransitionGroup name="fx"><div v-for="(it, i) in shown" :key="i" class="blk" :class="{ last: i === step }">
            <div class="ln"><span class="pp">{{ prompt }}</span> <span class="ps">$</span> {{ i === step ? it.cmd.slice(0, typed) : it.cmd }}<span v-if="i === step" class="caret" /></div>
            <template v-if="i < step || outOn">
              <div v-for="(o, k) in it.out" :key="k" class="o" v-html="o" />
            </template>
          </div></TransitionGroup>
        </div>
      </div>
      <ol class="side">
        <li v-for="(it, i) in items" :key="i" :class="{ on: i === step, done: i < step }" data-r>
          <code>{{ it.label }}</code>
          <div class="nt"><p>{{ it.note }}</p></div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.wrap { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1.25fr; gap: 48px; }
.term { order: 2; direction: ltr; background: rgba(2, 20, 29, 0.85); border: 1px solid var(--line); border-radius: 22px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 40px 80px -30px rgba(0,0,0,.6); }
.bar { display: flex; align-items: center; gap: 10px; padding: 16px 22px; border-bottom: 1px solid var(--line); background: rgba(255,255,255,.03); }
.bar i { width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,.18); }
.bar i:first-child { background: var(--coral); } .bar i:nth-child(2) { background: var(--amber); } .bar i:nth-child(3) { background: var(--teal); }
.bar span { margin-left: 14px; color: var(--ink-3); font-size: 18px; }
.body { padding: 26px 30px; font-size: 25px; line-height: 1.6; overflow: hidden; flex: 1; mask-image: linear-gradient(to bottom, transparent 0, #000 22px); }
.blk + .blk { margin-top: 14px; }
.blk { transition: opacity .4s var(--ease), transform .4s var(--ease), filter .4s var(--ease); }
.blk:not(.last) { opacity: 0.45; }
.pp { color: var(--sky); } .ps { color: var(--teal-l); }
.o { color: var(--ink-2); white-space: pre; font-size: 22px; }
.o :deep(.g) { color: var(--teal-l); } .o :deep(.r) { color: var(--coral); } .o :deep(.y) { color: var(--amber); } .o :deep(.d) { color: var(--ink-3); }
.caret { display: inline-block; width: 12px; height: 26px; background: var(--teal-l); vertical-align: -4px; margin-left: 3px; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.side { order: 1; list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.side li { border: 1px solid transparent; border-radius: 18px; padding: 14px 22px; transition: all .4s var(--ease); }
.side code { font-size: 28px; color: var(--ink-3); transition: color .4s; }
.side li.done code { color: var(--ink-2); }
.side li.on { background: var(--glass); border-color: rgba(111,214,200,.35); }
.side li.on code { color: var(--teal-l); }
/* the active note opens smoothly instead of popping in and shifting the list */
.nt { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .5s var(--ease); }
.nt > p { min-height: 0; overflow: hidden; opacity: 0; padding-top: 8px; font-size: 25px; color: var(--ink-2); line-height: 1.55; transition: opacity .25s; }
.side li.on .nt { grid-template-rows: 1fr; }
.side li.on .nt > p { opacity: 1; transition: opacity .4s .15s; }
</style>
