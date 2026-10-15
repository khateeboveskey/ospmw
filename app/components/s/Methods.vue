<script setup lang="ts">
import gsap from 'gsap'
import { RefreshCw } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const falls = ['المتطلبات', 'التصميم', 'التنفيذ', 'الاختبار', 'التسليم']
const wf = ref<HTMLElement>()
const ag = ref<HTMLElement>()
watch(() => [props.active, props.step] as const, ([a, s], [pa, ps]) => {
  if (!a) return
  if (!pa || ps === undefined) {
    gsap.fromTo(wf.value!.querySelectorAll('.st'), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.18, ease: 'bounce.out', delay: 0.7 })
  }
  if (s >= 1 && (ps ?? 0) < 1) {
    gsap.fromTo(ag.value!.querySelectorAll('.it'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.25, ease: 'back.out(2)', delay: 0.2 })
    gsap.fromTo(ag.value!.querySelectorAll('.box'), { scale: 0 }, { scale: 1, duration: 0.6, stagger: 0.25, ease: 'back.out(2)', delay: 0.4 })
  }
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="منهجيات العمل" :time="time" title="<span class='mono'>Waterfall</span> مقابل <em class='mono'>Agile</em>" />
    <div class="cmp">
      <div class="card side" data-r>
        <div class="hd"><h3>Waterfall</h3><span class="tag">الشلال</span></div>
        <div ref="wf" class="falls">
          <div v-for="(f, i) in falls" :key="f" class="st" :style="{ marginInlineStart: i * 70 + 'px' }">{{ f }}</div>
        </div>
        <p class="when" data-step="2"><b>يصلح عندما:</b> المتطلبات ثابتة وواضحة منذ البداية، والتغيير مكلف — كالأنظمة الحكومية والعقود المحددة.</p>
      </div>
      <div class="card side" data-step="1">
        <div class="hd"><h3>Agile</h3><span class="tag">الرشيق</span></div>
        <div ref="ag" class="loops">
          <div v-for="k in 3" :key="k" class="it">
            <div class="loop"><RefreshCw /><span class="mono">Sprint {{ k }}</span></div>
            <div class="box" :style="{ width: 30 + k * 26 + 'px', height: 30 + k * 26 + 'px' }" />
          </div>
        </div>
        <p class="when" data-step="2"><b>يصلح عندما:</b> المتطلبات تتغير، ونحتاج تسليمًا مبكرًا وتغذية راجعة مستمرة من العميل.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cmp { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; flex: 1; }
.side { display: flex; flex-direction: column; gap: 18px; }
.hd { display: flex; align-items: center; gap: 18px; }
.hd h3 { font-family: var(--mono); font-size: 46px; direction: ltr; }
.falls { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.st { align-self: flex-start; padding: 9px 24px; border-radius: 12px; background: rgba(143,195,221,.14); border: 1px solid rgba(143,195,221,.35); font-size: 23px; position: relative; }
.st:not(:last-child)::after { content: ''; position: absolute; inset-inline-end: -40px; top: 50%; width: 30px; height: 30px; border-top: 2px solid rgba(143,195,221,.5); border-inline-end: 2px solid rgba(143,195,221,.5); border-start-end-radius: 12px; }
.loops { display: flex; justify-content: space-around; align-items: center; flex: 1; }
.it { display: flex; flex-direction: column; align-items: center; gap: 18px; }
.loop { width: 130px; height: 130px; border-radius: 50%; border: 2px dashed var(--teal-l); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
.loop svg { width: 40px; height: 40px; color: var(--teal-l); animation: spin 6s linear infinite; }
.loop span { font-size: 18px; color: var(--ink-2); }
.box { background: var(--teal); border-radius: 12px; box-shadow: 0 0 40px rgba(28,157,142,.5); }
.when { font-size: 23px; line-height: 1.6; color: var(--ink-2); }
.when b { color: #fff; }
@keyframes spin { to { rotate: 360deg; } }
</style>
