<script setup lang="ts">
import { X, Check } from 'lucide-vue-next'
defineProps<{ active: boolean; step: number; time?: string }>()
const types = [['feat', 'ميزة جديدة'], ['fix', 'إصلاح خطأ'], ['docs', 'توثيق'], ['style', 'تنسيق فقط'], ['refactor', 'إعادة هيكلة'], ['test', 'اختبارات'], ['chore', 'مهام صيانة']]
</script>

<template>
  <section class="slide">
    <SlideHead kicker="الأساسيات" :time="time" title="رسائل commit احترافية" lead="معيار <span class='mono'>Conventional Commits</span>: رسالة يفهمها الإنسان والأدوات معًا." />
    <div class="anat mono" dir="ltr" data-r>
      <span class="p t">feat<small>type</small></span><span class="p s">(auth)<small>scope</small></span><span class="p c">:</span>&nbsp;<span class="p d">add login with GitHub<small>description</small></span>
    </div>
    <div class="types" dir="ltr" data-step="1">
      <div v-for="[k, v] in types" :key="k" class="ty"><b class="mono">{{ k }}</b><span>{{ v }}</span></div>
    </div>
    <div class="bg" data-step="2">
      <div class="card bad"><div class="h"><X /> سيئة</div><code>update</code><code>fixed stuff</code><code>asdfgh</code></div>
      <div class="card good"><div class="h"><Check /> جيدة</div><code>fix(cart): prevent negative quantity</code><code>docs: add setup steps to README</code><code>feat!: drop support for Node 18</code></div>
    </div>
  </section>
</template>

<style scoped>
.anat { align-self: center; font-size: 58px; display: flex; align-items: flex-start; padding: 30px 46px 60px; border-radius: 24px; background: rgba(2,20,29,.7); border: 1px solid var(--line); }
.p { position: relative; }
.p small { position: absolute; top: 100%; left: 50%; translate: -50% 8px; font-size: 18px; white-space: nowrap; color: var(--ink-3); border-top: 2px solid currentColor; padding-top: 4px; }
.t { color: var(--teal-l); } .s { color: var(--sky); } .d { color: #fff; } .c { color: var(--ink-3); }
.types { display: flex; gap: 16px; justify-content: center; margin-top: 44px; flex-wrap: wrap; }
.ty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 22px; border-radius: 16px; background: var(--glass); border: 1px solid var(--line); }
.ty b { font-size: 26px; color: var(--teal-l); } .ty span { font-size: 20px; color: var(--ink-2); }
.bg { display: grid; grid-template-columns: 1fr 1.6fr; gap: 28px; margin-top: 40px; }
.bg .card { display: flex; flex-direction: column; gap: 12px; padding: 26px 32px; }
.h { display: flex; align-items: center; gap: 10px; font-size: 26px; font-weight: 700; }
.h svg { width: 28px; height: 28px; }
.bad .h { color: var(--coral); } .good .h { color: var(--teal-l); }
.bg code { font-size: 23px; color: var(--ink-2); text-align: left; }
.bad code { text-decoration: line-through; text-decoration-color: rgba(255,138,118,.6); }
</style>
