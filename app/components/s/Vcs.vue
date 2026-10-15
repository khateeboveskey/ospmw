<script setup lang="ts">
import gsap from 'gsap'
import { FileText } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const files = ['تقرير.docx', 'تقرير_نهائي.docx', 'تقرير_نهائي_2.docx', 'تقرير_نهائي_معدل.docx', 'تقرير_نهائي_فعلًا.docx', 'تقرير_نهائي_آخر_مرة_والله.docx']
const rot = [-8, 5, -3, 9, -6, 4]
const versions = [
  { h: 'a1f', m: 'إنشاء التقرير', who: 'سارة' },
  { h: 'b72', m: 'إضافة الجداول', who: 'أحمد' },
  { h: 'c3e', m: 'تصحيح الأرقام', who: 'سارة' },
  { h: 'd9a', m: 'المراجعة النهائية', who: 'ليلى' },
]
const mess = ref<HTMLElement>()
const tl = ref<HTMLElement>()
watch(() => [props.active, props.step] as const, ([a, s], [pa]) => {
  if (!a) return
  const f = mess.value!.querySelectorAll('.f')
  if (s === 0) {
    gsap.to(tl.value!, { autoAlpha: 0, duration: 0.4 })
    gsap.fromTo(f, { y: -300, opacity: 0, rotate: 0 }, { y: 0, opacity: 1, rotate: (i: number) => rot[i]!, duration: 0.9, stagger: 0.12, ease: 'bounce.out', delay: pa ? 0 : 0.6 })
  } else {
    gsap.to(f, { x: 0, y: 0, scale: 0.2, opacity: 0, rotate: 0, duration: 0.7, stagger: 0.05, ease: 'power3.in' })
    gsap.set(tl.value!, { autoAlpha: 1 })
    gsap.fromTo(tl.value!.querySelector('.ax')!, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'expo.inOut', delay: 0.5 })
    gsap.fromTo(tl.value!.querySelectorAll('.v'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'expo.out', delay: 0.8 })
  }
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="مفهوم التحكم بالإصدارات" :time="time" title="ما المشكلة التي يحلّها <em class='mono'>Version Control</em>؟" />
    <div class="stage">
      <div ref="mess" class="mess">
        <div v-for="(f, i) in files" :key="f" class="f" :style="{ insetInlineStart: (i % 3) * 330 + 'px', top: Math.floor(i / 3) * 210 + 'px' }">
          <FileText /><span>{{ f }}</span>
        </div>
      </div>
      <div ref="tl" class="tl" dir="ltr">
        <div class="ax" />
        <div v-for="v in versions" :key="v.h" class="v">
          <span class="dot" /><b class="mono">{{ v.h }}</b><span class="m">{{ v.m }}</span><span class="w">{{ v.who }}</span>
        </div>
      </div>
      <ul class="qs">
        <li data-r>من غيّر هذا السطر؟</li>
        <li data-r>متى؟ ولماذا؟</li>
        <li data-r>كيف نعود لنسخة الأسبوع الماضي؟</li>
        <li data-r>كيف يعمل خمسة أشخاص على نفس الملف؟</li>
        <li data-step="1" class="ans">نظام التحكم بالإصدارات يجيب عن كل هذا.</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.stage { flex: 1; display: flex; gap: 60px; position: relative; }
.mess, .tl { position: relative; width: 1000px; height: 100%; }
.tl { position: absolute; right: 0; top: 140px; width: 1000px; height: 300px; display: flex; justify-content: space-between; align-items: flex-start; padding: 0 40px; }
.ax { position: absolute; left: 40px; right: 40px; top: 18px; height: 4px; background: var(--teal); border-radius: 2px; transform-origin: left; }
.v { position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; width: 200px; text-align: center; }
.dot { width: 40px; height: 40px; border-radius: 50%; background: var(--teal); border: 6px solid var(--navy-d); box-shadow: 0 0 0 3px var(--teal-l); }
.v b { font-size: 24px; color: var(--teal-l); }
.v .m { font-size: 25px; direction: rtl; }
.v .w { font-size: 20px; color: var(--ink-3); }
.f { position: absolute; width: 300px; padding: 22px; display: flex; align-items: center; gap: 14px; background: #f3f6f8; color: var(--navy-dd); border-radius: 14px; font-size: 22px; font-weight: 500; box-shadow: 0 20px 40px -20px rgba(0,0,0,.7); }
.f svg { width: 38px; height: 38px; color: #2b6cb0; flex: none; }
.qs { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 22px; flex: 1; justify-content: center; }
.qs li { font-size: 32px; color: var(--ink-2); padding-inline-start: 26px; border-inline-start: 3px solid rgba(111,214,200,.4); }
.qs .ans { color: #fff; font-weight: 700; border-color: var(--teal); font-family: var(--serif); font-size: 36px; }
</style>
