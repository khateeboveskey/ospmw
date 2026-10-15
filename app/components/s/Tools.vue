<script setup lang="ts">
import { CircleDot, CircleCheck, Milestone, Kanban } from 'lucide-vue-next'
defineProps<{ active: boolean; step: number; time?: string }>()
const issues = [
  { n: 17, t: 'Login button not working on mobile', l: [['bug', '#d73a4a'], ['priority: high', '#f4c26b']], done: false },
  { n: 21, t: 'Add order export to Excel', l: [['enhancement', '#1c9d8e'], ['good first issue', '#7057ff']], done: false },
  { n: 9, t: 'Write README setup steps', l: [['documentation', '#0075ca']], done: true },
]
</script>

<template>
  <section class="slide">
    <SlideHead kicker="أدوات الإدارة في GitHub" :time="time" title="<span class='mono'>Issues</span> و <span class='mono'>Labels</span> و <em class='mono'>Milestones</em>" />
    <div class="wrap">
      <div class="card list" dir="ltr" data-r>
        <div class="lh"><CircleDot /> 2 Open <span class="cl"><CircleCheck /> 1 Closed</span></div>
        <div v-for="it in issues" :key="it.n" class="is">
          <component :is="it.done ? CircleCheck : CircleDot" :class="it.done ? 'done' : 'open'" />
          <div>
            <b>{{ it.t }}</b>
            <div class="lbls"><span v-for="[l, c] in it.l" :key="l" class="lb" :style="{ '--c': c }" data-step="1">{{ l }}</span></div>
            <small class="mono">#{{ it.n }}</small>
          </div>
        </div>
      </div>
      <div class="side">
        <div class="card ms" data-step="2">
          <div class="mh"><Milestone /><b class="mono">v1.0 — Launch</b><span class="mono">due Nov 30</span></div>
          <div class="bar"><div class="fill" /></div>
          <small>65% مكتمل · 13 مغلقة · 7 مفتوحة</small>
        </div>
        <div class="card pj" data-step="3">
          <div class="mh"><Kanban /><b>GitHub Projects</b></div>
          <p>نفس لوحة Kanban من اليوم الأول — لكن البطاقات هنا Issues و PRs حقيقية تتحرك تلقائيًا عند الدمج.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap { flex: 1; display: grid; grid-template-columns: 1.3fr 1fr; gap: 36px; }
.list { padding: 0; display: flex; flex-direction: column; }
.lh { display: flex; align-items: center; gap: 10px; padding: 22px 28px; font-size: 22px; font-weight: 700; border-bottom: 1px solid var(--line); background: rgba(255,255,255,.03); }
.lh svg { width: 24px; height: 24px; color: #3fb950; }
.cl { margin-left: 22px; display: inline-flex; gap: 8px; align-items: center; color: var(--ink-3); font-weight: 400; } .cl svg { color: var(--ink-3); }
.is { display: flex; gap: 16px; padding: 24px 28px; border-bottom: 1px solid var(--line); }
.is > svg { width: 28px; height: 28px; flex: none; margin-top: 4px; }
.open { color: #3fb950; } .done { color: #a371f7; }
.is b { font-size: 26px; display: block; }
.lbls { display: flex; gap: 10px; margin: 10px 0; }
.lb { font-size: 17px; font-weight: 700; padding: 3px 12px; border-radius: 999px; background: color-mix(in srgb, var(--c) 30%, transparent); border: 1px solid var(--c); color: #fff; }
.is small { color: var(--ink-3); font-size: 18px; }
.side { display: flex; flex-direction: column; gap: 28px; }
.ms, .pj { display: flex; flex-direction: column; gap: 18px; }
.mh { display: flex; align-items: center; gap: 14px; font-size: 26px; }
.mh svg { width: 34px; height: 34px; color: var(--teal-l); }
.mh span { margin-inline-start: auto; font-size: 18px; color: var(--ink-3); }
.bar { height: 14px; border-radius: 7px; background: rgba(255,255,255,.1); overflow: hidden; }
.fill { width: 65%; height: 100%; background: linear-gradient(90deg, var(--teal), var(--teal-l)); border-radius: 7px; }
.ms small { font-size: 21px; color: var(--ink-2); }
.pj p { font-size: 25px; line-height: 1.6; color: var(--ink-2); }
</style>
