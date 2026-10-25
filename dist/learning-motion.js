/* Deliberately paced, looping teaching sequences. These are conceptual diagrams, not code execution. */
const learningSequences={
 html:[
  ['من الملف إلى العنصر','tree',[
   ['المصدر','المتصفح يقرأ وسم العنوان المكتوب في الملف.','<h1>أول صفحة</h1>'],
   ['التحليل','يتعرف على نوع العنصر والنص الموجود داخله.','Element: h1 → Text: أول صفحة'],
   ['الشجرة','يضيف العنصر داخل body في DOM.','html → body → h1'],
   ['العرض','تظهر نتيجة التركيب والتنسيق كعنوان.','النتيجة: أول صفحة']]],
  ['ترتيب النص والعناوين','tree',[
   ['العنوان الرئيسي','h1 يحدد موضوع الصفحة وليس مجرد حجم كبير.','h1: أساسيات الويب'],
   ['القسم','h2 يفتح موضوعًا داخل الصفحة.','h2: تركيب المحتوى'],
   ['الفقرة','p تحتوي شرحًا نصيًا في هذا القسم.','p: المحتوى هنا...'],
   ['التأكيد','strong تضيف أهمية داخل الفقرة بدون تغيير مستواها.','p → strong: نقطة مهمة']]],
  ['المسار والملف والنتيجة','flow',[
   ['العنوان','src أو href تحدد عنوان المورد المطلوب.','src="images/logo.svg"'],
   ['حل المسار','المتصفح يحسب العنوان من مكان الصفحة الحالي.','/course/ + images/logo.svg'],
   ['الطلب','يحاول الوصول للمورد في العنوان الناتج.','GET /course/images/logo.svg'],
   ['النتيجة','المورد يظهر إن كان موجودًا، والنص البديل يظل مهمًا للصورة.','img + alt="شعار المسار"']]],
  ['أب وأبناء داخل الوثيقة','tree',[
   ['الحاوية','main يحدد المحتوى الرئيسي.','main'],
   ['القسم','section موضوع داخل المحتوى.','main → section'],
   ['العناصر','عنوان وفقرة أبناء مباشران للقسم.','section → h2 + p'],
   ['الدلالة','الأسماء تصف المسؤولية؛ CSS ترتب الصناديق لاحقًا.','المعنى ≠ الشكل الافتراضي']]],
  ['احجز الخلايا في الجدول','table',[
   ['الأعمدة','الجدول هنا يتكون من ثلاث مساحات أعمدة.','[ A ] [ B ] [ C ]'],
   ['خلية عادية','td تحجز مساحة واحدة في الصف.','<td>A</td>'],
   ['دمج أفقي','colspan=2 تشغل مساحتين؛ لا تضف خلية لنفس المكان.','<td colspan="2">B + C</td>'],
   ['الصف التالي','يبدأ توزيع جديد مع مراعاة أي rowspan سابق.','tr → td + td + td']]],
  ['من الحقل إلى بيانات الإرسال','flow',[
   ['التسمية','label مرتبطة بالحقل عن طريق id.','for="email" ↔ id="email"'],
   ['القيمة','المستخدم يكتب، والحقل يحتفظ بقيمته الحالية.','value: learner@example.com'],
   ['التحقق','required وtype تفحصان القيود المناسبة قبل الإرسال.','type="email" required'],
   ['الإرسال','name تحدد مفتاح القيمة في بيانات النموذج.','email=learner@example.com']]]
 ],
 css:[
  ['من القاعدة إلى القيمة الفائزة','flow',[
   ['المحدد','المتصفح يبحث عن عناصر تطابق .title.','.title'],
   ['التصريح','القاعدة تطلب قيمة لون محددة.','color: purple;'],
   ['الحسم','Cascade تقارن القواعد المنافسة حسب عواملها.','origin → importance → specificity → order'],
   ['النتيجة','القيمة المحسوبة تطبق على العنصر.','computed color: purple']]],
  ['تنسيق فقرة بخطوات منفصلة','type',[
   ['الحجم','حجم الخط يحدد قياس الحروف.','font-size: 18px;'],
   ['السطر','ارتفاع السطر يوفر مساحة للقراءة.','line-height: 2;'],
   ['العرض','حد عرض الفقرة يسمح بسطور مريحة.','max-width: 65ch;'],
   ['التباين','النص والخلفية لازم يفضلوا مقروءين معًا.','color: #17152e; background: #fff;']]],
  ['طبقات الصندوق واحدة واحدة','box',[
   ['المحتوى','عرض المحتوى في المثال يبدأ من 200px.','content width = 200px'],
   ['الحشو','20px يمين ويسار تضيف 40px مع content-box.','200 + 20 + 20 = 240'],
   ['الحد','2px في الجانبين تضيف 4px.','240 + 2 + 2 = 244px'],
   ['طريقة الحساب','border-box تجعل width تشمل هذه الطبقات، والهامش يظل خارجها.','width: 200px; box-sizing: border-box;']]],
  ['المكان المحجوز والمكان المرئي','position',[
   ['التدفق','العناصر العادية تحجز مواقعها داخل الحاوية.','position: static;'],
   ['إزاحة','relative تغير الشكل المرئي وتحتفظ بمكان البداية.','position: relative; top: 12px;'],
   ['خارج التدفق','absolute تعتمد على حاويتها المرجعية ولا تحجز نفس المكان.','position: absolute; top: 12px;'],
   ['اختفاء','display:none تزيل الصندوق من التخطيط، لا من DOM.','display: none;']]],
  ['محور Flexbox وتوزيع العناصر','layout',[
   ['الحاوية','الأبناء المباشرون يصبحوا عناصر Flex.','display: flex;'],
   ['المحور','row يجعل المحور الرئيسي في اتجاه السطر.','flex-direction: row;'],
   ['المسافة','gap يضع فاصلًا بين العناصر.','gap: 16px;'],
   ['الاتجاه الآخر','column يحول المحور الرئيسي؛ وظيفة justify تظل على الرئيسي.','flex-direction: column;']]],
  ['اختيار حالة ثم قراءة متغير','flow',[
   ['التعريف','المتغير موجود في نطاق الجذر.','--accent: #7053eb;'],
   ['القراءة','الزر يستخدم قيمة المتغير في الخاصية.','color: var(--accent);'],
   ['الحالة','المحدد يتابع التركيز المرئي للمستخدم.','button:focus-visible'],
   ['النتيجة','الحالة تطبق قاعدة محددة بدون عنصر DOM إضافي.','outline: 3px solid var(--accent);']]],
  ['دورة حركة CSS مستمرة','transform',[
   ['البداية','0% تحدد قيمة أول الدورة.','transform: translateX(0);'],
   ['المنتصف','50% تحدد قيمة أخرى يستوفي المتصفح ما بينها.','transform: translateX(36px);'],
   ['النهاية','100% تعود لنقطة البداية.','transform: translateX(0);'],
   ['التكرار','infinite تعيد الدورة، وpaused توقفها.','animation: move 4s infinite;']]],
  ['نفس المحتوى في عرضين','responsive',[
   ['عرض ضيق','القاعدة الأساسية عمود واحد.','grid-template-columns: 1fr;'],
   ['مساحة أكبر','العرض يتيح أكثر من عمود مع الحفاظ على القراءة.','@media (min-width: 700px)'],
   ['توزيع جديد','القاعدة الجديدة تطبق عند تحقق الشرط.','grid-template-columns: repeat(3, 1fr);'],
   ['الرجوع','تضييق العرض يلغي مطابقة الشرط ويرجع للقواعد الأساسية.','width < 700px → 1fr']]]
 ],
 js:[
  ['تتبع قيمة المتغير','memory',[
   ['تعريف','let تنشئ اسمًا وقيمة بداية.','let count = 0;'],
   ['قراءة','التعبير يقرأ القيمة الحالية.','count + 1 → 1'],
   ['إسناد','القيمة الجديدة ترتبط بالاسم.','count = 1;'],
   ['طباعة','Console تعرض القيمة، مش عنصرًا على الصفحة.','console.log(count); // 1']]],
  ['اختيار فرع حسب مقارنة','branch',[
   ['المدخل','نبدأ بقيمة عددية.','const score = 75;'],
   ['المقارنة','النتيجة قيمة منطقية.','score >= 60 → true'],
   ['الفرع','الفرع الصحيح فقط ينفذ في السلسلة.','if (true) { result = "pass"; }'],
   ['الناتج','البديل لم يُنفذ لأن الفرع الأول تحقق.','result → "pass"']]],
  ['دورة for بالترتيب','loop',[
   ['التهيئة','تنفذ مرة قبل الاختبارات.','let i = 0;'],
   ['الشرط','لو false تنتهي الحلقة.','i < 3'],
   ['الجسم','التعليمة تعمل للقيمة الحالية.','console.log(i);'],
   ['التحديث','زد القيمة ثم ارجع للشرط، لا للتهيئة.','i++ → اختبار i < 3']]],
  ['من استدعاء دالة لنتيجة','call',[
   ['التعريف','الدالة جاهزة لكن جسمها لم يُنفذ بعد.','function double(n) { return n * 2; }'],
   ['الاستدعاء','argument تذهب للـparameter.','double(4) → n = 4'],
   ['الحساب','الجسم يحسب من المدخل.','n * 2 → 8'],
   ['الرجوع','return تعيد القيمة وتُنهي الاستدعاء.','const result = 8;']]],
  ['map تحول وfilter تختار','array',[
   ['الأصل','array مرتبة بعناصر وفهارس.','[2, 4, 6]'],
   ['التحويل','map ترجع قيمة مقابلة لكل عنصر.','.map(n => n * 2) → [4, 8, 12]'],
   ['الاختيار','filter تحتفظ بالعناصر المطابقة.','.filter(n => n > 4) → [8, 12]'],
   ['الجمع','reduce تجمع الناتج بمراكم يبدأ من صفر.','.reduce((sum,n) => sum+n, 0) → 20']]],
  ['توسيع نطاق العشوائية','memory',[
   ['قيمة أولية','random في المثال ترجع 0.42 داخل النطاق.','0 <= r < 1; r = 0.42'],
   ['توسيع','نضرب في عدد النتائج المطلوبة.','0.42 * 6 = 2.52'],
   ['تقريب','floor تختار العدد الصحيح الأسفل.','Math.floor(2.52) = 2'],
   ['إزاحة','نضيف واحدًا ليبدأ النطاق من 1.','2 + 1 = 3; range: 1..6']]],
  ['اختيار عنصر وتغيير نصه','tree',[
   ['الشجرة','العنصر موجود بعد تحليل الوثيقة.','body → h1#title'],
   ['الاختيار','المحدد يبحث عن أول مطابقة.','document.querySelector("#title")'],
   ['الفحص','نتأكد أن النتيجة ليست null.','if (title) { ... }'],
   ['التعديل','نكتب كنص في نفس العنصر.','title.textContent = "عنوان جديد";']]],
  ['من حدث الإرسال لعنصر جديد','flow',[
   ['الحدث','form تستقبل submit من زر أو Enter.','form.addEventListener("submit", handler);'],
   ['التحقق','نمنع الإرسال التقليدي ونفحص النص.','event.preventDefault(); value.trim();'],
   ['الإنشاء','العنصر جديد ومحتواه نص آمن.','li.textContent = cleanTitle;'],
   ['الإرفاق','أصبح داخل شجرة القائمة فظهر.','list.append(li);']]],
  ['طلب بيانات لا يجمد الصفحة','async',[
   ['البدء','تظهر حالة التحميل.','loading = true; fetch(url);'],
   ['الانتظار','بقية التفاعلات مستمرة؛ متابعة الدالة تنتظر.','await response;'],
   ['الفحص','HTTP ثم قراءة body ثم شكل البيانات.','if (!response.ok) throw Error();'],
   ['الإنهاء','نعرض البيانات أو رسالة فشل وننهي التحميل.','success / error → loading = false']]],
  ['من array إلى تخزين ثم قراءة','storage',[
   ['الذاكرة','لدينا array في البرنامج.','const tasks = [{ title: "React" }];'],
   ['نص JSON','نحوّل بيانات متوافقة لنص.','JSON.stringify(tasks)'],
   ['التخزين','نكتب النص تحت مفتاح خاص.','localStorage.setItem("tasks", text);'],
   ['القراءة','نقرأ ونفك ونفحص النوع قبل الاستخدام.','JSON.parse(text) → validate → array']]],
  ['إنشاء نسخة ونداء method','object',[
   ['التعريف','الكلاس يحدد التهيئة والسلوك.','class Task { constructor(title) { this.title = title; } }'],
   ['نسخة','new تنشئ object بهوية وحالة.','const task = new Task("راجع JSX");'],
   ['الخاصية','النسخة تحمل بياناتها.','task.title → "راجع JSX"'],
   ['السلوك','method يمكن مشاركتها عبر prototype.','task.describe() → نتيجة']]]
 ],
 react:[
  ['البيانات تصف شجرة الواجهة','tree',[
   ['المدخلات','Component تقرأ بياناتها الحالية.','title = "React"; count = 2;'],
   ['الحساب','الدالة ترجع وصف عناصر، مش تعديل DOM يدوي.','return <Header title={title} />;'],
   ['الشجرة','الوصف يحدد الأب والأبناء.','App → Header + CourseList'],
   ['التطبيق','React تطبق التغييرات المطلوبة فقط.','Commit → DOM']]],
  ['رحلة تشغيل مشروع Vite','flow',[
   ['الإنشاء','القالب يجهز الملفات الأساسية.','npm create vite@latest app -- --template react'],
   ['الحزم','تنزيل الاعتمادات داخل المشروع.','cd app → npm install'],
   ['التشغيل','خادم التطوير يقدم الملفات للمتصفح.','npm run dev → localhost'],
   ['العرض','main تربط App بعنصر root.','index.html → main.jsx → <App />']]],
  ['Component من تعريف لاستخدام','tree',[
   ['الدالة','تعريف نوع Component بحرف كبير.','function Header() { return <h1>React</h1>; }'],
   ['الاستخدام','JSX تصف مكان النوع داخل الشجرة.','<main><Header /></main>'],
   ['الحساب','React تستدعي الدالة لحساب المحتوى.','Header() → وصف h1'],
   ['DOM','تظهر عناصر HTML الناتجة، لا tag اسمها Header.','main → h1']]],
  ['Props تنزل وطلب الحدث يرجع','props',[
   ['المالك','الأب يحدد القيمة وcallback.','title = "JSX"; onChoose = choose;'],
   ['المرور','الابن يستقبل قيمًا للقراءة.','<Card title={title} onChoose={onChoose} />'],
   ['العرض','Card تقرأ title وتستخدمها في JSX.','<h2>{title}</h2>'],
   ['الإبلاغ','عند حدث تنادي الدالة؛ لا تعدل props.','onChoose(id) → الأب يقرر التحديث']]],
  ['اللقطة القديمة والقيمة التالية','state',[
   ['الحالي','هذا render يقرأ count بقيمة صفر.','count = 0;'],
   ['الحدث','handler تطلب قيمة تالية.','setCount(c => c + 1);'],
   ['حساب جديد','React تعطي القيمة الجديدة للدالة.','next render: count = 1;'],
   ['الواجهة','الرقم الظاهر يتوافق مع الحساب الجديد.','<output>1</output>']]],
  ['الحقل والأب والقائمة بنفس البيانات','state',[
   ['الكتابة','الحقل يرسل النص الجديد.','onChange → setTitle(value)'],
   ['الإرسال','الفورم يمرر عنوانًا صالحًا للأب.','onAdd(title.trim())'],
   ['التحديث','الأب يبني array جديدة.','setTasks(prev => [...prev, newTask])'],
   ['المشاركة','القائمة والعداد يقرآن نفس tasks.','TaskList(tasks) + completed(tasks)']]],
  ['دورة Effect والتنظيف','async',[
   ['التطبيق','الواجهة اتطبقت، والمزامنة تبدأ.','setup → fetch(url, { signal })'],
   ['الانتظار','دورة حالية نشطة والطلب قيد المتابعة.','active = true; loading = true;'],
   ['التنظيف','تغير الاعتماد أو الإزالة يلغي الدورة القديمة.','active = false; controller.abort();'],
   ['الدورة التالية','الإعداد الجديد مستقل، ولا يقبل رد الدورة القديمة.','next setup → new controller']]],
  ['رحلة المهمة في المشروع','state',[
   ['المدخل','فورم تقرأ وتتحقق من العنوان.','title.trim() → validation'],
   ['الذاكرة','App تملك tasks وعملياتها.','add / toggle / delete → new tasks'],
   ['الاشتقاق','الحسابات من المصدر نفسه.','visible = filter(tasks); completed = ...'],
   ['الحفظ','Effect تزامن نسخة نصية مع التخزين.','JSON.stringify(tasks) → localStorage']]]
 ]
};
function learningMotionMarkup(course,index){
 const [title,kind,steps]=learningSequences[course][index];
 return `<figure class="learning-motion" data-learning-motion="${course}:${index}" data-kind="${kind}"><div class="motion-heading"><span class="motion-badge">رسم متحرك للخطوات</span><strong>${esc(title)}</strong></div><p class="motion-intro">محاكاة توضيحية للتسلسل. الحركة بتتكرر بهدوء، وتقدر توقفها أو تمشي خطوة بخطوة.</p><ol class="motion-stops">${steps.map(([label],i)=>`<li class="${i===0?'is-current':''}"><span>${i+1}</span><b>${esc(label)}</b></li>`).join('')}</ol><div class="motion-scene" aria-hidden="true"><div class="scene-link"></div>${[0,1,2,3].map((i)=>`<div class="scene-cell ${i===0?'is-current':''}"><span class="scene-index">${i+1}</span><span class="scene-name">${esc(steps[i][0])}</span><i class="scene-packet"></i></div>`).join('')}</div><div class="motion-explanation"><span class="motion-step-label">الخطوة ١ من ٤</span><h4 class="motion-step-title">${esc(steps[0][0])}</h4><p class="motion-step-text">${esc(steps[0][1])}</p><pre dir="ltr"><code class="motion-step-code">${esc(steps[0][2])}</code></pre></div><div class="motion-controls"><button type="button" class="motion-play" aria-pressed="false">إيقاف الحركة</button><button type="button" class="motion-next">الخطوة التالية</button><button type="button" class="motion-restart">من البداية</button><span>كل خطوة ≈ ٤ ثوانٍ</span></div><figcaption>اقرأ وصف الخطوة مع الكود. الرسم يوضح ترتيب الفكرة، وليس سرعة التنفيذ الفعلية.</figcaption></figure>`;
}
