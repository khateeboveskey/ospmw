<script setup lang="ts">
import gsap from 'gsap'
import { KeyRound, Lock, LockOpen, Ticket, ShieldAlert } from 'lucide-vue-next'
const props = defineProps<{ active: boolean; step: number; time?: string }>()
const key = ref<HTMLElement>()
const open = ref(false)
watch(() => [props.active, props.step] as const, ([a, s]) => {
  if (!a) return
  if (s === 0) {
    open.value = false
    gsap.fromTo(key.value!, { x: 0, rotate: 0 }, { x: -230, duration: 1.2, ease: 'expo.inOut', delay: 0.9, onComplete: () => { gsap.to(key.value!, { rotate: 90, duration: 0.4, onComplete: () => { open.value = true } }) } })
  }
})
</script>

<template>
  <section class="slide">
    <SlideHead kicker="التعامل مع المستودعات البعيدة" :time="time" title="المصادقة: كيف يعرفك <em class='mono'>GitHub</em>؟" />
    <div class="cmp">
      <div class="card side" data-r>
        <h3 class="mono">SSH</h3>
        <p>زوج مفاتيح: <b>المفتاح العام</b> يُرفع إلى GitHub كقفل، و<b>المفتاح الخاص</b> يبقى على جهازك فقط.</p>
        <div class="anim" dir="ltr">
          <div class="dev"><span ref="key" class="key"><KeyRound /></span><small>private key · جهازك</small></div>
          <div class="lk" :class="{ open }"><component :is="open ? LockOpen : Lock" /><small>public key · GitHub</small></div>
        </div>
        <code>ssh-keygen -t ed25519 -C "you@example.com"</code>
      </div>
      <div class="card side" data-step="1">
        <h3 class="mono">Personal Access Token</h3>
        <p>رمز يُستخدم بدل كلمة المرور عبر HTTPS، له <b>صلاحيات محددة</b> و<b>تاريخ انتهاء</b>.</p>
        <div class="tok mono" dir="ltr"><Ticket /> ghp_<span class="dots">••••••••••••••••••••</span></div>
        <div class="scopes" dir="ltr"><span class="tag">repo</span><span class="tag">workflow</span><span class="tag">expires: 30 days</span></div>
      </div>
    </div>
    <p class="warn" data-step="2"><ShieldAlert /> لا تشارك المفتاح الخاص أو الـ Token مع أحد، ولا ترفعهما أبدًا داخل المستودع.</p>
  </section>
</template>

<style scoped>
.cmp { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 36px; }
.side { display: flex; flex-direction: column; gap: 24px; }
.side h3 { font-size: 44px; text-align: right; }
.side p { font-size: 27px; line-height: 1.6; color: var(--ink-2); }
.side b { color: #fff; }
.anim { display: flex; justify-content: space-between; align-items: center; padding: 10px 30px; flex: 1; }
.dev, .lk { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.dev small, .lk small { font-size: 18px; color: var(--ink-3); font-family: var(--mono); }
.key { display: inline-grid; color: var(--amber); }
.key svg { width: 80px; height: 80px; stroke-width: 1.5; }
.lk svg { width: 96px; height: 96px; stroke-width: 1.5; color: var(--ink-2); transition: color .4s; }
.lk.open svg { color: var(--teal-l); filter: drop-shadow(0 0 20px var(--teal)); }
code { font-size: 22px; color: var(--teal-l); background: rgba(4,33,47,.6); padding: 12px 18px; border-radius: 12px; align-self: flex-start; }
.tok { display: flex; align-items: center; gap: 14px; font-size: 34px; padding: 22px 26px; border-radius: 18px; background: rgba(4,33,47,.6); border: 1px dashed rgba(244,194,107,.5); color: var(--amber); margin-top: auto; }
.tok svg { width: 40px; height: 40px; }
.dots { letter-spacing: 2px; color: var(--ink-3); }
.scopes { display: flex; gap: 12px; }
.warn { display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 30px; font-size: 28px; color: var(--coral); }
.warn svg { width: 36px; height: 36px; }
</style>
