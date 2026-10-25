/* Continuation: lessons 9–20. Existing indices 0–7 and storage keys stay intact. */
const advancedReactTerms=[];
const RA={
 p:items=>items.map(p=>`<p>${p}</p>`).join(''),
 list:items=>`<ul>${items.map(p=>`<li>${p}</li>`).join('')}</ul>`,
 part:(id,title,paragraphs,sample='',file='App.jsx',trace=[])=>section(id,title,`<div class="deep-notes">${RA.p(paragraphs)}${sample?code(sample,file):''}${trace.length?'<h4>اقرأ المثال بالترتيب</h4>'+RA.list(trace):''}</div>`),
 chapter:(title,desc,sections,quizzes,exercises,references)=>{
  sections.push(RA.part('advanced-review','مراجعة الفهم والمراجع',[
   'قبل ما تعتبر الدرس خلص، نفّذ المثال في مشروعك وغيّر مدخلًا واحدًا، ثم فسّر النتيجة. افتح صفحة الأسئلة والتمارين من رابط الدرس؛ الحلول موجودة للمراجعة بعد المحاولة، مش بدلها.',
   'الأمثلة اللي مكتوب عليها مقطع توضيحي تحتاج السياق المذكور؛ الأمثلة اللي باسم ملف كامل تقدر تنقلها للملف المحدد. أي بيانات أو خدمة تجريبية هنا مش حسابًا حقيقيًا ولا تخزينًا إنتاجيًا.',
   references.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`).join(' · ')
  ]));
  const balanced=quizzes.map((q,i)=>{
   const shift=(courses.react.lessons.length+i)%q.options.length;
   return {...q,options:q.options.slice(shift).concat(q.options.slice(0,shift)),answer:(q.answer-shift+q.options.length)%q.options.length};
  });
  courses.react.lessons.push({title,short:title,desc,sections,quizzes:balanced,exercises,duration:null,terms:[],references});
 },
 term:(name,ar,definition,mechanism,pitfall,aliases=[])=>advancedReactTerms.push({name,ar,definition,mechanism,pitfall,aliases})
};

RA.chapter('إدارة الحالة الكبيرة: useReducer وContext',
 'نحدد صاحب كل بيانات، ننظم انتقالاتها بدالة نقية، ونوصل القيم للمكونات المحتاجة من غير نسخ متعارضة.',[
 RA.part('state-design','أول قرار: البيانات نوعها إيه ومين يملكها؟',[
  'زيادة حجم التطبيق مش معناها نقل كل state لمكان واحد. فرّق بين UI state زي فتح قائمة، وURL state زي نص البحث والصفحة الحالية، وServer state زي بيانات آتية من API. كل نوع له دورة حياة ومصدر حقيقة. بيانات مشتقة زي العدد المكتمل تتوقف على الأصل، فلا تخزنها كنسخة تانية محتاجة مزامنة.',
  'حالة محلية لا يحتاجها غير مكون واحد تفضل عنده. حالة مشتركة تترفع لأقرب أب مناسب. لو انتقال واحد بيغير عدة قيم مرتبطة، جمعها في شكل واحد يحمي من حالات متناقضة. بدل isLoading وisSuccess وisError اللي ممكن يبقوا true معًا، استعمل status بقيم محددة مثل idle وpending وsuccess وerror.',
  'التطبيع، أو Normalization، معناه تخزين السجل مرة واحدة والرجوع له بمعرّفه، بدل نسخ نفس السجل في selectedItem والقائمة. احتفظ بـselectedId واحسب السجل من المصدر. ده يقلل احتمالات تعديل نسخة ونسيان نسخة أخرى، ومش شرط تعمله لكل قائمة صغيرة.'
 ]),
 RA.part('reducer-contract','Reducer: الحالة القديمة + وصف الحدث = حالة جديدة',[
  'useReducer تنظم طريقة حساب الحالة التالية. Reducer دالة تستقبل state وaction وترجع nextState. Action بيانات تصف ما حصل، مثل إضافة مهمة أو تغيير اكتمالها؛ type اسم نتفق عليه، مش كلمة سحرية في React. Payload هي بيانات الحدث مثل id أو title.',
  'dispatch تبعت action لـReact فتطلب انتقالًا. مش بتستبدل state الحالية داخل نفس handler فورًا، ونفس فكرة Snapshot موجودة. الدالة reducer لازم تكون نقية: لا fetch ولا localStorage ولا توليد id عشوائي داخلها. جهّز المعرّف في handler وضمّه للحدث.',
  'لو الفعل غير معروف، اختر سياسة واضحة: رمي Error يساعد اكتشاف خطأ نوع الحدث في تطبيقنا. لو حدث معروف لكنه لا يغير شيئًا ارجع نفس state. لا تعدّل المصفوفة القديمة ثم ترجعها؛ لازم ترجع نسخة بالانتقال المقصود.'
 ],`export const initialTasks = [];

export function tasksReducer(state, action) {
  switch (action.type) {
    case 'added':
      return [...state, action.task];
    case 'toggled':
      return state.map(task => task.id === action.id
        ? { ...task, done: !task.done } : task);
    case 'deleted':
      return state.filter(task => task.id !== action.id);
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}`,'src/tasksReducer.js',[
  'added تأخذ object جاهزة بالمعرف والعنوان والحالة. الدالة هنا تحسب فقط ولا تنشئ تأثيرًا خارجيًا.',
  'toggled تنسخ العنصر المطلوب فقط وتحافظ على البقية. deleted تختار غير المطلوب بمعرّفه.',
  'اختبر الدالة وحدها بإرسال array وaction؛ لا تحتاج DOM لاختبار انتقال بيانات نقي.'
 ]),
 RA.part('use-reducer','نربط reducer بالواجهة ونفصل الأثر عن الحساب',[
  'useReducer ترجع الحالة الحالية وdispatch. أول وسيط دالة الانتقال، والثاني قيمة التهيئة في هذا المثال. ممكن تستعمل وسيط تهيئة ثالث لدالة تبدأ بها الحالة؛ لازم التهيئة تحترم النقاء. React قد تختبر reducer والتهيئة باستدعاءات إضافية في StrictMode أثناء التطوير.',
  'الدالة add تنظف النص وتتحقق منه، وتولد الهوية، وبعدها dispatch تصف الإضافة. كتابة localStorage لو أردتها تحصل في Effect تتابع الحالة أو في منطق حفظ خارجي مناسب، وليس داخل reducer. فصل القرار عن الأثر هو اللي يخلي الانتقالات سهلة الفحص.',
  'useReducer مش أسرع تلقائيًا من useState، ومش مخزن عالمي. استخدمها لما تعدد الانتقالات والعلاقات بين القيم يستفيد من مكان مركزي للقواعد. حالة زر بسيط قد يكون useState أوضح لها.'
 ],`import { useReducer, useState } from 'react';
import { tasksReducer, initialTasks } from './tasksReducer.js';

export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  const [title, setTitle] = useState('');
  function add(event) {
    event.preventDefault();
    const clean = title.trim();
    if (!clean) return;
    dispatch({ type: 'added', task: {
      id: crypto.randomUUID(), title: clean, done: false
    }});
    setTitle('');
  }
  return <main>
    <form onSubmit={add}>
      <label htmlFor="title">مهمة</label>
      <input id="title" value={title} onChange={e => setTitle(e.target.value)} />
      <button>إضافة</button>
    </form>
    <ul>{tasks.map(task => <li key={task.id}>
      <label><input type="checkbox" checked={task.done}
        onChange={() => dispatch({ type: 'toggled', id: task.id })} />{task.title}</label>
    </li>)}</ul>
  </main>;
}`),
 RA.part('context-provider','Context: نوصل قيمة لفرع من الشجرة',[
  'Props تمرير صريح وواضح. Prop drilling اسم لمرور قيمة عبر مستويات لا تحتاجها بنفسها لمجرد توصيلها. Context تسمح للمستهلك بقراءة أقرب Provider فوقه لنفس context. هي آلية توصيل، مش حالة أو صلاحية أمنية أو قاعدة بيانات.',
  'createContext تتكتب خارج المكونات. القيمة الافتراضية تستخدم لما لا يوجد Provider؛ كتابة null افتراضيًا مع Hook تتحقق منه تكشف استخدام المكون في مكان غلط. Provider داخل نفس المكون لا يؤثر على useContext اللي تُستدعى قبله؛ القراءة تبحث لأعلى في الشجرة.',
  'هنستعمل الصيغة .Provider المفهومة مع إصدارات سابقة وحديثة. React 19 تسمح كذلك بعرض context نفسها كـProvider. استخدام نسختين منفصلتين من تعريف context في ملفين لا يربطهما لمجرد تشابه الاسم.'
 ],`import { createContext, useContext, useReducer } from 'react';
import { tasksReducer, initialTasks } from './tasksReducer.js';

const TasksContext = createContext(null);
const DispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  return <TasksContext.Provider value={tasks}>
    <DispatchContext.Provider value={dispatch}>
      {children}
    </DispatchContext.Provider>
  </TasksContext.Provider>;
}

export function useTasks() {
  const tasks = useContext(TasksContext);
  if (tasks === null) throw new Error('TasksProvider missing');
  return tasks;
}
export function useTasksDispatch() {
  const dispatch = useContext(DispatchContext);
  if (dispatch === null) throw new Error('TasksProvider missing');
  return dispatch;
}`,'src/TasksProvider.jsx'),
 RA.part('context-cost','إعادة الحساب وحدود Context',[
  'تغيير value في Provider يقارن بالقيمة السابقة باستخدام Object.is. المستهلكون للقيمة المتغيرة يتلقوا التحديث حتى لو wrapped بـmemo. object جديدة مثل {tasks,dispatch} تُنشأ في كل render قد تغير هوية القيمة. تقسيم القراءة وdispatch في المثال يوضح إن تحديث القائمة لا يغير dispatch نفسها.',
  'تثبيت قيمة object عند وجود سبب مقاس يساعد، لكنه مش سبب تنقل كل حاجة لـuseMemo عشوائيًا. ضع Provider عند نطاق الاستخدام الفعلي. لو شجرة كبيرة تحتاج اشتراكات دقيقة لشرائح بيانات، قيم أدوات مخزن خارجي مناسبة بدل الادعاء أن Context تغطي كل أنماط التخزين.',
  'لو بيانات جاية من السيرفر، Context لا توفر stale time أو إعادة طلب أو إلغاء تلقائيًا. سنشرح إدارة بيانات السيرفر في درس مستقل. لا تكرر نفس مصدر البيانات بين reducer وQuery cache بدون حاجة واضحة.'
 ])
 ],[
 quiz('Reducer مسؤولة عن إيه؟',['حساب الحالة التالية بشكل نقي','تنفيذ كل طلبات الشبكة','تغيير DOM يدويًا'],0,'الأثر الخارجي له مكان منفصل؛ reducer قواعد انتقال البيانات.'),
 quiz('أين نولد id للمهمة؟',['داخل reducer في كل render','في handler قبل dispatch','داخل key وقت العرض'],1,'الهوية تنشأ عند إنشاء البيانات، وتبقى ثابتة أثناء العرض.'),
 quiz('Context بتقرأ أنهي قيمة؟',['أقرب Provider مناسب أعلى المكوّن','أي Provider بنفس الاسم النصي','الأحدث في كل التطبيق'],0,'الهوية الفعلية للـcontext وموقع Provider في الشجرة يحددان القراءة.'),
 quiz('memo تمنع تحديث مستهلك Context تغيرت؟',['نعم دائمًا','لا، تغيير context يصل له','فقط لو اسمه كبير'],1,'memo ليست حاجزًا أمام context التي يستهلكها المكون.')
 ],[
 task('أضف حذفًا للمثال','أضف زر حذف لكل مهمة يرسل id. اختبر حذف آخر عنصر، ثم جرّب التعديل بعد إضافة عنصرين.',`<button type="button"
  onClick={() => dispatch({ type: 'deleted', id: task.id })}>
  حذف {task.title}
</button>`,'داخل li في App.jsx',['الحذف بمعرف ثابت','الـreducer لا تعدل الأصل','القائمة الفارغة لا تسبب خطأ']),
 task('استهلك البيانات من السياق','لف App بـTasksProvider واكتب Summary تقرأ القائمة وتحسب المكتمل من غير state ثانية.',`import { useTasks } from './TasksProvider.jsx';
export default function Summary() {
  const tasks = useTasks();
  const done = tasks.filter(task => task.done).length;
  return <p>خلصت {done} من {tasks.length}</p>;
}`,'src/Summary.jsx',['تعمل داخل Provider','العدد مشتق','لا نسخ للمهام في state ثانية'])
 ],[['اختيار شكل الحالة','https://react.dev/learn/choosing-the-state-structure'],['Reducer وContext','https://react.dev/learn/scaling-up-with-reducer-and-context']]);

RA.chapter('Custom Hooks بعمق: الاشتراكات والقيم الحديثة',
 'نبني واجهة منطق قابلة لإعادة الاستخدام، نفهم Closure واعتمادات Effects، ونربط React بمصدر خارجي بشكل صحيح.',[
 RA.part('hook-contract','صمم واجهة Hook حسب المسؤولية',[
  'Custom Hook دالة تجمع Hooks لتنفيذ مسؤولية محددة وتبدأ use. اسم useOnlineStatus أوضح من useDoStuff. حدد المدخلات والمخرجات وسلوك التنظيف قبل الكود: هل تستقبل مدة؟ هل ترجع قيمة أم دالة أم الاثنين؟ خلي المستدعي يعرف ما الذي يتغير ومتى.',
  'كل استدعاء له حالة مستقلة. لو مكونان استدعيا useCounter فده منطق مشترك وذاكرتان. مشاركة نفس القيمة بين مكونات تحتاج رفع الحالة أو Context أو مخزنًا خارجيًا. لا تصنع Hook لمجرد تخبئة اعتماد ناقص أو تسجيل أثر لا تعرف من ينظفه.',
  'اختبار Hook مفيد عن طريق مكون يستخدمها بالطريقة الواقعية: يظهر قيمة ثم يغير مدخلًا أو يختفي. اسم الدالة لا يرفع عنها قواعد Hooks؛ استدعاؤها يكون في المستوى الأعلى المناسب.'
 ]),
 RA.part('debounce-hook','Hook لتأخير اعتماد القيمة وليس كتابة الحقل',[
  'Debounce تعني تأجيل اعتماد نتيجة حتى تمر مدة بلا تغيير جديد. الحقل نفسه يظل يتحدث فورًا؛ القيمة المؤجلة هي اللي تستخدمها لطلب بحث أو خطوة مكلفة. كل تغيير يبدأ timer جديدة ويلغي القديمة قبل إعادة الإعداد.',
  'لو delay أو value اتغيرت، Effect تنظف المؤقت السابق. عند إزالة المكون التنظيف يلغي التحديث المنتظر. ده لا يلغي طلب شبكة بدأ فعلًا؛ إلغاء الشبكة يحتاج AbortController أو أداة تدير الطلبات. التأخير هنا قرار تجربة استخدام، مش علاجًا لكل مشكلة أداء.'
 ],`import { useEffect, useState } from 'react';

export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}`,'src/hooks/useDebouncedValue.js',[
  'البداية تعرض أول value؛ بعدها كل كتابة تغير value وتعيد إعداد مؤقت.',
  'clearTimeout تخص timer من نفس دورة Effect. اعتمادات value وdelay تطابق القيم المقروءة.',
  'في المستدعي: احتفظ بـquery للحقل وdebouncedQuery للطلب. لا تستبدل قيمة الحقل نفسها بالقيمة المؤجلة.'
 ]),
 RA.part('stale-closure','Closure ليست خطأ، لكن لازم تعرف لقطة أي حساب',[
  'الدالة تحتفظ بإمكانية قراءة نطاق تعريفها. handler من render قديم تقرأ state ذلك الحساب؛ ده سبب شائع لقيمة قديمة داخل timer أو اشتراك. أحيانًا اللقطة القديمة هي المطلوبة، مثل إرسال ما كان المستخدم اختاره وقت الضغط. وأحيانًا تحتاج الأحدث.',
  'للتحديث المعتمد على السابق استخدم updater. لإعادة مزامنة اشتراك عند تغير مصدره ضع المصدر ضمن dependencies. ولمنطق حدث داخل Effect يحتاج أحدث قيمة بدون إعادة الاتصال، توجد useEffectEvent في React 19.2 وما بعدها. لا تستخدمها كبديل عام عن الاعتمادات ولا تمررها لمكونات أو handlers عادية.',
  'Refs يمكنها حمل قيمة خارج مسار العرض، لكنها ليست تصريحًا لتجاهل اتساق البيانات. قراءة ref أثناء render لتكوين واجهة متغيرة غالبًا اختيار خاطئ؛ الواجهة المعتمدة على القيمة تحتاج state.'
 ],`import { useEffect, useEffectEvent } from 'react';

export default function SessionNotice({ sessionId, theme }) {
  const onHeartbeat = useEffectEvent(() => {
    console.log('Session', sessionId, 'Theme', theme);
  });
  useEffect(() => {
    const timer = setInterval(() => onHeartbeat(), 1000);
    return () => clearInterval(timer);
  }, [sessionId]);
  return <p>الجلسة: {sessionId}</p>;
}`,'SessionNotice.jsx — React 19.2+',[
  'تغير sessionId سبب مقصود لإعادة دورة المزامنة. تغير theme وحده لا يعيد المؤقت لكن الحدث يقرأ أحدث قيمة committed.',
  'onHeartbeat تستدعى من منطق Effect فقط، ولا توضع ضمن dependencies. التزم بقواعد وأداة lint للإصدار المستخدم.'
 ]),
 RA.part('external-subscription','useSyncExternalStore لقراءة مصدر خارج React',[
  'لو المصدر له نظام subscribe خارج React، useSyncExternalStore تصف الاشتراك وقراءة snapshot. subscribe تستقبل callback تُنادى عند تغير المصدر وترجع cleanup. getSnapshot ترجع قيمة تمثل الحالة الحالية؛ لازم تظل نفس القيمة ما دام المصدر لم يتغير.',
  'المثال يقرأ navigator.onLine، وهي إشارة اتصال المتصفح بالشبكة، وليست ضمان وصول API معين. نثبت دوال الاشتراك خارج المكون لتجنب إعادة التسجيل بلا داعٍ. النص الذي يعتمد على النتيجة يتحدث من React.',
  'getServerSnapshot للعرض على الخادم والترطيب. القيمة هنا true افتراض حتمي متطابق في أول قراءة خادم/ترطيب، وليس ادعاء معرفة اتصال المستخدم من السيرفر. للمخازن ذات objects خزن snapshot غير قابلة للتعديل ومستقرة حتى تتغير البيانات، لا ترجع object جديدة مع كل قراءة.'
 ],`import { useSyncExternalStore } from 'react';

function subscribe(notify) {
  window.addEventListener('online', notify);
  window.addEventListener('offline', notify);
  return () => {
    window.removeEventListener('online', notify);
    window.removeEventListener('offline', notify);
  };
}
const getSnapshot = () => navigator.onLine;
const getServerSnapshot = () => true;

export function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}`,'src/hooks/useOnlineStatus.js'),
 RA.part('hook-debug','عمر الاشتراك والأخطاء اللي تراجعها',[
  'امشِ في ثلاث حالات: أول تركيب، تغير المدخل، ثم إزالة المكون. لكل مورد بدأ، حدد اسم المتغير الذي يتيح إغلاقه. لو التسجيل تكرر في StrictMode بدون تنظيف، أصلح التناظر بين setup وcleanup بدل إضافة راية تمنع التسجيل الثاني.',
  'اختلاف قيمة الدالة أو object في dependency array له معنى هوية. قد يكون نقل الإنشاء لداخل Effect هو الحل الأبسط. لا تضع كل callbacks في useCallback تلقائيًا، ولا تحذف اعتمادًا لإيقاف حلقة من غير إصلاح سبب تغيره.',
  'منطق Hook ليست بيئة مستقلة عن أخطاء الشبكة أو التخزين. اكتب عقدها: ماذا تعيد عند الغياب؟ هل ترمي خطأ أم ترجع error؟ وهل المستدعي يستطيع إعادة المحاولة؟ الوضوح أهم من إخفاء أكبر عدد من الأسطر.'
 ])
 ],[
 quiz('استدعاء نفس Custom Hook في مكونين يشارك نفس state؟',['نعم تلقائيًا','لا، لكل استدعاء حالته','فقط لو الاسم واحد'],1,'مشاركة المنطق لا تنشئ مخزنًا مشتركًا.'),
 quiz('Debounce للحقل تطبق على أي قيمة؟',['قيمة الطلب التابعة مع بقاء الكتابة فورية','كل زرار في الصفحة','قيمة الحقل فتمنعها من الظهور'],0,'تجربة الكتابة يجب أن تظل مباشرة.'),
 quiz('getSnapshot ترجع object جديدة كل قراءة بلا تغير؟',['مناسب دائمًا','لا، يجب استقرار اللقطة عند ثبات المصدر','لازم Math.random'],1,'لقطات جديدة بلا تغير قد تسبب تحديثات غير سليمة أو حلقة.'),
 quiz('useEffectEvent بديل عام عن dependencies؟',['نعم','لا، لمنطق حدث من Effect وفق قواعدها','تستدعى فقط في onClick'],1,'لا تستخدمها لإخفاء اعتماد تفاعلي لازم للمزامنة.')
 ],[
 task('استهلك قيمة البحث المؤجلة','اكتب مكونًا بحقل query، واعرض القيمة الفورية والقيمة المؤجلة. غيّر delay إلى 600 واختبر الكتابة السريعة.',`import { useState } from 'react';
import { useDebouncedValue } from './hooks/useDebouncedValue.js';
export default function SearchPreview() {
  const [query, setQuery] = useState('');
  const delayed = useDebouncedValue(query, 600);
  return <section><label htmlFor="q">بحث</label>
    <input id="q" value={query} onChange={e => setQuery(e.target.value)} />
    <p>الفوري: {query}</p><p>المعتمد: {delayed}</p>
  </section>;
}`,'src/SearchPreview.jsx',['الحقل فوري','المؤقت السابق يُلغى','التنظيف موجود']),
 task('اعرض حالة الاتصال','اكتب شارة تستخدم useOnlineStatus وتشرح أن الاتصال لا يضمن نجاح الخدمة.',`import { useOnlineStatus } from './hooks/useOnlineStatus.js';
export default function ConnectionStatus() {
  const online = useOnlineStatus();
  return <p role="status">{online ? 'الشبكة متصلة' : 'الشبكة غير متصلة'}
    — نجاح طلب الخدمة بيتفحص بشكل مستقل.</p>;
}`,'src/ConnectionStatus.jsx',['الاشتراك ينظف','الوصف لا يضمن وصول API'])
 ],[['إعادة استخدام المنطق','https://react.dev/learn/reusing-logic-with-custom-hooks'],['useEffectEvent','https://react.dev/reference/react/useEffectEvent'],['useSyncExternalStore','https://react.dev/reference/react/useSyncExternalStore']]);

RA.chapter('صفحات وروابط: React Router من البداية للتداخل',
 'نخلي العنوان جزءًا من حالة التطبيق، نعرض صفحات متداخلة ونقرأ المعرف والبحث ونفهم إعدادات النشر.',[
 RA.part('router-setup','التوجيه والمكتبة والنمط المستخدم',[
  'Routing يعني ربط عنوان بواجهة. في تطبيق SPA، التنقل الداخلي ممكن يغير تاريخ المتصفح والعنوان ويعرض شجرة مختلفة بدون تحميل وثيقة جديدة كل مرة. الرابط الحقيقي يظل مهمًا للرجوع والتقدم والفتح في تبويب ومشاركة الصفحة.',
  'React لا تحتوي Router جاهزة. هنستخدم React Router بالنمط Declarative، وأمثلة هذا الدرس مقصودة لفرع الإصدار 7 عبر react-router@7، وليس وصفًا لأن كل إصدار حديث يطابق أي كود قديم. النمط Data يضيف loaders وactions، وFramework يضيف أدوات بناء وتنظيم أوسع. ما تخلطش APIs من أنماط مختلفة من غير إعدادها.',
  'نفّذ التثبيت داخل مشروع Vite، ثم لف App مرة واحدة بـBrowserRouter. Context الخاصة بالتوجيه لازم تكون أعلى Link وRoutes وHooks المرتبطة بها. لا تلف كل صفحة بـRouter منفصلة.'
 ],`npm install react-router@7`,'Terminal'),
 RA.part('router-tree','شجرة مسارات كاملة وLayout مشتركة',[
  'Routes تقارن العنوان وتعتمد route مناسبة. Route تصف path وelement. المسار index يحدد الصفحة الافتراضية عند عنوان الأب؛ لا تضع له path في نفس الوقت. المسار * حالة عدم التطابق، ولازم تعرض فيها رابط عودة واضح.',
  'Layout فيها Outlet؛ ده موضع عرض الابن المطابق. التداخل في تعريف Routes يصف تركيب الواجهة، مش مجرد تشابه نصوص العناوين. الرابط Link للتنقل الداخلي، وNavLink يضيف حالة نشطة مناسبة. رابط موقع خارجي يظل a عادية.',
  'المثال كله قابل للتشغيل كـApp بعد وجود main. BrowserRouter يستخدم مسارات حقيقية، لذلك إعداد الاستضافة لازم يعيد الصفحة الأساسية لمسارات التطبيق غير الموجودة كملفات. هنفصل الفرق في نهاية الدرس.'
 ],`// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>
);`,'src/main.jsx'),
 RA.part('router-pages','من العنوان للابن المطابق',[
  'الجزء :taskId متغير داخل path. useParams ترجع قيمه نصوصًا أو غيابًا؛ لا تفترض أنه رقم صالح أو أن السجل موجود. اختبره وابحث في مصدر بياناتك، واعرض حالة عدم وجود لو لم تطابق.',
  'الصفحة قد تبقى من نفس النوع عند تغير المعرف، فالحالة المحلية لا تتصفّر بالضرورة. لو الاستعلام يعتمد على المعرف، ضمّه لمفتاح الطلب. لا تستخدم key عشوائية لإجبار كل شيء على إعادة التركيب؛ اختار هوية جديدة فقط لما تقصد ذلك.'
 ],`import { Routes, Route, NavLink, Link, Outlet, useParams } from 'react-router';
function Layout() {
  return <><nav><NavLink to="/">الرئيسية</NavLink>{' '}
    <NavLink to="/tasks">المهام</NavLink></nav><main><Outlet /></main></>;
}
function TaskPage() {
  const { taskId } = useParams();
  return <section><h1>المهمة: {taskId}</h1><Link to="/tasks">رجوع</Link></section>;
}
export default function App() {
  return <Routes><Route element={<Layout />}>
    <Route index element={<h1>الرئيسية</h1>} />
    <Route path="tasks" element={<Link to="/tasks/42">المهمة 42</Link>} />
    <Route path="tasks/:taskId" element={<TaskPage />} />
    <Route path="*" element={<h1>الصفحة مش موجودة</h1>} />
  </Route></Routes>;
}`),
 RA.part('url-search','نص البحث والصفحة في URL',[
  'Query string بعد ? تحمل قيمًا مثل q وpage. useSearchParams ترجع قارئًا ودالة تحديث مرتبطة بالتنقل. لا تعدّل الكائن ثم تتوقع عنوانًا جديدًا من غير setter. انسخ السابق لو عايز تحافظ على باقي المعلمات.',
  'في المثال نستخدم replace أثناء الكتابة علشان كل حرف ما يعملش خطوة جديدة في تاريخ المتصفح، ونمسح page لأن تغيير البحث يعيد الترقيم. لو عايز سجلًا بعد الضغط على بحث فقط، اجمع إدخالًا مؤقتًا في state ثم حدّث URL وقت submit.',
  'قراءة page تحتاج تحويلًا وتحققًا: Number قد ينتج NaN أو صفرًا أو سالبًا. اختار افتراضيًا صحيحًا وامنَع تمرير مدخل غير صالح لطلب API. العنوان مدخل مستخدم، مش بيانات موثوقة تلقائيًا.'
 ],`import { useSearchParams } from 'react-router';
export default function SearchBox() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  return <label>بحث <input value={query} onChange={event => {
    const value = event.target.value;
    setParams(previous => {
      const next = new URLSearchParams(previous);
      value ? next.set('q', value) : next.delete('q');
      next.delete('page');
      return next;
    }, { replace: true });
  }} /></label>;
}`,'src/SearchBox.jsx'),
 RA.part('router-navigation','تنقل برمجي، وصول، وصلاحيات',[
  'useNavigate مناسبة لتنقل مرتبط بنتيجة فعل، مثل نجاح حفظ. للتنقل الذي يختاره المستخدم بشكل مباشر Link أوضح ويحتفظ بوظائف الرابط. useLocation تصف الموقع الحالي، لكنها ليست API لتحميل بيانات أي نمط تلقائيًا.',
  'تغيير الصفحة داخل SPA لا يعيد كل سلوك المتصفح الافتراضي. حدّث عنوان الوثيقة بشكل مناسب، وراعِ نقل التركيز لنقطة واضحة بعد التنقل وإدارة التمرير. أسماء الروابط والصفحة الحالية لازم تبقى مفهومة للكيبورد وقارئ الشاشة.',
  'عرض Navigate لزائر غير مسجل هو تنظيم واجهة فقط؛ لا يحمي endpoint. الخادم لازم يتحقق من الجلسة والعملية وكل مورد. لا تعتبر وجود user في localStorage إثبات هوية. في أنماط Data/Framework استخدم مسارات المصادقة والتحميل المناسبة لإطارك مع تحقق خادم فعلي.'
 ]),
 RA.part('router-hosting','فتح رابط عميق والفرق عن HashRouter',[
  'لو الضغط على Link يعمل لكن تحديث /tasks/42 يرجع 404 من الاستضافة، فالمشكلة قد تكون تقديم ملف الوثيقة للمسار. BrowserRouter يحتاج إعداد SPA fallback مناسب. HashRouter يضع المسار بعد # فلا يصل هذا الجزء إلى الخادم، لكنه يغير شكل الروابط واعتبارات النشر.',
  'لمشروع Vite static على Vercel، نموذج rewrite إلى index.html مناسب عندما كل المسارات من تطبيق الواجهة ولا يوجد Backend بنفس النطاق يحتاج قواعد مختلفة. لا تنسخ rewrite شاملًا على مشروع API أو إطار SSR من غير فهم؛ ملفاته وقواعده تختلف.',
  'درسنا لا يستخدم loader داخل BrowserRouter التقليدي؛ loaders وuseLoaderData يحتاجوا Data Router أو Framework. اختيار نمط واحد بشكل متسق يمنع أخطاء شائعة في نقل أمثلة من مراجع مختلفة.'
 ],`{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}`,'vercel.json — مشروع SPA مستقل')
 ],[
 quiz('Outlet وظيفتها إيه؟',['تعرض الابن المطابق داخل Layout','تنزل الحزم','تحمي API'],0,'التداخل في شجرة التوجيه يحتاج موضع عرض للابن.'),
 quiz('useParams تعيد المعرف دائمًا كرقم؟',['نعم','لا، تحقق من القيمة النصية','ترجع state عالمية'],1,'URL مدخل نصي يحتاج تحققًا قبل استخدامه.'),
 quiz('Redirect في الواجهة يمنع طلب API يدويًا؟',['نعم','لا، الخادم مسؤول عن الصلاحيات','إذا الزرار مخفي فقط'],1,'حراسة الواجهة لا تعادل Authorization في الخادم.'),
 quiz('لماذا replace أثناء كتابة البحث؟',['لتقليل إدخالات التاريخ لكل حرف','لحذف كل البيانات','لإعادة تثبيت React'],0,'ده قرار لسلوك رجوع المتصفح أثناء إدخال متكرر.')
 ],[
 task('صفحة غير موجودة مفيدة','استبدل h1 فقط في route * بمكون فيه عنوان ورسالة ورابط للرئيسية.',`import { Link } from 'react-router';
export default function NotFound() {
  return <section><h1>الصفحة مش موجودة</h1>
    <p>راجع العنوان أو ارجع لبداية التطبيق.</p>
    <Link to="/">الرئيسية</Link></section>;
}`,'src/NotFound.jsx',['الرابط داخلي','عنوان واضح','تظهر عند مسار غير مطابق']),
 task('تحقق من رقم الصفحة','اكتب دالة تحول قيمة page لعدد صحيح موجب، أو ترجع 1. اختبر غيابًا ونصًا وسالبًا وكسرًا.',`export function readPage(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}`,'src/readPage.js',['غياب القيمة يعيد 1','الكسر مرفوض','القيمة لا تفترض موثوقية URL'])
 ],[['React Router: الأنماط','https://reactrouter.com/start/modes'],['التوجيه التصريحي','https://reactrouter.com/start/declarative/routing'],['قيم URL','https://reactrouter.com/start/declarative/url-values']]);

RA.chapter('بيانات السيرفر: Query وMutation وCache',
 'نفصل بيانات الشبكة عن حالة الواجهة، نستخدم TanStack Query، ونفهم الحداثة وإعادة الطلب وتحديث النتائج.',[
 RA.part('server-state','ليه بيانات الشبكة لها دورة حياة مختلفة؟',[
  'Server state مصدر حقيقتها على خدمة خارج المتصفح، وقد تتغير من مستخدم أو جهاز آخر. النسخة الموجودة عندك مؤقتة وتحتاج سياسة حداثة وإعادة جلب. UI state مثل فتح نافذة ليست نفس المشكلة. تخزين كل استجابة في reducer لا يضيف إدارة cache تلقائيًا.',
  'Cache نسخة تحت مفتاح معروف تسمح بإعادة الاستخدام ومشاركة نتيجة الطلب. وجود cache لا يعني أن النتيجة حديثة إلى الأبد. هنستخدم TanStack Query فرع v5، وهي مكتبة خارجية وليست Hook مدمجة في React. تفهم نموذج الطلب اليدوي أولًا مفيد، لكن في تطبيق أكبر إدارة الطلبات المتكررة بالأداة أو بإطار مناسب أوضح.'
 ],`npm install @tanstack/react-query@5`,'Terminal'),
 RA.part('query-provider','عميل واحد للمخزن، واستعلام بمفتاح واضح',[
  'QueryClient يحتفظ بمخزن الاستعلامات وإعداداتها. في تطبيق متصفحي بسيط أنشئه خارج App أو بهوية ثابتة، لا تنشئ عميلًا جديدًا كل render. لف الجزء المستخدم بـQueryClientProvider. إعداد SSR له عزل خاص لكل طلب سنناقشه لاحقًا.',
  'queryKey هوية بيانات الاستعلام. كل متغير تغيره الدالة ويغيّر النتيجة يدخل المفتاح، مثل userId أو filter أو page. المفتاح ليس مجرد عنوان عشوائي؛ مجموعات المفاتيح تسمح بإبطال نتائج مترابطة. queryFn ترجع Promise بالقيمة أو ترمي خطأ.',
  'signal جاي من المكتبة؛ تمريره لـfetch يسمح بإلغاء الشبكة عندما تُلغى العملية المناسبة. افحص response.ok وبيانات JSON. مثال JSONPlaceholder خدمة تجريبية تحتاج إنترنت، وليست قاعدة بيانات المشروع النهائي.'
 ],`import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
const client = new QueryClient();

async function getUsers({ signal }) {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', { signal });
  if (!response.ok) throw new Error('تعذر التحميل');
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('شكل بيانات غير متوقع');
  return data;
}
function Users() {
  const query = useQuery({ queryKey: ['users'], queryFn: getUsers, staleTime: 60_000 });
  if (query.isPending) return <p role="status">بنحمّل أول نتيجة...</p>;
  if (query.isError) return <button onClick={() => query.refetch()}>جرّب تاني</button>;
  return <section>
    {query.isFetching && <p role="status">بنحدّث البيانات...</p>}
    <ul>{query.data.map(user => <li key={user.id}>{user.name}</li>)}</ul>
  </section>;
}
export default function App() {
  return <QueryClientProvider client={client}><Users /></QueryClientProvider>;
}`),
 RA.part('query-keys','المفتاح والحداثة وحذف النسخة غير المستخدمة',[
  'staleTime يحدد مدة اعتبار البيانات fresh. بعد المدة تصبح stale، وده لا يمسحها فورًا ولا يعني طلبًا ثابتًا كل دقيقة. إعادة الجلب تتوقف على أحداث وإعدادات مثل التركيب والتركيز والاتصال. gcTime يحدد الاحتفاظ بالاستعلام غير النشط قبل جمعه؛ مختلف عن الحداثة.',
  'isPending تعني عدم وجود نجاح مكتمل للاستعلام حسب حالته، وisFetching تشير لعمل جلب نشط حتى لو لديك بيانات قديمة. لاستعلام disabled بدون cache قد ترى pending بدون fetch؛ لا تخلط انتظارًا بلا طلب بتحميل شبكة فعلي. في المثال الأول الاستعلام يعمل مباشرة فلا يوجد هذا الالتباس.',
  'لا تضع أسرارًا في queryKey أو URL. وعند خروج مستخدم من جلسة فعلية يجب التعامل مع بياناته المخزنة وعدم عرضها لحساب آخر؛ المفتاح والعزل وإزالة البيانات الخاصة قرار أمني وتجربة استخدام وليس مجرد تحسين أداء.'
 ]),
 RA.part('mutation','Mutation عملية تعديل، وليست مجرد Query باسم آخر',[
  'Mutation تصف إجراءً مثل POST لإضافة سجل. useMutation توفر حالة التنفيذ ونتيجته وفشله. mutate تطلقه، وmutateAsync ترجع Promise للانتظار. إعادة محاولة كتابة ليست دائمًا آمنة لأن العملية قد تكررت على الخادم رغم فشل وصول الرد.',
  'بعد نجاح التعديل، invalidateQueries تميز بيانات قديمة وتعيد جلب الاستعلامات النشطة المطابقة وفق إعداداتها. أو setQueryData تكتب استجابة مؤكدة في cache لو شكلها معروف. لا تعمل الاثنين عشوائيًا لكل شيء؛ اختار هل محتاج نتيجة من الخادم أو حساب محلي موثوق.',
  'المقطع التالي يفترض API حقيقية في /api/tasks تعيد السجل المحفوظ، وليست موجودة تلقائيًا في مشروع Vite. لا تختبرها ثم تعتبر 404 خطأ React. في مشروع التخرج هنستخدم repository محلية ونفصل واجهة الشبكة كترقية مستقلة.'
 ],`import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useAddTask() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async title => {
      const response = await fetch('/api/tasks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (!response.ok) throw new Error('تعذر الحفظ');
      return response.json();
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ['tasks'] })
  });
}`,'src/hooks/useAddTask.js — يحتاج Backend مطابق'),
 RA.part('optimistic-cache','التفاؤل وإعادة المحاولة وحالات الفشل',[
  'Optimistic update تعرض نتيجة متوقعة قبل تأكيد الخادم. في cache قد تحتاج إلغاء جلب منافس، ولقطة سابقة، وتحديثًا مؤقتًا، وrollback عند الفشل، ثم إعادة مزامنة. الطلبات المتزامنة تجعل الاسترجاع إلى لقطة واحدة موضوعًا يحتاج تصميمًا، فلا تضفه لمجرد أن الزر يشعر أسرع.',
  'ابدأ بنجاح مؤكد ثم حدّث العرض، وأظهر pending واضحًا. لو أضفت تفاؤلًا، عرّف كيف تعرض العنصر المؤقت وكيف تستبدل id المؤقت بالمؤكد، وما يحدث عند رفض الصلاحية أو تعارض النسخ. useOptimistic في React لها نطاق UI مختلف عن cache؛ هنشرحها في درس الفورمات.',
  'اختبر بطء الشبكة، فشل HTTP، فشل JSON، نتيجة فارغة، إعادة فتح الصفحة وتغيير مفتاح الطلب. Test يبدأ بافتراض محدد: نفس المفتاح يشارك نفس البيانات، ومعرف جديد لا يعرض نتيجة قديمة باعتبارها الحالية.'
 ])
 ],[
 quiz('queryKey لازم تشمل page لو queryFn تستخدمها؟',['نعم لأنها تغير هوية النتيجة','لا، أي مفتاح واحد يكفي','فقط في CSS'],0,'كل متغير يحدد النتيجة يدخل هوية الاستعلام.'),
 quiz('staleTime وgcTime نفس الوظيفة؟',['نعم','لا: حداثة مقابل حذف غير النشط','الاتنين عدد مكونات'],1,'البيانات stale قد تبقى معروضة وموجودة في cache.'),
 quiz('isFetching ممكن true مع وجود data؟',['نعم أثناء تحديث خلفي','لا أبدًا','لو userReducer موجودة'],0,'فرّق التحميل الأول عن إعادة الجلب مع نسخة سابقة.'),
 quiz('أمثلة /api/tasks تنشئ Backend تلقائيًا؟',['لا، تحتاج خدمة مطابقة','نعم مع React','نعم بمجرد useMutation'],0,'الكود المستدعي لا ينشئ endpoint على الخادم.')
 ],[
 task('مفتاح مستخدم والتحقق من الاستجابة','اكتب hook تقرأ مستخدمًا بمعرف، وتتوقف حتى يوجد معرف. اكتب تحققًا قبل طلبك الحقيقي لو المدخل غير موثوق.',`import { useQuery } from '@tanstack/react-query';
export function useUser(id) {
  return useQuery({
    queryKey: ['user', id], enabled: Boolean(id),
    queryFn: async ({ signal }) => {
      const r = await fetch('https://jsonplaceholder.typicode.com/users/' + encodeURIComponent(id), { signal });
      if (!r.ok) throw new Error('تعذر جلب المستخدم');
      return r.json();
    }
  });
}`,'src/hooks/useUser.js',['المعرف ضمن المفتاح','signal تمرر','الغموض بين pending وfetch موضح في UI']),
 task('حالة قائمة فارغة','بعد معالجة pending وerror في Users، اعرض رسالة للـarray الفارغة بدون إنشاء state ثانية.',`if (query.isPending) return <p>بنحمّل...</p>;
if (query.isError) return <p role="alert">تعذر التحميل</p>;
if (query.data.length === 0) return <p>مفيش مستخدمين.</p>;
return <ul>{query.data.map(user => <li key={user.id}>{user.name}</li>)}</ul>;`,'داخل Users',['الفحص بعد ضمان data','لا تكرار للبيانات'])
 ],[['البداية الرسمية لـTanStack Query','https://tanstack.com/query/latest/docs/framework/react/quick-start'],['مفاتيح الاستعلام','https://tanstack.com/query/latest/docs/framework/react/guides/query-keys'],['الإعدادات الافتراضية','https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults']]);
