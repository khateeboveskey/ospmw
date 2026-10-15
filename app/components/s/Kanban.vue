<script setup lang="ts">
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
gsap.registerPlugin(Flip)

const props = defineProps<{ active: boolean; step: number; time?: string }>()
const cols = ['للتنفيذ', 'قيد العمل', 'تم']
const cards = [
  { id: 'a', t: 'تصميم صفحة الدخول', tag: 'UI' },
  { id: 'b', t: 'ربط قاعدة البيانات', tag: 'API' },
  { id: 'c', t: 'كتابة اختبارات الدفع', tag: 'QA' },
  { id: 'd', t: 'إعداد خادم النشر', tag: 'DevOps' },
]
// column per card for each step
const plan = [
  { a: 0, b: 0, c: 0, d: 0 },
  { a: 1, b: 1, c: 0, d: 0 },
  { a: 2, b: 1, c: 1, d: 0 },
  { a: 2, b: 2, c: 1, d: 1 },
]
const at = computed(() => plan[Math.min(props.step, plan.length - 1)]!)
const board = ref<HTMLElement>()
let state: Flip.FlipState | null = null
watch(() => props.step, () => { if (board.value) state = Flip.getState(board.value.querySelectorAll('.kc')) }, { flush: 'pre' })
watch(() => props.step, () => { if (state && props.active) Flip.from(state, { duration: 0.9, ease: 'expo.inOut', absolute: true, scale: true }) }, { flush: 'post' })
</script>

<template>
  <section class="slide">
    <SlideHead kicker="منهجيات العمل" :time="time" title="طريقة <em class='mono'>Kanban</em>" lead="اجعل العمل مرئيًا، وحدّد عدد المهام الجارية (WIP Limit)، وحرّك البطاقات من اليمين إلى اليسار." />
    <div ref="board" class="board" data-r>
      <div v-for="(c, ci) in cols" :key="c" class="colm">
        <div class="ch"><b>{{ c }}</b><span v-if="ci === 1" class="wip mono">WIP ≤ 2</span><span class="cnt mono">{{ cards.filter(k => at[k.id as 'a'] === ci).length }}</span></div>
        <div class="list">
          <div v-for="k in cards.filter(k => at[k.id as 'a'] === ci)" :key="k.id" class="kc" :data-flip-id="k.id" :class="{ done: ci === 2 }">
            <span class="tag">{{ k.tag }}</span>
            <span>{{ k.t }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.board { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
.colm { background: rgba(255,255,255,.035); border: 1px solid var(--line); border-radius: 26px; padding: 24px; display: flex; flex-direction: column; gap: 18px; }
.ch { display: flex; align-items: center; gap: 14px; font-size: 30px; }
.wip { font-size: 17px; color: var(--amber); border: 1px solid rgba(244,194,107,.4); border-radius: 999px; padding: 3px 12px; }
.cnt { margin-inline-start: auto; font-size: 20px; color: var(--ink-3); }
.list { display: flex; flex-direction: column; gap: 12px; }
.kc { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-radius: 16px; background: var(--navy); border: 1px solid rgba(255,255,255,.16); font-size: 24px; box-shadow: 0 16px 30px -18px rgba(0,0,0,.6); }
.kc.done { border-color: var(--teal); background: linear-gradient(135deg, rgba(28,157,142,.35), var(--navy)); }
</style>
