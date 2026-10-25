/* Lessons 17–20: types, testing, rendering strategies, and the downloadable capstone. */
RA.chapter('React مع TypeScript: أنواع توضح عقد المكونات',
 'نضيف فحصًا وقت التطوير للـprops والحالة والأحداث والبيانات الخارجية، من غير افتراض إن الأنواع تحقق في الشبكة.',[
 RA.part('typescript-start','نوع بيانات قبل تشغيل الكود',[
  'TypeScript تضيف نظام أنواع لـJavaScript يتحقق قبل التنفيذ. معظم تعريفات الأنواع تُزال من الناتج، فالمتصفح لا يحصل تلقائيًا على حارس يمنع أي استجابة API غلط. هي تمنع فئات أخطاء في الكود وتوضح واجهاته، لكنها ليست بديلًا لاختبار أو تحقق بيانات خارجية.',
  'لملف يحتوي JSX استخدم tsx، ولمنطق TypeScript بدون JSX استخدم ts. ابدأ بقالب react-ts مستقل لو لسه بتتعلم، ولا تغير امتدادات مشروع كامل دفعة واحدة بدون فحص الإعدادات. الأمر التالي ينشئ مشروعًا جديدًا؛ مش أمر تحويل سحري لأي JavaScript موجودة.',
  'Inference استنتاج النوع من القيمة، فغالبًا useState(0) تفهمها الأداة كرقم. عندما البداية null أو array فارغة لا تكفي لتوضيح كل الحالات المقصودة، صرّح بالنوع. strict في tsconfig تكشف حالات غياب وتحويلات غير سليمة بدل إخفائها.'
 ],`npm create vite@latest typed-react -- --template react-ts
cd typed-react
npm install
npm run dev`,'Terminal'),
 RA.part('typed-props','اكتب ما يستقبله المكون ويرجعه الحدث',[
  'type أو interface توصف شكل props. علامة ? تجعل الخاصية اختيارية؛ ده معناه احتمال undefined في القراءة. الدالة callback لها نوع مدخل ونتيجة. لا تستخدم any علشان تسكت خطأ معناه أنك لم تحدد العقد بعد؛ unknown أنسب لبيانات غير موثوقة تحتاج فحصًا.',
  'ReactNode مناسب لمحتوى children الذي قد يكون نصًا أو عناصر وأشكالًا أخرى يقبلها العرض. لا تخلطه بـobject عادي من API. type import يوضح أن الاسم مستخدم لفحص النوع فقط. props للمكون مش فحص runtime؛ المستخدم قد يعدل الشبكة أو التخزين رغم صحة مشروعك وقت البناء.'
 ],`import type { ReactNode } from 'react';
type Task = { id: string; title: string; done: boolean };
type TaskCardProps = {
  task: Task;
  onToggle: (id: string) => void;
  children?: ReactNode;
};
export default function TaskCard({ task, onToggle, children }: TaskCardProps) {
  return <article><label>
    <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
    {task.title}</label>{children}</article>;
}`,'src/TaskCard.tsx'),
 RA.part('typed-state','حالة لها بدائل واضحة بدل flags متناقضة',[
  'Union تجمع احتمالات. Discriminated union تستخدم خاصية مشتركة مثل status تحدد شكل باقي البيانات. لو status=success يبقى data موجودة بالنوع المحدد، ولو error تبقى message. Narrowing تضييق النوع بعد شرط مفهوم للأداة.',
  'ده يمنع الوصول لـdata في حالة pending بدون معالجة. لا تكثر assertions مثل as User كأنها تحويل أو تحقق؛ هي إخبار للمترجم أن يثق بك. لو الافتراض غلط، runtime لن يصلحه. نفس القاعدة مع non-null assertion !: لا تجعل الغياب مستحيلًا فعليًا.',
  'لو تستخدم reducer، Action union توضح payload لكل نوع انتقال. في default يمكن فحص never لإظهار الفروع المنسية أثناء التطوير. لكن تحقق runtime ما زال مهمًا لو action جاية من مصدر غير موثوق.'
 ],`type User = { id: number; name: string };
type LoadState =
  | { status: 'pending' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string };

export function UserResult({ state }: { state: LoadState }) {
  if (state.status === 'pending') return <p>تحميل...</p>;
  if (state.status === 'error') return <p role="alert">{state.message}</p>;
  return <ul>{state.data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}`,'src/UserResult.tsx'),
 RA.part('typed-events','الأحداث والمراجع والـGenerics',[
  'الحدث inline غالبًا يتم استنتاج نوعه من العنصر. عند استخراج handler مستقلة صرّح مثل ChangeEvent&lt;HTMLInputElement&gt; أو FormEvent&lt;HTMLFormElement&gt;. currentTarget مرتبط بالعنصر الذي له handler، بينما target قد يكون عنصرًا فرعيًا.',
  'ref لحقل تبدأ null لأن DOM لسه لم تُطبق. useRef&lt;HTMLInputElement | null&gt;(null) توضح العمر وتفرض فحصًا قبل focus. Generic تسمح لدالة تستخدم نفس علاقة النوع عبر مدخلاتها ونتيجتها بدل حذف النوع بـany.',
  'لا تُعقد كل دالة بـGeneric؛ استخدمها لما في علاقة فعلية تريد الحفاظ عليها. دالة تقرأ id من قائمة يمكنها قيد T extends {id:string}، ونتيجتها تظل العنصر الأصلي بالنوع المقصود أو undefined.'
 ],`import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
export default function NameInput() {
  const field = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState('');
  function change(event: ChangeEvent<HTMLInputElement>) {
    setName(event.currentTarget.value);
  }
  return <><label>اسمك <input ref={field} value={name} onChange={change} /></label>
    <button onClick={() => field.current?.focus()}>تركيز</button></>;
}`,'src/NameInput.tsx'),
 RA.part('runtime-validation','unknown من الخارج ثم فحص حقيقي',[
  'response.json يمكن أن تصل بأي شكل. تعريف User لا يغير الاستجابة. استقبل unknown وافحص هل object غير null، وهل الحقول من النوع المتوقع. Type guard دالة تعيد شرطًا وتخبر TypeScript بالنوع بعد نجاح التحقق، ولذلك صدق تنفيذها مسؤوليتك.',
  'لبيانات كبيرة ومتداخلة مكتبة Schema مثل Zod يمكنها تنظيم تحقق runtime وإنتاج رسائل واضحة؛ هي خيار خارجي، وليست ضرورية لكل مثال صغير. افصل فشل الشبكة عن فشل شكل البيانات ليكون التشخيص مفهومًا.',
  'شغّل typecheck في خط البناء. أداة تحول TypeScript قد تزيل الأنواع بدون فحص شامل؛ نجاح خادم التطوير وحده لا يعني غياب أخطاء أنواع. قالب Vite TS يضم إعداداته؛ اقرأ scripts بدل افتراض أن كل build متطابقة.'
 ],`type User = { id: number; name: string };
export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && typeof value.id === 'number'
    && 'name' in value && typeof value.name === 'string';
}
export function readUser(value: unknown): User {
  if (!isUser(value)) throw new Error('Invalid user');
  return value;
}`,'src/readUser.ts')
 ],[
 quiz('TypeScript تتحقق تلقائيًا من JSON وقت التشغيل؟',['لا، نحتاج فحص runtime','نعم بمجرد as','لو الملف tsx'],0,'الأنواع لا تعيد تشكيل البيانات ولا تضمن مصدرها.'),
 quiz('children تختار لها غالبًا أي نوع؟',['ReactNode','any دائمًا','HTMLElement فقط'],0,'children قد تكون نصوصًا وعناصر وأشكال محتوى أخرى صالحة.'),
 quiz('as User تعمل تحويل بيانات مضمون؟',['لا، assertion تعتمد على صحة افتراضك','نعم تنشئ حقولًا','تحذف الطلب'],0,'الفحص الحقيقي يحتاج كودًا أو schema.'),
 quiz('لماذا ref قد تكون null؟',['قبل commit أو بعد الإزالة','لأن React تعطلت دائمًا','لازم random'],0,'العنصر لا يكون متاحًا طول عمر كل استدعاء للدالة.')
 ],[
 task('دالة بحث Generic','اكتب دالة تقبل قائمة عناصر لها id نصية وترجع العنصر أو undefined مع الحفاظ على النوع.',`export function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}`,'src/findById.ts',['لا any','الغياب موضح','يحتفظ بخواص نوع العنصر']),
 task('Action union','اكتب أنواع added وdeleted واستخدم reducer نقية مع فحص exhaustive.',`type Task = { id: string; title: string; done: boolean };
type Action = { type: 'added'; task: Task } | { type: 'deleted'; id: string };
export function reducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'added': return [...state, action.task];
    case 'deleted': return state.filter(t => t.id !== action.id);
    default: { const neverAction: never = action; throw new Error(String(neverAction)); }
  }
}`,'src/reducer.ts',['payload مرتبطة بالنوع','لا تعديل state القديمة','الفرع الناقص يكشفه الفحص'])
 ],[['React وTypeScript','https://react.dev/learn/typescript'],['تضييق الأنواع','https://www.typescriptlang.org/docs/handbook/2/narrowing.html'],['قوالب Vite','https://vite.dev/guide/']]);

RA.chapter('اختبارات تثق في السلوك: Vitest وTesting Library',
 'نختبر الانتقالات النقية والتفاعل من منظور المستخدم، ونتعامل مع الانتظار والـmocks بدون اختبارات تعيد كتابة التنفيذ.',[
 RA.part('test-plan','إيه اللي نختبره وإيه اللي ما يضيفش ثقة؟',[
  'Unit test لدالة منفصلة مثل reducer أو validation. Component test يركب جزء واجهة ويجربه داخل بيئة DOM مناسبة. Integration تجمع عدة أجزاء. End-to-end يشغّل رحلة في متصفح فعلي. التقسيم يساعد اختيار التكلفة والثقة، ومش مطلوب تكتب كل نوع لكل سطر.',
  'اختبر نتيجة تهم المستخدم: مهمة تظهر بعد كتابة عنوان وإرسال، خطأ يظهر عند إدخال غير صالح، أو قائمة لا تعرض بيانات الحساب السابق. اختبار أن useState نُوديت مرتين غالبًا مرتبط بالتنفيذ لا بالمطلب. الاختبار الجيد يفشل لو السلوك اتكسر حتى لو أسماء الدوال تغيرت.',
  'Snapshot ضخمة ليست بديلًا عن توكيد واضح. اختبر الفروع والحدود المهمة بدل السعي لرقم coverage وحده. اختبارات تنجح بدون ممارسة الحالة المطلوبة لا تعطي ضمانًا لمجرد لون أخضر.'
 ]),
 RA.part('vitest-setup','إعداد بيئة اختبار لمشروع Vite',[
  'Vitest مشغل اختبارات. Testing Library أدوات تركيب واستعلام وتفاعل أقرب لطريقة استخدام الواجهة، وuser-event لمحاكاة تفاعل متسلسل. jsdom بيئة DOM داخل Node، مش محرك رسم متصفح حقيقي؛ لذلك لا تعتمد عليها وحدها لإثبات المقاسات أو focus في كل نمط متقدم.',
  'ثبت الأدوات كـdevDependencies داخل المشروع. راجع متطلبات Node وVite للإصدارات اللي تثبتها؛ الأدوات الحديثة قد تتطلب Node أحدث من مشروع قديم. المثال يستخدم import صريح لـtest وexpect بدل افتراض globals، وملف setup ينظف DOM بعد كل حالة.',
  'التركيب في الاختبار يجب أن يضم Providers المطلوبة مثل MemoryRouter أو Context أو QueryClient جديد لكل اختبار حسب الحالة. الاعتماد على مخزن عالمي بقيت فيه بيانات اختبار سابق يسبب نتائج متقلبة.'
 ],`npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom`,'Terminal'),
 RA.part('test-config','ملفات الإعداد والتنظيف',[
  'defineConfig من vitest/config تسمح بوصف test. احتفظ بإضافات Vite اللي مشروعك يحتاجها مثل React بدل استبدال ملفك كله بلا مراجعة. setupFiles تُنفذ لإضافة matchers مثل toBeInTheDocument وتنظيف الواجهة.',
  'في package.json أضف script باسم test قيمته vitest، ويمكن test:run قيمته vitest run للتشغيل مرة واحدة في CI. وضع المراقبة مناسب أثناء التطوير، أما الفحص الآلي يحتاج خروجًا بحالة نجاح أو فشل. لا تتجاهل خروج الفشل لمجرد أن المشروع بُني.'
 ],`// vite.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.js' }
});

// src/test/setup.js
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(cleanup);`,'ملفان منفصلان حسب التعليقات'),
 RA.part('component-test','Arrange ثم Act ثم Assert',[
  'Arrange تجهيز البيانات وتركيب المكون. Act تنفيذ تفاعل المستخدم. Assert التحقق من النتيجة المطلوبة. getByRole باسم متاح يتوافق مع زر أو حقل مسمى، لذلك يحسن صحة التفاعل ومعنى الواجهة. queryBy مناسبة لاختبار غياب، وfindBy تنتظر ظهورًا غير متزامن.',
  'استعمل await مع user-event عند الحاجة؛ عدم انتظار التفاعل أو النتيجة قد يجعل الاختبار يقرأ لقطة قبل تطبيق العمل. لا تضع انتظارًا ثابتًا طويلًا بدل تحديد حدث أو عنصر منتظر. waitFor مفيدة لشرط يعاد فحصه، وليست مكانًا لوضع ضغطات متكررة.',
  'المثال يستخدم مكونًا كاملًا صغيرًا كي لا تعتمد على كود مخفي. نجاحه يثبت أن الإضافة تعطي نصًا في القائمة وأن زر الإرسال قابل للوصول باسمه، لكنه لا يثبت الحفظ بعد إعادة تشغيل أو صحة Backend.'
 ],`// src/AddTask.jsx
import { useState } from 'react';
export default function AddTask() {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState([]);
  return <form onSubmit={e => {
    e.preventDefault(); if (!title.trim()) return;
    setTasks(previous => [...previous, title.trim()]); setTitle('');
  }}><label htmlFor="task">عنوان المهمة</label>
    <input id="task" value={title} onChange={e => setTitle(e.target.value)} />
    <button>إضافة</button><ul>{tasks.map((text, i) => <li key={i}>{text}</li>)}</ul>
  </form>;
}

// src/AddTask.test.jsx
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTask from './AddTask.jsx';
test('adds a task through the form', async () => {
  const user = userEvent.setup();
  render(<AddTask />);
  await user.type(screen.getByLabelText('عنوان المهمة'), 'راجع Props');
  await user.click(screen.getByRole('button', { name: 'إضافة' }));
  expect(screen.getByRole('listitem')).toHaveTextContent('راجع Props');
});`,'ملفا المكون والاختبار',[
  'index هنا في قائمة تجريبية append-only لا تحذف ولا تعيد ترتيب؛ في المشروع القابل للتعديل استخدم id ثابتة كما في دروس القوائم.',
  'الاختبار يسأل عن label وعن اسم زر، لا class بصرية قد تتغير مع التصميم.'
 ]),
 RA.part('mocks-async','بدائل الشبكة والعزل بين الحالات',[
  'Mock بديل محدد لجزء خارجي، مثل استجابة API أو ساعة أو تخزين. لا تعمل mock لكل شيء لأنك قد تختبر بدائلك بدل التطبيق. للشبكة MSW خيار لمحاكاة الطلب عند حد الشبكة بحيث يظل كود fetch نفسه مستخدمًا، وله إعداد حسب بيئتك.',
  'اختبر loading ونجاحًا وفشلًا ونتيجة فارغة. في TanStack Query جهز QueryClient منفصلة وأغلق retry عند فحص خطأ إذا كانت إعادة المحاولة تؤخر النتيجة المطلوبة؛ نظف بعد الحالة. Timer tests تحتاج سياسة ساعات وهمية متوافقة مع user-event وتعود للساعات الحقيقية بعد الانتهاء.',
  'في E2E بمتصفح مثل Playwright اختبر مسارًا عميقًا وتحديث الصفحة والكيبورد وحفظ مهمة ثم إعادة التحميل. ده يكشف مشاكل تقديم index.html والوصول اللي jsdom لا تثبتها وحدها. لا تستخدم حساب إنتاج أو عملية مالية حقيقية كبيانات اختبار.'
 ]),
 RA.part('reducer-test','اختبار نقاء قواعد البيانات',[
  'الدالة النقية يمكن فحصها بدون تركيب React. جهز قبل، نفذ transition، ثم أكد الناتج وأن الأصل لم يتغير. object freeze على المستوى المناسب قد يساعد كشف تعديل غير مقصود في اختبار، لكنه لا يجمد كل الأعماق تلقائيًا.',
  'الفحص التالي مرتبط بمطلب: toggle يغير done للعنصر الصحيح ولا يغير state القديمة. لا يختبر تفاصيل كيف كتبت map. يفضل ينجح لو أعدت كتابة التنفيذ الصحيح بطريقة مختلفة.'
 ],`import { test, expect } from 'vitest';
import { tasksReducer } from './tasksReducer.js';
test('toggles the matching task without mutating the original', () => {
  const before = [{ id: 'a', title: 'React', done: false }];
  const after = tasksReducer(before, { type: 'toggled', id: 'a' });
  expect(after[0].done).toBe(true);
  expect(before[0].done).toBe(false);
  expect(after).not.toBe(before);
});`,'src/tasksReducer.test.js')
 ],[
 quiz('queryBy تستخدم غالبًا لفحص إيه؟',['غياب عنصر بدون رمي getBy','حجم الحزمة','قيمة Node'],0,'getBy ترمي لو لا يوجد تطابق، وqueryBy تسمح بمقارنة الغياب.'),
 quiz('jsdom يثبت التخطيط البصري الحقيقي؟',['لا، تحتاج اختبار متصفح للمناسب','نعم كل المقاسات','فقط لو CSS مثبتة'],0,'بيئة DOM ليست محرك layout ورسم مكافئًا للمتصفح.'),
 quiz('اختبار يعتمد على عدد استدعاءات Hook أكثر ثباتًا من سلوك المستخدم؟',['ليس بالضرورة، قد يربط الاختبار بالتنفيذ','نعم دائمًا','لا نختبر أي شيء'],0,'اختر توقعًا مرتبطًا بالمطلب بدل تفاصيل قابلة للتغيير.'),
 quiz('نشارك QueryClient واحدة عبر اختبارات مستقلة بلا تنظيف؟',['لا، قد تتسرب cache بين الحالات','نعم لتحسين النتيجة','شرط Vitest'],0,'العزل يمنع نجاحًا أو فشلًا يعتمد على ترتيب الاختبارات.')
 ],[
 task('ارفض المهمة الفارغة','أضف اختبارًا يرسل عنوانًا من مسافات ويؤكد غياب عناصر القائمة.',`test('does not add whitespace-only tasks', async () => {
  const user = userEvent.setup();
  render(<AddTask />);
  await user.type(screen.getByLabelText('عنوان المهمة'), '   ');
  await user.click(screen.getByRole('button', { name: 'إضافة' }));
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
});`,'داخل AddTask.test.jsx مع imports السابقة',['لا بيانات من اختبار سابق','الحدث منتظر','فحص غياب صريح']),
 task('تحقق من حدود المدخل','اكتب اختبارًا لدالة validateTitle من درس الفورمات بقيم 2 و3 حروف.',`import { test, expect } from 'vitest';
import { validateTitle } from './validateTitle.js';
test('enforces the title minimum', () => {
  expect(validateTitle('ab')).not.toBe('');
  expect(validateTitle('abc')).toBe('');
});`,'src/validateTitle.test.js',['حد فشل وحد نجاح','الدالة لا تحتاج DOM'])
 ],[['Vitest','https://vitest.dev/guide/'],['مثال Testing Library','https://testing-library.com/docs/react-testing-library/example-intro/'],['ترتيب الاستعلامات','https://testing-library.com/docs/queries/about/'],['MSW','https://mswjs.io/docs/']]);

RA.chapter('العرض على السيرفر: SSR وHydration وServer Components',
 'نفهم مكان الحساب ومكان التفاعل، وحدود العميل والخادم، ونميز أسلوب عرض الصفحة عن اختيار إطار المشروع.',[
 RA.part('rendering-strategies','CSR وSSR وSSG: إمتى يتكون محتوى الصفحة؟',[
  'في CSR المتصفح ينزل JavaScript وتحسب React الواجهة فيه. في SSR الخادم ينتج HTML للطلب، ثم قد يرسل كود العميل لتفعيل التفاعل. في SSG يتكون HTML في وقت البناء لصفحات مناسبة، ويمكن تحديثه بإستراتيجية إطارك. المصطلحات تصف متى وأين تنتج المحتوى، مش ضمانًا لأداء أو نتائج بحث في كل مشروع.',
  'SSR قد يقدم محتوى أوليًا أسرع في حالات، لكنه يضيف تكلفة خادم وإدارة بيانات وحدود cache. CSR قد يناسب أداة داخلية تفاعلية. لا تفترض أن كل موقع محتاج نظامًا واحدًا لكل أجزائه. إطار React يوفر اختيارات وتنظيمًا لهذه المسؤوليات بدل بناء كل البنية يدويًا.',
  'Vite بقالب React المتصفحي العادي لا يحول Components تلقائيًا لـServer Components أو نظام SSR كامل. دعم Vite لواجهات بناء سيرفر لا يساوي وجود إطار كامل جاهز في القالب البسيط. الدرس ده خريطة مع أمثلة نقاط دخول، وليس أمرًا واحدًا ينشئ Backend.'
 ]),
 RA.part('hydration','Hydration تربط React بواجهة ابتدائية من الخادم',[
  'hydrateRoot تستقبل عنصرًا فيه HTML ناتج متوافق من React، وتربط شجرة العميل به. مختلفة عن createRoot لواجهة يبدأ عرضها في المتصفح. أول حساب على العميل لازم يطابق ما نتج على الخادم بما يلزم؛ اختلاف محتوى غير مقصود يولد hydration mismatch.',
  'Date.now وMath.random أو قراءة حجم window أثناء render الأول قد تنتج فرقًا بين البيئتين. اجعل البداية حتمية، ومرر بيانات متوافقة من الخادم، ثم اقرأ واجهات المتصفح في الوقت المناسب. لا تستخدم suppressHydrationWarning كحل عام لكل عدم تطابق.',
  'هذا زوج دخول توضيحي لبيئة SSR مجهزة. server-entry تحتاج بناء سيرفر قادرًا على فهم JSX وتنفيذ React، والـHTML الناتج يقدّم داخل عنصر root. وضع الملفين في قالب Vite عادي لا يوفر خادم SSR وحده.'
 ],`// App.jsx — same deterministic component on both sides
export default function App() { return <h1>دليل React</h1>; }

// server-entry.jsx — inside an SSR build/runtime
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
export function render() { return renderToString(<App />); }

// client-entry.jsx — root already contains matching server HTML
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
hydrateRoot(document.getElementById('root'), <App />);`,'نقاط دخول توضيحية لبيئة SSR'),
 RA.part('server-boundary','Server Components ليست اسمًا آخر لـSSR',[
  'Server Component تنفذ في بيئة منفصلة عن تطبيق العميل وقد تكون وقت البناء أو مع الطلب بحسب الإطار. كودها لا يحتاج أن يُرسل كله للعميل، ويمكنها قراءة مصادر سيرفر ضمن سياستها. الناتج يُركّب مع مكونات العميل، وده بُعد مختلف عن إرسال HTML أولي بـSSR.',
  'Client Components مسؤولة عن state التفاعلية والأحداث وواجهات المتصفح. في إطار يدعم RSC، توجيه use client يحدد حدًا في شبكة الموديولات التي تدخل العميل؛ لا يعني بالضرورة أن المكون لن يشارك في إنتاج HTML أولي على الخادم. افهم حد الكود وحد العرض كلًا على حدة.',
  'لا تضف use client لقالب Vite وتتوقع نظام Server Components. استخدم إطارًا يدعم ذلك وبناءه الصحيح. واجهات دمج RSC على مستوى أدوات البناء قد تتطور، لذلك مش مطلوب للمبتدئ تنفيذ بروتوكولها يدويًا.'
 ]),
 RA.part('server-data-flow','تفاعل عميل داخل نتيجة مصدر سيرفر',[
  'المثال بصياغة شائعة في أطر تدعم Server Components: ملف عميل فيه Counter، وملف سيرفر async يجلب بيانات ويضم العميل. الـprops العابرة لحد العميل تحتاج قيمًا قابلة للتسلسل وفق عقد إطارك، لا اتصال database أو كائن طلب خام.',
  'قراءة قيمة في السيرفر لا تجعل عرضها آمنًا تلقائيًا؛ ما ترسله داخل JSX أو props يصل للمستخدم. لا تمرر أسرارًا أو بيانات لا يحق للزائر رؤيتها. أسرار الاتصال تظل في كود خادم مع تحقق صلاحيات قبل القراءة.',
  'Server Functions، ومنها اصطلاحات Server Actions في الأطر، نقاط وصول تحتاج تحققًا وتفويضًا مثل endpoint. إخفاء زر أو تمرير id من Client Component لا يثبت ملكية السجل. React تنظم الواجهة، والخادم يحمي العملية الفعلية.'
 ],`// Counter.jsx — framework with RSC support
'use client';
import { useState } from 'react';
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Page.jsx — Server Component in that framework
import Counter from './Counter.jsx';
export default async function Page() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  if (!response.ok) throw new Error('تعذر تحميل المستخدم');
  const user = await response.json();
  return <main><h1>{user.name}</h1><Counter /></main>;
}`,'ملفان في إطار يدعم RSC، وليس Vite CSR'),
 RA.part('streaming-cache','Streaming والكاش وعزل الطلبات',[
  'Streaming يسمح بإرسال أجزاء من النتيجة مع جاهزيتها بدل انتظار كل شيء، مع حدود Suspense وتكامل خادم مناسب. ده لا يعني تسريب جزء غير مصرح به ثم إخفاءه لاحقًا؛ التفويض قبل إرسال بيانات خاصة.',
  'Cache مشتركة على الخادم قد تخدم أكثر من مستخدم. لا تضع بيانات خاصة في QueryClient عالمية يُعاد استخدامها بين الطلبات. إنشاء عميل أو نطاق بيانات لكل طلب، وتسلسل بيانات آمنة للترطيب، يعتمد على طريقة الإطار والمكتبة. cache في المتصفح لها نطاق مختلف عن cache خادم.',
  'اختار إطارًا بعد تحديد متطلباتك: صفحات عامة، بيانات طلب، جلسات، تفاعل، ونشر متاح. Next.js أو React Router Framework أمثلة أطر لها مناهج مستقلة؛ إتقان React لا يعني حفظ كل إطار، لكن لازم تفهم حدود التنفيذ قبل نقل كود من واحد لآخر.'
 ])
 ],[
 quiz('SSR وServer Components نفس المصطلح؟',['لا، بُعدان مختلفان يمكن اجتماعهما','نعم دائمًا','لا علاقة لأي منهما بالمكان'],0,'SSR تنتج HTML للعرض الأول؛ RSC تحدد بيئة تنفيذ نوع من المكونات وتقسيم الكود.'),
 quiz('أول حساب عميل مختلف عشوائيًا عن HTML الخادم؟',['قد يسبب hydration mismatch','طبيعي ولا يحتاج مراجعة','يصلحه CSS'],0,'اجعل البداية متوافقة وحتمية ثم حدثها بعد الوقت المناسب.'),
 quiz('use client تعني عدم وجود HTML أولي من الخادم دائمًا؟',['لا، حسب إطار العرض','نعم في كل الحالات','هي API تخزين'],0,'حد العميل في الموديولات لا يساوي نفي SSR للمكون.'),
 quiz('QueryClient مشتركة عالميًا لبيانات خاصة على خادم؟',['قد تسرّب بيانات بين طلبات، اعزل وفق التصميم','أفضل اختيار دائمًا','تحميها key فقط بلا مراجعة'],0,'عزل المستخدم والطلب مسؤولية أساسية في بيئة الخادم.')
 ],[
 task('صنف الكود حسب البيئة','صنف navigator.onLine وuseState وقراءة سر قاعدة بيانات، واشرح أي بيانات يمكن إرسالها للعميل.',`navigator.onLine → واجهة متصفح، لا تُقرأ مباشرة على الخادم.
useState للتفاعل → Client Component في بيئة RSC.
سر قاعدة البيانات → يبقى في الخادم؛ لا يرسل في props أو JSON.
اسم عام مسموح عرضه → يمكن إرساله بعد تحقق سياسة الخدمة.`,'مراجعة حدود التنفيذ',['يفصل النوع عن مكان التنفيذ','لا يرسل السر','التفويض قبل البيانات']),
 task('أصلح بداية زمنية غير حتمية','اكتب مكونًا يبدأ بنص واحد ثابت على الخادم والعميل، ثم يعرض وقت المتصفح بعد التركيب.',`import { useEffect, useState } from 'react';
export default function ClientTime() {
  const [time, setTime] = useState(null);
  useEffect(() => { setTime(new Date().toLocaleTimeString()); }, []);
  return <p>{time === null ? 'جاري تحديد وقت الجهاز...' : time}</p>;
}`,'ClientTime.jsx — يحدد كعميل في إطار RSC',['أول render حتمية','لا قراءة وقت مختلف أثناء الحساب الأول','يفهم أن الوقت محلي'])
 ],[['hydrateRoot','https://react.dev/reference/react-dom/client/hydrateRoot'],['Server Components','https://react.dev/reference/rsc/server-components'],['use client','https://react.dev/reference/rsc/use-client'],['بدء مشروع بإطار','https://react.dev/learn/creating-a-react-app']]);

RA.chapter('مشروع التخرج: تنظيم التطبيق واختباره ونشره',
 'نركّب المهارات في Study Board: صفحات ومهام وبحث وتخزين محلي وبيانات تجريبية وحدود أخطاء، مع مشروع كامل قابل للتنزيل.',[
 RA.part('capstone-scope','حدود المشروع وماذا ستثبت عند انتهائه',[
  'Study Board تطبيق مذاكرة متصفحي بـReact وTypeScript. فيه صفحة مهام تضيف وتكمل وتحذف، وصفحة تفاصيل لكل مهمة، وبحث قيمته في URL، وملخص، وصفحة مستخدمين من API عامة عبر TanStack Query، وشاشة تقرير محملة بـlazy. المصدر الكامل في الأرشيف يشمل الأنواع والاختبارات والتنسيق وملفات التشغيل.',
  'المهام تحفظ محليًا في متصفح هذا الأصل. لا يوجد تسجيل دخول أو مزامنة بين الأجهزة أو Backend للمهام، وده اختيار نطاق واضح للتطبيق التعليمي. خدمة المستخدمين تحتاج إنترنت وهي منفصلة عن مهامك. لا نصف localStorage كقاعدة بيانات حساب حقيقي.',
  'المشروع يستخدم React 19، وReact Router 7 بالنمط Declarative، وTanStack Query 5. مكتبات الاختبار والتطوير مذكورة في package.json. راجع Node المدعومة للحزم قبل التثبيت؛ اختر LTS حديثة ومدعومة. الموقع التعليمي نفسه يظل HTML/CSS/JS ولا يحتاج تثبيت الحزم دي لقراءته.',
  '<a class="btn primary" href="react-capstone.zip" download>تنزيل مشروع React الكامل ZIP</a>'
 ]),
 RA.part('capstone-run','التشغيل وقراءة الملفات بالترتيب',[
  'فك الضغط في فولدر مستقل، وافتحه في المحرر، ثم نفذ الأوامر من نفس المجلد اللي فيه package.json. npm install تنزل الحزم، وnpm run dev تشغل Vite. npm run test:run تشغل الاختبارات مرة، وnpm run build تفحص الأنواع وتبني dist، ثم preview تفحص الناتج.',
  'ابدأ بـtypes.ts لتفهم Task وAction، ثم tasks.ts لقواعد البيانات، ثم TasksContext.tsx للملكية والتوصيل والحفظ. main.tsx يضع Router وQuery provider وحد الخطأ. App.tsx يحدد الصفحات. ملف Reports.tsx منفصل لاختبار lazy.',
  'تعليقات المصدر وREADME تحدد نطاق كل ملف وطريقة التحقق. لا تنسخ node_modules من مشروع آخر؛ ثبّت الحزم لهذه النسخة. ملف lock الناتج يثبت الاختيارات الدقيقة، واحتفظ به لو هتشارك مشروعك أو تبني في CI.'
 ],`npm install
npm run dev
npm run test:run
npm run build
npm run preview`,'Terminal — توقف dev أو استخدم نافذة ثانية للفحوص'),
 RA.part('capstone-architecture','ملكية واحدة لكل نوع بيانات',[
  'tasks في reducer وProvider لأن صفحات المهام والتفاصيل والتقرير تحتاج نفس المصدر. title المؤقتة في الفورم لأن بقية التطبيق لا تحتاج كل حرف قبل الإرسال. q في URL لأن مشاركة البحث والرجوع له لهما معنى. users في Query cache لأن مصدرها شبكة وسياسة جلبها مستقلة.',
  'Completed count قيمة مشتقة من tasks. لا تحفظها في localStorage كمفتاح مستقل ولا state ثانية. UI error لفشل التخزين توضح أن العرض الحالي ما زال موجودًا لكن الاستمرارية غير مضمونة. القراءة الابتدائية تفحص شكل البيانات وتزيل السجلات غير الصالحة ومعرفات مكررة.',
  'التقسيم حسب feature أو مسؤولية أنسب من جعل ملف utils عملاق لكل شيء. لا تضف Redux لمجرد أن التطبيق عنده ٣ صفحات؛ لو احتجته لاحقًا لإدارة انتقالات ومشاركة واشتراكات، قيمه على متطلبات واضحة. نفس المبادئ تنطبق مع أي مخزن تختاره.'
 ],`src/
├── types.ts              # Task and Action contracts
├── tasks.ts              # Pure reducer and safe storage reader
├── TasksContext.tsx      # Ownership + synchronization
├── App.tsx               # Routes + pages
├── Reports.tsx           # Lazy report
├── ErrorBoundary.tsx     # Render failure fallback
├── main.tsx              # Providers
├── style.css
├── tasks.test.ts
└── App.test.tsx`,'خريطة المصدر المرفق'),
 RA.part('capstone-tests','اختبار رحلة كاملة بدل الاكتفاء بـbuild',[
  'ابدأ من صفحة مهام فاضية، أضف عنوانًا صالحًا، علّم اكتماله، افتح التفاصيل، ثم احذفه. جرّب عنوان مسافات ونصًا طويلًا وبحثًا لا يطابق شيئًا. تأكد أن العد من القائمة الأصلية وليس من نتيجة البحث إلا إذا النص يصرح بذلك.',
  'أعد تحميل الصفحة لتفحص الحفظ. جرّب تعطيل التخزين أو وضع JSON تالفة وافحص سلوك fallback. افتح /tasks/id مباشرة بعد النشر علشان تختبر قواعد الاستضافة. افتح صفحة المستخدمين بإنترنت ثم دون اتصال واستخدم إعادة المحاولة. اختبر بالكيبورد وعلى هاتف.',
  'الاختبارات المرفقة تغطي نقاء reducer والتحقق من بيانات التخزين وإضافة مهمة من واجهة مسماة. لا تزعم أنها تثبت كل API خارجية أو كل قارئ شاشة. وسّعها حسب ميزة جديدة أو فشل محدد، ولا تكتب اختبارات تكرر تنفيذ map حرفيًا.'
 ]),
 RA.part('capstone-production','المتغيرات البيئية والأمان والتعامل مع الطلبات',[
  'في Vite القيم المعرضة للعميل باسم VITE_* تدخل الحزمة ويمكن للمستخدم رؤيتها. عنوان API عام يصلح، ومفتاح خدمة خاص أو كلمة مرور لا يصلحان. .env محلية ليست ضمانًا إن السر لم يخرج لو استوردته للعميل. أسرار الخادم تبقى في بيئة خادم حقيقية.',
  'كل عملية كتابة على خدمة حقيقية تحتاج Authentication لإثبات الهوية وAuthorization للسماح بالعملية والمورد. إخفاء زرار أو route guard لا يقوم بالدورين. استخدم نقل HTTPS وجلسات مناسبة لتصميمك، ولا تضف تخزين token حساس في متصفح كحل عام بدون مراجعة السياق.',
  'React تعرض النصوص كبيانات ولا تفسرها HTML خام افتراضيًا. dangerouslySetInnerHTML تفتح مسارًا مختلفًا يحتاج مصدرًا موثوقًا وتنقية مناسبة. CORS ليست نظام صلاحيات لحماية البيانات من كل عميل؛ الخادم يطبق التحقق فعليًا. لا تضع eval أو أسرار في مشروع التخرج لتسهيل التجربة.'
 ]),
 RA.part('capstone-deploy','نشر Vite SPA ومراجعة الناتج',[
  'ارفع مصدر مشروع التخرج لمستودع مستقل إذا أردت نشره. في Vercel إعداد مشروع Vite عادة build: npm run build ومخرج dist. مشروعنا الحالي للموقع التعليمي مختلف: dist فيه الملفات جاهزة أصلًا بدون build. لا تبدل إعداد نشر الموقع التعليمي بإعداد مشروع React بالخطأ.',
  'ملف vercel.json داخل مشروع التخرج يعيد مسارات SPA إلى index.html. افتح رابطًا عميقًا وحدّثه بعد النشر، وراجع تحميل ملفات JavaScript والأصول. preview محلي ليس نشرًا عامًا ولا خادم إنتاجًا.',
  'المراقبة بعد النشر تشمل أخطاء تشغيل، طلبات فاشلة، وتجربة مقاسات، مع عدم جمع بيانات حساسة بلا غرض واضح. احفظ نسخة المصدر وملف lock، وحدد نسخة تستطيع الرجوع لها عند فشل نشر. ميزة جديدة لا تكتمل قبل تجربة سلوكها في النسخة المنشورة.'
 ]),
 RA.part('capstone-graduation','خريطة مراجعة المسار وحدود «الكامل»',[
  'وصلت هنا لأساسيات React والموضوعات العملية التالية لها: نمذجة حالة، reducer/context، Hooks مخصصة، Routing، Server state، Actions، أداء، وصول، تحميل وأخطاء، أنواع، اختبارات، ومفاهيم العرض على السيرفر. تقدر تربطهم في مشروع واحد وتشرح سبب كل قرار بدل حفظ أسماء فقط.',
  'React ونظامها البيئي مش مقرر ثابت ينتهي بكل مكتبة موجودة. Next.js أو React Native أو GraphQL أو Redux Toolkit موضوعات مستقلة تتعلمها عند حاجة مشروعك. هنا شرحنا الحدود والمفاهيم اللي تؤهلك لاختيارها؛ لم ندّعِ أن تعلم React يساوي إتقان كل إطار وخادم وموبايل.',
  'الخطوة التالية العملية: ابنِ نسخة من المشروع بدون فتح الحل، وأضف تعديل عنوان المهمة وفلتر حالة في URL، ثم اكتب اختبارًا للسلوك الجديد. إذا قدرت تحدد ملكية البيانات وحدود الآثار والهوية وتفسير الفشل، فأنت بتستخدم المنهج كفهم قابل للنقل.'
 ])
 ],[
 quiz('أين q الخاصة بالبحث القابل للمشاركة؟',['URL مناسبة لها','في CSS','في key عشوائية'],0,'العنوان مصدر حقيقة مناسب لما نريد مشاركته والتنقل إليه.'),
 quiz('VITE_SECRET آمنة لأنها في .env؟',['لا، قيم VITE_* المعرضة للعميل قابلة للرؤية','نعم دائمًا','لو اسمها طويل'],0,'متغير عميل مش مكان سر خدمة.'),
 quiz('لماذا build وحدها لا تكفي؟',['لا تثبت كل تفاعل وطلب ومسار منشور','لأنها لا تقرأ كودًا','يجب حذف الاختبارات'],0,'التشغيل والاختبار لهما أدلة مختلفة عن فحص التحويل والأنواع.'),
 quiz('المهام في هذا المشروع تتزامن بين الأجهزة؟',['لا، حفظ محلي فقط','نعم مع أي Context','نعم عبر queryKey'],0,'النطاق معلن؛ وجود Router أو Query لصفحة أخرى لا يضيف Backend للمهام.')
 ],[
 task('أضف انتقال تعديل العنوان','مدد Action وإضافة case تغير عنوان المهمة من غير تغيير id أو done. اكتب اختبارًا يثبت حفظ بقية الخواص.',`// Add to Action union:
// | { type: 'renamed'; id: string; title: string }
// Add to reducer switch:
case 'renamed': {
  const title = action.title.trim();
  if (title.length < 3 || title.length > 80) return state;
  return state.map(task => task.id === action.id ? { ...task, title } : task);
}`,'تعديل types.ts وtasks.ts',['العنوان يتحقق','هوية ثابتة','الأصل لا يتغير','اختبار للتغيير']),
 task('خطة ترقية لـBackend','اكتب مسؤوليات واجهة مهام حقيقية قبل توصيلها. لا تعتبر التخزين المحلي أو user في المتصفح مصادقة.',`GET /tasks: جلسة صالحة، نتائج تخص المستخدم، تحقق query.
POST /tasks: تحقق title وصلاحية الإنشاء، id مؤكد من الخدمة.
PATCH /tasks/:id: تحقق ملكية المورد وقيم التعديل.
DELETE /tasks/:id: تحقق ملكية ثم نتيجة واضحة.
الواجهة: query keys مع نطاق المستخدم، pending/error، إبطال cache بعد التأكيد.
الخروج: إزالة بيانات خاصة ومنع عرض نسخة حساب سابق.`,'تصميم ترقية وليس خادمًا منفذًا',['هوية وتفويض على الخادم','شكل استجابة واضح','فشل وإعادة محاولة','لا أسرار في العميل'])
 ],[['بناء Vite','https://vite.dev/guide/build'],['المتغيرات البيئية','https://vite.dev/guide/env-and-mode'],['نشر Vite على Vercel','https://vercel.com/docs/frameworks/frontend/vite']]);

// Keep the original eight lessons stable; link the old end to the continuation.
const foundationEnd=courses.react.lessons[7].sections.find(s=>s.id==='next');
if(foundationEnd)foundationEnd.html+=note('المسار مكمل بعد الأساسيات','الدروس من ٩ إلى ٢٠ بتكمل المواضيع العملية والمتقدمة. ابدأ بـ <a href="#learn/react/8">إدارة الحالة بـReducer وContext</a> وبعدها امشي بالترتيب لحد مشروع التخرج.');
courses.react.desc='من أول Components وState لحد إدارة الحالة والتنقل وبيانات السيرفر والاختبارات ومشروع متكامل.';
