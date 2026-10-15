<script setup lang="ts">
defineProps<{ active: boolean; step: number; time?: string }>()
const buckets = [
  { k: 'M', en: 'Must have', t: 'يجب', d: 'بدونها لا يعمل المنتج', items: ['تسجيل الدخول', 'سلة المشتريات', 'الدفع الإلكتروني'], c: 'var(--teal)' },
  { k: 'S', en: 'Should have', t: 'ينبغي', d: 'مهمة لكن يمكن تأجيلها قليلًا', items: ['البحث والتصفية', 'تتبع الطلب'], c: 'var(--sky)' },
  { k: 'C', en: 'Could have', t: 'يمكن', d: 'إضافات جميلة إن توفر الوقت', items: ['الوضع الليلي', 'قائمة الأمنيات'], c: 'var(--amber)' },
  { k: 'W', en: "Won't have (now)", t: 'لن نفعل الآن', d: 'خارج النطاق في هذه المرحلة', items: ['تطبيق جوال'], c: 'var(--coral)' },
]
</script>

<template>
  <section class="slide">
    <SlideHead kicker="تخطيط المشروع وتقسيم العمل" :time="time" title="تحديد الأولويات بـ <em class='mono'>MoSCoW</em>" lead="مثال: متجر إلكتروني — ليس كل شيء «مهم جدًا»." />
    <div class="grid">
      <div v-for="(b, i) in buckets" :key="b.k" class="card bk" :style="{ '--c': b.c }" :data-step="i">
        <div class="hd"><span class="L mono">{{ b.k }}</span><div><b>{{ b.t }}</b><small class="mono">{{ b.en }}</small></div></div>
        <p>{{ b.d }}</p>
        <div class="items"><span v-for="it in b.items" :key="it" class="chip">{{ it }}</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grid { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px; }
.bk { display: flex; flex-direction: column; gap: 18px; border-top: 6px solid var(--c); }
.hd { display: flex; align-items: center; gap: 18px; }
.L { width: 80px; height: 80px; border-radius: 20px; display: grid; place-items: center; font-size: 44px; font-weight: 700; color: var(--navy-dd); background: var(--c); flex: none; }
.hd b { display: block; font-size: 34px; }
.hd small { font-size: 18px; color: var(--ink-3); }
p { font-size: 23px; color: var(--ink-2); }
.items { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
.chip { padding: 14px 18px; border-radius: 14px; background: rgba(255,255,255,.06); border: 1px dashed rgba(255,255,255,.22); font-size: 24px; }
</style>
