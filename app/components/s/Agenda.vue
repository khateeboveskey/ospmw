<script setup lang="ts">
defineProps<{ active: boolean; step: number }>()
const days = [
  { n: '01', t: 'أساسيات إدارة المشاريع البرمجية', items: ['دورة حياة البرمجيات وأدوار الفريق', 'Waterfall و Agile و Scrum و Kanban', 'User Stories و Story Points و MoSCoW', 'بناء Backlog وتخطيط Sprint'] },
  { n: '02', t: 'Git من الصفر', items: ['لماذا التحكم بالإصدارات؟', 'المناطق الثلاث والأوامر الأساسية', 'الفروع والدمج وحل التعارضات', 'التراجع والتصحيح'] },
  { n: '03', t: 'GitHub والعمل الجماعي', items: ['المستودعات البعيدة والمصادقة', 'Pull Requests و Code Review', 'Issues و Projects و Actions', 'مشروع ختامي كفريق حقيقي'] },
]
</script>

<template>
  <section class="slide">
    <SlideHead kicker="محاور الورشة · 3 أيام × 3 ساعات" time="4:00 – 7:00 م" title="ثلاثة أيام، <em>رحلة واحدة</em>" />
    <div class="days">
      <article v-for="(d, i) in days" :key="d.n" class="card day" data-r>
        <div class="n">{{ d.n }}</div>
        <div class="lbl">اليوم {{ ['الأول', 'الثاني', 'الثالث'][i] }}</div>
        <h3>{{ d.t }}</h3>
        <ul><li v-for="it in d.items" :key="it">{{ it }}</li></ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.days { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; flex: 1; }
.day { display: flex; flex-direction: column; gap: 8px; padding: 32px 36px; }
.n { font-family: var(--serif); font-weight: 900; font-size: 84px; line-height: 1; color: transparent; -webkit-text-stroke: 2px var(--teal-l); }
.lbl { color: var(--teal-l); font-size: 24px; font-weight: 500; }
h3 { font-family: var(--serif); font-size: 36px; line-height: 1.3; font-weight: 700; min-height: 94px; }
ul { list-style: none; padding: 0; margin: 6px 0 0; display: flex; flex-direction: column; gap: 10px; }
li { font-size: 23px; color: var(--ink-2); padding-inline-start: 28px; position: relative; }
li::before { content: ''; position: absolute; inset-inline-start: 0; top: 13px; width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--teal); }
</style>
