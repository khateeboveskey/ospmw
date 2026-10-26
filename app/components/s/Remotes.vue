<script setup lang="ts">
import gsap from 'gsap'
import { Laptop, Github, UserPlus } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
type C = { h: string; ghost?: boolean }
const plan: { local: C[]; remote: C[]; dir: 0 | 1 | -1; cmd: string; say: string; mate?: boolean }[] = [
  { local: [{ h: 'a1' }, { h: 'b2' }], remote: [], dir: 0, cmd: 'git remote add origin git@github.com:team/shop.git', say: 'نربط المستودع المحلي بمستودع فارغ على GitHub ونسمّيه origin.' },
  { local: [{ h: 'a1' }, { h: 'b2' }], remote: [{ h: 'a1' }, { h: 'b2' }], dir: 1, cmd: 'git push -u origin main', say: 'push: نرفع الـ commits المحلية إلى المستودع البعيد.' },
  { local: [{ h: 'a1' }, { h: 'b2' }], remote: [{ h: 'a1' }, { h: 'b2' }, { h: 'c3' }], dir: 0, cmd: '# زميلك رفع commit جديد', say: 'المستودع البعيد تقدّم، ونسختك المحلية لا تعلم بعد.' },
  { local: [{ h: 'a1' }, { h: 'b2' }, { h: 'c3', ghost: true }], remote: [{ h: 'a1' }, { h: 'b2' }, { h: 'c3' }], dir: -1, cmd: 'git fetch', say: 'fetch: نُحضر الجديد ونخزّنه في origin/main — دون أن نلمس عملنا.' },
  { local: [{ h: 'a1' }, { h: 'b2' }, { h: 'c3' }], remote: [{ h: 'a1' }, { h: 'b2' }, { h: 'c3' }], dir: -1, cmd: 'git pull', say: 'pull = fetch + merge: نُحضر الجديد وندمجه في فرعنا مباشرة.' },
  { local: [{ h: 'a1' }, { h: 'b2' }, { h: 'c3' }], remote: [{ h: 'a1' }, { h: 'b2' }, { h: 'c3' }], dir: -1, mate: true, cmd: 'git clone git@github.com:team/shop.git', say: 'clone: عضو جديد ينسخ المستودع كاملًا بتاريخه — مرة واحدة فقط.' },
]
const s = computed(() => plan[Math.min(props.step, plan.length - 1)]!)
const wire = ref<HTMLElement>()
const { typed, type } = useTyper()
watch(() => [props.active, props.step] as const, ([a], [pa]) => {
  if (!a) return
  type(s.value.cmd, 0, !pa)
  const pk = wire.value!.querySelectorAll('.pk')
  // packets fade in at one end, travel, and fade out at the other
  const [from, to] = s.value.dir > 0 ? ['0%', '100%'] : ['100%', '0%']
  if (s.value.dir) pk.forEach((el, i) => gsap.timeline({ delay: 0.3 + i * 0.18 })
    .fromTo(el, { left: from, opacity: 0 }, { left: to, duration: 1.2, ease: 'power2.inOut' })
    .to(el, { opacity: 1, duration: 0.25 }, 0)
    .to(el, { opacity: 0, duration: 0.25 }, 0.95))
  else gsap.to(pk, { opacity: 0, duration: 0.3 })
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="التعامل مع المستودعات البعيدة" :time="time" title="محلي ⇄ بعيد" />
    <div class="stage" dir="ltr" data-r>
      <div class="box">
        <div class="bh"><Laptop /><b>جهازك (local)</b></div>
        <div class="row"><TransitionGroup name="c"><span v-for="c in s.local" :key="c.h" class="c mono" :class="{ ghost: c.ghost }">{{ c.h }}</span></TransitionGroup></div>
        <Transition name="fx" mode="out-in"><span :key="String(s.local.some(c => c.ghost))" class="br mono">main{{ s.local.some(c => c.ghost) ? '   origin/main → c3' : '' }}</span></Transition>
        <div class="mate" :class="{ on: s.mate }"><UserPlus /><span>جهاز زميل جديد</span><span class="row"><span v-for="c in plan[5]!.local" :key="c.h" class="c mono sm">{{ c.h }}</span></span></div>
      </div>
      <div ref="wire" class="wire">
        <span class="lbl mono">origin</span>
        <i class="pk" /><i class="pk" /><i class="pk" />
      </div>
      <div class="box gh">
        <div class="bh"><Github /><b>GitHub (remote)</b></div>
        <div class="row"><TransitionGroup name="c"><span v-for="c in s.remote" :key="c.h" class="c mono">{{ c.h }}</span></TransitionGroup></div>
        <span class="br mono">main</span>
      </div>
    </div>
    <div class="foot">
      <div class="term mono"><span class="ps">$</span> {{ typed }}<span class="caret" /></div>
      <Transition name="say" mode="out-in"><p :key="step" class="say">{{ s.say }}</p></Transition>
    </div>
  </section>
</template>

<style scoped>
.stage { flex: 1; display: grid; grid-template-columns: 1fr 420px 1fr; align-items: stretch; align-content: center; gap: 0; }
.box { position: relative; min-height: 360px; border-radius: 28px; border: 1px solid var(--line); background: rgba(255,255,255,.04); padding: 30px; display: flex; flex-direction: column; gap: 26px; }
.box.gh { border-color: rgba(111,214,200,.4); background: rgba(28,157,142,.08); }
.bh { display: flex; align-items: center; gap: 14px; font-size: 28px; direction: rtl; justify-content: flex-end; }
.bh svg { width: 44px; height: 44px; color: var(--teal-l); stroke-width: 1.5; }
.row { display: flex; gap: 14px; align-items: center; min-height: 80px; }
.c { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; background: var(--teal); font-size: 22px; font-weight: 700; color: var(--navy-dd); position: relative; }
.c + .c::before { content: ''; position: absolute; right: 100%; width: 14px; height: 4px; background: var(--teal); }
/* every commit keeps a (transparent) dashed border, so fetched → merged only fades colours */
.c { border: 3px dashed transparent; transition: background .6s var(--ease), border-color .6s var(--ease), color .6s var(--ease); }
.c.ghost { background: transparent; border-color: var(--teal-l); color: var(--teal-l); }
.c.sm { width: 50px; height: 50px; font-size: 16px; }
.br { font-size: 20px; color: var(--ink-3); white-space: pre; }
/* space is always reserved, so the clone step fades in without moving anything */
.mate { display: flex; align-items: center; gap: 16px; padding: 14px 22px; border-radius: 20px; border: 1px dashed rgba(255,255,255,.3); font-size: 22px; direction: rtl; opacity: 0; transform: translateY(14px); transition: opacity .3s, transform .3s; }
.mate.on { opacity: 1; transform: none; transition: opacity .6s var(--ease) .5s, transform .6s var(--ease) .5s; }
.mate .row { min-height: 0; direction: ltr; }
.mate svg { width: 32px; height: 32px; color: var(--teal-l); }
.wire { align-self: center; position: relative; height: 4px; margin: 0 20px; background: linear-gradient(90deg, var(--teal), var(--teal-l)); border-radius: 2px; }
.lbl { position: absolute; left: 50%; top: -48px; translate: -50% 0; font-size: 22px; color: var(--teal-l); }
.pk { position: absolute; top: -8px; width: 20px; height: 20px; margin-left: -10px; border-radius: 50%; background: #fff; box-shadow: 0 0 20px #fff; opacity: 0; }
.c-enter-active { transition: all .7s var(--ease) .6s; } .c-leave-active { transition: all .3s; }
.c-enter-from { opacity: 0; transform: scale(.3); } .c-leave-to { opacity: 0; }
.foot { display: flex; align-items: center; gap: 36px; margin-top: 30px; }
.term { direction: ltr; font-size: 25px; padding: 14px 24px; border-radius: 14px; background: rgba(4,33,47,.7); border: 1px solid var(--line); min-width: 760px; }
.ps { color: var(--teal-l); margin-right: 8px; }
.caret { display: inline-block; width: 12px; height: 26px; background: var(--teal-l); vertical-align: -4px; margin-left: 3px; animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.say { font-size: 28px; color: var(--ink-2); line-height: 1.5; flex: 1; }
.say-enter-active, .say-leave-active { transition: all .35s var(--ease); }
.say-enter-from { opacity: 0; transform: translateY(12px); } .say-leave-to { opacity: 0; }
</style>
