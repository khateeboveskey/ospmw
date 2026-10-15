<script setup lang="ts">
defineProps<{ active: boolean; step: number; time?: string }>()
const steps = [
  { c: 'git merge feature', t: 'لا تقلق — اقرأ رسالة Git جيدًا' },
  { c: 'git status', t: 'اعرف أي الملفات فيها تعارض' },
  { c: '<<<<<<< ======= >>>>>>>', t: 'افتح الملف وابحث عن العلامات' },
  { c: 'edit', t: 'اختر أو ادمج النسختين واحذف العلامات' },
  { c: 'git add · git commit', t: 'أعلِم Git أنك حللت التعارض' },
]
</script>

<template>
  <section class="slide">
    <SlideHead kicker="الفروع والدمج" :time="time" title="حل <em class='mono'>Merge Conflicts</em> خطوة بخطوة" />
    <div class="wrap">
      <ol class="steps">
        <li v-for="(s, i) in steps" :key="i" :class="{ on: i === step, done: i < step }" data-r>
          <span class="n mono">{{ i + 1 }}</span>
          <div><b>{{ s.t }}</b><code>{{ s.c }}</code></div>
        </li>
      </ol>
      <div class="ed mono" dir="ltr" data-r>
        <div class="bar">
          <span>greeting.js</span>
          <span v-if="step < 4 && step >= 0" class="warn">CONFLICT</span>
          <span v-else class="ok">resolved</span>
        </div>
        <div class="code">
          <div v-if="step < 2" class="msg">
            <p class="r">Auto-merging greeting.js</p>
            <p class="r">CONFLICT (content): Merge conflict in greeting.js</p>
            <p class="d">Automatic merge failed; fix conflicts and then commit the result.</p>
            <template v-if="step === 1">
              <p class="d" style="margin-top:18px">Unmerged paths:</p>
              <p class="r">&nbsp;&nbsp;both modified:   greeting.js</p>
            </template>
          </div>
          <template v-else-if="step < 3">
            <p><span class="ln">1</span>function greet(name) {</p>
            <p class="mk head"><span class="ln">2</span>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</p>
            <p class="ours"><span class="ln">3</span>  return `مرحبًا ${name}`</p>
            <p class="mk"><span class="ln">4</span>=======</p>
            <p class="theirs"><span class="ln">5</span>  return `أهلًا وسهلًا ${name}`</p>
            <p class="mk inc"><span class="ln">6</span>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature</p>
            <p><span class="ln">7</span>}</p>
          </template>
          <template v-else>
            <p><span class="ln">1</span>function greet(name) {</p>
            <p class="fixed"><span class="ln">2</span>  return `أهلًا وسهلًا يا ${name}`</p>
            <p><span class="ln">3</span>}</p>
            <p v-if="step >= 4" class="g" style="margin-top:30px">$ git add greeting.js</p>
            <p v-if="step >= 4" class="g">$ git commit -m "merge: feature into main"</p>
          </template>
        </div>
        <div v-if="step === 2" class="legend" dir="rtl"><span class="o">نسختك الحالية (HEAD)</span><span class="t">النسخة القادمة (feature)</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap { flex: 1; display: grid; grid-template-columns: 1fr 1.25fr; gap: 48px; min-height: 0; }
.steps { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 14px; }
.steps li { display: flex; gap: 20px; align-items: center; padding: 16px 22px; border-radius: 18px; border: 1px solid transparent; opacity: .45; transition: all .5s var(--ease); }
.steps li.done { opacity: .75; }
.steps li.on { opacity: 1; background: var(--glass); border-color: rgba(111,214,200,.35); }
.n { width: 54px; height: 54px; border-radius: 50%; display: grid; place-items: center; font-size: 24px; border: 2px solid var(--teal); flex: none; }
.on .n { background: var(--teal); }
.steps b { display: block; font-size: 28px; }
.steps code { font-size: 20px; color: var(--teal-l); }
.ed { background: rgba(2,20,29,.85); border: 1px solid var(--line); border-radius: 22px; overflow: hidden; display: flex; flex-direction: column; }
.bar { display: flex; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid var(--line); font-size: 20px; color: var(--ink-2); }
.warn { color: var(--coral); font-weight: 700; } .ok { color: var(--teal-l); font-weight: 700; }
.code { padding: 30px; font-size: 27px; line-height: 1.75; flex: 1; }
.code p { white-space: pre; }
.ln { display: inline-block; width: 40px; color: var(--ink-3); font-size: 20px; }
.mk { color: var(--ink-3); }
.mk.head { color: var(--teal-l); } .mk.inc { color: var(--sky); }
.ours { background: rgba(28,157,142,.2); } .theirs { background: rgba(143,195,221,.16); }
.fixed { background: rgba(28,157,142,.25); border-left: 4px solid var(--teal-l); }
.msg .r { color: var(--coral); } .d { color: var(--ink-3); } .g { color: var(--teal-l); }
.legend { display: flex; gap: 20px; padding: 0 30px 26px; font-family: var(--sans); font-size: 22px; }
.legend .o { color: var(--teal-l); } .legend .t { color: var(--sky); }
</style>
