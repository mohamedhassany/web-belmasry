(() => {
 'use strict';
 const $=(s,r=document)=>r.querySelector(s);
 const aliasMap=new Map();
 learningTerms.forEach((term,index)=>[term.name,...term.aliases].forEach(name=>{if(name.length>1&&!aliasMap.has(name.toLowerCase()))aliasMap.set(name.toLowerCase(),index);}));
 const regexEscape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const termPattern=new RegExp([...aliasMap.keys()].sort((a,b)=>b.length-a.length).map(regexEscape).join('|'),'giu');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let stopAll=reduced.matches, cleanups=[],returnFocus=null,openedIndex=null;
 const dialog=document.createElement('dialog');
 dialog.className='learning-dialog';dialog.id='learning-term-dialog';dialog.setAttribute('aria-labelledby','term-dialog-title');
 dialog.innerHTML='<div class="term-dialog-header"><h2 id="term-dialog-title">شرح المصطلح</h2><button type="button" class="term-close" aria-label="قفل شرح المصطلح">×</button></div><div class="term-dialog-body"></div>';
 document.body.append(dialog);
 const body=$('.term-dialog-body',dialog);
 function isolate(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode())if(walker.currentNode.parentElement&&!walker.currentNode.parentElement.closest('pre,code,bdi,[dir="ltr"],script,style,button,input'))nodes.push(walker.currentNode);
  for(const n of nodes){
   const re=/[A-Za-z][A-Za-z0-9_]*(?:[ .:/+\-][A-Za-z0-9_]+)*/g;
   const f=document.createDocumentFragment();let start=0;
   for(const m of n.nodeValue.matchAll(re)){f.append(n.nodeValue.slice(start,m.index));const bdi=document.createElement('bdi');bdi.dir='ltr';bdi.textContent=m[0];f.append(bdi);start=m.index+m[0].length;}
   if(start){f.append(n.nodeValue.slice(start));n.replaceWith(f);}
  }
 }
 function termify(root,excludedIndex=null){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
  while(walker.nextNode()){
   const n=walker.currentNode;
   if(!n.parentElement||n.parentElement.closest('a,button,pre,script,style,textarea,input,select,.motion-stops,.motion-scene,.motion-controls,.reader-help,.code-top,.visual-source,.scene-name,.term-dialog-header'))continue;
   if(!n.parentElement.closest('p,li,h2,h3,h4,td,th,figcaption,summary,.callout-title,.explain-row'))continue;
   nodes.push(n);
  }
  for(const node of nodes){
   const text=node.nodeValue;const f=document.createDocumentFragment();let start=0;
   termPattern.lastIndex=0;
   for(const match of text.matchAll(termPattern)){
    if(aliasMap.get(match[0].toLowerCase())===excludedIndex)continue;
    const latin=/[A-Za-z]/.test(match[0]);
    const left=text[match.index-1]||'',right=text[match.index+match[0].length]||'';
    if(latin&&(/[A-Za-z0-9_]/.test(left)||/[A-Za-z0-9_]/.test(right)))continue;
    if(!latin&&(/[\p{L}]/u.test(left)||/[\p{L}]/u.test(right)))continue;
    f.append(text.slice(start,match.index));
    const button=document.createElement('button');button.type='button';button.className='term-link';button.dataset.learningTerm=aliasMap.get(match[0].toLowerCase());button.textContent=match[0];
    button.setAttribute('aria-label','شرح مصطلح '+match[0]);button.setAttribute('aria-haspopup','dialog');if(latin)button.dir='ltr';
    f.append(button);start=match.index+match[0].length;
   }
   if(start){f.append(text.slice(start));node.replaceWith(f);}
  }
 }
 function codeGuide(root){
  const hints=[
   [/^import\b/,'استيراد: يحدد هذا السطر القيمة أو التنسيق القادم من ملف أو حزمة. راجع هل الاستيراد named بين أقواس أو default بدونها، وراجع المسار.'],
   [/^export\b/,'تصدير: يجعل هذه القيمة متاحة لملفات أخرى. default واجهة واحدة افتراضية؛ named يحتاج اسمًا مطابقًا عند الاستيراد.'],
   [/\buseState\s*\(/,'حالة: القيمتان الخارجتان هما القراءة الحالية ودالة طلب تحديثها. القيمة بين الأقواس تهيئة وليست إعادة ضبط لكل render.'],
   [/\buseEffect\s*\(/,'مزامنة: هذه الدالة تسجل إعدادًا لنظام خارجي. تابع قائمة الاعتماد والتنظيف في نهاية الجسم، وليس هذا السطر وحده.'],
   [/\buseRef\s*\(/,'مرجع: النتيجة object مستقرة لها current. تعديلها لا يطلب render؛ لذلك تختلف عن state.'],
   [/\bset[A-Z]\w*\s*\(/,'طلب تحديث: لو الوسيط دالة فهي تحسب التالي من السابق. لا تفترض أن متغير اللقطة الحالية اتغير بعد هذا الاستدعاء.'],
   [/\bfunction\b|=>/,'دالة: الاسم أو التعبير يحدد خطوات يمكن استدعاؤها. وجود تعريفها لا يعني تنفيذ الجسم فورًا. => بجسم تعبيري ترجع ضمنيًا، وبكتلة تحتاج return.'],
   [/\breturn\b/,'رجوع: يحدد النتيجة وينهي مسار الدالة الحالية. في Component تكون النتيجة وصف واجهة، وفي updater تكون الحالة التالية.'],
   [/\bif\s*\(/,'شرط: الجسم يعمل فقط عندما نتيجة التعبير truthy. افصل اختبار النوع والحدود عن التعامل مع النتيجة.'],
   [/\.map\s*\(/,'تحويل: القيمة المرجعة من كل callback تدخل في array جديدة. لو النتيجة JSX لقائمة راجع key الثابتة.'],
   [/\.filter\s*\(/,'اختيار: يحتفظ بالعناصر التي تحقق شرط الدالة، ويرجع array جديدة دون حذف عناصر من الأصل.'],
   [/\.reduce\s*\(/,'تجميع: راجع قيمة البداية وreturn للمراكم؛ كل دورة تستخدم الناتج السابق.'],
   [/\bfetch\s*\(/,'شبكة: يبدأ طلبًا ويعيد Promise. لازم تفحص استجابة HTTP ثم تقرأ body وتعالج الفشل والإلغاء عند الحاجة.'],
   [/localStorage\./,'تخزين: العملية على مساحة الأصل الحالي في هذا المتصفح. القيم نصوص، والقراءة والكتابة قد تحتاج معالجة خطأ.'],
   [/addEventListener\s*\(/,'تسجيل حدث: الدالة تمرر للتنفيذ وقت الحدث. تمرير استدعاء بدل مرجع ينفذه أثناء التسجيل.'],
   [/preventDefault\s*\(/,'سلوك المتصفح: يمنع التصرف الافتراضي للحدث المناسب؛ لا يوقف الانتشار للأب تلقائيًا.'],
   [/textContent\s*=/,'عرض نص: القيمة تعامل كنص لا كوسوم، ولذلك مناسبة لنصوص المستخدم بدل innerHTML غير الموثوقة.'],
   [/<label\b/,'تسمية: for في HTML أو htmlFor في JSX تربط اسم الحقل بـid مناسب، أو يحتوي label الحقل مباشرة.'],
   [/<input\b/,'إدخال: type تحدد السلوك. في HTML name مفتاح الإرسال؛ وفي React controlled راجع value أو checked ومعالج التغيير.'],
   [/<(?:section|main|article|header|footer|nav)\b/,'هيكل: اسم العنصر يصف دوره في الوثيقة، بينما CSS تحدد مكانه وشكله. افتح وأغلق العناصر بتعشيش صحيح.'],
   [/\bkey\s*=/,'هوية قائمة: المفتاح يثبت مع نفس بيانات العنصر وسط إخوته، ولا يصل للابن كـprop عادية.'],
   [/onClick\s*=|onChange\s*=|onSubmit\s*=/,'ربط تفاعل في JSX: القيمة دالة تُستدعى وقت الحدث، وليس نتيجة تشغيلها أثناء render.'],
   [/display\s*:\s*(flex|grid)/,'تخطيط: الحاوية تعتمد هذا النظام لترتيب أبنائها المباشرين؛ بقية إعدادات المحاور أو المسارات تكمل التوزيع.'],
   [/box-sizing\s*:/,'مقاسات: تحدد هل width تخص المحتوى أو تشمل padding وborder. margin تظل خارج هذا الحساب.'],
   [/padding\s*:|margin\s*:/,'مسافة: padding داخل حد الصندوق، وmargin خارجه. القيم المختصرة لها ترتيب حسب عددها.'],
   [/@media\b/,'شرط تنسيق: القواعد داخلها تدخل الحساب فقط عند تطابق الشرط، وتظل خاضعة للـCascade.'],
   [/@keyframes\b|animation\s*:/,'حركة: @keyframes تصف القيم الزمنية، وanimation تربطها بالعنصر وتحدد مدتها وتكرارها.'],
   [/\bnew\s+[A-Z]/,'إنشاء نسخة: new تنشئ object وفق constructor. النسخة الجديدة لها هوية تختلف عن نسخ أخرى حتى لو البيانات متشابهة.']
  ];
  root.querySelectorAll('.code-block').forEach(block=>{
   const source=$('pre code',block)?.textContent;if(!source)return;
   const lines=source.split('\n');const selected=[];
   for(const [pattern,explanation]of hints){const lineIndex=lines.findIndex(line=>pattern.test(line));if(lineIndex!==-1)selected.push({line:lineIndex+1,text:lines[lineIndex].trim(),explanation});}
   const matches=new Set();termPattern.lastIndex=0;
   for(const m of source.matchAll(termPattern))if(/[A-Za-z]/.test(m[0])&&!/[A-Za-z0-9_]/.test(source[m.index-1]||'')&&!/[A-Za-z0-9_]/.test(source[m.index+m[0].length]||''))matches.add(aliasMap.get(m[0].toLowerCase()));
   if(!selected.length&&!matches.size)return;
   const details=document.createElement('details');details.className='code-reading-guide';
   details.innerHTML=`<summary>فهم أجزاء الكود ومصطلحاته</summary><p>اقرأ الأجزاء الأساسية في ترتيب ظهورها، وافتح أي مصطلح محتاج توضيح.</p>${selected.length?`<ol>${selected.sort((a,b)=>a.line-b.line).slice(0,10).map(h=>`<li><span class="guide-line">السطر ${h.line}</span><pre dir="ltr"><code>${esc(h.text)}</code></pre><p>${esc(h.explanation)}</p></li>`).join('')}</ol>`:''}${matches.size?`<div class="code-term-list">${[...matches].map(i=>`<button type="button" data-learning-term="${i}" dir="ltr">${esc(learningTerms[i].name)}</button>`).join('')}</div>`:''}`;
   block.insertAdjacentElement('afterend',details);
  });
 }
 function showDialog(trigger){
  if(!dialog.open){returnFocus=trigger||document.activeElement;dialog.showModal();document.dispatchEvent(new Event('learning-dialog-change'));}
 }
 function searchTerms(query=''){
  const q=query.trim().toLowerCase();
  const list=learningTerms.map((t,i)=>({t,i})).filter(({t})=>([t.name,t.ar,t.definition,...t.aliases].join(' ').toLowerCase().includes(q)));
  $('.term-search-results',body).innerHTML=list.length?list.map(({t,i})=>`<button type="button" class="term-result" data-learning-term="${i}"><b dir="ltr">${esc(t.name)}</b><span>${esc(t.ar)}</span></button>`).join(''):'<p class="term-empty">مفيش مصطلح مطابق؛ جرّب جزءًا من الاسم بالعربي أو الإنجليزي.</p>';
  $('.term-search-count',body).textContent=`${list.length} مصطلح`;
 }
 function showSearch(trigger){
  openedIndex=null;$('#term-dialog-title').textContent='قاموس الشرح المفصل';
  body.innerHTML='<label class="term-search-label" for="learning-term-search">ابحث باسم المصطلح أو معناه</label><input class="term-search-input" id="learning-term-search" type="search" placeholder="مثلاً: Props أو ذاكرة"><p class="term-search-count" role="status"></p><div class="term-search-results term-results"></div>';
  searchTerms();$('#learning-term-search').addEventListener('input',e=>searchTerms(e.target.value));showDialog(trigger);dialog.scrollTop=0;$('#learning-term-search').focus();
 }
 function showTerm(index,trigger){
  const term=learningTerms[index];if(!term)return;
  const context=trigger?.closest('p,li,td,figcaption');
  const excerpt=context?.textContent.trim();
  openedIndex=index;$('#term-dialog-title').textContent='شرح المصطلح بالتفصيل';
  body.innerHTML=`<button type="button" class="term-back" data-term-search>كل المصطلحات والبحث</button><h3 dir="ltr">${esc(term.name)}</h3><div class="term-subtitle">${esc(term.ar)}</div>${excerpt&&excerpt.length<450?`<p class="term-context">السياق اللي ضغطت فيه: ${esc(excerpt)}</p>`:''}<h4>المعنى</h4><p>${esc(term.definition)}</p>${term.mechanism&&!term.mechanism.startsWith('التفاصيل والسياق')?`<h4>بيشتغل إزاي؟</h4><p>${esc(term.mechanism)}</p>`:''}${term.pitfall&&!term.pitfall.startsWith('افحص مكان الاستخدام')?`<h4>الفرق اللي لازم تاخد بالك منه</h4><p>${esc(term.pitfall)}</p>`:''}${term.related.length?`<div class="term-related"><h4>شرح أوسع في الدروس</h4>${term.related.slice(0,3).map((s,i)=>`<details ${i===0?'open':''}><summary>${esc(courses[s.course].name)} · ${esc(s.title.replace(/^[٠-٩0-9]+\.\s*/,''))}</summary>${s.text.map(p=>`<p>${esc(p)}</p>`).join('')}<a href="#learn/${s.course}/${s.index}/${s.id}" data-term-go>افتح موضع الشرح في الدرس</a></details>`).join('')}</div>`:''}`;
  termify(body,index);isolate(body);showDialog(trigger);dialog.scrollTop=0;$('.term-close',dialog).focus();
 }
 function closeDialog(){if(dialog.open)dialog.close();}
 $('.term-close',dialog).onclick=closeDialog;
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
 dialog.addEventListener('close',()=>{document.dispatchEvent(new Event('learning-dialog-change'));if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});returnFocus=null;});
 document.addEventListener('click',e=>{
  const link=e.target.closest('[data-learning-term]');if(link){e.preventDefault();showTerm(Number(link.dataset.learningTerm),link);return;}
  if(e.target.closest('[data-term-search]')){showSearch(e.target.closest('button'));return;}
  if(e.target.closest('[data-term-go]'))closeDialog();
 });
 function specialScene(element,kind,stage){
  const scene=$('.motion-scene',element);const lit=i=>stage===i?'lit':'';
  if(kind==='box')scene.innerHTML=`<div class="scene-live"><div class="live-box" style="padding:${stage===0?6:stage===1?22:30}px"><span>${stage===3?'border-box: 200px':'content-box'}</span><div class="live-content">${stage===3?'width includes padding + border':'Content: 200px'}</div></div></div>`;
  else if(kind==='array'){
   const values=[[2,4,6],[4,8,12],[8,12],[20]][stage];
   scene.innerHTML=`<div class="scene-live"><div class="live-array">${values.map(n=>`<span>${n}</span>`).join('')}</div></div>`;
  }else if(kind==='layout'||kind==='responsive')scene.innerHTML=`<div class="scene-live"><div class="live-layout" style="${kind==='responsive'?'width:'+(stage===0||stage===3?'46%':'100%')+';flex-direction:'+(stage===0||stage===3?'column':'row'):'flex-direction:'+(stage===3?'column':'row')}"><span>1</span><span>2</span><span>3</span></div></div>`;
  else if(kind==='state'){
   const isCounter=element.dataset.learningMotion==='react:4';
   scene.innerHTML=`<div class="live-state"><div class="${lit(0)||lit(1)}"><small>${isCounter?'State':'tasks'}</small><b>${isCounter?(stage<2?'0':'1'):(stage<2?'[]':'[✓]')}</b></div><div class="live-connector"></div><div class="${lit(2)}"><small>Render</small><b>ƒ</b></div><div class="live-connector"></div><div class="${lit(3)}"><small>DOM</small><b>${isCounter?(stage<3?'0':'1'):(stage<3?'—':'✓')}</b></div></div>`;
  }
  else if(kind==='tree'){
   const key=element.dataset.learningMotion;
   const nodes=key.startsWith('html')?['body','h1','p','section']:key.startsWith('js')?['body','h1#title','button','p']:['App','Header','main','Footer'];
   scene.innerHTML=`<div class="live-tree"><span>${nodes[0]}</span><span class="${lit(0)}">${nodes[1]}</span><span class="${lit(1)||lit(2)}">${nodes[2]}</span><span class="${lit(3)}">${nodes[3]}</span></div>`;
  }
  else if(kind==='props')scene.innerHTML=`<div class="live-state"><div class="${lit(0)||lit(3)}"><small>App</small><b>title</b></div><div class="live-connector" style="${stage===3?'transform:rotate(180deg)':''}"></div><div class="${lit(1)||lit(2)}"><small>Card</small><b>JSX</b></div></div>`;
  else if(kind==='table')scene.innerHTML=`<div class="live-table"><span>A</span><span style="grid-column:span ${stage===2?2:1}">${stage===2?'B + C':'B'}</span>${stage===2?'':'<span>C</span>'}<span>1</span><span>2</span><span>3</span></div>`;
  else if(kind==='transform')scene.innerHTML='<div class="live-transform">CSS</div>';
  else if(kind==='type')scene.innerHTML=`<div class="live-type" style="font-size:${stage===0?18:20}px;line-height:${stage===1||stage===3?2.4:1.8}">تنسيق النص بيغيّر قياس الحروف وارتفاع السطر، وحد عرض الفقرة بيحافظ على سهولة القراءة.</div>`;
  else scene.querySelectorAll('.scene-cell').forEach((n,i)=>n.classList.toggle('is-current',stage===i));
 }
 function mountMotion(element){
  const [course,rawIndex]=element.dataset.learningMotion.split(':');
  const [title,kind,steps]=learningSequences[course][Number(rawIndex)];
  let stage=0,paused=stopAll,visible=false,timer=null;
  const play=$('.motion-play',element);
  const draw=()=>{
   const [label,description,code]=steps[stage];
   element.dataset.stage=stage;$('.motion-step-label',element).textContent=`الخطوة ${stage+1} من ${steps.length}`;
   $('.motion-step-title',element).textContent=label;$('.motion-step-text',element).textContent=description;$('.motion-step-code',element).textContent=code;
   termify($('.motion-explanation',element));isolate($('.motion-explanation',element));
   element.querySelectorAll('.motion-stops li').forEach((n,i)=>{n.classList.toggle('is-current',i===stage);if(i===stage)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current');});
   specialScene(element,kind,stage);element.classList.toggle('is-paused',paused||!visible);
   play.textContent=paused?'تشغيل الحركة':'إيقاف الحركة';play.setAttribute('aria-pressed',String(paused));
  };
  const sync=()=>{clearInterval(timer);timer=null;element.classList.toggle('is-paused',paused||!visible||dialog.open);play.textContent=paused?'تشغيل الحركة':'إيقاف الحركة';play.setAttribute('aria-pressed',String(paused));if(!paused&&visible&&!document.hidden&&!dialog.open)timer=setInterval(()=>{stage=(stage+1)%steps.length;draw();},4200);};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15});observer.observe(element);
  play.onclick=()=>{paused=!paused;sync();};$('.motion-next',element).onclick=()=>{paused=true;stage=(stage+1)%steps.length;draw();sync();};$('.motion-restart',element).onclick=()=>{stage=0;draw();sync();};
  const all=e=>{paused=e.detail;sync();};const visibility=()=>sync();
  document.addEventListener('learning-motion-pause',all);document.addEventListener('visibilitychange',visibility);document.addEventListener('learning-dialog-change',visibility);
  draw();
  return()=>{clearInterval(timer);observer.disconnect();document.removeEventListener('learning-motion-pause',all);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('learning-dialog-change',visibility);};
 }
 window.clearLearning=()=>{cleanups.forEach(fn=>fn());cleanups=[];closeDialog();};
 window.enhanceLearning=current=>{
  const content=$('#content');
  if(current?.index!==undefined&&!current.practice){
   const article=$('.article',content);const help=document.createElement('div');help.className='reader-help';
   help.innerHTML='<p>المصطلح اللي تحته نقط تقدر تضغط عليه وتفتح شرحه من غير ما تسيب مكانك. الكود في مساحة مستقلة من الشمال لليمين، والشرح عربي من اليمين لليسار.</p><div class="reader-tools"><button class="term-launch" type="button" data-term-search>افتح قاموس الشرح</button><button type="button" data-motion-all>إيقاف كل الحركات</button></div>';
   article.insertBefore(help,$('.reading-time',article));
   const first=$('.topic',article);if(first)first.insertAdjacentHTML('beforeend',learningMotionMarkup(current.course,current.index));
   const toggle=$('[data-motion-all]',help);const update=()=>{toggle.textContent=stopAll?'تشغيل الحركات':'إيقاف كل الحركات';toggle.setAttribute('aria-pressed',String(stopAll));};update();
   toggle.onclick=()=>{stopAll=!stopAll;update();document.dispatchEvent(new CustomEvent('learning-motion-pause',{detail:stopAll}));};
   article.querySelectorAll('[data-learning-motion]').forEach(el=>cleanups.push(mountMotion(el)));
   // Existing sequential diagrams receive a gentle, visible-only reading highlight.
   article.querySelectorAll('.lesson-visual').forEach(figure=>{
    const boxes=[...figure.querySelectorAll('.visual-step,.visual-branches>div,.visual-array>div')];if(boxes.length<2)return;
    figure.classList.add('motion-scan');let position=0,timer;
    const stop=()=>{clearInterval(timer);boxes.forEach(b=>b.classList.remove('scan-current'));};
    let visible=false;
    const sync=()=>{stop();if(visible&&!stopAll&&!document.hidden&&!dialog.open){boxes[position].classList.add('scan-current');timer=setInterval(()=>{boxes[position].classList.remove('scan-current');position=(position+1)%boxes.length;boxes[position].classList.add('scan-current');},4200);}};
    const observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;sync();},{threshold:.2});observer.observe(figure);
    document.addEventListener('learning-motion-pause',sync);document.addEventListener('visibilitychange',sync);document.addEventListener('learning-dialog-change',sync);
    cleanups.push(()=>{stop();observer.disconnect();document.removeEventListener('learning-motion-pause',sync);document.removeEventListener('visibilitychange',sync);document.removeEventListener('learning-dialog-change',sync);});
   });
  }
  if(location.hash==='#glossary')content.querySelectorAll('.glossary-card').forEach(card=>{
   const name=card.querySelector('bdi')?.textContent;const index=aliasMap.get(name?.toLowerCase());
   if(index!==undefined&&!card.querySelector('.glossary-more')){const button=document.createElement('button');button.type='button';button.className='glossary-more';button.dataset.learningTerm=index;button.textContent='افتح الشرح المفصل';card.append(button);}
  });
  if(current?.index!==undefined)codeGuide(content);
  termify(content);isolate(content);
 };
 reduced.addEventListener('change',e=>{stopAll=e.matches;document.dispatchEvent(new CustomEvent('learning-motion-pause',{detail:stopAll}));const button=$('[data-motion-all]');if(button){button.textContent=stopAll?'تشغيل الحركات':'إيقاف كل الحركات';button.setAttribute('aria-pressed',String(stopAll));}});
})();
