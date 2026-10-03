/* Original Egyptian Arabic curriculum. The examples are for a React/Vite learning project. */
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const code = (s, file='App.jsx') => `<div class="code-block"><div class="code-top"><span><span class="dots">● ● ●</span>${esc(file)}</span><button class="copy-code" type="button">نسخ الكود ⧉</button></div><pre><code>${esc(s.trim())}</code></pre></div>`;
const note = (title, text, color='') => `<aside class="callout ${color}"><div class="callout-title">✦ ${title}</div><p>${text}</p></aside>`;
const section = (id,title,html) => ({id,title,html});
const rows = arr => `<div class="explain-list">${arr.map(([a,b])=>`<div class="explain-row"><code>${esc(a)}</code><p>${b}</p></div>`).join('')}</div>`;
const flow = arr => `<figure class="diagram"><div class="flow">${arr.map(([a,b],i)=>`${i?'<span class="flow-arrow">←</span>':''}<div class="flow-node"><b>${a}</b><small>${b}</small></div>`).join('')}</div><figcaption class="diagram-label">اقرا الرحلة من اليمين للشمال؛ كل خطوة بتجهّز اللي بعدها.</figcaption></figure>`;
const exercise = (title,text,solution,file) => `<div class="exercise"><h4>✎ ${title}</h4><p>${text}</p><details><summary>جرّب الأول، وبعدين افتح الحل</summary>${code(solution,file)}</details></div>`;
const practice = (kind,title) => `<div class="practice" data-demo="${kind}"><div class="practice-head"><b>◉ ${title}</b><span>جرّب الفكرة بإيدك</span></div><div class="practice-body"></div></div>`;
const glossary = [
 ['react','React','ريأكت','مكتبة JavaScript بتساعدك تبني واجهة المستخدم من أجزاء صغيرة اسمها Components. بتوصف شكل الواجهة حسب البيانات، وهي بتحدّث عناصر الصفحة اللي محتاجة تغيير.',0],
 ['ui','UI','واجهة المستخدم','اختصار User Interface: كل حاجة المستخدم بيشوفها وبيتعامل معاها؛ زرار، فورم، قائمة وصورة. منطق تسجيل الدخول لوحده مش واجهة.',0],
 ['library','Library','مكتبة','كود جاهز لمهمة معيّنة بتستدعيه في مشروعك. React مكتبة للواجهات؛ التوجيه وجلب البيانات ممكن تضيف لهم أدوات تانية حسب احتياجك.',0],
 ['dom','DOM','تمثيل الصفحة','اختصار Document Object Model. المتصفح بيحوّل HTML لشجرة عناصر في الذاكرة. JavaScript تقدر تقرا الشجرة وتغيّرها.',0],
 ['render','Render','حساب الواجهة','في React، الرندر هو استدعاء الكومبوننتس عشان تحسب الواجهة المطلوبة. بعد الحساب، مرحلة Commit بتطبّق التغييرات اللازمة على DOM؛ مش كل رندر بيغيّر الصفحة.',0],
 ['node','Node.js','تشغيل JavaScript خارج المتصفح','بيئة تشغيل بتسمح لـ JavaScript تشتغل على جهازك، وبتشغّل أدوات التطوير زي Vite. مش معناها إنك لازم تبني Backend عشان تتعلّم React.',1],
 ['npm','npm','مدير الحزم','أداة بتيجي عادة مع Node.js، بتنزّل مكتبات المشروع وتشغّل الأوامر المسجلة في package.json. Package معناها حزمة كود قابلة للتثبيت.',1],
 ['terminal','Terminal','نافذة الأوامر','برنامج بتكتب فيه أوامر للجهاز، زي الدخول لمجلد بـ cd أو تشغيل المشروع بـ npm run dev. لازم تكون واقف في المجلد المناسب.',1],
 ['vite','Vite','أداة تطوير وبناء','بتجهز سيرفر التطوير، تحوّل JSX لكود يفهمه المتصفح، وتنتج ملفات للنشر. React مسؤولة عن الواجهة؛ Vite مسؤولة عن أدوات المشروع.',1],
 ['dependency','Dependency','اعتماد المشروع','حزمة مشروعك محتاجها. dependencies للحزم المستخدمة في التطبيق، وdevDependencies لأدوات التطوير والبناء. البناء ممكن يحتاج الاتنين.',1],
 ['module','Module','ملف له صادرات وواردات','ملف JavaScript يقدر يصدّر حاجات بـ export، وملف تاني يستوردها بـ import. ده بيقسّم المشروع بدل ما كل الكود يكون في ملف واحد.',0],
 ['jsx','JSX','كتابة الواجهة جوّه JavaScript','صيغة شبه HTML بتوصف الواجهة داخل كود JavaScript. مش نص HTML، وأداة زي Vite بتحوّلها لاستدعاءات JavaScript أثناء التطوير والبناء.',2],
 ['component','Component','جزء من الواجهة','دالة JavaScript اسمها بيبدأ بحرف كبير وبتعيد وصف واجهة بـ JSX. تقدر تستعملها أكتر من مرة وتجمعها مع غيرها.',2],
 ['fragment','Fragment','غلاف من غير عنصر إضافي','الصيغة <>...</> بتجمع أكتر من عنصر JSX من غير ما تضيف div في DOM. لو محتاج key للغلاف استخدم Fragment بالاسم.',2],
 ['props','Props','بيانات داخلة للكومبوننت','اختصار Properties. الأب بيبعتها للابن كخصائص، والابن بيقراها من كائن props. تعامل معاها كبيانات للقراءة، ما تعدّلهاش.',3],
 ['children','children','المحتوى بين الوسمين','Prop اسمها children بيستقبلها الكومبوننت من المحتوى المكتوب بين وسم البداية والنهاية، زي <Card>عنوان</Card>.',3],
 ['key','key','هوية عنصر القائمة','قيمة ثابتة وفريدة بين العناصر اللي تحت نفس الأب. React بتستخدمها عشان تربط العنصر ببياناته لما القائمة تتغيّر. ما بتوصلش كـ prop عادية.',3],
 ['event','Event','حدث','حاجة حصلت من المستخدم أو المتصفح، زي الضغط أو الكتابة. Event Handler هي الدالة اللي بتستجيب للحدث؛ بتبعتها للخاصية من غير استدعاء فوري.',4],
 ['state','State','ذاكرة الكومبوننت','بيانات React بتحتفظ بيها بين الرندرات. تغييرها بالـ setter بيطلب رندر جديد. لكل نسخة مستقلة من الكومبوننت State خاصة بيها.',4],
 ['hook','Hook','دالة من أدوات React','دالة تبدأ بـ use بتضيف إمكانيات زي State أو Effect. استدعيها في أعلى Function Component أو Custom Hook، وبنفس الترتيب كل مرة؛ مش جوّه شرط أو لوب.',4],
 ['snapshot','Snapshot','لقطة من البيانات','كل رندر شايف قيم State الخاصة بيه. استدعاء setter بيجهز قيمة لرندر جاي؛ ما بيغيّرش المتغير الحالي فورًا في نفس الدالة.',4],
 ['immutable','Immutable update','تحديث بنسخة جديدة','بدل تعديل object أو array الموجودة في State، اعمل نسخة بالقيمة الجديدة. استخدم spread أو map أو filter عشان React تشوف قيمة جديدة.',5],
 ['controlled','Controlled input','حقل React متحكمة فيه','حقل قيمته جاية من State بـ value أو checked، وonChange بيحدّث State. الواجهة والبيانات بيبقوا متفقين على قيمة واحدة.',5],
 ['lifting','Lifting state up','رفع الحالة للأب','لما كومبوننتين محتاجين نفس البيانات، حط State عند أقرب أب مشترك وابعت القيمة ودوال التحديث للاتنين.',5],
 ['effect','Effect','مزامنة مع حاجة خارج React','كود بيشتغل بعد Commit عشان يزامن الواجهة مع نظام خارجي، زي مؤقت أو شبكة أو عنوان الصفحة. مش مطلوب لأي حساب عادي نقدر نعمله وقت الرندر.',6],
 ['cleanup','Cleanup','إيقاف الشغل القديم','دالة بيرجعها Effect لإلغاء مؤقت أو اشتراك أو طلب قديم. React بتشغلها قبل إعادة Effect بعد تغيّر اعتماداتها، وكمان عند إزالة الكومبوننت.',6],
 ['api','API','واجهة للتعامل مع نظام','اختصار Application Programming Interface. في درس الشبكة هي عنوان وقواعد بنطلب بيها بيانات من سيرفر. API ممكن تكون كمان دوال مكتبة، مش شرط لينك.',6],
 ['promise','Promise','نتيجة هتوصل بعدين','كائن بيمثّل عملية لسه بتكمل، زي طلب شبكة. async/await طريقة لانتظار نتيجته جوّه دالة async من غير تجميد الصفحة.',6],
 ['json','JSON','صيغة تبادل بيانات','صيغة نصية فيها objects وarrays وقيم بسيطة. response.json() بيقرا جسم الاستجابة ويحوّله لقيم JavaScript؛ لازم تنتظر النتيجة.',6],
 ['ref','Ref','مرجع بيحتفظ بقيمة','useRef بيرجع object فيه current. تغيير current مش بيطلب رندر. ينفع للإمساك بعنصر DOM عشان تعمل focus أو تخزّن قيمة غير مرئية.',7],
 ['custom-hook','Custom Hook','منطق قابل لإعادة الاستخدام','دالة تبدأ بـ use بتجمع Hooks مرتبطة بمهمة واحدة. بتشارك المنطق، مش نفس State تلقائيًا؛ كل استدعاء له حالته المستقلة.',7],
 ['build','Build','نسخة النشر','عملية تحويل وتجميع ملفات المشروع لملفات جاهزة للإنتاج. npm run build في قالب Vite بينتج dist، وpreview بيجربها محليًا.',1],
 ['strict','StrictMode','فحوص إضافية في التطوير','أداة React بتعمل فحوص تطوير، منها رندر إضافي ودورة إعداد وتنظيف إضافية للـ Effects. مش بتعمل نفس التكرار ده في نسخة الإنتاج.',2],
 ['destructure','Destructuring','استخراج قيم بالاسم','طريقة JavaScript بتطلع قيم من object أو array مباشرة. مثال const {name} = user ومثال const [value, setter] = useState(0).',0],
 ['spread','Spread','نشر عناصر أو خصائص','علامة ... بتنسخ عناصر array أو خصائص object في قيمة جديدة. النسخة سطحية؛ لو عدّلت object متداخل لازم تنسخ المستوى ده كمان.',0]
];
const lessons = [
{title:'قبل أول سطر React',short:'الفكرة وأساسيات JavaScript',icon:'✦',desc:'يعني إيه React أصلًا؟ وليه بنستخدمها؟ ونراجع JavaScript اللي هنحتاجها، بمثال بسيط من الحياة.',objectives:['تفرّق بين HTML وReact','تفهم DOM وRender','تراجع JavaScript الضرورية'],plan:['٣٠ دقيقة فهم الفكرة','٣٥ دقيقة JavaScript','٤٠ دقيقة تطبيق','١٥ دقيقة مراجعة'],sections:[
section('why','١. خلّينا نبدأ من الويب نفسه',`<p>تخيّل إنك بتبني صفحة محل: <strong>HTML</strong> هي الهيكل، زي عنوان المحل وصورة المنتج والزرار. <strong>CSS</strong> هي الشكل: ألوان، مسافات، وترتيب على الموبايل. <strong>JavaScript</strong> هي التصرفات: المستخدم يدوس «ضيف للسلة»، فتتغيّر كمية المنتجات والسعر.</p><p><strong>React</strong> مكتبة JavaScript لبناء <strong>واجهة المستخدم UI</strong>. مكتبة يعني كود جاهز لمهمة محددة، وواجهة المستخدم هي الجزء اللي الناس بتشوفه وبتتعامل معاه. React مش لغة جديدة، ومش بديل لـ HTML وCSS وJavaScript؛ هي طريقة ننظّم بيها شغل JavaScript والواجهة.</p>${flow([['HTML','هيكل الصفحة'],['CSS','الشكل والتنسيق'],['JavaScript','التفاعل والمنطق']])}<p>لو صفحة ثابتة صغيرة، HTML وCSS ممكن يكفّوا. لما الواجهة يبقى فيها منتجات وفلاتر وسلة وفورمات، متابعة تغيّر كل عنصر يدويًا بتتعقّد. React بتخلّيك تكتب: «لو البيانات كده، الواجهة تكون كده».</p>${note('قبل ما نكمل','مش لازم تكون محترف، لكن محتاج تعرف تعمل صفحة HTML بسيطة، تنسّقها بـ CSS، وتفهم متغيرات ودوال وشروط في JavaScript. لو دول جداد عليك، خُد وقتك في المراجعة اللي تحت قبل الدرس التاني.')}`),
section('mental','٢. البيانات بتقود شكل الواجهة',`<p>المتصفح بيحوّل HTML لشجرة اسمها <strong>DOM — Document Object Model</strong>. الشجرة فيها عنصر الصفحة وتحته العناوين والأزرار. في JavaScript العادية ممكن تمسك عنصر وتغيّر محتواه بنفسك:</p>${code(`let count = 0;
const button = document.querySelector('#counter');
button.addEventListener('click', () => {
  count += 1;
  button.textContent = 'العدد: ' + count;
});`,'vanilla.js')}<p><code>querySelector</code> بتلاقي أول عنصر مطابق للمحدد، و<code>addEventListener</code> بتربط دالة بحدث، و<code>textContent</code> بتغيّر النص. في React هنحتفظ بالعدد كـ State ونوصف زرار يعرضه؛ React هتتولى تحديث DOM.</p>${flow([['بيانات','العدد = 0'],['واجهة','زرار يعرض العدد'],['حدث','المستخدم يدوس'],['بيانات جديدة','العدد = 1']])}<p><strong>Render</strong> معناها React بتنادي دوال الكومبوننتس وتحسب الواجهة المطلوبة. <strong>Commit</strong> هي المرحلة اللي تغييرات DOM اللازمة بتتطبّق فيها. إعادة الرندر مش معناها مسح الصفحة وإعادة بنائها كلها، ومش ضمان إن كل عنصر هيحتاج يتغير.</p>${note('تشبيه يفكّ الفكرة','اعتبر الواجهة صورة للبيانات الحالية. البيانات تتغيّر؟ نطلع وصف جديد للصورة. ما تدخلش بنفسك تغيّر عناصر DOM اللي React مسؤولة عنها إلا لما يبقى فيه سبب وأداة مناسبة، زي Ref.', 'purple')}`),
section('variables','٣. المتغيرات، القيم، والدوال',`<p><strong>Variable</strong> متغير: اسم لقيمة نستخدمها بعدين. <code>const</code> لو مش هتعيّن قيمة جديدة للاسم، و<code>let</code> لو هتغيّر التعيين. <strong>String</strong> نص بين علامات اقتباس، <strong>Number</strong> رقم، و<strong>Boolean</strong> قيمة صح أو غلط: <code>true</code> أو <code>false</code>.</p>${code(`const name = 'مريم';
let age = 20;
const isStudent = true;

function greet(person) {
  return 'أهلًا يا ' + person;
}

const greetAgain = (person) => 'أهلًا يا ' + person;
console.log(greet(name));`,'basics.js')}${rows([['function','بتعرّف دالة: مجموعة خطوات بنستدعيها باسمها.'],['person','Parameter: اسم يستقبل القيمة اللي بنبعتها عند الاستدعاء.'],['return','بيوقّف الدالة ويرجع نتيجة؛ من غيره الدالة عادة بترجع undefined.'],['=>','Arrow function: صيغة تانية لكتابة الدالة. لو جسمها تعبير واحد من غير أقواس {}، نتيجة التعبير بترجع تلقائيًا.'],['console.log','بيطبع قيمة في Console للتجربة وتشخيص المشاكل.']])}<p>لو كتبت <code>const user = { name: 'مريم' }</code> تقدر تغيّر خاصية داخل object في JavaScript، لكن ما تقدرش تعمل <code>user = objectAnother</code>. يعني const بتمنع إعادة التعيين للاسم، مش بتجمّد الكائن. في React State هنلتزم بعمل نسخ جديدة؛ ده موضوع مختلف.</p>`),
section('arrays','٤. Objects وArrays وطرق التعامل معاهم',`<p><strong>Object</strong> كائن يجمع خصائص مرتبطة ببعض؛ زي اسم المنتج وسعره. <strong>Array</strong> مصفوفة، يعني قائمة مرتّبة من قيم. الوصول لعنصر في array بيبدأ من رقم <code>0</code>، والوصول لخاصية في object غالبًا بالنقطة.</p>${code(`const product = { id: 1, title: 'كشكول', price: 40 };
const products = [product, { id: 2, title: 'قلم', price: 10 }];

const { title, price } = product;
const names = products.map(item => item.title);
const cheap = products.filter(item => item.price < 20);
const copy = { ...product, price: 45 };

console.log(title, names, cheap, copy);`,'collections.js')}${rows([['{ title }','Destructuring: استخراج خاصية من object في متغير بنفس الاسم.'],['map','بتحوّل كل عنصر لنتيجة وترجع array جديدة. ما بتغيّرش الأصل لو الدالة اللي بعتها ما عدّلتهوش.'],['filter','بترجع array جديدة بالعناصر اللي الشرط رجّع معاها true.'],['...product','Spread: نسخ خصائص object. كتبنا price بعد النسخ، فالسعر الجديد غطّى على القديم.'],['item =>','دالة بتتنادى لكل عنصر. اسم item من اختيارك، مش كلمة سحرية.']])}${exercise('تطبيق ١ — قائمة منتجات','اعمل array فيها ٣ منتجات. استخدم filter عشان تطلع اللي سعره أقل من ١٠٠، وبعدها map عشان تطلع أسماء المنتجات دي.',`const products = [
  { id: 1, title: 'قلم', price: 15 },
  { id: 2, title: 'شنطة', price: 300 },
  { id: 3, title: 'كشكول', price: 50 }
];
const names = products
  .filter(product => product.price < 100)
  .map(product => product.title);
console.log(names);`,'practice.js')}`),
section('modules','٥. الشروط والـ Modules',`<p>الشرط بيحدد هننفذ إيه. <code>===</code> مقارنة صارمة للقيمة والنوع، و<code>=</code> تعيين قيمة. <code>?</code> مع <code>:</code> اسمهم <strong>Ternary operator</strong>: لو الشرط صح خُد القيمة الأولى، ولو غلط خُد التانية. <code>&&</code> بيكمّل للطرف التاني لو الأول truthy، و<code>!</code> بيعكس القيمة المنطقية.</p>${code(`const age = 19;
const message = age >= 18 ? 'مسموح' : 'لسه صغير';

// math.js
export function double(number) {
  return number * 2;
}

// main.js
import { double } from './math.js';
console.log(double(5));`,'modules.js')}<p><strong>Module</strong> ملف يصدّر حاجات عشان ملفات تانية تستعملها. <strong>Named export</strong> زي double بنستورده بأقواس وبنفس الاسم. <strong>Default export</strong> هو التصدير الافتراضي الوحيد للملف وبنستورده من غير أقواس، ويجوز نختار اسم محلي مختلف. <code>./</code> يعني في نفس المجلد، و<code>../</code> يعني اطلع مجلد لفوق.</p>${note('المطلوب من الجلسة دي','جرّب الأمثلة في Console المتصفح، باستثناء import/export: جرّبهم في ملفات مشروع Vite بعد الدرس الجاي. لو فاهم الدالة وmap والـ object والشرط، انت جاهز تدخل React.','orange')}`)
],quizzes:[{q:'React بتساعدك تعمل إيه؟',options:['تكتب لغة بديلة لـ JavaScript','توصف واجهة المستخدم حسب البيانات','تبني قاعدة بيانات تلقائيًا'],answer:1,why:'React مكتبة JavaScript للواجهات. بنوصف الواجهة، وهي بتنسّق تحديثها لما البيانات تتغيّر.'},{q:'map بترجع إيه؟',options:['Array جديدة بنتائج التحويل','نفس array بعد حذف عناصرها','عنصر واحد دائمًا'],answer:0,why:'map بتطبّق دالة على كل عنصر وتجمع النتائج في array جديدة.'}],source:'https://react.dev/learn'},
{title:'أول مشروع: من Terminal لصفحة شغّالة',short:'Vite والأوامر وملفات المشروع',icon:'↗',desc:'نجهّز الأدوات، نفهم كل جزء في أمر إنشاء المشروع، ونعرف كل ملف اتعمل وليه موجود.',objectives:['تشغّل مشروع Vite','تفهم npm والأوامر','تقرأ هيكل المشروع'],plan:['٢٠ دقيقة تجهيز','٣٠ دقيقة أوامر','٣٠ دقيقة ملفات','٤٠ دقيقة تجربة وحل مشاكل'],sections:[
section('tools','١. إيه الأدوات اللي محتاجينها؟',`<p>نزّل <a href="https://nodejs.org/en/download" target="_blank" rel="noopener"><strong>Node.js</strong> من الموقع الرسمي ↗</a>، واختار إصدار LTS حديث مدعوم. LTS يعني دعم طويل المدى. Node بيشغّل أدوات التطوير على جهازك، و<strong>npm</strong> مدير الحزم غالبًا بيتثبّت معاه. هنستخدم محرر كود زي <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code ↗</a> ومتصفح حديث.</p><p><strong>Terminal</strong> نافذة نكتب فيها أوامر. في VS Code افتح القائمة Terminal وبعدها New Terminal. مهم تعرف انت واقف في أنهي فولدر؛ أوامر إنشاء المشروع هتعمل مجلد جواه. اختار مكان للمشروع، وافتحه في المحرر.</p>${code(`node -v
npm -v`,'Terminal')}${rows([['node -v','بيطبع إصدار Node؛ حرف v هنا اختصار version. لو ظهر إصدار، التثبيت اتشاف.'],['npm -v','بيطبع إصدار npm، مش إصدار React.']])}${note('توافق Vite','حسب توثيق Vite الحالي، محتاج Node.js 20.19+ أو 22.12+؛ بعض القوالب ممكن تحتاج إصدار أعلى. الأفضل تثبّت LTS حديث مدعوم، وتراجع رسالة المتطلبات لو ظهرت. فتح Terminal جديد بعد التثبيت بيساعد الجهاز يقرأ المسارات الجديدة.','orange')}`),
section('vite','٢. React غير Vite — كل واحد بيعمل إيه؟',`<p><strong>Vite</strong> أداة تطوير وبناء. وقت التطوير بتشغّل سيرفر محلي عشان تشوف الصفحة، بتحوّل JSX لصيغة JavaScript يفهمها المتصفح، وبتحدّث الصفحة بسرعة لما تغيّر الكود. ده اسمه <strong>HMR — Hot Module Replacement</strong>؛ تبديل الوحدات المتغيرة أثناء التطوير، مع الحفاظ على الحالة لما التغيير يسمح.</p><p>React هي اللي بتبني وتحدّث الواجهة. Vite بتجهز بيئة الشغل. <strong>Development server</strong> سيرفر تطوير على جهازك، و<strong>Build</strong> نسخة جاهزة للنشر. سيرفر التطوير مش هو استضافة الموقع على الإنترنت.</p>${flow([['Vite','بيجهّز وبيحوّل الكود'],['React','بتحسب شكل الواجهة'],['Browser','بيعرض النتيجة']])}${note('طب Create React App؟','ممكن تلاقي كورسات قديمة بتستخدم npx create-react-app. Create React App اتوقف التوصية بيه للمشاريع الجديدة. للتعلّم هنا هنستخدم Vite. في تطبيقات إنتاج كبيرة ممكن Framework مناسب يكون اختيار أحسن حسب المشروع.','purple')}`),
section('commands','٣. أمر إنشاء المشروع، كلمة كلمة',`<p>اكتب الأوامر دي <strong>بالترتيب، كل أمر في سطر منفصل</strong>. لو npm سألك عن تنزيل create-vite، راجع اسم الحزمة ووافق عشان يكمل. اختار الإعدادات الافتراضية المناسبة لو ظهرت أسئلة إضافية؛ واجهة الأداة ممكن تتغير بين الإصدارات.</p>${code(`npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev`,'Terminal')}${rows([['npm','الأداة اللي بنستخدمها عشان نشغّل مولّد المشروع.'],['create','أمر npm لتشغيل initializer؛ هنا بيشغّل حزمة create-vite.'],['vite@latest','بنطلب أحدث نسخة من مولّد Vite. latest اسم tag للإصدار الحالي، مش رقم ثابت.'],['my-react-app','اسم مجلد المشروع. ينفع تختار اسم تاني بسيط، من غير مسافات.'],['--','فاصل: الخيارات اللي بعده تتبعت للأداة اللي npm بيشغّلها.'],['--template react','اختيار قالب React باستخدام JavaScript. قالب react-ts بيستخدم TypeScript، وده مش مطلوب هنا.'],['cd','Change Directory: ادخل مجلد المشروع الجديد.'],['npm install','نزّل الحزم المكتوبة في package.json، واعمل أو حدّث ملف القفل.'],['npm run dev','شغّل script اسمه dev من package.json؛ في قالب Vite غالبًا ده بيشغّل vite.']])}<p>افتح <strong>الرابط اللي Terminal طبعه فعلًا</strong>، غالبًا <code>http://localhost:5173</code>. Localhost يعني جهازك. لو المنفذ مشغول Vite ممكن يختار رقم تاني. سيب Terminal شغّالة؛ لإيقاف السيرفر اضغط <code>Ctrl + C</code>.</p>${note('ما تتلخبطش','npm install تجهيز للحزم، وnpm run dev تشغيل للمشروع. الأول مش بديل للتاني. ولو الأداة عملت التثبيت والتشغيل تلقائيًا، ما تشغّلش نسخة تانية من السيرفر في نفس الوقت.')}`),
section('files','٤. الملفات اللي اتعملت ولزمتها',`<p>القالب ممكن يغيّر تفاصيل بسيطة مع الوقت، لكن الأدوار دي هتفضل مفيدة. اضغط على أي ملف في الشجرة عشان تقرا وظيفته:</p><div class="file-explorer" data-files><h4>my-react-app/</h4><div class="file-list"></div><div class="file-description" aria-live="polite"></div></div><p><strong>node_modules</strong> فيه الحزم المتثبتة، حجمه كبير وما بنعدّلش فيه يدويًا ولا نرفعه عادة لـ Git. <strong>package-lock.json</strong> بيثبّت تفاصيل نسخ الحزم، وده نحتفظ بيه مع المشروع. <strong>.gitignore</strong> بيقول لـ Git يتجاهل إيه؛ Git أداة تسجيل تاريخ التغييرات.</p><p><strong>public</strong> لملفات ثابتة بتتقدم كما هي، وممكن تشير لها بمسار زي <code>/logo.svg</code>. <strong>src/assets</strong> لملفات بتستوردها في الكود؛ Vite بتتعامل معاها وقت البناء، ومنها تعديل المسار حسب النسخة. مش لازم تستخدم الاتنين لنفس الغرض.</p>`),
section('entry','٥. الواجهة بتطلع إزاي من الملفات؟',`<p><code>index.html</code> فيها مكان فاضي للواجهة وسطر بيحمّل ملف البداية. <code>main.jsx</code> بيستورد الكومبوننت الرئيسي ويطلب من React ترسمه جوا المكان ده:</p>${code(`<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>`,'index.html — مقتطف')}${code(`import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);`,'src/main.jsx')}${rows([['import','استورد حاجة من ملف أو حزمة. المسار react حزمة، و./App.jsx ملف محلي.'],['createRoot','بيجهز جذر React مربوط بعنصر DOM. غالبًا تطبيقك له جذر رئيسي واحد.'],['getElementById','دالة المتصفح بتجيب العنصر اللي id بتاعه root.'],['.render','بيطلب عرض شجرة الكومبوننتس تحت الجذر.'],['<App />','نسخة من الكومبوننت الرئيسي.'],['StrictMode','فحوص إضافية في التطوير عشان تلاحظ مشاكل في نقاء الرندر وتنظيف Effects.']])}${flow([['index.html','مكان root'],['main.jsx','يربط React بالمكان'],['App.jsx','محتوى تطبيقك']])}<p>استبدل محتوى <code>src/App.jsx</code> بالكود البسيط ده، واحفظ الملف. لو تنسيقات القالب مخلية الشكل غريب، امسح تنسيقات العرض التجريبية من App.css وindex.css، وسيب قواعدك أنت:</p>${code(`export default function App() {
  return <h1>أول مشروع React ليا! 🎉</h1>;
}`,'src/App.jsx')}`),
section('scripts','٦. التشغيل والبناء ومشاكل البداية',`<p><code>package.json</code> ملف إعدادات بصيغة <strong>JSON</strong>. فيه اسم المشروع وscripts والحزم. في JSON مفاتيح النصوص لازم تكون بعلامات اقتباس مزدوجة، ومش بنكتب تعليقات ولا فاصلة بعد آخر عنصر.</p>${code(`{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`,'package.json — جزء scripts فقط')}${rows([['npm run build','بيطلع ملفات جاهزة للنشر في dist. لو فيه خطأ لازم تصلحه قبل النشر.'],['npm run preview','بيخدم نسخة dist محليًا للتجربة بعد build؛ مش سيرفر إنتاج لاستضافة دائمة.'],['Missing script','راجع scripts في package.json وتأكد انك في مجلد المشروع الصحيح.'],['ENOENT','غالبًا ملف مش موجود في المسار المطلوب؛ لو package.json مش متشاف، راجع المجلد.'],['node not found','راجع تثبيت Node، افتح Terminal جديدة، وتأكد إن المسار متاح.'],['صفحة بيضا','افتح Console في DevTools واقرا أول خطأ، وراجع export/import ومسارات الملفات.']])}${exercise('تطبيق الجلسة — مشروع باسمك','أنشئ مشروعًا، غيّر العنوان لاسمك، ضيف فقرة تحته، شغّل build وبعدين preview. اقفل السيرفر وشغّله تاني من نفس المجلد.',`export default function App() {
  return (
    <main>
      <h1>Mohamed Hassany</h1>
      <p>أنا بدأت أتعلم React خطوة خطوة.</p>
    </main>
  );
}`,'src/App.jsx')}`)
],quizzes:[{q:'بعد cd my-react-app، ليه بنعمل npm install؟',options:['عشان نفتح المتصفح','عشان ننزّل حزم المشروع','عشان ننشر الموقع'],answer:1,why:'install بيثبت dependencies. التشغيل بيكون بأمر dev، والنشر خطوة تانية.'},{q:'أنهي ملف غالبًا بيربط App بعنصر root؟',options:['src/main.jsx','package-lock.json','README.md'],answer:0,why:'main.jsx بيستخدم createRoot ويرندر App جوّه عنصر root الموجود في index.html.'}],source:'https://vite.dev/guide/'},
{title:'ابني الواجهة: JSX وComponents',short:'من أول عنصر لأجزاء قابلة لإعادة الاستخدام',icon:'▧',desc:'نكتب JSX صح، نقسم الصفحة لكومبوننتس، نفهم import وexport، ونضيف تنسيقات وصور بطريقة واضحة.',objectives:['تكتب JSX صحيحة','تعمل Component مستقل','تنسّق وتضيف صور'],plan:['٣٠ دقيقة JSX','٣٠ دقيقة Components','٤٥ دقيقة بناء صفحة','١٥ دقيقة تصحيح'],sections:[
section('jsx','١. JSX مش HTML بالضبط',`<p><strong>JSX</strong> صيغة بنكتب بيها وصف الواجهة جوّه JavaScript. شكلها قريب من HTML، لكنها بتتحوّل لكود JavaScript بأداة البناء. تقدر تعرض متغير باستخدام <code>{ }</code>، وتحط تعبير بيطلع قيمة، زي جمع رقمين أو استدعاء دالة ترجع نص.</p>${code(`export default function App() {
  const name = 'مريم';
  const lessons = 3;
  return (
    <main className="page">
      <h1>أهلًا يا {name}</h1>
      <p>خلصت {lessons} دروس، وفاضلك {8 - lessons}.</p>
    </main>
  );
}`)}<p><strong>Expression</strong> تعبير ينتج قيمة، زي <code>8 - lessons</code>. <strong>Statement</strong> تعليمة، زي if أو تعريف const؛ دي ما تتحطش مباشرة جوّه أقواس JSX. اعملها قبل return، أو استخدم تعبير مناسب. الأقواس جوّه النص معناها «ارجع لـ JavaScript».</p>${note('نص ولا متغير؟','<code>title="name"</code> بيبعت النص الحرفي name. <code>title={name}</code> بيبعت قيمة المتغير. مش بنحط أقواس JSX جوّه علامات الاقتباس.')}`),
section('rules','٢. قواعد JSX اللي لازم تتعود عليها',`<p>ارجع عنصر جذر واحد، أو استخدم <strong>Fragment</strong> بالصيغة <code>&lt;&gt;...&lt;/&gt;</code> لجمع العناصر من غير div إضافية. لازم تقفل كل الوسوم؛ صورة تتكتب <code>&lt;img /&gt;</code> وفاصل سطر <code>&lt;br /&gt;</code>.</p>${code(`export default function Intro() {
  return (
    <>
      <h1 className="title">خطوة جديدة</h1>
      <label htmlFor="name">اسمك</label>
      <input id="name" type="text" />
      {/* ده تعليق داخل JSX */}
      <p>ابدأ صغير، وجرّب كتير.</p>
    </>
  );
}`,'src/Intro.jsx')}${rows([['className','بديل class في JSX لإضافة CSS classes.'],['htmlFor','بديل for في label؛ بيربطه بحقل له id مطابق.'],['onClick','خصائص أحداث React غالبًا camelCase: أول كلمة صغيرة والتانية أول حرف فيها كبير.'],['{/* ... */}','طريقة كتابة تعليق داخل منطقة JSX.'],['return (','خلي فتح القوس على نفس سطر return؛ نزول التعبير لسطر جديد من غير قوس ممكن يخلي JavaScript ترجع undefined.']])}<p>السمات زي <code>aria-label</code> و<code>data-id</code> بتفضل بالشرطة زي HTML. لازم كل عنصر تفاعلي يبقى له اسم مفهوم، والصورة لها <code>alt</code> يوصفها، والـ label مرتبط بالـ input. سهولة الوصول جزء من كتابة الواجهة صح.</p>`),
section('components','٣. يعني إيه Component وبنعملها إزاي؟',`<p><strong>Component</strong> جزء مستقل من الواجهة، بيجمع الشكل والمنطق اللي يخصه. ممكن يكون زرار، كارت منتج، أو صفحة كاملة. هو هنا دالة JavaScript بترجع JSX، واسمها <strong>لازم يبدأ بحرف كبير</strong>. React بتتعامل مع الحروف الصغيرة كوسوم HTML.</p>${code(`function WelcomeCard() {
  return (
    <article className="welcome-card">
      <h2>أهلًا بيك في React</h2>
      <p>كل جزء صغير بيفرق.</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <WelcomeCard />
      <WelcomeCard />
    </main>
  );
}`)}<p>عرّف الكومبوننتس في مستوى الملف، مش جوّه دالة كومبوننت تانية. استعمل <code>&lt;WelcomeCard /&gt;</code> عشان React تستدعيها بالطريقة الصح؛ ما تتعاملش معاها كدالة عادية وتكتب <code>WelcomeCard()</code> لبناء الواجهة.</p><figure class="diagram"><div class="component-tree"><div class="tree-root">&lt;App /&gt;</div><div class="tree-stem"></div><div class="tree-children"><span>&lt;Header /&gt;</span><span>&lt;WelcomeCard /&gt;</span><span>&lt;Footer /&gt;</span></div></div><figcaption class="diagram-label">صفحة كبيرة = أجزاء صغيرة متجمّعة. App هو الأب، والأجزاء تحته أبناء.</figcaption></figure>${note('نقسم إمتى؟','لما جزء بيتكرر، أو له مسؤولية واضحة، أو حجمه بدأ يصعّب القراءة. مش لازم كل سطر يبقى كومبوننت لوحده. ابدأ بسيط، وقسّم حسب المعنى.')}`),
section('imports','٤. كل Component في ملف',`<p>اعمل مجلد <code>src/components</code>، وجوّه ملف <code>Header.jsx</code>. المجلد ده تنظيم من اختيارنا؛ React مش بتفرض اسمه. بنصدّر الدالة من الملف، وبعدين نستوردها في App.</p>${code(`export default function Header() {
  return (
    <header>
      <h1>ريأكت بالمصري</h1>
    </header>
  );
}`,'src/components/Header.jsx')}${code(`import Header from './components/Header.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main>محتوى الصفحة هنا</main>
    </>
  );
}`)}<p><code>export default</code> بيحدد التصدير الافتراضي للملف؛ واحد بس في كل ملف. لو كتبت <code>export function Header()</code> ده named export وتستورده بـ <code>import { Header } ...</code>. ما تخلطش الصيغتين. حالة الحروف في مسار الملف مهمة، خصوصًا بعد النشر على أنظمة حساسة للحروف.</p>`),
section('styling','٥. CSS والصور والتنسيقات الديناميكية',`<p>CSS اللي تعرفها لسه شغّالة. استورد ملف CSS واكتب className في JSX. التنسيق العام مش بيبقى مقصور تلقائيًا على كومبوننت معيّنة؛ class عامة ممكن تأثر على عناصر تانية. CSS Modules اختيار إضافي للعزل، ومش محتاجينه عشان نبدأ.</p>${code(`import './App.css';

export default function App() {
  const accent = '#2e5943';
  return (
    <article className="card" style={{ borderColor: accent }}>
      <h1>أنا بتعلم React</h1>
    </article>
  );
}`)}${code(`.card {
  max-width: 640px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid;
  border-radius: 16px;
}
@media (max-width: 600px) {
  .card { margin: 20px; padding: 16px; }
}`,'src/App.css')}<p><code>style={{ borderColor: accent }}</code>: القوس الخارجي بيدخل JavaScript، والداخلي بيعرّف object. خصائص CSS هنا camelCase، فـ <code>background-color</code> تصبح <code>backgroundColor</code>. خلّي التنسيقات الثابتة في CSS، واستخدم style لما قيمة تعتمد على البيانات.</p>${code(`import logo from './assets/react.svg';

export default function Logo() {
  return <img src={logo} alt="شعار React" width={80} />;
}`,'src/Logo.jsx')}<p>ده بيستخدم الصورة الموجودة في قالب Vite لو لسه موجودة. صورة داخل public تستخدم مسارًا زي <code>/photo.jpg</code> بعد ما تحط الملف فعليًا هناك. ما تستخدمش مسار جهازك زي C:\\Pictures؛ المتصفح بعد النشر ما يعرفوش.</p>`),
section('purity','٦. رندر نقي وتطبيق صفحة شخصية',`<p><strong>Pure</strong> أو نقي: الكومبوننت لنفس props وstate وcontext ترجع نفس الوصف، وما تغيّرش قيم موجودة قبل استدعائها أو تعمل شغل خارجي وقت الرندر. ما تنفّذش طلب شبكة أو تعدّل document مباشرة في جسم الكومبوننت. التفاعلات مكانها Event handlers، والمزامنة مكانها Effects لما تحتاجها.</p><p>StrictMode ممكن يستدعي الرندر زيادة في التطوير عشان يساعد يكشف المشاكل دي؛ ما تحلش التكرار بحذفه. أصلح السبب. هنشوف تنظيف Effects في الجلسة السابعة.</p>${exercise('تطبيق الجلسة — صفحة عنك','خُد ٤٥ دقيقة وابني صفحة فيها Header وAboutCard وFooter، كل واحد في ملف. اعرض اسمك ورابط بورتفوليوك، واكتب CSS متجاوبة. الحل ده نموذج تجميع؛ انت اعمل الأجزاء في ملفات مستقلة.',`function Header() {
  return <header><h1>Mohamed Hassany</h1></header>;
}
function AboutCard() {
  return (
    <article>
      <h2>عنّي</h2>
      <p>أنا بتعلم بناء واجهات باستخدام React.</p>
      <a href="https://my-portfolio-gamma-two-39.vercel.app/"
         target="_blank" rel="noopener noreferrer">
        شوف البورتفوليو
      </a>
    </article>
  );
}
function Footer() {
  return <footer>اتعمل باستخدام React</footer>;
}
export default function App() {
  return <><Header /><main><AboutCard /></main><Footer /></>;
}`)}`)
],quizzes:[{q:'ليه اسم WelcomeCard بيبدأ بحرف كبير؟',options:['عشان React تعرف إنه Component','عشان CSS تشتغل','مفيش فرق'],answer:0,why:'React بتميّز أسماء الكومبوننتس بالحرف الكبير، والحروف الصغيرة بتعتبرها وسوم HTML.'},{q:'إيه معنى style={{ color: accent }}؟',options:['غلطة لازم نشيل قوس','قوس JSX خارجي وobject داخلي','نص CSS عادي'],answer:1,why:'القوس الخارجي بيدخل تعبير JavaScript، والقوس الداخلي بيعرّف object فيها التنسيقات.'}],source:'https://react.dev/learn/your-first-component'},
{title:'بياناتك جوّه الواجهة: Props وقوائم وشروط',short:'نفس الكومبوننت، محتوى مختلف',icon:'⇄',desc:'نحوّل الكارت الثابت لكارت يستقبل بيانات، ونبني قائمة منتجات بهويات صحيحة وشروط واضحة.',objectives:['تبعت Props','تستخدم children','ترسم قوائم وشروط'],plan:['٣٥ دقيقة Props','٢٥ دقيقة شروط','٣٠ دقيقة قوائم','٣٠ دقيقة تطبيق'],sections:[
section('props','١. Props: البيانات بتسافر من الأب للابن',`<p>دلوقتي عندنا كارت بيتكرر، بس المحتوى واحد. <strong>Props</strong> هي بيانات الأب بيبعتها للكومبوننت الابن. تخيّل الكومبوننت قالب كارت، والـ props الورقة اللي مكتوب عليها الاسم والسعر. الدالة بتستقبل object فيها الخصائص.</p>${code(`function ProductCard({ title, price, available = true }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{price} جنيه</p>
      <small>{available ? 'متاح' : 'مش متاح دلوقتي'}</small>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <ProductCard title="كشكول" price={40} />
      <ProductCard title="قلم" price={15} available={false} />
    </main>
  );
}`)}${rows([['{ title, price }','Destructuring للـ props بدل كتابة props.title كل مرة.'],['price={40}','رقم JavaScript. price="40" هيبعت string، وده ممكن يعمل فرق في الحساب.'],['available=true','قيمة افتراضية لو الخاصية مش مبعوتة أو قيمتها undefined. null مش بتفعّل الافتراضي.']])}${flow([['App','عنده بيانات المنتج'],['Props ↓','title وprice'],['ProductCard','بيقرا ويعرض']])}<p>Props للقراءة. ما تكتبش <code>props.price = 50</code> وما تعدّلش object الأب بعتها. لو محتاج تغيير، الأب يحتفظ بالبيانات ويبعت دالة للابن يطلب بيها التحديث؛ ده هنطبّقه في درس State.</p>`),
section('children','٢. children: محتوى جوّه القالب',`<p>لما تكتب محتوى بين وسم البداية والنهاية لكومبوننت، React بتبعته في prop اسمها <strong>children</strong>. ينفع نص، عنصر، أو مجموعة عناصر. مفيدة لما نعمل غلاف زي كارت أو Modal، ونسيب المحتوى لاختيار الأب.</p>${code(`function Card({ children, title }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <Card title="خطتك النهارده">
      <p>افهم Props، وبعدها جرّب بنفسك.</p>
      <a href="https://react.dev/learn">اقرا التوثيق</a>
    </Card>
  );
}`)}<p>ده اسمه <strong>Composition</strong>: تركيب أجزاء صغيرة مع بعض. الأب بيختار المحتوى، والكارت بيختار ترتيب وشكل الغلاف. أحيانًا children أوضح من إنشاء props كتير لكل سطر ممكن يتحط في الكارت.</p>${practice('props','غيّر الاسم وشوف نفس الكارت بمحتوى جديد')}`),
section('conditions','٣. Conditional Rendering: نعرض إيه وإمتى؟',`<p>Conditional Rendering يعني عرض مشروط. ممكن ترجع JSX مختلفة حسب البيانات. <code>if</code> بتتكتب قبل return، والـ ternary جوّه JSX لما عندك اختيارين. لو مش محتاج تعرض حاجة، رجّع <code>null</code>.</p>${code(`function StockMessage({ quantity }) {
  if (quantity === 0) {
    return <p>خلص من المخزن</p>;
  }

  return (
    <div>
      <p>{quantity > 5 ? 'كمية كويسة' : 'آخر كام قطعة'}</p>
      {quantity > 0 && <button>ضيف للسلة</button>}
    </div>
  );
}`,'StockMessage.jsx')}<p><code>&&</code> مش بترجع true أو false دائمًا؛ بتعيد واحدة من القيم. عشان كده <code>quantity && &lt;p&gt;متاح&lt;/p&gt;</code> لو quantity صفر ممكن تعرض رقم 0. اكتب مقارنة منطقية صريحة زي <code>quantity > 0 && ...</code>.</p>${note('الواجهة بتشرح الحالة','لو فيه خطأ، اعرض رسالة واضحة. لو القائمة فاضية، وضّح مفيش عناصر بدل مساحة فاضية. تصميم الحالات المختلفة جزء من بناء الكومبوننت.','orange')}`),
section('lists','٤. map: من Array لعناصر على الشاشة',`<p>القائمة في البيانات Array، وفي الواجهة عناصر. <code>map</code> بتعمل التحويل. كل عنصر محتاج <strong>key</strong> ثابتة وفريدة بين إخواته، عشان React تتابع هويته لو اتنقل أو اتحذف.</p>${code(`const products = [
  { id: 'p1', title: 'كشكول', price: 40 },
  { id: 'p2', title: 'قلم', price: 15 },
  { id: 'p3', title: 'شنطة', price: 300 }
];

function ProductCard({ title, price }) {
  return <article><h2>{title}</h2><p>{price} جنيه</p></article>;
}

export default function App() {
  return (
    <main>
      {products.map(product => (
        <ProductCard
          key={product.id}
          title={product.title}
          price={product.price}
        />
      ))}
    </main>
  );
}`)}<p>الـ key تتحط على العنصر اللي راجع مباشرة من map، حتى لو اللي جواه عناصر تانية. ما تستخدمش <code>Math.random()</code> في الرندر، وما تستخدمش ترتيب index لما العناصر ممكن تتحذف أو تتبدّل. الـ id من البيانات أفضل. key مش بتوصل للابن كـ prop؛ ابعت <code>id={product.id}</code> لو محتاجه هناك.</p>${note('الفخ الصغير في Arrow function','لو استخدمت جسم دالة بـ {}، اكتب return. الصيغة <code>items.map(item => { &lt;Card /&gt; })</code> مش بترجع عناصر. استخدم <code>item => (&lt;Card /&gt;)</code> أو return صريحة.','purple')}`),
section('filter','٥. فلترة وقيم مشتقة من البيانات',`<p>قبل ما ترسم القائمة، ممكن تعمل filter. <strong>Derived data</strong> بيانات مشتقة: نتيجة حساب من البيانات الأصلية، زي المنتجات الرخيصة أو مجموع الأسعار. طالما ممكن تحسبها وقت الرندر، غالبًا مش محتاج تحتفظ بنسخة تانية مستقلة منها في State.</p>${code(`const products = [
  { id: 1, title: 'قلم', price: 15 },
  { id: 2, title: 'كشكول', price: 40 },
  { id: 3, title: 'شنطة', price: 300 }
];

export default function App() {
  const affordable = products.filter(product => product.price <= 50);
  return (
    <ul>
      {affordable.map(product => (
        <li key={product.id}>{product.title}: {product.price} جنيه</li>
      ))}
    </ul>
  );
}`)}<p>filter بتحدد اللي يظهر، وmap بتحدّد يظهر إزاي. ترتيب الخطوتين هنا منطقي: اختار البيانات الأول وبعدها حوّلها لعناصر.</p>`),
section('apply','٦. ورشة كتالوج منتجات',`${exercise('تطبيق ١ — كارت مرن','اعمل ProductCard يستقبل title وprice وavailable. لو unavailable اخفي زرار الشراء واعرض رسالة. جرّب ٣ كروت ببيانات مختلفة.',`function ProductCard({ title, price, available }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{price} جنيه</p>
      {available ? <button>شراء</button> : <p>مش متاح</p>}
    </article>
  );
}`)}${exercise('تطبيق ٢ — كتالوج كامل','كوّن ٥ منتجات لها id ثابتة. اعرض المنتجات المتاحة فقط، ورتّب الكروت بـ CSS Grid. جرّب قائمة فاضية. حل مبسّط للعرض:',`function Catalog({ products }) {
  const visible = products.filter(product => product.available);
  if (visible.length === 0) return <p>مفيش منتجات متاحة حاليًا.</p>;
  return (
    <main className="catalog">
      {visible.map(product => (
        <ProductCard key={product.id}
          title={product.title}
          price={product.price}
          available={product.available} />
      ))}
    </main>
  );
}`)}<p>راجع نفسك: هل كل prop مفهوم؟ هل في key على العنصر المباشر؟ هل القائمة الفاضية لها رسالة؟ هل الكروت بتتكيف على الموبايل؟ جرّب تغيّر ترتيب البيانات وتأكد إنك ما اعتمدتش على رقم الترتيب كهوية.</p>`)
],quizzes:[{q:'البيانات في Props ماشية منين لفين؟',options:['من الابن للأب تلقائيًا','من الأب للابن','من CSS لـ HTML'],answer:1,why:'الأب بيبعت props للابن. طلب التغيير لفوق ممكن يتم عن طريق دالة الأب بعتها.'},{q:'أنهي key أفضل لقائمة ممكن تتغيّر؟',options:['Math.random() كل رندر','ترتيب العنصر index','id ثابتة من بيانات العنصر'],answer:2,why:'الـ id الثابتة بتخلي React تتابع نفس العنصر عبر الإضافة والحذف والتبديل.'}],source:'https://react.dev/learn/rendering-lists'},
{title:'خلّي الواجهة تتفاعل: Events وState',short:'أول Hook وفهم تحديث الواجهة',icon:'＋',desc:'نتعامل مع ضغط المستخدم، نفهم useState والرندر والـ snapshot، ونبني عدّاد وتفاعل حقيقي.',objectives:['تكتب Event handler','تستخدم useState','تفهم snapshot والتحديث الوظيفي'],plan:['٢٠ دقيقة أحداث','٣٥ دقيقة State','٢٥ دقيقة رندر','٤٠ دقيقة تطبيق'],sections:[
section('events','١. Event يعني حاجة حصلت',`<p><strong>Event</strong> حدث، زي المستخدم ضغط زرار أو كتب في حقل. <strong>Event handler</strong> الدالة اللي بتتعامل مع الحدث. في React بنبعت الدالة لخاصية زي onClick، وReact بتناديها لما الحدث يحصل.</p>${code(`export default function App() {
  function handleClick() {
    alert('أهلًا بيك!');
  }
  return <button onClick={handleClick}>اضغط هنا</button>;
}`)}<p>اكتب <code>onClick={handleClick}</code> من غير أقواس استدعاء. لو كتبت <code>handleClick()</code> هتتنادى أثناء الرندر، وممكن تعمل مشاكل أو تحديث لا نهائي. لو محتاج تبعت قيمة، استخدم دالة وسيطة:</p>${code(`function BuyButton({ productId }) {
  function handleBuy(id) {
    console.log('شراء المنتج', id);
  }
  return <button onClick={() => handleBuy(productId)}>شراء</button>;
}`,'BuyButton.jsx')}<p>معظم الأحداث بتوصل كائن <code>event</code> للدالة. <code>event.target</code> غالبًا العنصر اللي بدأ الحدث، و<code>event.currentTarget</code> العنصر اللي الـ handler مربوط بيه. حدث الضغط ممكن ينتقل للأب؛ ده اسمه <strong>Bubbling</strong>. <code>stopPropagation()</code> توقف انتقاله، و<code>preventDefault()</code> تمنع تصرف المتصفح الافتراضي، زي إرسال فورم وإعادة تحميل الصفحة. دي حاجتين مختلفتين.</p>`),
section('state','٢. ليه let لوحدها مش كفاية؟',`<p>لو عرّفت <code>let count = 0</code> جوّه الكومبوننت وزوّدتها، React مش هتعرف إنك عايز تغيّر الشاشة. كمان المتغير المحلي بيتكوّن من جديد مع كل استدعاء للدالة. محتاجين <strong>State</strong>: ذاكرة React للكومبوننت بين الرندرات، وطريقة تخبرها إن فيه قيمة اتغيّرت.</p>${code(`import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(previous => previous + 1);
  }
  return <button onClick={handleClick}>العدد: {count}</button>;
}`,'Counter.jsx')}${rows([['useState(0)','Hook بتجهز State، والقيمة الابتدائية هنا 0.'],['count','القيمة الحالية للرندر ده.'],['setCount','Setter: دالة بتطلب تحديث الحالة ورندر لاحق. الاسم من اختيارنا؛ المعتاد set + اسم القيمة.'],['[ ... ]','Array destructuring: بنستخرج عنصري array اللي useState رجّعتها.'],['previous =>','دالة تحديث بتاخد الحالة المعلقة السابقة وتحسب الجديدة.']])}${practice('counter','عدّاد: البيانات تتغيّر، الواجهة تتحدّث')}<p>كل نسخة من Counter لها State مستقلة. حط عدّادين جنب بعض، هتلاقي الضغط على واحد مش بيغيّر التاني. لو عايز قيمة مشتركة، هترفع State للأب في الدرس الجاي.</p>`),
section('snapshot','٣. State لقطة، مش متغير بيتغيّر فورًا',`<p>كل رندر له قيمته الخاصة من State. لما تنادي setter، انت بتحجز قيمة للرندر الجاي؛ <strong>المتغير الحالي جوّه نفس الدالة بيحتفظ بلقطة الرندر اللي بدأ منه</strong>. عشان كده الطباعة بعد setter هتشوف قيمة اللقطة الحالية.</p>${code(`function handleClick() {
  setCount(count + 1);
  console.log(count); // قيمة الرندر الحالي، مش القيمة الجاية
}`,'داخل Counter')}${flow([['Event','الضغط على الزرار'],['setCount','طلب تحديث'],['Render','حساب الواجهة الجديدة'],['Commit','تطبيق التغييرات']])}<p><strong>Batching</strong> يعني React بتجمع تحديثات خلال الحدث قبل ما تعالج الرندر. لو عايز ٣ زيادات تعتمد على السابقة، استخدم updater function؛ كل دالة بتاخد نتيجة اللي قبلها في الطابور.</p>${code(`function addThree() {
  setCount(previous => previous + 1);
  setCount(previous => previous + 1);
  setCount(previous => previous + 1);
}`,'داخل Counter')}<p>كتابة <code>setCount(count + 1)</code> ثلاث مرات داخل نفس الـ handler بتطلب نفس القيمة ٣ مرات؛ count هي نفس اللقطة. ما تحطش alert أو طلب شبكة جوّه updater function؛ لازم تفضل نقية لأنها ممكن تتنادى أكتر من مرة في التطوير.</p>`),
section('hooks','٤. قواعد Hooks من أول يوم',`<p><strong>Hook</strong> دالة تبدأ بـ use وتوصّلك لإمكانيات React. استدعِ useState في أعلى دالة الكومبوننت، قبل أي return مشروط. ما تستدعيهاش جوّه if أو loop أو Event handler، ولا في دالة JavaScript عادية. React بتعتمد على ثبات ترتيب الاستدعاءات بين الرندرات.</p>${code(`import { useState } from 'react';

export default function Details() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <button onClick={() => setIsOpen(open => !open)}
              aria-expanded={isOpen}>
        {isOpen ? 'اخفي التفاصيل' : 'اعرض التفاصيل'}
      </button>
      {isOpen && <p>دي تفاصيل إضافية بتظهر حسب State.</p>}
    </section>
  );
}`,'Details.jsx')}${note('!open بتعمل إيه؟','علامة ! بتعكس Boolean: لو كانت true تبقى false، ولو false تبقى true. ده Toggle، يعني التبديل بين حالتين. استخدم updater لما الجديدة مبنية على السابقة.')}`),
section('identity','٥. امتى State بتفضل وامتى بتتصفر؟',`<p>React بتربط State بمكان الكومبوننت ونوعه وهويته في شجرة الواجهة. لو نفس الكومبوننت في نفس المكان، الحالة عادة بتفضل. لو شلته أو بدّلت نوعه أو key بتاعته، ممكن الحالة تتصفّر ويبدأ من جديد.</p><p>عشان كده ما تعرّفش كومبوننت جديدة جوّه دالة كومبوننت أب؛ تعريف الدالة الجديد كل رندر ممكن يغيّر هويتها. وما تحطش key عشوائية للكارت. استخدم key متغيرة بس لو انت <strong>قاصد</strong> تعيد تهيئة الجزء، زي فورم مستخدم جديد.</p>${code(`function ProfileArea({ userId }) {
  return <ProfileForm key={userId} userId={userId} />;
}`,'مثال على إعادة التهيئة المقصودة')}<p>الكود ده مثال لفكرة الهوية؛ ProfileForm لازم تكون كومبوننت معرّفة في مشروعك. لو userId اتغيّرت، React هتعتبر الفورم نسخة جديدة بحالة جديدة.</p>`),
section('apply','٦. ورشة: عدّاد وإظهار تفاصيل',`${exercise('تطبيق ١ — عدّاد كامل','اعمل زرار + وزرار − وزرار تصفير. امنع العدد ينزل تحت صفر، وخليه يزيد ٣ بزرار تاني. جرّب الضغط بسرعة وفسّر ليه updater function مناسبة.',`import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <section>
      <h1>{count}</h1>
      <button onClick={() => setCount(n => n + 1)}>+</button>
      <button disabled={count === 0}
              onClick={() => setCount(n => Math.max(0, n - 1))}>−</button>
      <button onClick={() => setCount(n => n + 3)}>+3</button>
      <button onClick={() => setCount(0)}>تصفير</button>
    </section>
  );
}`)}${exercise('تطبيق ٢ — تفاصيل منتج','حط Boolean State باسم isOpen. غيّر نص الزرار بين عرض وإخفاء، واعرض وصف المنتج حسب الحالة. ضيف aria-expanded للزرار.',`import { useState } from 'react';
export default function ProductDetails() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section>
      <button aria-expanded={isOpen}
              onClick={() => setIsOpen(value => !value)}>
        {isOpen ? 'إخفاء' : 'عرض التفاصيل'}
      </button>
      {isOpen && <p>كشكول 100 ورقة للمذاكرة.</p>}
    </section>
  );
}`)}`)
],quizzes:[{q:'setCount بتغيّر count الحالية فورًا في نفس الـ handler؟',options:['أيوه فورًا','لأ، بتطلب قيمة لرندر لاحق','بتحتاج reload'],answer:1,why:'الـ handler شايف snapshot الرندر الحالي. setter بيطلب تحديث يعالَج في رندر لاحق.'},{q:'فين مكان استدعاء useState الصحيح؟',options:['جوّه onClick','جوّه شرط لو المستخدم مسجل','في أعلى Function Component'],answer:2,why:'ترتيب Hooks لازم يفضل ثابت؛ نستدعيها في أعلى الكومبوننت أو Custom Hook.'}],source:'https://react.dev/learn/state-as-a-snapshot'},
{title:'فورمات وState مشتركة وتحديث البيانات',short:'من مدخلات المستخدم لواجهة مترابطة',icon:'☷',desc:'نتحكم في الحقول، نعمل validation، نحدّث objects وarrays من غير تعديل مباشر، ونوصل الكومبوننتس ببعض.',objectives:['تبني Controlled form','تعمل immutable updates','ترفع State للأب'],plan:['٣٠ دقيقة فورمات','٣٠ دقيقة تحديثات','٢٥ دقيقة مشاركة State','٣٥ دقيقة ورشة'],sections:[
section('input','١. Controlled input: قيمة واحدة واضحة',`<p>Controlled input حقل قيمته متوصّلة بـ State. <code>value</code> بتعرض القيمة، و<code>onChange</code> بتسجّل كتابة المستخدم. لازم الاتنين يبقوا موجودين لو الحقل قابل للتعديل. القيمة الأولية للنص تكون <code>''</code> بدل undefined عشان ما تبدّلش بين حقل متحكم فيه وحقل مستقل.</p>${code(`import { useState } from 'react';

export default function NameForm() {
  const [name, setName] = useState('');
  return (
    <section>
      <label htmlFor="name">اسمك</label>
      <input id="name" value={name}
             onChange={event => setName(event.target.value)} />
      <p>أهلًا يا {name || 'صاحبنا'}</p>
    </section>
  );
}`,'NameForm.jsx')}${rows([['event','كائن الحدث اللي React بتمرّره للدالة.'],['target.value','النص الحالي داخل الحقل. حتى input type="number" بتديك value كنص؛ حوّله لرقم لما تحتاج حساب وتحقق من الحقل الفاضي.'],['name || ...','لو name فارغة، نعرض القيمة البديلة. || بتعيد قيمة، مش مجرد true/false.']])}${practice('name','اكتب اسمك وشوف المعاينة')}<p>للـ checkbox استخدم <code>checked</code> بدل value لتمثيل الاختيار، واقرا <code>event.target.checked</code>. أما input مستقل، ممكن يبدأ بـ defaultValue وتقرأه وقت إرسال الفورم، بس هنا هنستخدم Controlled عشان نفهم اتصال البيانات بالواجهة.</p>`),
section('submit','٢. الإرسال والتحقق من المدخلات',`<p>الفورم الطبيعي ممكن يحمّل صفحة تانية وقت الإرسال. بنستخدم <code>onSubmit</code> على form و<code>preventDefault()</code> عشان ندير الإرسال في JavaScript. خليك واضح في type بتاع الأزرار؛ زرار داخل form نوعه الافتراضي submit، فالأزرار الأخرى اكتب لها <code>type="button"</code>.</p>${code(`import { useState } from 'react';

export default function Signup() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setMessage('اكتب اسم من حرفين على الأقل.');
      return;
    }
    setMessage('أهلًا يا ' + name.trim() + '!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="full-name">الاسم</label>
      <input id="full-name" value={name}
        onChange={e => setName(e.target.value)} />
      <button type="submit">إرسال</button>
      <p role="status">{message}</p>
    </form>
  );
}`,'Signup.jsx')}<p><strong>Validation</strong> التحقق إن البيانات مناسبة. <code>trim()</code> بترجع نص جديد من غير مسافات البداية والنهاية. التحقق في المتصفح يحسن التجربة؛ لو بتبعت لسيرفر حقيقي، السيرفر كمان لازم يتحقق. الرسالة هنا محلية ومش تسجيل حساب فعلي.</p>`),
section('objects','٣. تحديث Object من غير تعديل مباشر',`<p>لو عندك profile في State، ما تغيّرش <code>profile.name</code> وبعدين تبعت نفس object. اعمل نسخة جديدة وغيّر الخاصية المطلوبة. ده اسمه <strong>Immutable update</strong>: البيانات القديمة نسيبها زي ما هي.</p>${code(`const [profile, setProfile] = useState({ name: '', city: 'القاهرة' });

function changeName(name) {
  setProfile(previous => ({ ...previous, name }));
}`,'داخل Component مع import useState')}<p>الأقواس حول object في Arrow function <code>previous => ({...})</code> بتخلي JavaScript تفهم إننا بنرجع object، مش فاتحين جسم دالة. <code>name</code> المختصرة تعني <code>name: name</code>.</p>${code(`const [profile, setProfile] = useState({
  name: 'مريم',
  address: { city: 'القاهرة', street: 'شارع النيل' }
});

function changeCity(city) {
  setProfile(previous => ({
    ...previous,
    address: { ...previous.address, city }
  }));
}`,'تحديث قيمة متداخلة')}<p>Spread بتعمل <strong>نسخة سطحية</strong>، فلو قيمة داخل object متداخلة هننسخ مستواها كمان. ما تستخدمش نسخة سطحية وبعدين تعدّل الخاصية المتداخلة مباشرة؛ ساعتها النسخة القديمة والجديدة لسه بيشاركوا نفس object الداخلية.</p>`),
section('arrays','٤. Array: إضافة وحذف وتعديل',`<p>ممنوعات عملية في State: ما تعملش push أو splice أو sort مباشرة على array الموجودة في الحالة. الطرق دي ممكن تعدّل الأصل. بدل كده استخدم spread للإضافة، filter للحذف، وmap للتعديل.</p>${code(`const [tasks, setTasks] = useState([]);

function addTask(title) {
  const task = { id: crypto.randomUUID(), title, done: false };
  setTasks(previous => [...previous, task]);
}

function deleteTask(id) {
  setTasks(previous => previous.filter(task => task.id !== id));
}

function toggleTask(id) {
  setTasks(previous => previous.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  ));
}`,'دوال داخل Component')}<p><code>crypto.randomUUID()</code> بتنتج id جديدة؛ شغّلها وقت إنشاء العنصر، مش وقت الرندر. بتحتاج متصفح حديث وسياق آمن زي HTTPS أو localhost. <code>!==</code> مقارنة صارمة بعدم التساوي. في map بننسخ object اللي تغيّرت، ونرجع بقية العناصر كما هي.</p>${note('عايز ترتب؟','انسخ الأول: <code>[...tasks].sort(...)</code>، أو استخدم طريقة غير معدّلة زي toSorted لو بيئة مشروعك بتدعمها. المهم ما تعدّلش array الأصلية الموجودة في State.','orange')}`),
section('lifting','٥. Lifting State Up: شارك من الأب',`<p>تخيّل حقل بحث في SearchBox وقائمة في Results. لو كل واحد محتفظ بنص بحث مستقل، هيتوهوا من بعض. الحل: أقرب أب مشترك يحتفظ بالنص ويبعت القيمة للحقل، ويبعت دالة تحديث. القائمة تقرا نفس القيمة.</p>${code(`import { useState } from 'react';

function SearchBox({ query, onQueryChange }) {
  return (
    <input aria-label="البحث" value={query}
      onChange={e => onQueryChange(e.target.value)} />
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const products = ['قلم', 'كشكول', 'شنطة'];
  const visible = products.filter(name => name.includes(query));
  return (
    <main>
      <SearchBox query={query} onQueryChange={setQuery} />
      <ul>{visible.map(name => <li key={name}>{name}</li>)}</ul>
    </main>
  );
}`)}<p><strong>Callback prop</strong> دالة بنبعتها كـ prop. الابن بيناديها بالقيمة الجديدة؛ الأب هو صاحب State وبيقرر التحديث. أسماء زي onQueryChange من اختيارنا. <strong>Single source of truth</strong> يعني قيمة واحدة موثوقة بدل نسختين لازم نطابقهم يدويًا. استخدام اسم المنتج كـ key هنا صالح بس لأن أسماء المثال فريدة وثابتة؛ في بيانات حقيقية استخدم id.</p>${flow([['App','query + setQuery'],['SearchBox','يعرض ويطلب تعديل'],['Results','يعرض النتائج المشتقة']])}`),
section('apply','٦. ورشة قائمة مهام صغيرة',`${practice('tasks','ضيف مهمة، علّمها خلصت، أو امسحها')}${exercise('تطبيق الجلسة — فورم وقائمة','خُد ٣٥ دقيقة: ضيف مهمة من form، امنع النص الفاضي، اعرض العدد المتبقي، واعمل toggle وحذف. خلّي البيانات عند الأب. العدد يتحسب من القائمة من غير State إضافية.',`const remaining = tasks.filter(task => !task.done).length;

function handleSubmit(event) {
  event.preventDefault();
  const title = draft.trim();
  if (!title) return;
  addTask(title);
  setDraft('');
}

// draft وtasks ودوال التحديث State داخل الكومبوننت.
// اعرض remaining، واربط input بـ draft وsetDraft.
// الحل المتكامل في الجلسة الثامنة.`,'خطة الحل')}<p>اختبر نص كله مسافات، مهمتين بنفس العنوان، حذف مهمة في النص، وتغيير حالة أول مهمة. لازم id تختلف حتى لو العنوان واحد. احتفاظك بالعدد المتبقي في State منفصلة بيزود فرصة إن العدد والقائمة يختلفوا؛ حسابه وقت الرندر أبسط.</p>`)
],quizzes:[{q:'أنهي طريقة سليمة لحذف مهمة من State؟',options:['tasks.splice مباشرة','filter وبعدين setTasks','تغيير DOM يدويًا'],answer:1,why:'filter بتعمل array جديدة بالعناصر اللي محتاجينها، وsetter بتطلب التحديث.'},{q:'كومبوننتين محتاجين نفس قيمة البحث؛ نعمل إيه؟',options:['نكرر State في الاتنين','نرفع State للأب المشترك','نستخدم متغير عالمي وخلاص'],answer:1,why:'الأب بيحتفظ بمصدر واحد للقيمة، ويبعت قيمة ودوال تحديث للأبناء.'}],source:'https://react.dev/learn/sharing-state-between-components'},
{title:'برا React: useEffect والتعامل مع البيانات',short:'Effects وتنظيفها وطلبات الشبكة',icon:'⟳',desc:'نفهم إمتى نحتاج Effect، وإزاي ننضّفها، ونعرض بيانات من API مع حالات التحميل والخطأ.',objectives:['تحدد وقت احتياج Effect','تكتب dependencies وcleanup','تدير طلب شبكة بأمان'],plan:['٣٠ دقيقة Effects','٢٥ دقيقة Cleanup','٣٥ دقيقة شبكة','٣٠ دقيقة تطبيق'],sections:[
section('effect','١. إمتى نحتاج useEffect؟',`<p><strong>Effect</strong> وسيلة لمزامنة الكومبوننت مع حاجة خارج React، زي عنوان المتصفح أو مؤقت أو اشتراك في خدمة. بتشتغل بعد Commit. التفاعل اللي سببه ضغط المستخدم غالبًا مكانه Event handler؛ والحسابات زي فلترة قائمة مكانها الرندر.</p>${code(`import { useEffect, useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'العدد: ' + count;
    return () => { document.title = previousTitle; };
  }, [count]);

  return <button onClick={() => setCount(n => n + 1)}>{count}</button>;
}`)}<p>العدد بيتعرض من State من غير Effect. الـ Effect هنا تخص عنوان document، حاجة خارج وصف JSX. رجعنا دالة تسترجع العنوان السابق عند التنظيف. لو في أكتر من جزء مسؤول عن عنوان الصفحة، نظّم المسؤولية عشان ما يتنافسوش.</p>${note('ما تحتاجش Effect للحساب ده','<code>const remaining = tasks.filter(t => !t.done).length</code> حساب عادي من State. ما تعملش State للعدد وبعدين Effect تحدّثها؛ ده تعقيد ورندر إضافي من غير داعي.','purple')}`),
section('dependencies','٢. Dependency array مش اختيار عشوائي',`<p>الدالة الأولى لـ useEffect فيها الشغل. الـ array التانية بتحدد القيم اللي المزامنة تعتمد عليها. لازم تحط <strong>كل قيمة reactive</strong> الـ Effect بتقراها من نطاق الكومبوننت؛ زي props وstate ودوال أو متغيرات متعرفة داخله.</p>${rows([['بدون array','Effect بتشتغل بعد كل Commit للكومبوننت. لو بتحدّث State كل مرة ممكن تعمل حلقة لا نهائية.'],['[]','لا تعتمد على قيم reactive متغيرة؛ بتبدأ عند التركيب. StrictMode تعمل دورة إضافية في التطوير.'],['[query]','تبدأ عند التركيب، وتتنظف وتبدأ تاني لما query تختلف عن السابقة حسب Object.is.']])}<p>ما تخفيش تحذير dependencies لمجرد إنك عايزها تشتغل مرة. عدّل تصميم الكود بحيث يعبّر عن البيانات اللي بتستخدمها فعلًا. object أو دالة جديدة في كل رندر ممكن تتسبب في إعادة تشغيل Effect؛ ساعات الحل نقل إنشاء object جوّه Effect أو نقل قيمة ثابتة خارج الكومبوننت.</p>${code(`useEffect(() => {
  console.log('المستخدم الحالي:', userId);
}, [userId]);`,'مقتطف داخل Component')}<p>الـ Effect دي بتستخدم userId، فلازم يبقى في dependencies. حذفها يخلي الكود يعتمد على لقطة قديمة، وده اسمه <strong>Stale closure</strong>: الدالة شايلة قيمة من رندر سابق بدل القيمة اللي محتاجينها دلوقتي.</p>`),
section('cleanup','٣. Cleanup: افتح الشغل واقفله',`<p>لو Effect بدأت مؤقت أو اشتراك، لازم تعرف توقفه. الدالة اللي بتُرجعها هي <strong>Cleanup</strong>. React بتناديها قبل إعداد Effect من جديد بسبب تغيير dependencies، وكمان لما الكومبوننت تتشال.</p>${code(`import { useEffect, useState } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timerId = setInterval(() => {
      setSeconds(previous => previous + 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  return <p>عدّى {seconds} ثانية</p>;
}`,'Timer.jsx')}<p><code>setInterval</code> بتنادي الدالة كل فترة؛ 1000 مللي ثانية = ثانية. بترجع id بنستخدمها مع clearInterval للإيقاف. الـ updater بتخلّينا ما نحتاجش نقرا seconds جوّه Effect، فـ array الفاضية صحيحة هنا.</p>${flow([['Setup','ابدأ المؤقت'],['Update / Removal','اعتماد اتغيّر أو إزالة'],['Cleanup','أوقف المؤقت القديم']])}${note('ليه بيتكرر في التطوير؟','StrictMode بتجرب دورة إعداد ← تنظيف ← إعداد إضافية عشان تختبر إن تنظيفك صحيح. مؤقت من غير cleanup ممكن تلاحظ إنه بيضاعف. ما تعالجش المشكلة بمنع التشغيل بدالة Ref؛ نظّف الموارد صح.','orange')}`),
section('network','٤. API وfetch وasync/await',`<p><strong>API</strong> هنا واجهة سيرفر بنطلب منها بيانات بعنوان URL. <strong>fetch</strong> دالة في المتصفح بتعمل طلب شبكة وترجع <strong>Promise</strong>، يعني نتيجة هتوصل بعدين. <code>async</code> بتخلي الدالة ترجع Promise، و<code>await</code> بتستنى النتيجة جوّه الدالة من غير ما تجمّد الصفحة.</p>${code(`async function readPosts() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('الطلب فشل: ' + response.status);
  }
  const data = await response.json();
  return data;
}`,'network.js')}<p><strong>JSON</strong> صيغة نصية لتبادل البيانات. <code>response.json()</code> بتحوّل جسم الاستجابة لقيم JavaScript، وبرضه لازم await. <code>response.ok</code> بتكون true لو كود HTTP في نطاق نجاح 200–299. fetch مش بترفض Promise تلقائيًا لكل خطأ HTTP، فلازم تفحص ok.</p><p><strong>try/catch</strong> لتجربة عملية والتعامل مع خطأ متوقع بدل كسر الواجهة. <strong>finally</strong> بتشتغل بعد النجاح أو الخطأ. API المثال خدمة تجريبية عامة؛ بتحتاج إنترنت، ومش مخزن حقيقي لبيانات تطبيقك. لو المتصفح منع الطلب بـ CORS، السيرفر هو اللي لازم يسمح بالأصل المناسب؛ ما تتحايلش بـ no-cors لأنه مش هيديك بيانات قابلة للقراءة.</p>`),
section('fetch-effect','٥. مثال كامل: Loading وError وData',`<p>الشاشة لها حالات: تحميل، خطأ، بيانات، وقائمة فاضية. هنستخدم AbortController عشان نلغي الطلب لما الكومبوننت تتشال. بنستخدم كمان active flag عشان نتيجة قديمة ما تحدّثش الحالة بعد التنظيف.</p>${code(`import { useEffect, useState } from 'react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=5',
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error('تعذّر تحميل البيانات.');
        const data = await response.json();
        if (active) setPosts(data);
      } catch (err) {
        if (active && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  if (loading) return <p role="status">بنحمّل البيانات...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (posts.length === 0) return <p>مفيش مقالات.</p>;
  return <ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>;
}`,'Posts.jsx')}<p>ما تكتبش <code>useEffect(async () => ...)</code>؛ دالة Effect محتاجة ترجع cleanup أو لا ترجع شيء، والدالة async بترجع Promise. اعمل دالة async داخلها وناديها. مثالنا تعليمي؛ في تطبيق أكبر ممكن تستخدم أداة لإدارة بيانات السيرفر والكاش بدل تكرار المنطق.</p>${note('Race condition يعني إيه؟','لو طلب بحث قديم خلص بعد طلب جديد، ممكن يكتب نتائج مش مناسبة للبحث الحالي. التنظيف والإلغاء أو تجاهل النتيجة القديمة يمنعوا ده. لو الطلب يعتمد على query أو userId، حط القيمة في dependencies ونظّف كل طلب قديم.')}`),
section('apply','٦. تطبيق الجلسة: شبكة ومؤقت',`${practice('fetch','حمّل بيانات تجريبية من API فعلية')}${exercise('تطبيق ١ — مؤقت','ابني Timer من المثال. ضيف زرار في الأب يظهر ويخفي Timer. اتأكد إن المؤقت بيتوقف عند الإخفاء. استخدم updater function وcleanup.',`import { useState } from 'react';
import Timer from './Timer.jsx';

export default function App() {
  const [show, setShow] = useState(true);
  return (
    <main>
      <button onClick={() => setShow(value => !value)}>تبديل</button>
      {show && <Timer />}
    </main>
  );
}`)}${exercise('تطبيق ٢ — جرّب حالات الشبكة','انسخ Posts، جرّب عنوان صحيح ثم عنوان يرد 404، وافصل الإنترنت من DevTools. راقب loading وerror، وبعدين رجّع العنوان. أضف زرار إعادة المحاولة باستخدام قيمة retry.',`const [retry, setRetry] = useState(0);

// حط retry في dependencies للـ Effect:
// useEffect(() => { ... }, [retry]);

// زرار في عرض حالة الخطأ:
<button onClick={() => setRetry(n => n + 1)}>جرّب تاني</button>`,'تعديلات داخل Posts.jsx')}<p>المهم تقدر تشرح ليه Effect موجودة أصلًا، وإيه اللي بتبدأه، وإيه اللي بتنظّفه. لو مش عارف تجاوب، ارجع للفكرة قبل إضافة كود جديد.</p>`)
],quizzes:[{q:'فلترة tasks حسب البحث محتاجة Effect؟',options:['أيوه دائمًا','لأ، نحسبها أثناء الرندر','لازم fetch'],answer:1,why:'الفلترة حساب من بيانات موجودة، ومش مزامنة مع نظام خارجي.'},{q:'fetch رجعت 404. لازم نفحص response.ok؟',options:['أيوه، fetch مش بترفض لكل خطأ HTTP','لأ، catch هتشتغل تلقائيًا دائمًا','لازم نمسح StrictMode'],answer:0,why:'fetch ممكن تحقق الـ Promise باستجابة 404؛ افحص ok وارمِ خطأ لو الحالة مش نجاح.'}],source:'https://react.dev/learn/synchronizing-with-effects'},
{title:'نجمع كل ده: مشروع عملي والخطوة الجاية',short:'قائمة مهام متكاملة وRefs وCustom Hooks',icon:'✓',desc:'نكتب مشروع مهام كامل، نفهم useRef وCustom Hook، ونراجع تصحيح الأخطاء والنشر ونحدّد إيه اللي جاي.',objectives:['تجمع أساسيات React في مشروع','تفهم Ref وCustom Hook','تجهّز نسخة للنشر'],plan:['١٥ دقيقة تصميم','٥٥ دقيقة بناء','٢٥ دقيقة أدوات إضافية','٢٥ دقيقة مراجعة'],sections:[
section('design','١. نخطط قبل ما نكتب',`<p>هدف المشروع: المستخدم يضيف مهمة، يعلّمها مكتملة، يحذفها، ويختار عرض الكل أو المتبقي أو المكتمل. State اللي محتاجينها: <code>tasks</code> و<code>draft</code> و<code>filter</code>. القائمة المعروضة والعدد المتبقي نقدر نحسبهم، فمش محتاجين State إضافية.</p><p>قسّم حسب المسؤولية: App صاحب البيانات، TaskForm للكتابة، TaskList للعرض، وTaskItem لمهمة واحدة. ابدأ ببيانات مؤقتة وشكل ثابت، وبعدين وصل State والأحداث. ده بيخلّيك تلاحظ مشاكل الشكل قبل مشاكل المنطق.</p><figure class="diagram"><div class="component-tree"><div class="tree-root">&lt;App /&gt; — tasks, filter</div><div class="tree-stem"></div><div class="tree-children"><span>&lt;TaskForm /&gt;</span><span>&lt;TaskList /&gt;</span><span>&lt;FilterBar /&gt;</span></div></div><figcaption class="diagram-label">الأب يحتفظ بالبيانات، والأبناء تعرضها وتطلب التعديل عن طريق callbacks.</figcaption></figure>${note('نطاق المشروع','النسخة الأساسية دي بياناتها في الذاكرة؛ إعادة تحميل الصفحة بتصفّرها. هنعرض حفظًا محليًا اختياريًا بعد المثال. مفيش تسجيل حساب أو مزامنة بين أجهزة في المشروع ده.')}`),
section('project','٢. الكود المتكامل: انسخه وجرّبه',`<p>الكود ده جاهز يتجرّب في <code>src/App.jsx</code> داخل مشروع Vite. الكومبوننتس هنا في ملف واحد لتسهيل التجربة؛ بعد ما تفهمه انقل TaskForm وTaskItem لملفات في components واعمل import.</p>${code(`import { useState } from 'react';
import './App.css';

function TaskForm({ onAdd }) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    const title = draft.trim();
    if (!title) {
      setError('اكتب مهمة الأول.');
      return;
    }
    onAdd(title);
    setDraft('');
    setError('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task">مهمتك الجديدة</label>
      <div className="form-row">
        <input id="task" value={draft}
          onChange={e => setDraft(e.target.value)}
          aria-describedby="task-error" />
        <button type="submit">إضافة</button>
      </div>
      <p id="task-error" role="status">{error}</p>
    </form>
  );
}

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.done ? 'task done' : 'task'}>
      <label>
        <input type="checkbox" checked={task.done}
          onChange={() => onToggle(task.id)} />
        <span>{task.title}</span>
      </label>
      <button type="button" onClick={() => onDelete(task.id)}
        aria-label={'حذف ' + task.title}>حذف</button>
    </li>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');

  function addTask(title) {
    const task = { id: crypto.randomUUID(), title, done: false };
    setTasks(previous => [...previous, task]);
  }
  function toggleTask(id) {
    setTasks(previous => previous.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  }
  function deleteTask(id) {
    setTasks(previous => previous.filter(task => task.id !== id));
  }

  const visible = tasks.filter(task => {
    if (filter === 'active') return !task.done;
    if (filter === 'done') return task.done;
    return true;
  });
  const remaining = tasks.filter(task => !task.done).length;

  return (
    <main className="todo-app" dir="rtl">
      <h1>خطوة كل يوم</h1>
      <p>متبقي {remaining} من {tasks.length} مهام</p>
      <TaskForm onAdd={addTask} />
      <div className="filters" aria-label="فلترة المهام">
        {[['all', 'الكل'], ['active', 'المتبقي'], ['done', 'المكتمل']]
          .map(([value, label]) => (
            <button type="button" key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}>{label}</button>
          ))}
      </div>
      {visible.length === 0 ? <p>مفيش مهام في العرض ده.</p> : (
        <ul className="task-list">
          {visible.map(task => (
            <TaskItem key={task.id} task={task}
              onToggle={toggleTask} onDelete={deleteTask} />
          ))}
        </ul>
      )}
    </main>
  );
}`)}${code(`* { box-sizing: border-box; }
body { margin: 0; background: #f6f8f1; color: #263d30;
  font-family: Tahoma, sans-serif; }
.todo-app { width: min(640px, calc(100% - 32px));
  margin: 48px auto; padding: 28px;
  background: white; border: 1px solid #dde5d4; border-radius: 18px; }
button, input { font: inherit; }
button { cursor: pointer; border: 1px solid #d0dcbf;
  background: #edf3e5; border-radius: 7px; padding: 9px 14px; }
input:not([type="checkbox"]) { min-width: 0; flex: 1;
  border: 1px solid #d0dcbf; border-radius: 7px; padding: 10px; }
.form-row, .filters { display: flex; gap: 8px; margin: 12px 0; }
.filters { flex-wrap: wrap; }
.filters button[aria-pressed="true"] { background: #2e5943; color: white; }
.task-list { padding: 0; list-style: none; }
.task { display: flex; justify-content: space-between; align-items: center;
  gap: 12px; padding: 12px 0; border-bottom: 1px solid #edf1e7; }
.task label { display: flex; align-items: center; gap: 9px; overflow-wrap: anywhere; }
.task.done span { text-decoration: line-through; color: #788770; }
button:focus-visible, input:focus-visible { outline: 3px solid #8db15e; }
@media (max-width: 480px) {
  .todo-app { margin: 24px auto; padding: 18px; }
}`,'src/App.css')}<p>في الفلاتر استخدمنا Array destructuring بـ <code>([value, label])</code> عشان نستخرج القيمتين. <code>aria-pressed</code> بتوضح حالة زرار التبديل لأدوات المساعدة. الفورم بيملك draft لأنه محدش غيره محتاجها، والأب بيملك tasks لأنها مطلوبة في أجزاء مختلفة.</p>`),
section('ref','٣. useRef: لما قيمة مش محتاجة رندر',`<p><strong>useRef</strong> بترجع object فيها <code>current</code>. القيمة بتفضل بين الرندرات، لكن تغييرها مش بيطلب رندر. نستخدمها مثلًا للوصول لحقل DOM وعمل focus بعد ضغط زرار. لو القيمة لازم تظهر وتتحدث على الشاشة، State هي الأنسب.</p>${code(`import { useRef } from 'react';

export default function FocusDemo() {
  const inputRef = useRef(null);
  return (
    <div>
      <label htmlFor="focus-name">اسمك</label>
      <input id="focus-name" ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>
        روح لحقل الاسم
      </button>
    </div>
  );
}`,'FocusDemo.jsx')}<p>React بتحط عنصر input الفعلي في current بعد Commit، وبترجعه null لما العنصر يتشال. <code>?.</code> اسمها Optional chaining: ما تناديش focus لو القيمة null أو undefined. تجنب قراءة أو كتابة ref أثناء الرندر إلا التهيئة المسموح بها؛ التعامل هنا داخل handler.</p>`),
section('custom','٤. Custom Hook وحفظ محلي اختياري',`<p>لما منطق Hooks بيتكرر، ممكن نحطه في دالة تبدأ بـ <code>use</code>. اسمها <strong>Custom Hook</strong>. بتشارك المنطق، مش نفس State بين الاستدعاءات. المثال ده بيحفظ بيانات JSON في المتصفح بـ <strong>localStorage</strong>؛ حفظ على الجهاز ونفس أصل الموقع، مش قاعدة بيانات ولا مزامنة.</p>${code(`import { useEffect, useState } from 'react';

export function useStoredTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem('react-learning-tasks');
      if (!raw) return [];
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) return [];
      return data.filter(task => task &&
        typeof task.id === 'string' &&
        typeof task.title === 'string' &&
        typeof task.done === 'boolean');
    } catch {
      return [];
    }
  });
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('react-learning-tasks', JSON.stringify(tasks));
      setStorageError('');
    } catch {
      setStorageError('الحفظ المحلي مش متاح؛ المهام لسه في الذاكرة.');
    }
  }, [tasks]);

  return [tasks, setTasks, storageError];
}`,'src/hooks/useStoredTasks.js')}${code(`import { useStoredTasks } from './hooks/useStoredTasks.js';

// بدّل سطر useState الخاص بـ tasks داخل App:
const [tasks, setTasks, storageError] = useStoredTasks();

// اعرض الرسالة داخل JSX:
{storageError && <p role="status">{storageError}</p>}`,'تعديلات على App.jsx')}<p><code>JSON.parse</code> بتحوّل النص لقيم، و<code>JSON.stringify</code> بتحوّل القيم لنص. القراءة هنا initializer function لـ useState: React بتستخدمها للتهيئة، وممكن تستدعيها مرتين في StrictMode لفحص النقاء؛ ما تعملش فيها كتابة أو حذف. المثال للمتصفح داخل Vite، مش جاهز كما هو لـ SSR اللي بيشغّل كود على السيرفر حيث localStorage مش موجودة.</p>${note('حدود الحفظ','المتصفح ممكن يمنع التخزين أو المستخدم يمسحه. ما تخزّنش أسرار فيه. لو فتحت الموقع من أصل مختلف، البيانات المحلية مش هتتنقل. الهدف هنا نفهم تنظيم المنطق والتعامل مع فشل الحفظ.','orange')}`),
section('debug','٥. تصحيح الأخطاء ومراجعة المشروع',`<p><strong>DevTools</strong> أدوات المطوّر في المتصفح. Console للأخطاء والطباعة، Network لطلبات الشبكة، وElements لفحص DOM والتنسيق. إضافة <a href="https://react.dev/learn/react-developer-tools" target="_blank" rel="noopener">React Developer Tools ↗</a> بتساعدك تشوف الكومبوننتس وprops وstate.</p>${rows([['Invalid Hook call','راجع إن Hook داخل Component أو Custom Hook، وراجع ترتيبها. السبب ممكن يكون كمان نسخ React مكررة أو إصدارات غير متوافقة.'],['Too many re-renders','غالبًا setter بتتنده أثناء الرندر، أو handler بتستدعيه فورًا بدل تمرير الدالة.'],['Each child needs key','حط key مستقرة على العنصر المباشر الراجع من map.'],['Input read-only','حط onChange مع value للحقل القابل للتعديل، أو readOnly لو متعمد.'],['Objects are not valid','ما تعرضش object مباشرة في JSX؛ اعرض خاصية زي user.name، أو stringify للتشخيص فقط.'],['Unexpected token','راجع الأقواس والوسوم المقفولة، ونوع الملف .jsx لو فيه JSX.']])}<p>اختبر إضافة نص فارغ، مهمتين بنفس الاسم، حذف أول وآخر مهمة، الفلاتر من غير نتائج، لوحة المفاتيح، وشاشة ٣٦٠ بكسل. لو طبّقت الحفظ اختبر Reload، وبيانات تخزين تالفة، ومنع التخزين. خطوات التحقق دي أهم من إن الكود «اشتغل مرة».</p>`),
section('next','٦. النشر وإيه اللي جاي بعد الأساسيات؟',`<p>شغّل <code>npm run build</code>، وبعد النجاح <code>npm run preview</code> عشان تجرب نسخة الإنتاج. لو هترفع على استضافة static زي Vercel أو Netlify، إعدادات مشروع Vite غالبًا أمر البناء npm run build ومجلد الناتج dist. راجع توثيق المنصة؛ تفاصيل الخطوات ممكن تتغيّر. لو بتنشر تحت مسار فرعي، راجع إعداد <code>base</code> في Vite.</p><p>«نص منهج React» مش نسبة رسمية؛ الدليل ده بيغطي الأساسيات العملية لحد State وEffects والشبكة، ومعاهم مقدمة Refs وCustom Hooks. بعد ما تخلص المشروع، الطريق الطبيعي: <strong>Routing</strong> للتنقل بين صفحات، <strong>Context</strong> لمشاركة بيانات بعيدة، <strong>useReducer</strong> لتنظيم تحديثات معقدة، ثم اختبارات وأدوات بيانات السيرفر وتحسين الأداء عند الحاجة. TypeScript وFrameworks مرحلة لاحقة حسب هدفك.</p>${exercise('التحدي الأخير — النسخة بتاعتك','قسّم المشروع لملفات، ضيف حقل بحث، وحساب عدد المكتمل من tasks. بعدها طبّق الحفظ المحلي وجرّب كل الحالات. ما تضيفش State للنتائج المشتقة.',`const [query, setQuery] = useState('');
const completed = tasks.filter(task => task.done).length;

const visible = tasks.filter(task => {
  const matchesText = task.title.includes(query.trim());
  const matchesStatus = filter === 'all' ||
    (filter === 'active' && !task.done) ||
    (filter === 'done' && task.done);
  return matchesText && matchesStatus;
});`,'داخل App.jsx')}<p>لو تقدر تشرح كل State وليه موجودة، وكل prop جاية منين، وكل Effect بتزامن إيه، وتضيف ميزة من غير نسخ الكود عمياني، انت بنيت أساس كويس تكمّل عليه. افتح مشروعك واكتب تعليقًا بصوتك عند الأجزاء اللي محتاجة مراجعة.</p>`)
],quizzes:[{q:'قيمة محتاج تتغيّر وتظهر فورًا في الواجهة؛ نستخدم إيه؟',options:['useRef دائمًا','State','متغير خارج الكومبوننت'],answer:1,why:'State بتطلب رندر عند تحديثها. تغيير ref.current لوحده مش بيحدّث العرض.'},{q:'Custom Hook بتشارك إيه بين استدعاءين؟',options:['نفس State تلقائيًا','المنطق، وكل استدعاء له حالته','كل DOM في الصفحة'],answer:1,why:'Custom Hook بتعيد استخدام منطق Hooks؛ كل استدعاء مستقل في حالته.'}],source:'https://react.dev/learn/reusing-logic-with-custom-hooks'}
];
const projectFiles = [
 ['📁 node_modules/','الحزم اللي npm install نزّلها. ما تعدّلهاش يدويًا؛ غالبًا ما تتبعتش مع Git. ممكن إعادة تكوينها من package.json وملف القفل.'],
 ['📁 public/','ملفات ثابتة بتتقدم زي ما هي. لو حطيت favicon.svg هنا تقدر تطلبه بمسار /favicon.svg.'],
 ['📁 src/assets/','صور وخطوط وأصول بتستوردها من الكود؛ Vite بتجهز مساراتها في البناء.'],
 ['  App.jsx','الكومبوننت الرئيسي للواجهة اللي هتكتبها. ممكن يقسم الصفحة لأجزاء في components.'],
 ['  App.css','تنسيق الكومبوننت الرئيسي في القالب. مش عزل تلقائي؛ قواعد CSS بتتطبق حسب المحددات.'],
 ['  index.css','تنسيقات عامة زي font وbody وbox-sizing. غالبًا main.jsx بيستورده.'],
 ['  main.jsx','نقطة دخول JavaScript؛ بيستورد App ويستخدم createRoot لربط React بعنصر root.'],
 ['index.html','صفحة HTML الأساسية، فيها root وscript لملف main.jsx، وكمان title وmetadata.'],
 ['package.json','اسم المشروع وأوامر scripts والحزم وإعدادات أخرى. JSON لازم تلتزم بصيغتها.'],
 ['package-lock.json','تفاصيل النسخ المثبتة عشان التثبيت يبقى قابل للتكرار. احتفظ بيه في Git.'],
 ['vite.config.js','إعدادات Vite وplugins زي plugin React. نستخدمه لو احتجنا base أو إعدادات بناء.'],
 ['eslint.config.js','قواعد ESLint لتحليل الكود وكشف أخطاء وأنماط خطرة، ومنها قواعد Hooks حسب القالب.'],
 ['.gitignore','قائمة الملفات اللي Git يتجاهلها زي node_modules وdist عادة.'],
 ['README.md','تعليمات المشروع. اكتب فيها التشغيل والمتطلبات ووصف تطبيقك.'],
 ['dist/ (بعد build)','الناتج الجاهز للنشر. ده بيتولد من الكود؛ عدّل المصدر وبعدين اعمل build بدل التعديل جوّاه في مشروع React.']
];
