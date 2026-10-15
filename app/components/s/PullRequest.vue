<script setup lang="ts">
import { GitBranch, GitCommitHorizontal, GitPullRequest, MessageSquare, CircleCheck, GitMerge, Check } from 'lucide-vue-next'
defineProps<{ active: boolean; step: number; time?: string }>()
const stages = [
  { i: GitBranch, t: 'فرع جديد' },
  { i: GitCommitHorizontal, t: 'commits' },
  { i: GitPullRequest, t: 'فتح PR' },
  { i: MessageSquare, t: 'مراجعة' },
  { i: CircleCheck, t: 'فحوصات CI' },
  { i: GitMerge, t: 'دمج' },
]
</script>

<template>
  <section class="slide">
    <SlideHead kicker="سير العمل الجماعي" :time="time" title="دورة حياة <em class='mono'>Pull Request</em>" />
    <div class="pipe" data-r>
      <div class="track"><div class="fill" :style="{ transform: `scaleX(${step / (stages.length - 1)})` }" /></div>
      <div v-for="(s, i) in stages" :key="i" class="st" :class="{ on: i <= step, cur: i === step }">
        <div class="ic"><component :is="s.i" /></div><span>{{ s.t }}</span>
      </div>
    </div>
    <div class="pr card" data-step="2">
      <div class="top" dir="ltr">
        <span class="state mono" :class="{ merged: step >= 5 }"><component :is="step >= 5 ? GitMerge : GitPullRequest" /> {{ step >= 5 ? 'Merged' : 'Open' }}</span>
        <b class="mono">feat: add login page</b><span class="num mono">#42</span>
      </div>
      <p class="desc"><span class="mono">feature/login → main</span> · يضيف صفحة تسجيل الدخول مع التحقق من المدخلات. <span class="mono link">Closes #17</span></p>
      <div class="rows">
        <div class="r" :class="{ ok: step >= 3 }"><MessageSquare /> <span>Code Review</span><b>{{ step >= 3 ? 'تمت الموافقة (Approved) من مراجعَين' : 'بانتظار المراجعة' }}</b></div>
        <div class="r" :class="{ ok: step >= 4 }"><CircleCheck /> <span>Checks</span><b>{{ step >= 4 ? 'build ✓ · test ✓ · lint ✓' : '…' }}</b></div>
        <div class="r" :class="{ ok: step >= 5 }"><Check /> <span>Merge</span><b>{{ step >= 5 ? 'دُمج في main وحُذف الفرع' : 'غير جاهز' }}</b></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pipe { position: relative; display: flex; justify-content: space-between; margin: 10px 30px 50px; }
.track { position: absolute; top: 44px; inset-inline: 44px; height: 4px; background: rgba(255,255,255,.1); border-radius: 2px; }
.fill { height: 100%; background: var(--teal-l); transform-origin: right; transition: transform .9s var(--ease); }
.st { position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 24px; color: var(--ink-3); transition: color .5s; }
.ic { width: 92px; height: 92px; border-radius: 50%; display: grid; place-items: center; background: var(--navy-d); border: 2px solid rgba(255,255,255,.15); transition: all .6s var(--ease); }
.ic svg { width: 40px; height: 40px; stroke-width: 1.6; }
.st.on { color: #fff; } .st.on .ic { border-color: var(--teal); background: rgba(28,157,142,.25); }
.st.cur .ic { background: var(--teal); box-shadow: 0 0 50px rgba(28,157,142,.7); scale: 1.12; }
.pr { display: flex; flex-direction: column; gap: 20px; max-width: 1300px; align-self: center; width: 100%; }
.top { display: flex; align-items: center; gap: 18px; font-size: 32px; }
.state { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 999px; background: #1f883d; font-size: 21px; transition: background .5s; }
.state.merged { background: #8250df; }
.state svg { width: 22px; height: 22px; }
.num { color: var(--ink-3); }
.desc { font-size: 24px; color: var(--ink-2); }
.link { color: var(--sky); }
.rows { display: flex; flex-direction: column; gap: 12px; }
.r { display: flex; align-items: center; gap: 16px; padding: 14px 20px; border-radius: 14px; background: rgba(255,255,255,.04); font-size: 22px; color: var(--ink-3); transition: all .5s; }
.r svg { width: 28px; height: 28px; }
.r span { font-family: var(--mono); width: 170px; direction: ltr; text-align: right; }
.r.ok { color: #fff; background: rgba(28,157,142,.16); } .r.ok svg { color: var(--teal-l); }
</style>
