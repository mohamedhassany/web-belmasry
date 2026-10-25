/* Lessons 13–16: Actions, performance, DOM integration and resilience. */
RA.chapter('فورمات React الحديثة: Actions وuseOptimistic',
 'نبني دورة إرسال واضحة، نعرض انتظارًا وأخطاء، ونتعلم أدوات React 19 من غير خلط فعل المتصفح بوظيفة على الخادم.',[
 RA.part('form-lifecycle','العقد: مدخلات ثم تحقق ثم معالجة ثم نتيجة',[
  'الفورم لا تكتمل بمجرد وصول onClick. حدّد الحقول وأسماء name، والتحقق، ومتى تمنع إرسالًا متكررًا، وما تظهره عند فشل متوقع أو غير متوقع. اربط label بالحقول، ورسالة الخطأ بالـid المناسب. الطلب المرسل للخادم يحتاج تحققًا وصلاحيات عنده حتى لو واجهتك منعت قيمًا غير صالحة.',
  'Controlled input تخلي value في state، ومفيدة للمعاينة المباشرة وربط عدة حقول. Uncontrolled input تحتفظ بالقيمة في DOM وتقرأها وقت الإرسال؛ ده خيار صحيح للفورمات المناسبة، وليس أقل جودة تلقائيًا. FormData واجهة تجمع القيم المسماة من النموذج، وقد ترجع string أو File أو null، فلا تفترض نوعًا قبل الفحص.',
  'أمثلة هذا الدرس تعتمد React 19 أو أحدث. action كدالة على form جزء من React، وServer Function وظيفة خاصة ببيئة إطار يدعمها؛ نفس اللفظ لا يعني أن أي دالة async اتنقلت للسيرفر. في Vite متصفحي عادي الدالة هنا تعمل في المتصفح.'
 ]),
 RA.part('action-state','useActionState: نتيجة الإرسال جزء من الحالة',[
  'useActionState تستقبل دالة معالجة وقيمة بداية، وترجع state وformAction وisPending. الدالة تأخذ previousState أولًا ثم payload مثل FormData؛ نسيان الوسيط الأول يخليك تقرأ formData من المكان الغلط. اربط الدالة الراجعة بـaction على form علشان سياق Action وحالة الانتظار يشتغلوا.',
  'هنعيد أخطاء التحقق المتوقعة كبيانات واضحة بدل رمي استثناء يعطّل النموذج. throw مناسب لفشل غير متوقع تريد أن تعالجه Error Boundary في السياق المناسب. الدالة async هنا تؤخر نجاحًا محليًا فقط، ولا تحفظ على الإنترنت.',
  'عند انتهاء Action بنجاح وفق دورة React، الحقول غير المتحكم فيها قد تعود لافتراضياتها. إرجاع بيانات خطأ هو اكتمال عادي للدالة، فلو لازم تحتفظ بما كتبه المستخدم صمّم ذلك صراحة: حقول controlled أو قيم مرتجعة وإعداد مناسب لإعادة العرض، لا تفترض أن عدم وجود نجاح منطقي يمنع reset تلقائيًا.'
 ],`import { useActionState } from 'react';

async function saveTitle(previous, formData) {
  const raw = formData.get('title');
  const title = typeof raw === 'string' ? raw.trim() : '';
  if (title.length < 3) return { ok: false, message: 'اكتب ٣ حروف على الأقل.' };
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ok: true, message: 'تمت معالجة: ' + title };
}
export default function App() {
  const [state, formAction, pending] = useActionState(saveTitle, { ok: false, message: '' });
  return <form action={formAction}>
    <label htmlFor="title">العنوان</label>
    <input id="title" name="title" minLength={3} required aria-describedby="result" />
    <button disabled={pending}>{pending ? 'بنحفظ...' : 'حفظ تجريبي'}</button>
    <p id="result" role="status">{state.message}</p>
  </form>;
}`),
 RA.part('form-status','زر الإرسال يعرف حالة form الأب',[
  'useFormStatus من react-dom، مش react. تقرأ حالة أقرب form أب ضمن الشجرة. لازم المكون المستدعي يبقى ابنًا حقيقيًا للفورم، مش نفس الدالة اللي لسه هترجع form تحتها. الفصل ده هو سبب وضع SubmitButton كمكون داخل النموذج.',
  'pending تعني أن الإرسال التابع لهذه form قيد المعالجة. لو عندك عدة فورمات كل واحدة يمكنها زر مستقل. بيانات status مثل data قد تكون null قبل وجود إرسال، فلا تقرأ منها بدون فحص. لا تعرض محتوى حساسًا فقط لعمل معاينة انتظار.',
  'في مثال useActionState السابق isPending كافية؛ مش مطلوب تستخدم الطريقتين معًا. useFormStatus مفيدة لما زر مشترك عايز يقرأ حالة النموذج المحيط بدون تمرير prop كل مرة.'
 ],`import { useFormStatus } from 'react-dom';
export function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>
    {pending ? 'جاري التنفيذ...' : 'إرسال'}
  </button>;
}
// Use inside the form, not above it:
// <form action={formAction}><input name="title" /><SubmitButton /></form>`,'src/SubmitButton.jsx'),
 RA.part('optimistic-ui','نتيجة مؤقتة قبل تأكيد المصدر',[
  'useOptimistic تسمح بعرض قيمة متوقعة أثناء Action، مع بقاء قيمة أساس مؤكدة. المحدث يجب أن يُستدعى داخل Action أو Transition مناسبة. لا تناديه أثناء render، ولا تعدل القيمة الأصلية حتى تتأكد العملية أو تطبق سياسة واضحة.',
  'عند نجاح العملية حدّث الأساس بالنتيجة المؤكدة. عند الفشل أبقِ الأساس واعرض الخطأ، فالتوقع المؤقت لا يصبح حقيقة. لو فيه تحديثات متزامنة استخدم reducer تفاؤلي يحسب فوق الأساس الحالي بدل نسخة قديمة. التوقع في الواجهة ليس استرجاعًا لأي تعديل وصل فعليًا للخادم.',
  'المثال لا يختبر تزامن مستخدمين ولا شبكة؛ هو عداد لتوضيح دورة التفاؤل. لتجربة الفشل غيّر shouldFail إلى true داخل fakeSave. في خدمة حقيقية رد الخادم هو مصدر التأكيد، وليس مجرد انتهاء setTimeout.'
 ],`import { useOptimistic, useState, useTransition, startTransition } from 'react';
async function fakeSave() {
  await new Promise(resolve => setTimeout(resolve, 700));
  const shouldFail = false;
  if (shouldFail) throw new Error('تعذر الحفظ');
}
export default function OptimisticCounter() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const [pending, begin] = useTransition();
  const [visible, addOptimistic] = useOptimistic(count, (current, delta) => current + delta);
  function add() {
    setError('');
    begin(async () => {
      addOptimistic(1);
      try {
        await fakeSave();
        startTransition(() => setCount(c => c + 1));
      } catch {
        setError('الحفظ ماكملش، العدد المؤكد لم يتغير.');
      }
    });
  }
  return <section><p>العدد: {visible}</p>
    <button disabled={pending} onClick={add}>زود واحد</button>
    <p role="status">{pending ? 'بنأكد التغيير...' : error}</p></section>;
}`,'src/OptimisticCounter.jsx'),
 RA.part('forms-complex','الفورم الكبيرة والملفات ومنع فقد البيانات',[
  'لو النموذج فيه حقول كتير وحقول متداخلة وقواعد مترابطة، مكتبة فورم مثل React Hook Form ومخطط تحقق مناسب قد يقلل تكرارًا. دي أدوات خارج React، واستخدامها لا يلغي الحاجة لفهم name والقيمة والأخطاء والانتظار. ابدأ بعقد واضح ثم اختر أداة، مش العكس.',
  'حقول الملفات تُقرأ من files أو FormData، ولا تتحكم في مسار الملف بقيمة نصية كما تفعل مع input عادية. حجم الملف ونوعه يتحقق منهما الخادم كذلك، وaccept تلميح اختيار وليس حماية. إرسال ملف يحتاج سياسة خدمة وتخزين وصلاحيات لا يوفرها React نفسها.',
  'لو المستخدم عنده تغييرات غير محفوظة، فكر في سياسة تنقل ورسالة مناسبة حسب Router والنمط. لا تضيف تحذيرًا عند كل خروج بلا داعٍ، ولا توعد بحفظ إذا كان التخزين محليًا مؤقتًا. اختبر الإرسال مرتين، الفشل، العودة بعد النجاح، والتركيز بعد ظهور خطأ.'
 ])
 ],[
 quiz('وسيطا دالة useActionState في هذا المثال؟',['previousState ثم FormData','FormData فقط دائمًا','event ثم CSS'],0,'الدالة تستقبل الحالة السابقة ثم payload؛ النوع يعتمد على جهة استدعاء Action.'),
 quiz('useFormStatus تُستدعى أين؟',['داخل مكون ابن لـform المطلوبة','فوق كل Forms لتقرأها كلها','داخل reducer'],0,'تقرأ أقرب form أعلى في شجرة العرض.'),
 quiz('useOptimistic تغير الحقيقة المؤكدة تلقائيًا؟',['لا، لازم تأكيد المصدر وتحديث الأساس','نعم تحفظ database','تغير localStorage دائمًا'],0,'التوقع مؤقت، ورفض الخادم له مسار واضح.'),
 quiz('action async في Vite وحدها تعتبر Server Function؟',['لا، تحتاج بيئة وإطار يدعمان ذلك','نعم بسبب async','نعم بسبب الاسم'],0,'async لا تنقل مكان التنفيذ إلى الخادم.')
 ],[
 task('تحقق قابل للاختبار','استخرج فحص العنوان لدالة نقية ترجع رسالة خطأ أو نصًا فارغًا. استخدمها قبل التأخير في saveTitle.',`export function validateTitle(value) {
  if (typeof value !== 'string') return 'قيمة نصية مطلوبة.';
  if (value.trim().length < 3) return 'اكتب ٣ حروف على الأقل.';
  if (value.trim().length > 80) return 'الحد الأقصى ٨٠ حرفًا.';
  return '';
}`,'src/validateTitle.js',['تتعامل مع النوع','لا آثار جانبية','اختبر الحدود 2 و3 و80 و81']),
 task('نموذج يحتفظ بالنص بعد رفضه','اكتب نموذجًا controlled مع submit تقليدي محلي يتحقق ولا يفضّي الحقل إلا بعد نجاح الفحص.',`import { useState } from 'react';
import { validateTitle } from './validateTitle.js';
export default function RetainedForm() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  function submit(e) {
    e.preventDefault();
    const error = validateTitle(title);
    if (error) { setMessage(error); return; }
    setMessage('تم قبول النص محليًا.'); setTitle('');
  }
  return <form onSubmit={submit}><label htmlFor="name">عنوان</label>
    <input id="name" value={title} onChange={e => setTitle(e.target.value)} aria-describedby="msg" />
    <button>تحقق</button><p id="msg" role="status">{message}</p></form>;
}`,'src/RetainedForm.jsx',['النص يبقى عند الخطأ','اسم ووصف للحقل','لا ادعاء حفظ على خادم'])
 ],[['useActionState','https://react.dev/reference/react/useActionState'],['useFormStatus','https://react.dev/reference/react-dom/hooks/useFormStatus'],['useOptimistic','https://react.dev/reference/react/useOptimistic']]);

RA.chapter('الأداء: نقيس ثم نحسّن حساب الواجهة',
 'نفهم هوية القيم، memo وuseMemo وuseCallback، والفرق بين تأخير الحساب وتجميع الطلبات، ودور React Compiler.',[
 RA.part('profile-first','حدد بطء التفاعل ومصدره قبل إضافة Hooks',[
  'وقت التحميل، ووقت استجابة الكتابة، وعدد مرات render، وحجم JavaScript مش نفس القياس. قد تكون شبكة بطيئة أو loop مكلفة أو آلاف عناصر DOM. زيادة عدد renders ليست دليلًا وحدها على بطء؛ حساب صغير سريع قد يكون أرخص من مقارنة معقدة لمنعه.',
  'ابدأ بأدوات المتصفح وReact DevTools Profiler. سجل تفاعلًا فعليًا وحدد الجزء الأبطأ. بنية state مهمة: وضع قيمة كتابة محلية أعلى شجرة ضخمة يجبر حسابات أكثر مما تحتاجه. نقل الحالة قرب الاستخدام قد يحل المشكلة قبل memoization.',
  'اختبر نسخة مناسبة للإنتاج؛ وضع التطوير وStrictMode قد يضيفا عملًا للفحص. لا تقارن قياسين على جهازين أو بيانات مختلفة كأنهما نفس الحالة. إصلاح صحة البيانات وتنظيف Effects سابق لأي تحسين حساب.'
 ]),
 RA.part('memo-values','memo للمكونات وuseMemo للقيم',[
  'memo تلف Component لتسمح بتجاوز حساب بسبب props غير المتغيرة وفق المقارنة الافتراضية المناسبة. لا تمنع تحديث state داخلها أو context التي تستهلكها. useMemo تحفظ نتيجة حساب بين renders طالما الاعتمادات مناسبة، وليست مكانًا لآثار جانبية أو حفظ دائم.',
  'كل object أو array جديدة هوية جديدة حتى لو المحتوى متشابه. لو memo تتلقى items ناتجة من filter جديدة في كل مرة، تمرير مرجع ثابت عند ثبات المدخلات قد يساعد. لكن تصغير المصفوفة أو نقل الحالة أحيانًا أنسب. لا تعتمد على بقاء cache لتصحيح منطق؛ التحسين يجب أن يترك النتيجة صحيحة لو أعيد الحساب.',
  'المثال يربط حساب visible بعنصري البيانات والبحث. غير state أخرى مستقلة وشوف Profiler قبل وبعد. مجرد استخدام useMemo مع جمع عددين لن يعطي تحسينًا مهمًا غالبًا، وقد يضيف تعقيدًا.'
 ],`import { memo, useMemo, useState } from 'react';
const data = Array.from({ length: 500 }, (_, i) => ({ id: i, title: 'Item ' + i }));
const Results = memo(function Results({ items }) {
  return <ul>{items.map(item => <li key={item.id}>{item.title}</li>)}</ul>;
});
export default function App() {
  const [query, setQuery] = useState('');
  const [compact, setCompact] = useState(false);
  const visible = useMemo(() => data.filter(item => item.title.includes(query)), [query]);
  return <main><label>بحث <input value={query} onChange={e => setQuery(e.target.value)} /></label>
    <button onClick={() => setCompact(c => !c)}>تغيير المسافة</button>
    <div style={{ lineHeight: compact ? 1.4 : 2 }}><Results items={visible} /></div>
  </main>;
}`),
 RA.part('callback-identity','useCallback تثبت الدالة وليس كل شيء جواها',[
  'useCallback ترجع هوية دالة قابلة لإعادة الاستخدام عند ثبات dependencies. لا تنفذ الدالة فورًا ولا تجعل حسابها أسرع بحد ذاتها. تفيد عند تمرير callback لمكون memo أو واجهة اعتماد تتأثر بالهوية. لو الابن لا يستفيد من ثبات الهوية، ربما لا تحتاجها.',
  'اكتب كل اعتماد تفاعلي تقرأه. Updater تسمح بعدم قراءة state الحالية في حساب قائم على السابق، فتقلل اعتمادًا حقيقيًا بطريقة سليمة. لا تحذف متغيرًا مستخدمًا من القائمة لمجرد تثبيت الهوية؛ ستحتفظ بدالة تقرأ لقطة قديمة.',
  'حتى لو عندك handleSelect ثابتة، كتابة onClick={()=&gt;handleSelect(id)} في الأب تنشئ دالة جديدة لذلك prop. لا تحول كودًا بسيطًا لشبكة callbacks بهدف نظري؛ قِس وحدد مكونًا يستفيد فعلًا من الثبات.'
 ],`import { useCallback, useState } from 'react';
export function useSelection() {
  const [selectedIds, setSelectedIds] = useState([]);
  const select = useCallback(id => {
    setSelectedIds(previous => previous.includes(id) ? previous : [...previous, id]);
  }, []);
  return { selectedIds, select };
}`,'src/hooks/useSelection.js'),
 RA.part('transitions','أولوية التحديث: كتابة فورية وحساب تابع',[
  'useTransition تعطي isPending وstartTransition لتعليم تحديثات غير عاجلة. React يمكنها مقاطعة حساب مناسب وإعادة المحاولة لتبقى التفاعلات الأهم مستجيبة. هي ليست خيط تنفيذ منفصلًا؛ عملية CPU طويلة متزامنة خارج عمل React ما زالت تشغل الخيط.',
  'لا تستخدم Transition للتحكم في قيمة input النصية نفسها؛ الكتابة يجب أن تكون فورية. useDeferredValue تسمح بأن تتأخر قيمة مشتقة عن المدخل الأحدث أثناء ضغط الحساب. الفرق عن Debounce: لا تختار مدة ثابتة، ولا توقف طلبات الشبكة تلقائيًا. عرّف هل الناتج القديم ما زال ظاهرًا وأوضح أنه يجري تحديثه.',
  'التحديث بعد await داخل تدفق متقدم قد يحتاج startTransition أخرى حسب API والإصدار؛ راجع القيود الرسمية. عدم blocking لا يعني ترتيب طلبات أو rollback تلقائيًا. لا تستعمله بدل حماية من race condition.'
 ],`import { useDeferredValue, useState, memo } from 'react';
const items = Array.from({ length: 500 }, (_, i) => 'نتيجة ' + i);
const Results = memo(function Results({ query }) {
  return <ul>{items.filter(x => x.includes(query)).map(x => <li key={x}>{x}</li>)}</ul>;
});
export default function App() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const stale = query !== deferred;
  return <><label>بحث <input value={query} onChange={e => setQuery(e.target.value)} /></label>
    {stale && <p role="status">بنحدّث النتائج...</p>}
    <div style={{ opacity: stale ? 0.6 : 1 }}><Results query={deferred} /></div></>;
}`),
 RA.part('compiler-and-scale','Compiler، تقسيم الحزم، وعرض قوائم ضخمة',[
  'React Compiler أداة وقت البناء لتحسين حسابات مناسبة تلقائيًا وفق قواعد React. ليست useMemo جديدة تستدعيها، وليست مفعّلة في أي مشروع لمجرد تحديث حزمة react. تفعيلها يعتمد على بيئة البناء وإعداداتها، والتبنّي يكون وفق توثيق الإصدار.',
  'لا تكتب كودًا غير نقي وتنتظر Compiler تصلحه. بعد تفعيلها لا تحذف كل memoization من مشروع حقيقي دفعة واحدة؛ تحقق من الصحة والقياسات. سنشرح lazy لتقسيم ملفات شاشة غير مطلوبة فورًا في درس التحميل والأخطاء.',
  'آلاف عناصر DOM قد تحتاج Virtualization: عرض نطاق مرئي مع مساحة تمرير مناسبة بدل إنشاء كل العناصر. ده قرار تخطيط ووصول، ويحتاج مكتبة أو تصميمًا واضحًا للمقاسات والتركيز. useMemo لا تقلل وحدها عدد nodes المعروضة. واستخدم Web Worker لحسابات مستقلة ثقيلة عند الحاجة؛ واجهات DOM ليست متاحة داخل العامل بنفس الشكل.'
 ])
 ],[
 quiz('هل كل render مشكلة أداء؟',['لا، القياس والتكلفة هما الأساس','نعم لازم تمنعها كلها','فقط لو فيه title'],0,'عدد الاستدعاءات وحده لا يحدد بطء التفاعل.'),
 quiz('useMemo مكان لطلب شبكة أثناء render؟',['لا، حساب نقي لتحسين الأداء','نعم لو []','نعم مع memo'],0,'طلب الشبكة أثر، وليس حساب نتيجة نقيًا.'),
 quiz('useDeferredValue تعمل Debounce لمدة ثابتة؟',['لا، أولوية حساب وليست مدة ثابتة','نعم 300ms دائمًا','تلغي fetch تلقائيًا'],0,'جدولة React مختلفة عن توقيت debounce وإلغاء الشبكة.'),
 quiz('React Compiler مفعلة بمجرد تثبيت react؟',['لا، أداة بناء تحتاج إعدادًا مناسبًا','نعم في كل مشروع','فقط لو CSS موجودة'],0,'راجع بيئة البناء والإعداد الرسمي.')
 ],[
 task('قيمة مشتقة بدون state ثانية','اكتب عداد completed مشتقًا من tasks مباشرة. لا تضف useMemo إلا لو قياس الحساب يبررها.',`const completed = tasks.filter(task => task.done).length;
const remaining = tasks.length - completed;`,'داخل Component',['نتيجة صحيحة بعد الحذف','لا Effect لنسخ العدادات']),
 task('افحص اعتماد callback','اكتب دالة اختيار تتجنب تكرار id وتعتمد على الحالة السابقة، ثم فسر ليه [] مناسبة هنا.',`const select = useCallback(id => {
  setSelected(previous => previous.includes(id) ? previous : [...previous, id]);
}, []);`,'مقطع مع useState/useCallback',['لا قراءة selected من الخارج','لا تعديل مباشر','يفسر أن setSelected ثابتة'])
 ],[['أداة القياس','https://react.dev/reference/react/Profiler'],['useMemo','https://react.dev/reference/react/useMemo'],['useDeferredValue','https://react.dev/reference/react/useDeferredValue'],['React Compiler','https://react.dev/learn/react-compiler/introduction']]);

RA.chapter('واجهات متاحة: Refs وPortals والحوار',
 'نبني مكونات لها عقد واضح، نصل للـDOM عند الحاجة، ونضبط التركيز والهوية والمحتوى اللي يظهر فوق الصفحة.',[
 RA.part('component-contract','مكوّن قابل لإعادة الاستخدام بدون غموض',[
  'Component جيدة لها props محددة، وتتجنب عشرات flags التي تنتج حالات بصرية متعارضة. بدل isSmall وisLarge معًا، استخدم size بقيم واضحة. افصل محتوى children عن إعدادات السلوك. اكتب ما المطلوب وما الافتراضي وما الذي قد يتغير بعد البداية.',
  'Controlled component تأخذ القيمة ومعالج طلب التغيير من الأب؛ uncontrolled قد تملك البداية محليًا. لا تخلط المصدرين من غير قاعدة. كومبوننت Accordion مثلًا لو الأب يملك openedId، الابن لا يخزن نسخة ثانية ثم يحاول مزامنتها بـEffect.',
  'تجميع عناصر مترابطة عبر Compound components نمط ممكن، لكنه يحتاج قواعد سياق وأسماء ومسؤوليات واضحة. لا تبدأ بنظام مكونات معقد قبل ظهور تكرار فعلي. الدلالة الصحيحة للزر والرابط والحقل جزء من العقد، مش تنسيق إضافي بعد الانتهاء.'
 ]),
 RA.part('id-and-focus','useId للربط وليس لهوية البيانات',[
  'useId تنتج معرّفًا مناسبًا لربط حقول ومعلومات وصول عبر نسخ متعددة من المكون. استخدمه للـid وhtmlFor وaria-describedby. لا تستخدمها key لقائمة؛ مفاتيح القائمة لازم تأتي من البيانات نفسها.',
  'useRef تمسك عنصرًا بعد commit. التركيز يتم في handler أو Effect مناسبة، لا أثناء render. لو واجهتك تحتاج قراءة قياس ثم تعديلًا قبل الرسم قد يلزم useLayoutEffect بحذر؛ هي تمنع الرسم أثناء عملها، فتجنب الحساب الثقيل وضع بديلًا للعرض على الخادم الذي لا يملك layout متصفح.',
  'التركيز لازم يمشي مع الفعل المتوقع. بعد إضافة عنصر قد ترجع لحقل الإدخال. عند إغلاق حوار ارجع لزر فتحه إذا ما زال موجودًا. لا تنقل التركيز في كل render لأن ده يقطع استخدام لوحة المفاتيح.'
 ],`import { useId } from 'react';
export default function TextField({ label, error = '', ...inputProps }) {
  const id = useId();
  const errorId = id + '-error';
  return <div>
    <label htmlFor={id}>{label}</label>
    <input {...inputProps} id={id} aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId : undefined} />
    {error && <p id={errorId}>{error}</p>}
  </div>;
}`,'src/TextField.jsx'),
 RA.part('ref-api','تمرير ref وواجهة أوامر صغيرة',[
  'في React 19 Function Component يمكنها استقبال ref كـprop. في إصدارات أقدم forwardRef كانت واجهة التمرير المعتادة؛ لا تخلط مثالًا يتطلب 19 مع 18 بدون تعديل. الهدف السماح بعملية محدودة يحتاجها الأب، مش كشف كل تفاصيل DOM من كل مكون.',
  'useImperativeHandle تحدد ما يراه الأب عبر ref. بدل كشف عنصر كامل، ممكن ترجع focus فقط. القائمة dependency تطابق ما تقرأه الدالة في الواجهة. لا تستخدم المنطق الآمر بدل props في كل شيء؛ فتح/قفل واجهة غالبًا يظل declarative بمدخل open.',
  'Refs ليست وسيلة مشاركة حالة ظاهرة: قيمة تتغير وتحتاج تحديث الشاشة يجب أن تكون state أو مصدر اشتراك مناسب. التلاعب بنص عنصر تديره React مباشرة قد يجعل البيانات والـDOM متعارضين.'
 ],`import { useImperativeHandle, useRef } from 'react';
export default function SearchInput({ ref }) {
  const input = useRef(null);
  useImperativeHandle(ref, () => ({
    focus() { input.current?.focus(); }
  }), []);
  return <label>بحث <input ref={input} /></label>;
}`,'src/SearchInput.jsx — React 19+'),
 RA.part('portals','Portal تغيّر مكان DOM وليس سياق React',[
  'createPortal من react-dom تعرض children داخل node أخرى في DOM، مع بقاء العلاقة في شجرة React. props وContext وانتشار أحداث React يتبعوا الشجرة المنطقية؛ مكان العنصر في HTML لا يعني أنه فقد سياقه.',
  'تستخدمها لطبقة أو نافذة عندما تحتاج فصل موضع DOM. لكن Portal لا تعطي وحدها حجز تركيز أو إغلاق Escape أو اسم حوار أو منع تفاعل الخلفية. ولا تجعل أي z-index يهزم كل سياق. استخدم عنصر dialog الأصلي أو أداة وصول موثوقة وفق حاجتك.',
  'الهدف لازم يكون node موجودة مثل document.body في المتصفح. لا تقرأ document أثناء render على الخادم؛ لو المثال متصفحي صرّح ببيئته، وفي SSR اجعل نقطة الدمج بعد التركيب أو وفق آلية إطارك.'
 ]),
 RA.part('native-dialog','حوار حقيقي له اسم وزر إغلاق',[
  'المثال التالي متصفحي على React 19. dialog.showModal يفعّل السلوك المشروط الأصلي في المتصفحات الحديثة، مع واجهة إغلاق Escape. لا تكتفِ بوضع attribute open لو عايز نفس السلوك modal. React تملك requestedOpen، والحدث onClose يبلغها عن إغلاق من المتصفح.',
  'useEffect توفق بين prop وحالة العنصر وتتحقق من open قبل استدعاء showModal أو close. ده مثال مشروع لاستخدام Effect مع واجهة DOM خارج حساب JSX. close قد يطلق حدثًا؛ لو الأب عايز يرفض إغلاقًا أو ينتظر حفظًا لازم تصمم عقدًا أوسع بدل دوامة state.',
  'اختبر Tab وShift+Tab وEscape واسم الحوار وإعادة التركيز. المثال لا يقفل عند أي ضغط داخل المحتوى، ولا يحتاج استماعًا عامًا على كل الصفحة. التنظيف يغلق النسخة عند إزالتها بدون إنشاء مورد دائم.'
 ],`import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
function ConfirmDialog({ open, onClose }) {
  const dialog = useRef(null);
  const heading = useId();
  useEffect(() => {
    const node = dialog.current;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
    return () => { if (node.open) node.close(); };
  }, [open]);
  return createPortal(<dialog ref={dialog} aria-labelledby={heading} onClose={onClose}>
    <h2 id={heading}>تفاصيل المهمة</h2><p>المحتوى هنا.</p>
    <button onClick={() => dialog.current.close()}>إغلاق</button>
  </dialog>, document.body);
}
export default function App() {
  const [open, setOpen] = useState(false);
  const opener = useRef(null);
  function close() { setOpen(false); opener.current?.focus(); }
  return <><button ref={opener} onClick={() => setOpen(true)}>افتح التفاصيل</button>
    <ConfirmDialog open={open} onClose={close} /></>;
}`),
 RA.part('accessible-patterns','الواجهة الكاملة تشمل لوحة المفاتيح',[
  'استخدم button للأفعال وa للانتقال، وحافظ على focus-visible. للأزرار الأيقونية اسم متاح واضح. aria-expanded تصف فتح قسم قابل للتوسيع، وaria-controls تربط العنصر بالمحتوى عند ملاءمة النمط. ARIA تصف المعنى لكنها لا تضيف تنفيذ لوحة المفاتيح وحدها.',
  'الإخفاء البصري غير إزالة التفاعل: opacity:0 قد تترك عنصرًا في مسار التركيز، وPortal لا تجعل الخلفية inert. لا تكرر aria-live على كل نص متغير؛ تحديثات مهمة مثل نتيجة حفظ أو خطأ تحتاج إعلانًا موجزًا، والحركة التوضيحية يمكن أن تظل غير حية لقارئ الشاشة.',
  'اكتب ترتيب DOM منطقيًا ثم نسق الشكل. تبديل ترتيب العناصر بـCSS لا يضمن تغيير ترتيب التنقل. اختبر نصًا طويلًا ومقاس هاتف وتكبيرًا، واحتفظ بإمكانية إيقاف الحركة المستمرة كما نفعل في رسوم الدروس.'
 ])
 ],[
 quiz('useId بديل عن id من بيانات القائمة؟',['لا، مناسبة لربط عناصر الوصول','نعم لكل key','فقط مع Math.random'],0,'هوية السجل من البيانات، وربط label استخدام مختلف.'),
 quiz('Portal تنشئ تلقائيًا Focus trap؟',['لا، مسؤولة عن موضع DOM','نعم دائمًا','تلغي كل أحداث React'],0,'الوصول والسلوك يحتاجان عنصرًا أو نمطًا مناسبًا.'),
 quiz('ref كـprop في المثال تحتاج أي أساس؟',['React 19+','أي إصدار منذ 2013','CSS Grid'],0,'تختلف صيغة تمرير refs عن الأمثلة القديمة بـforwardRef.'),
 quiz('useLayoutEffect مناسبة لكل طلب شبكة؟',['لا، لمنطق قياس متزامن ضروري قبل الرسم','نعم أسرع fetch','بديل useState'],0,'عملها يحجز الرسم ولا يجعل الشبكة أسرع.')
 ],[
 task('نسختان من حقل مسمى','ركب TextField مرتين بأسماء مختلفة وتأكد أن الضغط على label يركز الحقل الصحيح.',`import TextField from './TextField.jsx';
export default function Fields() {
  return <section><TextField label="الاسم" name="name" />
    <TextField label="البريد" name="email" type="email" /></section>;
}`,'src/Fields.jsx',['id مختلفة','label مرتبطة','لا key عشوائية']),
 task('أضف زر تركيز من الأب','استخدم SearchInput وref في الأب واستدع focus من حدث ضغط.',`import { useRef } from 'react';
import SearchInput from './SearchInput.jsx';
export default function SearchPage() {
  const field = useRef(null);
  return <><SearchInput ref={field} />
    <button onClick={() => field.current?.focus()}>روح لحقل البحث</button></>;
}`,'src/SearchPage.jsx',['النداء في handler','مرجع قد يكون null','الواجهة تعرض فقط ما يلزم'])
 ],[['معرفات الوصول','https://react.dev/reference/react/useId'],['createPortal','https://react.dev/reference/react-dom/createPortal'],['واجهة ref محددة','https://react.dev/reference/react/useImperativeHandle'],['عنصر dialog','https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog']]);

RA.chapter('تحميل وأخطاء: lazy وSuspense وError Boundary',
 'نقسم الكود، نحدد انتظار كل منطقة، ونمنع فشل جزء من إسقاط تجربة التطبيق كلها.',[
 RA.part('failure-types','أربع حالات مختلفة لا تجمعهم تحت Spinner واحدة',[
  'انتظار تحميل ملف JavaScript مختلف عن انتظار API، ورفض تحقق في form مختلف عن استثناء أثناء render. كل سبب له مكان معالجة. Spinner لا تعالج خطأ، ورسالة خطأ بلا إعادة محاولة لا تعالج كل انتظار طويل.',
  'Suspense تتعامل مع مصادر متوافقة تعلق أثناء حساب React، مثل lazy أو تكامل بيانات يدعمها. fetch داخل useEffect لا يفعّل Suspense لمجرد وجود fallback. الحالات اليدوية تظل تقرأ loading وerror، أو تختار API suspense موثقة من مكتبة البيانات.',
  'الحدود توضع حسب مسؤولية وتجربة منطقة، لا حول كل فقرة. لو التنقل والهيدر يمكنهما الاستمرار أثناء انتظار تقرير، اجعل الحد حول التقرير. loading لا تعني حذف معلومات قديمة مفيدة من كل التطبيق.'
 ]),
 RA.part('lazy-files','lazy تؤجل طلب كود مكون',[
  'lazy تأخذ دالة import ديناميكي ترجع Promise بموديول، وعادة تحتاج export default للمكون المحمل في هذا المثال. عرّف lazy خارج الدالة حتى لا تُنشئ نوعًا جديدًا مع كل render. Suspense تعرض fallback عند التعليق المناسب.',
  'تقسيم الحزمة يقلل ما يُطلب في البداية إذا لم تكن الشاشة مطلوبة فورًا. لكن عدد ملفات كبير جدًا قد يزيد تعقيد التحميل. اختبر Network على بيانات باردة ودافئة. لا تستخدم التأخير الصناعي في الإنتاج لمجرد استعراض Spinner.',
  'المثال من ملفين مستقلين في src. عدم وجود Reports.jsx أو اختلاف حروف الاسم خطأ تحميل موديول، وليس مشكلة بيانات API.'
 ],`// src/Reports.jsx
export default function Reports() {
  return <section><h2>التقرير</h2><p>تم تحميل ملف الشاشة.</p></section>;
}`,'src/Reports.jsx'),
 RA.part('suspense-boundary','fallback تصف انتظار المنطقة',[
  'fallback واجهة خفيفة ومفهومة. لو فيها مصدر آخر يعلق، قد يصعد الانتظار لحد أعلى. حدود متداخلة تسمح بالكشف التدريجي، لكن لا تضفها لمجرد تفتيت التحميل بصريًا. مع Transitions يمكن الاحتفاظ بمحتوى مكشوف في حالات مناسبة بدل استبداله فورًا.',
  'use API في React الحديثة تستطيع قراءة Promise متوافقة مع Suspense عند تصميم المصدر الصحيح. إنشاء Promise جديدة أثناء كل render في Client Component ليس طريقة كاش بيانات. الأفضل مصدر إطار أو مكتبة يدير الاستقرار والعمر؛ بناء نظام Suspense يدوي للشبكة خارج نطاق مثال البداية.'
 ],`import { lazy, Suspense, useState } from 'react';
const Reports = lazy(() => import('./Reports.jsx'));
export default function App() {
  const [show, setShow] = useState(false);
  return <main><h1>التطبيق</h1>
    <button onClick={() => setShow(true)}>عرض التقرير</button>
    {show && <Suspense fallback={<p role="status">بنحمّل كود التقرير...</p>}>
      <Reports />
    </Suspense>}
  </main>;
}`),
 RA.part('error-boundary','حد يستقبل خطأ في رسم الأبناء',[
  'Error Boundary مكون يعرض fallback عند أخطاء مناسبة في شجرة أبنائه أثناء render ودورات React. الواجهة الأصلية ما زالت تستخدم Class Component لهذه القدرة؛ تعلم الصيغة هنا لا يعني العودة لكتابة كل تطبيقك بالكلاسات. ممكن تستعمل مكتبة حدود موثوقة بدلها.',
  'getDerivedStateFromError تحول حالة الحد لواجهة فشل، وcomponentDidCatch مناسبة للتسجيل في خدمة رصد بعد تنقية البيانات. لا تطبع أسرار المستخدم في تقارير الأخطاء. الحد لا يمسك كل خطأ في event handler أو setTimeout أو طلب منفصل تلقائيًا؛ عالج تلك المسارات في مكانها.',
  'الزر هنا يزيل حالة الخطأ ويعيد محاولة الرسم. لو السبب ما زال موجودًا سيفشل ثانية، وده منطقي. استيراد lazy الفاشل قد يكون مخزنًا حسب سلوك الواجهة والموديول؛ reset ليست ضمانًا لإعادة تنزيل حزمة حذفها نشر قديم. خطة إعادة تحميل أو تحديث آمن للمصدر قد تكون مطلوبة.'
 ],`import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error, info) {
    console.error('Render failed', error.message, info.componentStack);
  }
  render() {
    if (this.state.failed) return <section role="alert">
      <h2>الجزء ده ما اشتغلش.</h2>
      <button onClick={() => this.setState({ failed: false })}>حاول تعرضه تاني</button>
    </section>;
    return this.props.children;
  }
}`,'src/ErrorBoundary.jsx'),
 RA.part('error-reset','استرجاع منطقة سليمة وحدود واضحة',[
  'لف المنطقة بـErrorBoundary وحط Suspense المناسبة داخلها أو حسب تصميمك. Error boundary تعالج الفشل، وSuspense تعالج الانتظار؛ الأولى مش بديل الثانية. مثال: حد حول شاشة التقرير يسمح ببقاء التنقل قابلًا للاستخدام.',
  'لو مسار جديد يحتاج بداية جديدة للحد، يمكن key بهوية المسار المناسبة لإعادة تركيبه. ده استخدام مقصود للهوية، لا random في كل render. أخطاء network المتوقعة قد تعرض داخل الشاشة مع retry، بدل رميها كلها لحد التطبيق العام.',
  'اختبر فشل طلب ونجاحه وفشل رسم مكون وبقاء جزء آخر من الصفحة عاملًا. اختبار error boundary في التطوير قد يصاحبه رسائل Console أو overlay من أدوات البناء؛ افهم الفرق بين أداة التشخيص وتجربة نسخة الإنتاج.'
 ],`<ErrorBoundary>
  <Suspense fallback={<p>تحميل...</p>}>
    <Reports />
  </Suspense>
</ErrorBoundary>`,'مقطع داخل App مع imports المناسبة')
 ],[
 quiz('fetch داخل useEffect يفعّل Suspense دائمًا؟',['لا، تحتاج مصدرًا متوافقًا','نعم مع أي Promise','لو فيه loading فقط'],0,'وجود async لا يساوي تعليقًا تديره Suspense أثناء render.'),
 quiz('مكان تعريف lazy المناسب؟',['خارج Component','جوه كل onClick','داخل reducer'],0,'التعريف خارجها يحافظ على هوية مستقرة.'),
 quiz('Error Boundary تمسك أي خطأ داخل setTimeout تلقائيًا؟',['لا، عالج المسار غير المتزامن مناسبًا','نعم دائمًا','فقط مع CSS'],0,'حدود الرسم لا تمثل try/catch لكل شغل خارج دورة React.'),
 quiz('reset تضمن أن السبب اتصلح؟',['لا، تعيد المحاولة وقد يفشل ثانية','نعم','تلغي كل الشبكة'],0,'استرجاع العرض يحتاج معالجة السبب أو قبول إعادة المحاولة.')
 ],[
 task('فشل متحكم فيه أثناء render','اكتب مكونًا يرمي خطأ بناءً على prop، وضع التحكم في الأب خارج ErrorBoundary. اجعل زرًا يزيل السبب قبل إعادة المحاولة.',`function Report({ fail }) {
  if (fail) throw new Error('فشل تجريبي');
  return <h2>التقرير اشتغل</h2>;
}
// In App, keep fail state outside the boundary:
// <button onClick={() => setFail(false)}>إزالة سبب الفشل</button>
// <ErrorBoundary><Report fail={fail} /></ErrorBoundary>`,'مقطع توضيحي مع useState في الأب',['التحكم خارج الحد','إزالة السبب قبل retry','بقية الصفحة تعمل']),
 task('حدود الانتظار والخطأ','ارسم شجرة للهيدر والشاشة، خلي الهيدر خارج حدود فشل وتحميل الشاشة.',`App
├── Header
└── ErrorBoundary
    └── Suspense
        └── Reports (lazy)`,'خطة شجرة',['الانتظار لا يخفي Header','fallbacks لها وظائف مختلفة'])
 ],[['lazy','https://react.dev/reference/react/lazy'],['Suspense','https://react.dev/reference/react/Suspense'],['حدود الأخطاء','https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary'],['قراءة الموارد بـuse','https://react.dev/reference/react/use']]);
