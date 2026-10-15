import type { Component } from 'vue'
import { Shuffle, Hourglass, Expand, MessagesSquare, Bug, EyeOff, Target, CodeXml, ShieldCheck, Compass, UserCheck, MessageSquareText, Heart, Minimize2 } from 'lucide-vue-next'
import type { GraphDef } from './types'

import Cover from '~/components/s/Cover.vue'
import Agenda from '~/components/s/Agenda.vue'
import Divider from '~/components/s/Divider.vue'
import Break from '~/components/s/Break.vue'
import Cards from '~/components/s/Cards.vue'
import Graph from '~/components/s/Graph.vue'
import Terminal from '~/components/s/Terminal.vue'
import Closing from '~/components/s/Closing.vue'
import Sdlc from '~/components/s/Sdlc.vue'
import Methods from '~/components/s/Methods.vue'
import Scrum from '~/components/s/Scrum.vue'
import Kanban from '~/components/s/Kanban.vue'
import Story from '~/components/s/Story.vue'
import Points from '~/components/s/Points.vue'
import Moscow from '~/components/s/Moscow.vue'
import Vcs from '~/components/s/Vcs.vue'
import GitHub from '~/components/s/GitHub.vue'
import Areas from '~/components/s/Areas.vue'
import Commits from '~/components/s/Commits.vue'
import Conflict from '~/components/s/Conflict.vue'
import Remotes from '~/components/s/Remotes.vue'
import Auth from '~/components/s/Auth.vue'
import PullRequest from '~/components/s/PullRequest.vue'
import Fork from '~/components/s/Fork.vue'
import Tools from '~/components/s/Tools.vue'
import Actions from '~/components/s/Actions.vue'

export type Slide = {
  c: Component
  props?: Record<string, unknown>
  steps?: number
  title: string
  section: string
  time?: string
  kind?: 'divider'
  notes: string[]
}

const T = '#1c9d8e', W = '#ffffff', SKY = '#8fc3dd', AMB = '#f4c26b', COR = '#ff8a76'
const D0 = 'افتتاح'
const D1 = 'اليوم الأول · إدارة المشاريع البرمجية'
const D2 = 'اليوم الثاني · Git من الصفر'
const D3 = 'اليوم الثالث · GitHub والعمل الجماعي'

/* ---------------- commit graphs ---------------- */
const gBranch: GraphDef = {
  lanes: [{ name: 'main', color: T }, { name: 'feature', color: W }],
  nodes: [{ id: 'c1', x: 0, l: 0 }, { id: 'c2', x: 1, l: 0, p: ['c1'] }, { id: 'f1', x: 2, l: 1, p: ['c2'] }, { id: 'f2', x: 3, l: 1, p: ['f1'] }, { id: 'c3', x: 3, l: 0, p: ['c2'] }],
  steps: [
    { add: ['c1', 'c2'], refs: { main: 'c2' }, head: 'main', cmd: 'git log --oneline', say: 'كل commit لقطة كاملة للمشروع، ويشير إلى الـ commit الذي قبله.' },
    { refs: { feature: 'c2' }, cmd: 'git branch feature', say: 'الفرع مجرد مؤشر خفيف على commit — إنشاؤه فوري ولا ينسخ أي ملف.' },
    { head: 'feature', cmd: 'git switch feature', say: 'HEAD يخبرنا أين نقف الآن. (الأمر الأقدم: git checkout feature)' },
    { add: ['f1'], refs: { feature: 'f1' }, cmd: 'git commit -m "feat: login form"', say: 'نعمل على الفرع: feature يتقدم، و main لا يتأثر.' },
    { add: ['f2'], refs: { feature: 'f2' }, cmd: 'git commit -m "feat: validation"', say: 'نجرّب بحرية دون أن نكسر main.' },
    { head: 'main', add: ['c3'], refs: { main: 'c3' }, cmd: 'git switch main && git commit -m "fix: typo"', say: 'التاريخ تفرّع: مساران مستقلان يتطوران معًا.' },
  ],
}
const gFF: GraphDef = {
  lanes: [{ name: 'main', color: T }, { name: 'feature', color: W }],
  nodes: [{ id: 'c1', x: 0, l: 0 }, { id: 'c2', x: 1, l: 0, p: ['c1'] }, { id: 'f1', x: 2, l: 1, p: ['c2'] }, { id: 'f2', x: 3, l: 1, p: ['f1'] }],
  steps: [
    { add: ['c1', 'c2', 'f1', 'f2'], refs: { main: 'c2', feature: 'f2' }, head: 'feature', cmd: 'git log --graph --oneline', say: 'main لم يتقدم منذ أن أنشأنا feature.' },
    { head: 'main', cmd: 'git switch main', say: 'ننتقل إلى الفرع الذي نريد الدمج فيه.' },
    { refs: { main: 'f2' }, cmd: 'git merge feature', say: 'Fast-forward: لا حاجة لـ commit جديد — Git يحرّك المؤشر للأمام فقط.' },
  ],
}
const g3way: GraphDef = {
  lanes: [{ name: 'main', color: T }, { name: 'feature', color: W }],
  nodes: [{ id: 'c1', x: 0, l: 0 }, { id: 'c2', x: 1, l: 0, p: ['c1'] }, { id: 'f1', x: 2, l: 1, p: ['c2'] }, { id: 'f2', x: 3, l: 1, p: ['f1'] }, { id: 'c3', x: 2, l: 0, p: ['c2'] }, { id: 'M', x: 4, l: 0, p: ['c3', 'f2'] }],
  steps: [
    { add: ['c1', 'c2', 'c3', 'f1', 'f2'], refs: { main: 'c3', feature: 'f2' }, head: 'main', cmd: 'git log --graph --oneline', say: 'الفرعان تباعدا: لكلٍّ منهما commits جديدة.' },
    { add: ['M'], refs: { main: 'M' }, cmd: 'git merge feature', say: 'دمج ثلاثي: يقارن Git النسختين مع الأصل المشترك (c2)، وينشئ merge commit له أبوان.' },
    { refs: { feature: null }, cmd: 'git branch -d feature', say: 'بعد الدمج نحذف الفرع — والتاريخ يبقى محفوظًا.' },
  ],
}
const gRebase: GraphDef = {
  lanes: [{ name: 'main', color: T }, { name: 'feature', color: W }, { name: '', color: 'rgba(255,255,255,.4)' }],
  nodes: [{ id: 'c1', x: 0, l: 0 }, { id: 'c2', x: 1, l: 0, p: ['c1'] }, { id: 'c3', x: 2, l: 0, p: ['c2'] }, { id: 'f1', x: 2, l: 1, p: ['c2'] }, { id: 'f2', x: 3, l: 1, p: ['f1'] }, { id: "f1'", x: 3, l: 1, p: ['c3'] }, { id: "f2'", x: 4, l: 1, p: ["f1'"] }],
  dy: 125,
  steps: [
    { add: ['c1', 'c2', 'c3', 'f1', 'f2'], refs: { main: 'c3', feature: 'f2' }, head: 'feature', cmd: 'git log --graph --oneline', say: 'main تقدّم بعد أن تفرّعنا منه.' },
    { add: ["f1'", "f2'"], dim: ['f1', 'f2'], pos: { f1: [2, 2], f2: [3, 2] }, refs: { feature: "f2'" }, cmd: 'git rebase main', say: 'rebase يعيد تطبيق commits الفرع فوق آخر main — بنسخ جديدة وهويات جديدة.' },
    { head: 'main', refs: { main: "f2'" }, cmd: 'git switch main && git merge feature', say: 'النتيجة: تاريخ خطي نظيف، والدمج أصبح Fast-forward.' },
    { hide: ['f1', 'f2'], cmd: '# القاعدة الذهبية', say: 'لا تعمل rebase لفرع رفعته وشاركته مع غيرك — لأنه يعيد كتابة التاريخ.' },
  ],
}
const one = [{ name: 'main', color: T }]
const gReset: GraphDef = {
  title: 'git reset', lanes: one, dx: 170,
  nodes: [{ id: 'c1', x: 0, l: 0 }, { id: 'c2', x: 1, l: 0, p: ['c1'] }, { id: 'c3', x: 2, l: 0, p: ['c2'], c: COR }],
  steps: [
    { add: ['c1', 'c2', 'c3'], refs: { main: 'c3' }, head: 'main', cmd: 'git log --oneline', say: 'commit خاطئ (c3) وصل إلى main.' },
    { refs: { main: 'c2' }, dim: ['c3'], cmd: 'git reset --hard HEAD~1', say: 'يعيد المؤشر للخلف ويُسقط ما بعده — للعمل المحلي فقط.' },
  ],
}
const gRevert: GraphDef = {
  title: 'git revert', lanes: one, dx: 170,
  nodes: [{ id: 'c1', x: 0, l: 0 }, { id: 'c2', x: 1, l: 0, p: ['c1'] }, { id: 'c3', x: 2, l: 0, p: ['c2'], c: COR }, { id: '¬c3', x: 3, l: 0, p: ['c3'] }],
  steps: [
    { add: ['c1', 'c2', 'c3'], refs: { main: 'c3' }, head: 'main', cmd: 'git log --oneline', say: 'نفس الموقف: commit خاطئ في main.' },
    { add: ['¬c3'], refs: { main: '¬c3' }, cmd: 'git revert c3', say: 'commit جديد يعكس الخطأ والتاريخ محفوظ — آمن للفروع المشتركة.' },
  ],
}
const gGhFlow: GraphDef = {
  lanes: [{ name: 'main', color: T }, { name: 'feature/login', color: W }, { name: 'fix/typo', color: SKY }],
  nodes: [{ id: 'm1', x: 0, l: 0 }, { id: 'm2', x: 1, l: 0, p: ['m1'] }, { id: 'a1', x: 2, l: 1, p: ['m2'] }, { id: 'a2', x: 3, l: 1, p: ['a1'] }, { id: 'm3', x: 4, l: 0, p: ['m2', 'a2'] }, { id: 'b1', x: 5, l: 2, p: ['m3'] }, { id: 'm4', x: 6, l: 0, p: ['m3', 'b1'] }],
  dy: 125,
  steps: [
    { add: ['m1', 'm2'], refs: { main: 'm2' }, head: 'main', cmd: 'git pull', say: 'main دائمًا مستقر وقابل للنشر.' },
    { add: ['a1', 'a2'], refs: { 'feature/login': 'a2' }, head: 'feature/login', cmd: 'git switch -c feature/login', say: 'لكل مهمة فرع قصير العمر باسم واضح.' },
    { add: ['m3'], refs: { main: 'm3', 'feature/login': null }, head: 'main', cmd: '# Pull Request → Review → Merge', say: 'نفتح Pull Request، يراجعه زميل، ثم يُدمج في main ويُحذف الفرع.' },
    { add: ['b1'], refs: { 'fix/typo': 'b1' }, head: 'fix/typo', cmd: 'git switch -c fix/typo', say: 'وتتكرر الدورة: فرع ← PR ← مراجعة ← دمج ← نشر.' },
    { add: ['m4'], refs: { main: 'm4', 'fix/typo': null }, head: 'main', cmd: '# merged', say: 'بسيط ومناسب لمعظم الفرق وللنشر المستمر.' },
  ],
}
const gGitFlow: GraphDef = {
  lanes: [{ name: 'main', color: T }, { name: 'hotfix', color: COR }, { name: 'release', color: AMB }, { name: 'develop', color: W }, { name: 'feature', color: SKY }],
  dy: 105, dx: 140,
  nodes: [
    { id: 'v1', x: 0, l: 0 }, { id: 'd1', x: 1, l: 3, p: ['v1'] }, { id: 'f1', x: 2, l: 4, p: ['d1'] }, { id: 'f2', x: 3, l: 4, p: ['f1'] },
    { id: 'd2', x: 4, l: 3, p: ['d1', 'f2'] }, { id: 'r1', x: 5, l: 2, p: ['d2'] }, { id: 'v2', x: 6, l: 0, p: ['v1', 'r1'] }, { id: 'd3', x: 6, l: 3, p: ['d2', 'r1'] },
    { id: 'h1', x: 7, l: 1, p: ['v2'] }, { id: 'v3', x: 8, l: 0, p: ['v2', 'h1'] }, { id: 'd4', x: 8, l: 3, p: ['d3', 'h1'] },
  ],
  steps: [
    { add: ['v1', 'd1'], refs: { main: 'v1', develop: 'd1' }, head: 'develop', cmd: 'git switch -c develop', say: 'فرعان دائمان: main للإصدارات المنشورة، و develop للتطوير.' },
    { add: ['f1', 'f2'], refs: { feature: 'f2' }, head: 'feature', cmd: 'git switch -c feature/cart develop', say: 'كل ميزة في فرع feature يخرج من develop.' },
    { add: ['d2'], refs: { feature: null, develop: 'd2' }, head: 'develop', cmd: 'git merge --no-ff feature/cart', say: 'الميزات المكتملة تُدمج في develop.' },
    { add: ['r1'], refs: { release: 'r1' }, head: 'release', cmd: 'git switch -c release/1.1 develop', say: 'فرع release لتجهيز الإصدار واختباره — لا ميزات جديدة هنا.' },
    { add: ['v2', 'd3'], refs: { main: 'v2', develop: 'd3', release: null }, head: 'main', cmd: 'git merge --no-ff release/1.1 && git tag v1.1', say: 'يُدمج في main كإصدار جديد، وفي develop أيضًا.' },
    { add: ['h1'], refs: { hotfix: 'h1' }, head: 'hotfix', cmd: 'git switch -c hotfix/1.1.1 main', say: 'hotfix لإصلاح عاجل يخرج مباشرة من main.' },
    { add: ['v3', 'd4'], refs: { main: 'v3', develop: 'd4', hotfix: null }, head: 'main', cmd: 'git tag v1.1.1', say: 'مناسب للمنتجات ذات الإصدارات المجدولة — لكنه أثقل من GitHub Flow.' },
  ],
}
const gTeam: GraphDef = {
  lanes: [{ name: 'main', color: T }, { name: 'ahmed/navbar', color: W }, { name: 'sara/api', color: SKY }, { name: 'laila/footer', color: AMB }],
  dy: 115, dx: 170,
  nodes: [
    { id: 'm1', x: 0, l: 0 }, { id: 'a1', x: 1, l: 1, p: ['m1'] }, { id: 's1', x: 1, l: 2, p: ['m1'] }, { id: 'l1', x: 1, l: 3, p: ['m1'] },
    { id: 'a2', x: 2, l: 1, p: ['a1'] }, { id: 's2', x: 2, l: 2, p: ['s1'] }, { id: 'l2', x: 2, l: 3, p: ['l1'] },
    { id: 'm2', x: 3, l: 0, p: ['m1', 'a2'] }, { id: 'm3', x: 4, l: 0, p: ['m2', 's2'] }, { id: 'l3', x: 4.6, l: 3, p: ['l2', 'm3'] }, { id: 'm4', x: 5.6, l: 0, p: ['m3', 'l3'] },
  ],
  steps: [
    { add: ['m1'], refs: { main: 'm1' }, head: 'main', cmd: 'git clone git@github.com:team/project.git', say: 'مستودع واحد للفريق، و main محمي بقواعد الحماية.' },
    { add: ['a1', 's1', 'l1'], refs: { 'ahmed/navbar': 'a1', 'sara/api': 's1', 'laila/footer': 'l1' }, cmd: 'git switch -c <name>/<task>', say: 'كل عضو يعمل على فرعه الخاص.' },
    { add: ['a2', 's2', 'l2'], refs: { 'ahmed/navbar': 'a2', 'sara/api': 's2', 'laila/footer': 'l2' }, cmd: 'git push -u origin HEAD', say: 'commits صغيرة ومتكررة، ثم يفتح كلٌّ منهم Pull Request.' },
    { add: ['m2'], refs: { main: 'm2', 'ahmed/navbar': null }, cmd: '# PR #1 approved → merged', say: 'زميل يراجع، يوافق، فيُدمج الفرع.' },
    { add: ['m3'], refs: { main: 'm3', 'sara/api': null }, cmd: '# PR #2 approved → merged', say: 'الدمج الثاني — main يتقدم.' },
    { add: ['l3'], refs: { 'laila/footer': 'l3' }, cmd: 'git merge main  # resolve conflict', say: 'ليلى تجد تعارضًا: تدمج main في فرعها وتحلّه محليًا.' },
    { add: ['m4'], refs: { main: 'm4', 'laila/footer': null }, cmd: '# PR #3 approved → merged', say: 'الجميع في main — عرض النتائج!' },
  ],
}

const graph = (g: GraphDef[], p: Record<string, unknown>) => ({ c: Graph, props: { graphs: g, ...p }, steps: g[0]!.steps.length })

/* ---------------- deck ---------------- */
export const slides: Slide[] = [
  { c: Cover, title: 'الغلاف', section: D0, notes: ['ورشة: إدارة المشاريع البرمجية مع Git و GitHub', 'المدة: 3 أيام × 4 ساعات (4:00 – 8:00 م)', 'عرّف بنفسك، واسأل المشاركين عن خبراتهم السابقة مع Git.'] },
  { c: Agenda, title: 'محاور الورشة', section: D0, notes: ['اليوم الأول: أساسيات إدارة المشاريع البرمجية', 'اليوم الثاني: Git من الصفر', 'اليوم الثالث: GitHub والعمل الجماعي', 'كل يوم ينتهي بتطبيق عملي.'] },

  /* ---------- Day 1 ---------- */
  { c: Divider, kind: 'divider', title: 'اليوم الأول', section: D1, props: { n: '01', label: 'اليوم الأول', title: 'أساسيات إدارة<br><em>المشاريع البرمجية</em>', sessions: [{ t: '4:00', name: 'مدخل إلى إدارة المشاريع' }, { t: '4:45', name: 'منهجيات العمل' }, { t: '6:00', name: 'التخطيط وتقسيم العمل' }, { t: '7:00', name: 'تطبيق عملي' }] }, notes: ['4:00 – 4:45 مدخل إلى إدارة المشاريع البرمجية', '4:45 – 5:45 منهجيات العمل', '5:45 – 6:00 استراحة', '6:00 – 7:00 تخطيط المشروع وتقسيم العمل', '7:00 – 8:00 تطبيق عملي'] },
  { c: Sdlc, steps: 6, time: '4:00 – 4:45', title: 'دورة حياة تطوير البرمجيات', section: D1, props: { time: '4:00 – 4:45' }, notes: ['دورة حياة تطوير البرمجيات (SDLC)', 'كل ضغطة تنتقل لمرحلة: التخطيط ← المتطلبات ← التصميم ← التطوير ← الاختبار ← النشر والصيانة', 'نبّه: الدورة تتكرر — المنتج لا "ينتهي" بعد الإطلاق.'] },
  { c: Cards, time: '4:00 – 4:45', title: 'أسباب فشل المشاريع', section: D1, props: { kicker: 'مدخل إلى إدارة المشاريع البرمجية', time: '4:00 – 4:45', title: 'لماذا تفشل المشاريع البرمجية؟', cols: 3, cards: [
    { icon: Shuffle, t: 'متطلبات غامضة ومتغيرة', d: 'نبدأ البناء قبل أن نفهم ماذا نبني.' },
    { icon: Hourglass, t: 'تقديرات غير واقعية', d: 'وعود بمواعيد لا تأخذ المخاطر في الحسبان.' },
    { icon: Expand, t: 'تضخم النطاق', en: 'Scope Creep', d: '«ميزة صغيرة أخيرة»… تتكرر عشرين مرة.' },
    { icon: MessagesSquare, t: 'ضعف التواصل', d: 'بين الفريق والعميل، وداخل الفريق نفسه.' },
    { icon: Bug, t: 'الاختبار المتأخر', d: 'اكتشاف الأخطاء في النهاية يضاعف تكلفتها.' },
    { icon: EyeOff, t: 'غياب الشفافية', d: 'لا أحد يعرف أين وصلنا فعلًا.' },
  ] }, notes: ['أسباب فشل المشاريع البرمجية الشائعة', 'اسأل الحضور: من عاش مشروعًا فشل؟ ولماذا؟', 'اربط كل سبب بأداة سنتعلمها: User Stories، Story Points، MoSCoW، Kanban، Git.'] },
  { c: Cards, time: '4:00 – 4:45', title: 'أدوار الفريق', section: D1, props: { kicker: 'مدخل إلى إدارة المشاريع البرمجية', time: '4:00 – 4:45', title: 'أدوار الفريق', cols: 4, cards: [
    { icon: Target, t: 'مالك المنتج', en: 'Product Owner', d: 'يحدد <b>ماذا</b> نبني و<b>لماذا</b>، ويرتّب الأولويات.' },
    { icon: CodeXml, t: 'المطوّر', en: 'Developer', d: 'يقدّر الجهد ويحوّل القصص إلى كود يعمل.' },
    { icon: ShieldCheck, t: 'ضمان الجودة', en: 'QA', d: 'يتحقق أن المنتج يعمل كما يجب، ويكتشف الأخطاء مبكرًا.' },
    { icon: Compass, t: 'قائد الفريق', en: 'Team Lead', d: 'يوجّه تقنيًا، يزيل العوائق، ويحافظ على جودة الكود.' },
  ] }, notes: ['أدوار الفريق: Product Owner، Developer، QA، Team Lead', 'في الفرق الصغيرة قد يحمل الشخص أكثر من دور.'] },
  { c: Methods, steps: 3, time: '4:45 – 5:45', title: 'Waterfall مقابل Agile', section: D1, props: { time: '4:45 – 5:45' }, notes: ['Waterfall مقابل Agile: متى يصلح كل منهما', 'ضغطة 1: Agile بدورات قصيرة ومنتج ينمو', 'ضغطة 2: متى يصلح كل منهما'] },
  { c: Scrum, steps: 4, time: '4:45 – 5:45', title: 'Scrum', section: D1, props: { time: '4:45 – 5:45' }, notes: ['إطار Scrum: الـ Sprint، الـ Backlog، الاجتماعات الدورية', 'Product Backlog ← Sprint Planning ← Sprint Backlog ← Sprint (Daily Scrum) ← Increment ← Review & Retro'] },
  { c: Kanban, steps: 4, time: '4:45 – 5:45', title: 'Kanban', section: D1, props: { time: '4:45 – 5:45' }, notes: ['طريقة Kanban ولوحات المهام', 'كل ضغطة تحرك البطاقات — لاحظ WIP Limit في عمود «قيد العمل».', 'الفرق عن Scrum: لا دورات ثابتة، بل تدفق مستمر.'] },
  { c: Break, time: '5:45 – 6:00', title: 'استراحة', section: D1, props: { time: '5:45 – 6:00', back: '6:00' }, notes: ['استراحة 15 دقيقة — المؤقت يبدأ عند فتح الشريحة.'] },
  { c: Story, steps: 9, time: '6:00 – 7:00', title: 'User Stories', section: D1, props: { time: '6:00 – 7:00' }, notes: ['كتابة User Stories ومعايير القبول', 'الضغطات من 1 إلى 3: أجزاء القصة (بصفتي / أريد / حتى)', 'الضغطة 4+: معايير القبول، كل ضغطة تؤشّر معيارًا', 'معايير القبول = متى نعتبر القصة «منتهية»؟'] },
  { c: Points, steps: 2, time: '6:00 – 7:00', title: 'Story Points', section: D1, props: { time: '6:00 – 7:00' }, notes: ['تقسيم المهام وتقدير الوقت (Story Points)', 'نقاط نسبية تعبّر عن الجهد + التعقيد + عدم اليقين', 'ضغطة 1: Planning Poker'] },
  { c: Moscow, steps: 4, time: '6:00 – 7:00', title: 'MoSCoW', section: D1, props: { time: '6:00 – 7:00' }, notes: ['تحديد الأولويات (MoSCoW)', 'Must / Should / Could / Won\'t (now)', 'اطلب من الحضور تصنيف ميزات مشروعهم.'] },
  { c: Cards, steps: 4, time: '7:00 – 8:00', title: 'تطبيق عملي', section: D1, props: { kicker: 'تطبيق عملي', time: '7:00 – 8:00', title: 'لنبنِ <em>Backlog</em> حقيقيًا', lead: 'على GitHub Projects أو Trello — في مجموعات.', cols: 4, numbered: true, stepwise: true, cards: [
    { t: 'أنشئ اللوحة', d: 'GitHub Projects أو Trello بأعمدة: Backlog · To Do · In Progress · Done' },
    { t: 'اكتب القصص', d: 'من 8 إلى 10 User Stories لمشروع حقيقي، مع معايير قبول.' },
    { t: 'قدّر ورتّب', d: 'Story Points لكل قصة، ثم صنّفها بـ MoSCoW.' },
    { t: 'خطط Sprint', d: 'اختر قصص أول Sprint (أسبوعان) — ثم نقاش جماعي.' },
  ] }, notes: ['بناء Backlog لمشروع حقيقي على GitHub Projects أو Trello', 'تخطيط Sprint أول ونقاش جماعي', 'وزّع الحضور على مجموعات من 3 إلى 4 أشخاص.'] },

  /* ---------- Day 2 ---------- */
  { c: Divider, kind: 'divider', title: 'اليوم الثاني', section: D2, props: { n: '02', label: 'اليوم الثاني', title: '<span class="mono">Git</span><br><em>من الصفر</em>', sessions: [{ t: '4:00', name: 'مفهوم التحكم بالإصدارات' }, { t: '4:30', name: 'الأساسيات' }, { t: '5:45', name: 'الفروع والدمج' }, { t: '7:00', name: 'التراجع والتصحيح + تطبيق' }] }, notes: ['4:00 – 4:30 مفهوم التحكم بالإصدارات', '4:30 – 5:30 الأساسيات', '5:30 – 5:45 استراحة', '5:45 – 7:00 الفروع والدمج', '7:00 – 8:00 التراجع والتصحيح + تطبيق عملي', 'ملاحظة: اليوم الثاني مكتظ؛ إذا كان المشاركون مبتدئين تمامًا، يُفضّل نقل rebase إلى اليوم الثالث أو حذفه، وإعطاء وقت أطول لـ Merge Conflicts لأنها أكثر نقطة يتعثر فيها المبتدئون.'] },
  { c: Vcs, steps: 2, time: '4:00 – 4:30', title: 'لماذا Version Control؟', section: D2, props: { time: '4:00 – 4:30' }, notes: ['ما المشكلة التي يحلها Version Control', 'ضغطة 1: الفوضى تتحول إلى تاريخ منظم — من، متى، لماذا.'] },
  { c: GitHub, steps: 3, time: '4:00 – 4:30', title: 'Git مقابل GitHub', section: D2, props: { time: '4:00 – 4:30' }, notes: ['Git مقابل GitHub: الفرق الجوهري', 'Git أداة محلية — GitHub منصة استضافة وتعاون', 'بدائل GitHub: GitLab، Bitbucket — كلها تستخدم Git.'] },
  { c: Terminal, steps: 5, time: '4:30 – 5:30', title: 'git config', section: D2, props: { kicker: 'الأساسيات', time: '4:30 – 5:30', title: 'التثبيت والإعداد', path: '~', items: [
    { label: 'git --version', cmd: 'git --version', out: ['git version 2.47.0'], note: 'تأكد من التثبيت. Windows: Git for Windows · macOS: brew install git' },
    { label: 'user.name', cmd: 'git config --global user.name "Sara Ahmed"', note: 'اسمك كما سيظهر في كل commit.' },
    { label: 'user.email', cmd: 'git config --global user.email "sara@example.com"', note: 'استخدم نفس البريد المسجّل في GitHub.' },
    { label: 'init.defaultBranch', cmd: 'git config --global init.defaultBranch main', note: 'اسم الفرع الافتراضي في المستودعات الجديدة.' },
    { label: 'git config --list', cmd: 'git config --list', out: ['user.name=Sara Ahmed', 'user.email=sara@example.com', 'init.defaultbranch=main'], note: 'راجع إعداداتك في أي وقت.' },
  ] }, notes: ['التثبيت والإعداد: git config', 'تأكد أن الجميع ثبّت Git قبل المتابعة.'] },
  { c: Areas, steps: 5, time: '4:30 – 5:30', title: 'المناطق الثلاث', section: D2, props: { time: '4:30 – 5:30' }, notes: ['المناطق الثلاث: Working Directory، Staging، Repository', 'تشبيه: Staging = عربة التسوق قبل الدفع، commit = الفاتورة.', 'كل ضغطة تنفّذ أمرًا وتحرّك الملفات بين المناطق.'] },
  { c: Terminal, steps: 6, time: '4:30 – 5:30', title: 'الأوامر الأساسية', section: D2, props: { kicker: 'الأساسيات', time: '4:30 – 5:30', title: 'الأوامر الأساسية', items: [
    { label: 'init', cmd: 'git init', out: ['Initialized empty Git repository in ~/my-app/.git/'], note: 'يحوّل المجلد إلى مستودع Git (ينشئ مجلد ‎.git المخفي).' },
    { label: 'status', cmd: 'git status', out: ['On branch main', 'Untracked files:', '  <span class="r">index.html</span>'], note: 'سؤالك الدائم: ماذا تغيّر؟ وما الموجود في منطقة التجهيز؟' },
    { label: 'add', cmd: 'git add index.html', note: 'ينقل التعديلات إلى منطقة التجهيز.' },
    { label: 'commit', cmd: 'git commit -m "feat: add homepage"', out: ['[main (root-commit) a1f3c2e] feat: add homepage', ' 1 file changed, 24 insertions(+)'], note: 'يحفظ لقطة دائمة مع رسالة توضّح السبب.' },
    { label: 'log', cmd: 'git log --oneline', out: ['<span class="y">e7b21d4</span> fix: correct page title', '<span class="y">a1f3c2e</span> feat: add homepage'], note: 'تاريخ المشروع: من غيّر؟ متى؟ ولماذا؟' },
    { label: 'diff', cmd: 'git diff', out: ['<span class="d">--- a/index.html</span>', '<span class="d">+++ b/index.html</span>', '<span class="r">-  &lt;h1&gt;Hello&lt;/h1&gt;</span>', '<span class="g">+  &lt;h1&gt;Welcome&lt;/h1&gt;</span>'], note: 'يعرض الفروقات سطرًا بسطر قبل الحفظ.' },
  ] }, notes: ['الأوامر: init، status، add، commit، log، diff', 'نفّذها حيًّا مع الحضور بعد العرض.'] },
  { c: Commits, steps: 3, time: '4:30 – 5:30', title: 'Conventional Commits', section: D2, props: { time: '4:30 – 5:30' }, notes: ['كتابة Commit Messages احترافية (Conventional Commits)', 'type(scope): description', 'الرسالة تشرح «لماذا» — الكود يشرح «كيف».'] },
  { c: Break, time: '5:30 – 5:45', title: 'استراحة', section: D2, props: { time: '5:30 – 5:45', back: '5:45' }, notes: ['استراحة 15 دقيقة.'] },
  { ...graph([gBranch], { kicker: 'الفروع والدمج', time: '5:45 – 7:00', title: 'الفروع: <span class="mono">branch</span> و <em class="mono">switch</em>' }), time: '5:45 – 7:00', title: 'الفروع', section: D2, notes: ['إنشاء الفروع والتنقل: branch، switch، checkout', 'git switch -c feature = إنشاء + انتقال في أمر واحد', 'checkout هو الأمر القديم متعدد الاستخدامات؛ switch و restore أوضح.'] },
  { ...graph([gFF], { kicker: 'الفروع والدمج', time: '5:45 – 7:00', title: 'الدمج: <em class="mono">Fast-forward</em>' }), time: '5:45 – 7:00', title: 'Fast-forward', section: D2, notes: ['الدمج: merge وأنواعه — Fast-forward', 'يحدث عندما لا يتقدم الفرع الهدف بعد التفرع.'] },
  { ...graph([g3way], { kicker: 'الفروع والدمج', time: '5:45 – 7:00', title: 'الدمج الثلاثي: <em class="mono">3-way merge</em>' }), time: '5:45 – 7:00', title: '3-way merge', section: D2, notes: ['الدمج الثلاثي: النسختان + الأصل المشترك', 'ينتج merge commit له أبوان.'] },
  { c: Conflict, steps: 5, time: '5:45 – 7:00', title: 'Merge Conflicts', section: D2, props: { time: '5:45 – 7:00' }, notes: ['حل Merge Conflicts خطوة بخطوة', 'أكثر نقطة يتعثر فيها المبتدئون — أعطها وقتًا كافيًا وجرّبها حيًّا.', 'التعارض يحدث عندما يعدّل فرعان نفس السطر.'] },
  { ...graph([gRebase], { kicker: 'الفروع والدمج', time: '5:45 – 7:00', title: 'مقدمة في <em class="mono">rebase</em>' }), time: '5:45 – 7:00', title: 'rebase', section: D2, notes: ['مقدمة في rebase ومتى يُستخدم', 'استخدمه لتحديث فرعك المحلي قبل فتح PR.', 'إذا ضاق الوقت: انقل هذه الشريحة لليوم الثالث أو تجاوزها.'] },
  { c: Terminal, steps: 5, time: '7:00 – 8:00', title: 'التراجع والتصحيح', section: D2, props: { kicker: 'التراجع والتصحيح', time: '7:00 – 8:00', title: 'التراجع: <span class="mono">restore</span> و <span class="mono">stash</span>', items: [
    { label: 'git restore app.js', cmd: 'git restore app.js', out: ['<span class="d"># تعديلات app.js غير المحفوظة اختفت</span>'], note: 'يتراجع عن تعديلات ملف في مجلد العمل (قبل add).' },
    { label: 'git restore --staged', cmd: 'git restore --staged app.js', out: ['<span class="d"># app.js خرج من منطقة التجهيز، والتعديلات باقية</span>'], note: 'يُخرج الملف من منطقة التجهيز دون حذف تعديلاتك.' },
    { label: 'git stash', cmd: 'git stash', out: ['Saved working directory and index state WIP on main: e7b21d4'], note: 'يخبّئ تعديلاتك مؤقتًا لتنتقل إلى فرع آخر بنظافة.' },
    { label: 'git stash pop', cmd: 'git stash pop', out: ['On branch main', 'Changes not staged for commit:', '  <span class="y">modified:   style.css</span>', 'Dropped refs/stash@{0}'], note: 'يعيد التعديلات المخبّأة.' },
    { label: '.gitignore', cmd: 'cat .gitignore', out: ['node_modules/', '.env', '*.log', 'dist/'], note: 'ملفات لا نريد أن يتتبعها Git أبدًا: الأسرار، المكتبات، والملفات المولّدة.' },
  ] }, notes: ['restore، stash، ملف .gitignore', 'تحذير: لا ترفع ملف .env أبدًا.'] },
  { ...graph([gReset, gRevert], { kicker: 'التراجع والتصحيح', time: '7:00 – 8:00', title: '<span class="mono">reset</span> مقابل <em class="mono">revert</em>' }), time: '7:00 – 8:00', title: 'reset مقابل revert', section: D2, notes: ['reset يعيد كتابة التاريخ — للعمل المحلي غير المرفوع فقط', 'revert يضيف commit عكسيًا — آمن على الفروع المشتركة', 'reset --soft / --mixed / --hard: الفرق فيما يحدث للتعديلات.'] },
  { c: Cards, steps: 5, time: '7:00 – 8:00', title: 'تمرين', section: D2, props: { kicker: 'تطبيق عملي', time: '7:00 – 8:00', title: 'تمرين: تاريخ <em>نظيف</em> وفروع متعددة', cols: 5, numbered: true, stepwise: true, cards: [
    { t: 'ابدأ', d: 'مشروع صغير: صفحة شخصية', code: 'git init' },
    { t: 'احفظ', d: 'من 3 إلى 5 commits برسائل Conventional', code: 'git commit' },
    { t: 'تفرّع', d: 'فرعان: about و contact', code: 'git switch -c' },
    { t: 'ادمج', d: 'افتعل تعارضًا… وحلّه', code: 'git merge' },
    { t: 'تحقّق', d: 'تاريخ نظيف ومقروء', code: 'git log --graph' },
  ] }, notes: ['تمرين: بناء مشروع صغير بتاريخ commits نظيف وفروع متعددة', 'تجوّل بين المشاركين — ساعد في حل التعارضات.'] },

  /* ---------- Day 3 ---------- */
  { c: Divider, kind: 'divider', title: 'اليوم الثالث', section: D3, props: { n: '03', label: 'اليوم الثالث', title: '<span class="mono">GitHub</span><br><em>والعمل الجماعي</em>', sessions: [{ t: '4:00', name: 'المستودعات البعيدة' }, { t: '4:45', name: 'سير العمل الجماعي' }, { t: '6:00', name: 'أدوات الإدارة في GitHub' }, { t: '6:45', name: 'المشروع الختامي' }] }, notes: ['4:00 – 4:45 التعامل مع المستودعات البعيدة', '4:45 – 5:45 سير العمل الجماعي', '5:45 – 6:00 استراحة', '6:00 – 6:45 أدوات الإدارة في GitHub', '6:45 – 8:00 المشروع الختامي'] },
  { c: Remotes, steps: 6, time: '4:00 – 4:45', title: 'المستودعات البعيدة', section: D3, props: { time: '4:00 – 4:45' }, notes: ['إنشاء مستودع وربطه: remote، push، pull، fetch، clone', 'fetch آمن دائمًا؛ pull = fetch + merge.'] },
  { c: Auth, steps: 3, time: '4:00 – 4:45', title: 'المصادقة', section: D3, props: { time: '4:00 – 4:45' }, notes: ['المصادقة عبر SSH و Personal Access Tokens', 'GitHub لم يعد يقبل كلمة المرور عبر HTTPS.', 'اختبر SSH: ssh -T git@github.com'] },
  { ...graph([gGhFlow], { kicker: 'سير العمل الجماعي', time: '4:45 – 5:45', title: 'استراتيجية <em class="mono">GitHub Flow</em>' }), time: '4:45 – 5:45', title: 'GitHub Flow', section: D3, notes: ['استراتيجيات الفروع: GitHub Flow', 'main + فروع قصيرة + Pull Requests'] },
  { ...graph([gGitFlow], { kicker: 'سير العمل الجماعي', time: '4:45 – 5:45', title: 'استراتيجية <em class="mono">Git Flow</em>' }), time: '4:45 – 5:45', title: 'Git Flow', section: D3, notes: ['استراتيجيات الفروع: Git Flow', 'main · develop · feature · release · hotfix', 'قارن: GitHub Flow للنشر المستمر، Git Flow للإصدارات المجدولة.'] },
  { c: PullRequest, steps: 6, time: '4:45 – 5:45', title: 'Pull Requests', section: D3, props: { time: '4:45 – 5:45' }, notes: ['Pull Requests: الإنشاء، الوصف، الربط بالـ Issues', 'كلمة Closes #17 في الوصف تغلق الـ Issue تلقائيًا عند الدمج.'] },
  { c: Cards, time: '4:45 – 5:45', title: 'Code Review', section: D3, props: { kicker: 'سير العمل الجماعي', time: '4:45 – 5:45', title: '<em class="mono">Code Review</em>: كيف تراجع، وكيف تستقبل', cols: 2, cards: [
    { icon: UserCheck, t: 'راجِع الكود لا الشخص', en: 'reviewer', d: 'بدل «كودك سيئ»: «ماذا لو استخدمنا دالة هنا لتجنب التكرار؟»' },
    { icon: MessageSquareText, t: 'كن محددًا واقترح بديلًا', en: 'reviewer', d: 'اشرح السبب، وميّز بين الضروري والاقتراح (nit).' },
    { icon: Heart, t: 'لا تأخذها بشكل شخصي', en: 'author', d: 'الملاحظة على الكود، والهدف منتج أفضل للجميع.' },
    { icon: Minimize2, t: 'PR صغير = مراجعة أفضل', en: 'author', d: 'فرق صغيرة، وصف واضح، وصور للتغييرات المرئية.' },
  ] }, notes: ['Code Review: كيف تراجع وكيف تستقبل الملاحظات', 'جرّبوا: كل شخص يراجع PR زميله في المشروع الختامي.'] },
  { c: Fork, steps: 5, time: '4:45 – 5:45', title: 'Fork', section: D3, props: { time: '4:45 – 5:45' }, notes: ['Fork والمساهمة في المشاريع مفتوحة المصدر', 'git remote add upstream <url> لمتابعة المشروع الأصلي', 'ابحث عن وسم good first issue للبداية.'] },
  { c: Break, time: '5:45 – 6:00', title: 'استراحة', section: D3, props: { time: '5:45 – 6:00', back: '6:00' }, notes: ['استراحة 15 دقيقة.'] },
  { c: Tools, steps: 4, time: '6:00 – 6:45', title: 'Issues و Milestones', section: D3, props: { time: '6:00 – 6:45' }, notes: ['Issues و Labels و Milestones', 'GitHub Projects وربطها بما تم في اليوم الأول'] },
  { c: Actions, steps: 2, time: '6:00 – 6:45', title: 'Branch Protection و Actions', section: D3, props: { time: '6:00 – 6:45' }, notes: ['حماية الفروع (Branch Protection Rules)', 'لمحة عن GitHub Actions (CI/CD)'] },
  { ...graph([gTeam], { kicker: 'المشروع الختامي', time: '6:45 – 8:00', title: 'محاكاة <em>فريق حقيقي</em>', lead: 'كل عضو يعمل على فرع، يفتح PR، يراجع زميله، ويحل التعارضات.' }), time: '6:45 – 8:00', title: 'المشروع الختامي', section: D3, notes: ['محاكاة فريق حقيقي: توزيع المشاركين على فرق', 'كل عضو يعمل على فرع، يفتح PR، يراجع زميله، ويحل التعارضات', 'عرض النتائج وختام الورشة'] },
  { c: Closing, title: 'الختام', section: 'ختام', notes: ['شكر الحضور، أسئلة مفتوحة، مصادر للاستزادة: git-scm.com/book · docs.github.com · learngitbranching.js.org'] },
]
