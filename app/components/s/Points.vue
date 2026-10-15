<script setup lang="ts">
import gsap from 'gsap'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const fib = ['1', '2', '3', '5', '8', '13', '21', '?']
const deck = ref<HTMLElement>()
const votes = ref<HTMLElement>()
watch(() => [props.active, props.step] as const, ([a, s], [pa, ps]) => {
  if (!a) return
  if (!pa) gsap.fromTo(deck.value!.children, { rotateY: 180, y: 80, opacity: 0 }, { rotateY: 0, y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.6 })
  if (s === 1 && (ps ?? 0) < 1 || (s === 1 && !pa)) gsap.fromTo(votes.value!.querySelectorAll('.v'), { rotateY: 180 }, { rotateY: 0, duration: 0.8, stagger: 0.25, ease: 'back.out(1.6)', delay: 0.3 })
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="تخطيط المشروع وتقسيم العمل" :time="time" title="تقدير الوقت بـ <em class='mono'>Story Points</em>" lead="نقدّر الجهد والتعقيد والمخاطرة نسبيًا — لا بالساعات. نستخدم متتالية فيبوناتشي لأن الفروق الكبيرة تعكس عدم اليقين." />
    <div ref="deck" class="fib">
      <div v-for="f in fib" :key="f" class="pc mono">{{ f }}</div>
    </div>
    <div ref="votes" class="poker" data-step="1">
      <div class="who"><div class="v mono">3</div><span>مطوّر أ</span></div>
      <div class="who"><div class="v mono hi">8</div><span>مطوّر ب</span></div>
      <div class="who"><div class="v mono">5</div><span>QA</span></div>
      <p class="pk"><b>Planning Poker:</b> كلٌّ يكشف بطاقته معًا، ثم يشرح صاحب أعلى وأقل تقدير وجهة نظره، ونعيد التصويت حتى نتفق.</p>
    </div>
  </section>
</template>

<style scoped>
.fib { display: flex; gap: 22px; justify-content: center; perspective: 1200px; direction: ltr; margin-top: 10px; }
.pc { width: 150px; height: 210px; border-radius: 20px; display: grid; place-items: center; font-size: 66px; font-weight: 700; background: linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.03)); border: 1px solid rgba(255,255,255,.2); backface-visibility: hidden; }
.pc:nth-child(4) { background: var(--teal); border-color: var(--teal-l); }
.poker { display: flex; align-items: center; gap: 40px; margin-top: 60px; perspective: 1000px; }
.who { display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 22px; color: var(--ink-2); }
.v { width: 96px; height: 134px; border-radius: 14px; display: grid; place-items: center; font-size: 46px; font-weight: 700; background: var(--navy); border: 2px solid var(--teal-l); }
.v.hi { border-color: var(--amber); color: var(--amber); }
.pk { font-size: 27px; line-height: 1.6; color: var(--ink-2); flex: 1; }
.pk b { color: #fff; }
</style>
