/* One four-stage loop for every added lesson. */
learningSequences.react.push(
 ['انتقال حالة ثم وصولها للمستهلك','flow',[
  ['الحالي','الذاكرة الحالية عند Provider واحدة لكل الفرع.','tasks = [{ id: "a", done: false }]'],
  ['الوصف','handler تبعت حدثًا ببياناته.','dispatch({ type: "toggled", id: "a" })'],
  ['الحساب','Reducer ترجع نسخة جديدة بدون أثر خارجي.','next = [{ id: "a", done: true }]'],
  ['التوصيل','المستهلك يقرأ القيمة الجديدة من Context ويعرضها.','Provider → useTasks() → UI']]],
 ['الاشتراك من البداية للتنظيف','flow',[
  ['الربط','نصف كيفية الاشتراك في المصدر الخارجي.','subscribe(notify)'],
  ['القراءة','نقرأ لقطة ثابتة ما دام المصدر ثابتًا.','getSnapshot() → online'],
  ['التغير','المصدر يبلغ، فتعيد React قراءة اللقطة.','notify() → compare snapshot → render'],
  ['التنظيف','عند الإزالة نلغي الاشتراك الخاص بهذه الدورة.','removeEventListener(...)']]],
 ['من عنوان الصفحة إلى المكوّن','flow',[
  ['العنوان','تنقل داخلي يغير الموقع في سياق Router.','/tasks/42?q=react'],
  ['المطابقة','Routes تحدد الفرع المناسب حسب path.','tasks/:taskId'],
  ['القيمة','المعرف من useParams نص يحتاج تحققًا.','taskId === "42"'],
  ['العرض','Layout تستمر، وOutlet تعرض الصفحة المطابقة.','Layout → Outlet → TaskPage']]],
 ['Cache وطلب جديد ثم مزامنة','flow',[
  ['الهوية','مفتاح يصف النتيجة المطلوبة بكل محدداتها.','queryKey: ["tasks", userId, page]'],
  ['المصدر','Query تقرأ نسخة أو تبدأ جلبًا وفق السياسة.','queryFn({ signal }) → fetch'],
  ['النتيجة','تظهر البيانات أو حالة فشل مع إعادة محاولة.','pending → success / error'],
  ['التعديل','بعد نجاح Mutation نحدث حداثة القائمة.','invalidateQueries({ queryKey: ["tasks"] })']]],
 ['فعل فورم من القراءة للتأكيد','flow',[
  ['المدخل','حقول مسماة تعطي FormData.','formData.get("title")'],
  ['التحقق','نفحص النوع والطول ونرجع رسالة متوقعة لو فشل.','title.trim().length >= 3'],
  ['الانتظار','Action قيد التنفيذ؛ لا ندعي تأكيدًا قبل المصدر.','pending = true'],
  ['التأكيد','نحدث الحالة المؤكدة، أو نعرض الفشل ونلغي التوقع.','confirmed state / error feedback']]],
 ['القياس قبل تحسين الحساب','flow',[
  ['تفاعل','المستخدم يكتب؛ قيمة الحقل تظل فورية.','setQuery(nextText)'],
  ['قياس','نحدد حسابًا أو رسمًا مكلفًا من دليل.','Profiler → actual cost'],
  ['اختيار','نقل state أو memo أو جدولة حسب السبب.','useMemo / memo / useDeferredValue'],
  ['مقارنة','نفس التفاعل والبيانات بعد التعديل.','correctness + measured improvement']]],
 ['شجرة React ومكان DOM للحوار','flow',[
  ['الأمر','زر يطلب فتح واجهة لها اسم.','setOpen(true)'],
  ['المكان','Portal تضع DOM في حاوية مناسبة.','createPortal(dialog, document.body)'],
  ['السلوك','dialog أصلية تعرض modal وتدعم سلوكها المناسب.','dialog.showModal()'],
  ['الرجوع','إغلاق يبلغ الأب ويرجع التركيز لزر الفتح.','onClose → setOpen(false) → focus()']]],
 ['انتظار ملف وفشل رسم ليسا نفس الحالة','flow',[
  ['الطلب','lazy تبدأ تحميل ملف المكون عند الحاجة.','lazy(() => import("./Reports.jsx"))'],
  ['الانتظار','Suspense تعرض بديل انتظار المصدر المتوافق.','fallback: loading UI'],
  ['الجاهز','الموديول جاهز، فتحسب React محتواه.','Reports → render'],
  ['الفشل','لو حدث خطأ رسم مناسب تعرض Boundary بديل فشل.','ErrorBoundary → retry option']]],
 ['من unknown إلى قيمة متحقق منها','flow',[
  ['الخارج','بيانات JSON لا يضمنها TypeScript وقت التشغيل.','value: unknown'],
  ['الفحص','نتأكد من object ونوع الخواص المطلوبة.','typeof value.name === "string"'],
  ['التضييق','Type guard تعطي نوعًا بعد تحقق صادق.','isUser(value) → value is User'],
  ['الاستخدام','المكون يقرأ عقدًا معروفًا مع معالجة الغياب.','<UserCard user={value} />']]],
 ['اختبار يثبت تفاعلًا مطلوبًا','flow',[
  ['التجهيز','نركب المكون وبيئته المطلوبة.','render(<AddTask />)'],
  ['الفعل','نكتب في حقل مسمى ونرسل النموذج.','await user.type(...); await user.click(...)'],
  ['التوكيد','نتحقق من نتيجة تهم المستخدم.','expect(listitem).toHaveTextContent(title)'],
  ['العزل','ننظف DOM والمخازن قبل الحالة التالية.','afterEach(cleanup)']]],
 ['HTML أولي ثم ربط التفاعل','flow',[
  ['الخادم','بيئة مجهزة تحسب الواجهة من بيانات مسموحة.','server render → HTML'],
  ['النقل','HTML تصل للمتصفح، مع بيانات البداية المناسبة.','root contains server markup'],
  ['المطابقة','أول حساب عميل يطابق النتيجة الأولية.','hydrateRoot(root, <App />)'],
  ['التفاعل','state والأحداث تعمل في أجزاء العميل.','interaction → client updates']]],
 ['من نسخة مصدر إلى تطبيق تمت مراجعته','flow',[
  ['البناء','ملكية بيانات وحدود ملفات واضحة قبل إضافة مكتبات.','tasks / URL search / server cache'],
  ['الفحص','اختبارات سلوك وأنواع وبناء للنشر.','test:run → typecheck → build'],
  ['النشر','نشر dist لتطبيق Vite على إعداد مناسب.','Vercel → SPA routes → assets'],
  ['المراجعة','مسار عميق وكيبورد وفشل وحفظ بعد التحميل.','published behavior verified']]]
);
