<script setup lang="ts">
import { Check } from 'lucide-vue-next'
defineProps<{ active: boolean; step: number; time?: string }>()
const ac = ['يظهر زر «تصدير» في صفحة الطلبات', 'الملف يحتوي: رقم الطلب، التاريخ، المبلغ، الحالة', 'يمكن التصفية حسب الشهر قبل التصدير', 'يكتمل التصدير خلال أقل من 5 ثوانٍ']
</script>

<template>
  <section class="slide">
    <SlideHead kicker="تخطيط المشروع وتقسيم العمل" :time="time" title="كتابة <em class='mono'>User Stories</em>" lead="نصف الميزة من وجهة نظر المستخدم — لا من وجهة نظر الكود." />
    <div class="wrap">
      <div class="card story" data-r>
        <div class="id mono">#US-14</div>
        <p class="s">
          <span class="seg" :class="{ on: step >= 1 }"><small>بصفتي</small> مدير متجر،</span>
          <span class="seg" :class="{ on: step >= 2 }"><small>أريد</small> تصدير الطلبات إلى ملف Excel،</span>
          <span class="seg" :class="{ on: step >= 3 }"><small>حتى</small> أُعِدّ التقرير الشهري بسرعة.</span>
        </p>
        <div class="tmpl mono">As a &lt;role&gt;, I want &lt;goal&gt;, so that &lt;benefit&gt;</div>
      </div>
      <div class="card ac" data-step="4">
        <h3>معايير القبول <span class="mono">Acceptance Criteria</span></h3>
        <ul>
          <li v-for="(a, i) in ac" :key="a" :class="{ ok: step >= 5 + i }"><span class="cb"><Check /></span>{{ a }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap { flex: 1; display: grid; grid-template-columns: 1.1fr 1fr; gap: 36px; }
.story { display: flex; flex-direction: column; gap: 26px; border-inline-start: 6px solid var(--teal); }
.id { color: var(--ink-3); font-size: 22px; }
.s { font-family: var(--serif); font-size: 50px; line-height: 1.55; display: flex; flex-direction: column; gap: 10px; }
.seg { transition: all .6s var(--ease); opacity: .35; }
.seg small { font-family: var(--sans); font-size: 26px; color: var(--teal-l); margin-inline-end: 10px; padding: 2px 12px; border-radius: 8px; background: rgba(28,157,142,.18); vertical-align: middle; }
.seg.on { opacity: 1; }
.tmpl { font-size: 20px; color: var(--ink-3); margin-top: auto; }
.ac { display: flex; flex-direction: column; gap: 22px; }
.ac h3 { font-size: 34px; } .ac h3 span { font-size: 20px; color: var(--ink-3); margin-inline-start: 10px; }
ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 20px; }
li { display: flex; align-items: center; gap: 18px; font-size: 26px; color: var(--ink-2); transition: color .4s; }
.cb { width: 38px; height: 38px; border-radius: 10px; border: 2px solid rgba(255,255,255,.3); display: grid; place-items: center; flex: none; transition: all .4s var(--ease); }
.cb svg { width: 24px; height: 24px; stroke-width: 3; opacity: 0; transform: scale(.3); transition: all .4s var(--ease); }
li.ok { color: #fff; } li.ok .cb { background: var(--teal); border-color: var(--teal); } li.ok .cb svg { opacity: 1; transform: none; }
</style>
