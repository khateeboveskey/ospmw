<script setup lang="ts">
import gsap from 'gsap'
import { CalendarDays, Clock, Timer } from 'lucide-vue-next'

const props = defineProps<{ active: boolean; step: number }>()
const art = ref<SVGSVGElement>()
let tl: gsap.core.Timeline | null = null

watch(() => props.active, (a) => {
  if (!a || !art.value) return
  tl?.kill()
  const paths = art.value.querySelectorAll('path')
  const dots = art.value.querySelectorAll('circle')
  tl = gsap.timeline({ delay: 0.5 })
    .fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.25, ease: 'power2.inOut' })
    .fromTo(dots, { attr: { r: 0 } }, { attr: { r: (i: number, el: SVGCircleElement) => Number(el.dataset.rad) }, duration: 0.6, stagger: 0.07, ease: 'back.out(2.5)' }, 0.4)
    .to(art.value, { y: -14, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
})
</script>

<template>
  <section class="slide cover">
    <div class="txt">
      <div class="kicker" data-r>ورشة عمل تدريبية</div>
      <h1 class="title xl" data-r>إدارة المشاريع البرمجية</h1>
      <h1 class="title xl sub" data-r>مع <span class="en">Git</span> و <span class="en">GitHub</span></h1>
      <p class="lead" data-r>من تخطيط العمل وتقسيمه، إلى التحكم بالإصدارات، إلى التعاون كفريق حقيقي.</p>
      <div class="meta" data-r>
        <span class="pill"><CalendarDays /> 3 أيام</span>
        <span class="pill"><Clock /> 4 ساعات يوميًا</span>
        <span class="pill"><Timer /> <span class="mono">4:00 – 8:00</span> م</span>
      </div>
      <p class="hint" data-r>المسافة · الأسهم · التمرير للتنقل &nbsp;—&nbsp; <kbd>F</kbd> ملء الشاشة · <kbd>P</kbd> عرض المقدّم</p>
    </div>
    <svg ref="art" class="art" data-own viewBox="0 0 560 860" aria-hidden="true">
      <path d="M280 840 V20" stroke="#1c9d8e" pathLength="1" />
      <path d="M280 700 C280 620 440 640 440 560 V380 C440 300 280 320 280 240" stroke="#ffffff" pathLength="1" />
      <path d="M280 520 C280 460 120 470 120 400 V300" stroke="#6fd6c8" pathLength="1" />
      <path d="M440 470 C440 420 520 420 520 360" stroke="#8fc3dd" pathLength="1" />
      <circle cx="280" cy="840" data-rad="16" fill="#1c9d8e" />
      <circle cx="280" cy="700" data-rad="16" fill="#1c9d8e" />
      <circle cx="280" cy="520" data-rad="16" fill="#1c9d8e" />
      <circle cx="440" cy="560" data-rad="14" fill="#fff" />
      <circle cx="440" cy="470" data-rad="14" fill="#fff" />
      <circle cx="120" cy="400" data-rad="14" fill="#6fd6c8" />
      <circle cx="120" cy="300" data-rad="14" fill="#6fd6c8" />
      <circle cx="440" cy="380" data-rad="14" fill="#fff" />
      <circle cx="520" cy="360" data-rad="12" fill="#8fc3dd" />
      <circle cx="280" cy="400" data-rad="16" fill="#1c9d8e" />
      <circle cx="280" cy="240" data-rad="22" fill="#1c9d8e" stroke="#fff" stroke-width="5" />
      <circle cx="280" cy="20" data-rad="10" fill="#1c9d8e" />
    </svg>
  </section>
</template>

<style scoped>
.cover { flex-direction: row; align-items: center; justify-content: space-between; }
.txt { display: flex; flex-direction: column; gap: 26px; max-width: 1150px; }
.sub { color: var(--teal-l); margin-top: -16px; }
.en { font-family: var(--serif); }
.meta { display: flex; gap: 18px; margin-top: 12px; }
.meta svg { width: 26px; height: 26px; color: var(--teal-l); }
.hint { font-size: 21px; color: var(--ink-3); margin-top: 26px; }
kbd { font-family: var(--mono); font-size: 18px; border: 1px solid var(--line); border-radius: 6px; padding: 2px 9px; background: var(--glass); }
.art { width: 520px; height: 820px; flex: none; }
.art path { fill: none; stroke-width: 9; stroke-linecap: round; stroke-dasharray: 1; }
</style>
