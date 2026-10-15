<script setup lang="ts">
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { FolderOpen, PackageCheck, Database } from 'lucide-vue-next'
gsap.registerPlugin(Flip)

const props = defineProps<{ active: boolean; step: number; time?: string }>()
type F = { id: string; st: 'M' | 'U' | 'A' }
// where every file / commit lives at each step
const plan: { wd: F[]; stg: F[]; repo: string[]; cmd: string; say: string }[] = [
  { wd: [{ id: 'index.html', st: 'M' }, { id: 'style.css', st: 'M' }, { id: 'app.js', st: 'U' }], stg: [], repo: ['a1f3c'], cmd: 'git status', say: 'عدّلنا ملفين وأنشأنا ملفًا جديدًا — Git يلاحظ التغييرات لكنه لم يحفظها بعد.' },
  { wd: [{ id: 'style.css', st: 'M' }, { id: 'app.js', st: 'U' }], stg: [{ id: 'index.html', st: 'A' }], repo: ['a1f3c'], cmd: 'git add index.html', say: 'نختار ما نريد إدراجه في اللقطة القادمة، ونضعه في منطقة التجهيز.' },
  { wd: [], stg: [{ id: 'index.html', st: 'A' }, { id: 'style.css', st: 'A' }, { id: 'app.js', st: 'A' }], repo: ['a1f3c'], cmd: 'git add .', say: 'أو نضيف كل التغييرات دفعة واحدة.' },
  { wd: [], stg: [], repo: ['a1f3c', 'e7b21'], cmd: 'git commit -m "feat: add homepage"', say: 'الـ commit يأخذ لقطة دائمة لكل ما في منطقة التجهيز، مع رسالة توضح السبب.' },
  { wd: [{ id: 'style.css', st: 'M' }], stg: [], repo: ['a1f3c', 'e7b21'], cmd: 'git diff', say: 'تعديل جديد يبدأ الدورة من جديد… و git diff يُظهر ما تغيّر بالضبط.' },
]
const s = computed(() => plan[Math.min(props.step, plan.length - 1)]!)
const typed = ref('')
let typing: gsap.core.Tween | null = null
const root = ref<HTMLElement>()
let state: Flip.FlipState | null = null

watch(() => props.step, () => { if (root.value) state = Flip.getState(root.value.querySelectorAll('[data-flip-id]')) }, { flush: 'pre' })
watch(() => [props.active, props.step] as const, ([a], [pa]) => {
  if (!a) return
  if (state && pa) {
    Flip.from(state, {
      targets: root.value!.querySelectorAll('[data-flip-id]:not([data-leaving])'),
      duration: 0.9, ease: 'expo.inOut', absolute: true, scale: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.7, delay: 0.5, ease: 'back.out(2)' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.3, x: 200, duration: 0.6, ease: 'power3.in' }),
    })
  }
  state = null
  const full = s.value.cmd
  const o = { n: 0 }
  typing?.kill()
  typing = gsap.to(o, { n: full.length, duration: Math.min(1.1, full.length * 0.035), ease: 'none', onUpdate: () => { typed.value = full.slice(0, Math.round(o.n)) } })
}, { flush: 'post' })

/* items removed from a zone: if they reappear elsewhere Flip moves the new copy, otherwise they fly out */
function onLeave(el: Element, done: () => void) {
  const h = el as HTMLElement
  h.dataset.leaving = ''
  const id = h.dataset.flipId
  const moved = root.value?.querySelector(`[data-flip-id="${id}"]:not([data-leaving])`)
  gsap.set(h, { position: 'absolute', top: h.offsetTop, left: h.offsetLeft, width: h.offsetWidth, margin: 0 })
  if (moved) return gsap.to(h, { opacity: 0, duration: 0.15, onComplete: done })
  gsap.to(h, { opacity: 0, x: 220, scale: 0.4, duration: 0.7, ease: 'power3.in', onComplete: done })
}
</script>

<template>
  <section ref="root" class="slide">
    <SlideHead kicker="الأساسيات" :time="time" title="المناطق الثلاث في <em class='mono'>Git</em>" />
    <div class="zones" dir="ltr" data-r>
      <div class="z">
        <div class="zh"><FolderOpen /><div><b>Working Directory</b><span>مجلد العمل</span></div></div>
        <TransitionGroup tag="div" class="files" :css="false" @leave="onLeave">
          <div v-for="f in s.wd" :key="'wd' + f.id" :data-flip-id="f.id" class="file"><i :class="f.st">{{ f.st }}</i>{{ f.id }}</div>
        </TransitionGroup>
      </div>
      <div class="arr"><span class="mono">git add</span><svg viewBox="0 0 120 24"><path d="M0 12 H110 M100 2 L112 12 L100 22" /></svg></div>
      <div class="z">
        <div class="zh"><PackageCheck /><div><b>Staging Area</b><span>منطقة التجهيز</span></div></div>
        <TransitionGroup tag="div" class="files" :css="false" @leave="onLeave">
          <div v-for="f in s.stg" :key="'st' + f.id" :data-flip-id="f.id" class="file"><i :class="f.st">{{ f.st }}</i>{{ f.id }}</div>
        </TransitionGroup>
      </div>
      <div class="arr"><span class="mono">git commit</span><svg viewBox="0 0 120 24"><path d="M0 12 H110 M100 2 L112 12 L100 22" /></svg></div>
      <div class="z repo">
        <div class="zh"><Database /><div><b>Repository (.git)</b><span>المستودع</span></div></div>
        <TransitionGroup tag="div" class="commits" :css="false" @leave="onLeave">
          <div v-for="(c, i) in s.repo" :key="c" :data-flip-id="'c' + c" class="cm"><span class="dot" /><b class="mono">{{ c }}</b><span>{{ i ? 'feat: add homepage' : 'initial commit' }}</span></div>
        </TransitionGroup>
      </div>
    </div>
    <div class="foot">
      <div class="term mono"><span class="ps">$</span> {{ typed }}<span class="caret" /></div>
      <Transition name="say" mode="out-in"><p :key="step" class="say">{{ s.say }}</p></Transition>
    </div>
  </section>
</template>

<style scoped>
.zones { flex: 1; display: grid; grid-template-columns: 1fr 150px 1fr 150px 1fr; align-items: stretch; min-height: 0; }
.z { background: rgba(255,255,255,.035); border: 1px solid var(--line); border-radius: 26px; padding: 26px; display: flex; flex-direction: column; gap: 22px; }
.z.repo { border-color: rgba(111,214,200,.4); background: rgba(28,157,142,.08); }
.zh { display: flex; align-items: center; gap: 16px; }
.zh svg { width: 44px; height: 44px; color: var(--teal-l); stroke-width: 1.5; }
.zh b { display: block; font-family: var(--mono); font-size: 25px; }
.zh span { font-size: 22px; color: var(--ink-3); }
.files, .commits { position: relative; display: flex; flex-direction: column; gap: 14px; }
.file { display: flex; align-items: center; gap: 14px; font-family: var(--mono); font-size: 24px; padding: 14px 18px; border-radius: 14px; background: var(--navy); border: 1px solid rgba(255,255,255,.18); }
.file i { font-style: normal; width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center; font-size: 18px; font-weight: 700; }
.file i.M { background: rgba(244,194,107,.2); color: var(--amber); }
.file i.U { background: rgba(255,138,118,.2); color: var(--coral); }
.file i.A { background: rgba(28,157,142,.3); color: var(--teal-l); }
.cm { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 14px; background: rgba(28,157,142,.18); font-size: 21px; }
.cm b { font-size: 22px; color: var(--teal-l); }
.cm span:last-child { font-family: var(--mono); color: var(--ink-2); font-size: 18px; }
.cm .dot { width: 22px; height: 22px; border-radius: 50%; background: var(--teal); flex: none; }
.arr { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--teal-l); font-size: 19px; }
.arr svg { width: 110px; } .arr path { fill: none; stroke: var(--teal-l); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.foot { display: flex; align-items: center; gap: 36px; margin-top: 30px; }
.term { direction: ltr; font-size: 26px; padding: 14px 24px; border-radius: 14px; background: rgba(4,33,47,.7); border: 1px solid var(--line); min-width: 600px; }
.ps { color: var(--teal-l); margin-right: 8px; }
.caret { display: inline-block; width: 12px; height: 26px; background: var(--teal-l); vertical-align: -4px; margin-left: 3px; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.say { font-size: 28px; color: var(--ink-2); line-height: 1.5; flex: 1; }
.say-enter-active, .say-leave-active { transition: all .35s var(--ease); }
.say-enter-from { opacity: 0; transform: translateY(12px); } .say-leave-to { opacity: 0; }
</style>
