<script setup lang="ts">
import gsap from 'gsap'
import { ShieldCheck, Check, Lock } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const jobs = ['checkout', 'install', 'lint', 'test', 'build', 'deploy']
const pipe = ref<HTMLElement>()
let tl: gsap.core.Timeline | null = null
watch(() => [props.active, props.step] as const, ([a, s]) => {
  tl?.kill()
  if (!a || s < 1) return
  const js = pipe.value!.querySelectorAll('.job')
  gsap.set(js, { '--p': 0 })
  js.forEach((j) => j.classList.remove('ok'))
  tl = gsap.timeline({ delay: 0.4, repeat: -1, repeatDelay: 2 })
  js.forEach((j) => {
    tl!.to(j, { '--p': 1, duration: 0.6, ease: 'power1.inOut' }).call(() => j.classList.add('ok'))
  })
  tl.call(() => {}, [], '+=1.5').call(() => js.forEach((j) => j.classList.remove('ok'))).to(js, { '--p': 0, duration: 0.5, ease: 'power2.inOut' })
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="أدوات الإدارة في GitHub" :time="time" title="حماية الفروع و <em class='mono'>GitHub Actions</em>" />
    <div class="wrap">
      <div class="card bp" data-r>
        <div class="h"><ShieldCheck /><b>Branch Protection Rules</b><span class="tag">main</span></div>
        <ul>
          <li><Lock /> منع الرفع المباشر إلى main</li>
          <li><Check /> اشتراط Pull Request مع موافقة مراجع واحد على الأقل</li>
          <li><Check /> اشتراط نجاح الفحوصات (Status Checks) قبل الدمج</li>
          <li><Check /> منع حذف الفرع أو force push</li>
        </ul>
      </div>
      <div class="card ci" data-step="1">
        <div class="h"><b class="mono">CI/CD</b><span>مع كل push أو PR، تعمل الأتمتة تلقائيًا</span></div>
        <div ref="pipe" class="pipe" dir="ltr">
          <div v-for="j in jobs" :key="j" class="job"><span class="ring"><Check /></span><span class="mono">{{ j }}</span></div>
        </div>
        <pre class="yml mono" dir="ltr"><span class="k">on</span>: [push, pull_request]
<span class="k">jobs</span>:
  <span class="k">test</span>:
    <span class="k">runs-on</span>: ubuntu-latest
    <span class="k">steps</span>:
      - uses: actions/checkout@v4
      - run: npm ci && npm test</pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wrap { flex: 1; display: grid; grid-template-columns: 1fr 1.3fr; gap: 36px; }
.bp, .ci { display: flex; flex-direction: column; gap: 24px; }
.h { display: flex; align-items: center; gap: 14px; font-size: 30px; flex-wrap: wrap; }
.h svg { width: 40px; height: 40px; color: var(--teal-l); }
.h span:not(.tag) { font-size: 22px; color: var(--ink-2); }
ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 18px; }
li { display: flex; align-items: center; gap: 14px; font-size: 25px; color: var(--ink-2); }
li svg { width: 28px; height: 28px; color: var(--teal-l); flex: none; }
.pipe { display: flex; justify-content: space-between; position: relative; padding: 10px 0; }
.pipe::before { content: ''; position: absolute; top: 40px; left: 30px; right: 30px; height: 3px; background: rgba(255,255,255,.12); }
.job { --p: 0; position: relative; display: flex; flex-direction: column; align-items: center; gap: 10px; font-size: 18px; color: var(--ink-2); }
.ring { width: 60px; height: 60px; border-radius: 50%; display: grid; place-items: center; background: conic-gradient(var(--teal-l) calc(var(--p) * 360deg), rgba(255,255,255,.1) 0); position: relative; }
.ring::before { content: ''; position: absolute; inset: 5px; border-radius: 50%; background: var(--navy-d); transition: background .4s var(--ease); }
.ring svg { position: relative; width: 28px; height: 28px; stroke-width: 3; color: var(--teal-l); opacity: 0; transform: scale(.4); transition: all .3s var(--ease); }
.job.ok .ring::before { background: var(--teal); } .job.ok .ring svg { opacity: 1; transform: none; color: #fff; }
.yml { margin: 0; font-size: 21px; line-height: 1.6; padding: 22px 26px; border-radius: 16px; background: rgba(2,20,29,.75); border: 1px solid var(--line); color: var(--ink-2); }
.k { color: var(--teal-l); }
</style>
