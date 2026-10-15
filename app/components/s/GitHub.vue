<script setup lang="ts">
import gsap from 'gsap'
import { Laptop, Cloud, ArrowLeft, ArrowRight } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const pipe = ref<HTMLElement>()
let loop: gsap.core.Timeline | null = null
watch(() => [props.active, props.step] as const, ([a, s]) => {
  loop?.kill()
  if (!a || s < 2) return
  const up = pipe.value!.querySelectorAll('.pk.up')
  const dn = pipe.value!.querySelectorAll('.pk.dn')
  loop = gsap.timeline({ repeat: -1, delay: 0.4 })
    .fromTo(up, { x: 0, opacity: 0 }, { x: 330, opacity: 1, duration: 1.2, stagger: 0.25, ease: 'power1.inOut' })
    .to(up, { opacity: 0, duration: 0.2 }, '-=0.2')
    .fromTo(dn, { x: 0, opacity: 0 }, { x: -330, opacity: 1, duration: 1.2, stagger: 0.25, ease: 'power1.inOut' })
    .to(dn, { opacity: 0, duration: 0.2 }, '-=0.2')
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="مفهوم التحكم بالإصدارات" :time="time" title="<span class='mono'>Git</span> مقابل <em class='mono'>GitHub</em>" lead="الفرق الجوهري: Git أداة، و GitHub مكان." />
    <div class="cmp" dir="ltr">
      <div class="card side" data-r>
        <div class="big"><Laptop /></div>
        <h3 class="mono">Git</h3>
        <ul dir="rtl">
          <li>برنامج يعمل على جهازك</li>
          <li>يحفظ تاريخ التعديلات محليًا</li>
          <li>يعمل دون إنترنت</li>
          <li>مفتوح المصدر — صنعه Linus Torvalds عام 2005</li>
        </ul>
      </div>
      <div ref="pipe" class="pipe" data-step="2">
        <div class="lane"><span class="mono">push</span><ArrowRight /><i class="pk up" /><i class="pk up" /><i class="pk up" /></div>
        <div class="lane"><ArrowLeft /><span class="mono">pull</span><i class="pk dn" /><i class="pk dn" /><i class="pk dn" /></div>
      </div>
      <div class="card side gh" data-step="1">
        <div class="big"><Cloud /></div>
        <h3 class="mono">GitHub</h3>
        <ul dir="rtl">
          <li>منصة على الإنترنت تستضيف مستودعات Git</li>
          <li>تعاون: Pull Requests و Code Review</li>
          <li>إدارة: Issues و Projects</li>
          <li>أتمتة: GitHub Actions</li>
        </ul>
      </div>
    </div>
    <p class="ana" data-step="2">تشبيه: <b>Git</b> هو الكاميرا التي تلتقط الصور، و <b>GitHub</b> هو الألبوم المشترك على السحابة.</p>
  </section>
</template>

<style scoped>
.cmp { flex: 1; display: grid; grid-template-columns: 1fr 420px 1fr; gap: 30px; align-items: stretch; }
.side { display: flex; flex-direction: column; gap: 18px; }
.big { width: 84px; height: 84px; border-radius: 28px; display: grid; place-items: center; background: rgba(28,157,142,.2); color: var(--teal-l); }
.big svg { width: 44px; height: 44px; stroke-width: 1.5; }
.gh .big { background: rgba(255,255,255,.12); color: #fff; }
.side h3 { font-size: 46px; }
.side ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.side li { font-size: 24px; color: var(--ink-2); }
.side li::before { content: '—'; color: var(--teal-l); margin-inline-end: 12px; }
.pipe { display: flex; flex-direction: column; justify-content: center; gap: 80px; }
.lane { position: relative; display: flex; align-items: center; justify-content: center; gap: 12px; height: 60px; border-top: 2px dashed rgba(111,214,200,.4); font-size: 26px; color: var(--teal-l); padding-top: 20px; }
.lane svg { width: 30px; height: 30px; }
.pk { position: absolute; top: -9px; width: 16px; height: 16px; border-radius: 50%; background: var(--teal-l); box-shadow: 0 0 16px var(--teal-l); opacity: 0; }
.pk.up { left: 30px; } .pk.dn { right: 30px; background: #fff; box-shadow: 0 0 16px #fff; }
.ana { font-size: 30px; color: var(--ink-2); margin-top: 18px; text-align: center; }
.ana b { color: #fff; font-family: var(--mono); }
</style>
