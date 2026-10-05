(function () {
  'use strict';
  const body=document.body;
  body.classList.add('mobile-shell');
  if(window.PotteryWorkflow?.current()?.purpose==='free')body.classList.add('workflow-free');
  const isShape=!!document.getElementById('resetShape'),isDecor=!!document.getElementById('colorTool'),isKiln=!!document.getElementById('decorationLink');
  if(!isShape&&!isDecor&&!isKiln){body.classList.add('mobile-photo');return;}
  body.classList.add(isShape||isDecor?'mobile-craft':'mobile-kiln');
  if(isDecor)body.classList.add('mobile-decor');
  const dock=document.createElement('nav');dock.className='mobile-action-dock';dock.setAttribute('aria-label','当前步骤操作');body.append(dock);
  const strip=document.createElement('div');strip.className='mobile-tool-strip';strip.setAttribute('aria-label','工具选择栏');strip.hidden=true;
  const toolParking=document.createElement('div');toolParking.hidden=true;body.append(toolParking);
  const close=document.createElement('button');close.type='button';close.className='strip-close';close.setAttribute('aria-label','收起选择栏');close.textContent='×';
  function closeTools(){strip.hidden=true;document.dispatchEvent(new Event('pottery:tool-close'));}
  close.addEventListener('click',closeTools);strip.append(close);body.append(strip);
  function button(label,icon,action,done=false){const item=document.createElement('button');item.type='button';item.className=`mobile-shortcut${done?' mobile-done':''}`;item.setAttribute('aria-label',label);item.innerHTML=`<span aria-hidden="true">${icon}</span>`;item.addEventListener('click',action);dock.append(item);return item;}
  function reveal(content){strip.classList.toggle('strip-compact',content.classList.contains('strip-choices'));strip.querySelectorAll('.strip-content').forEach(item=>{item.querySelectorAll('.strip-tool').forEach(group=>[...group.children].forEach(child=>toolParking.append(child)));item.remove();});const holder=document.createElement('div');holder.className='strip-content';holder.append(content);strip.append(holder);strip.hidden=false;}
  if(isShape){
    button('选择自由创作或订单','✉',()=>{const choices=document.createElement('div');choices.className='strip-choices';
      const current=window.PotteryWorkflow.current()?.purpose||'free';
      const accepted=Object.entries(window.PotteryEngine.loadEconomy().orders||{}).find(([,order])=>order?.status==='accepted');
      const options=[['free','自由创作']];
      if(accepted){const name=window.PotteryOrderRegistry?.get(accepted[0])?.customer.name||'客户';options.push(['order',`${name}的订单`]);}
      for(const [purpose,label] of options){
        const choice=document.createElement('button');choice.type='button';choice.textContent=label;choice.setAttribute('aria-pressed',String(current===purpose));
        choice.addEventListener('click',()=>{if(window.PotterySetPurpose(purpose))strip.hidden=true;else location.href='./orders.html';});choices.append(choice);
      }reveal(choices);});
    const select=document.getElementById('materialSelect');
    button('选择泥料','◈',()=>{const choices=document.createElement('div');choices.className='strip-choices';
      for(const option of select.options){if(option.disabled)continue;const choice=document.createElement('button');choice.type='button';choice.textContent=option.textContent;choice.setAttribute('aria-pressed',String(select.value===option.value));choice.addEventListener('click',()=>{select.value=option.value;select.dispatchEvent(new Event('change',{bubbles:true}));strip.hidden=true;});choices.append(choice);}reveal(choices);});
    for(const [id,label,icon] of [['undo','撤销','↶'],['redo','复原','↷']]){
      const control=document.getElementById(id),shortcut=button(label,icon,()=>control.click());
      const sync=()=>shortcut.disabled=control.disabled;
      new MutationObserver(sync).observe(control,{attributes:true,attributeFilter:['disabled']});sync();
    }
    button('完成塑形','✓',()=>document.querySelector('.next-step').click(),true);
  }else if(isDecor){
    const swatches=document.getElementById('swatches'),patternRow=document.getElementById('patternRow'),drawRow=document.getElementById('drawRow');
    const tools=window.PotteryDecorationTools,shortcuts=new Map();
    const syncTools=()=>{for(const [kind,item] of shortcuts)item.setAttribute('aria-pressed',String(tools.current()===kind));};
    const setTool=(kind,id,contents)=>{
      if(tools.current()===kind){closeTools();return;}
      document.getElementById(id).click();
      const group=document.createElement('div');group.className='strip-tool';contents.forEach(content=>group.append(content));reveal(group);syncTools();
    };
    shortcuts.set('color',button('涂底色','◉',()=>setTool('color','colorTool',[swatches])));
    shortcuts.set('pattern',button('贴花纹','✿',()=>setTool('pattern','patternTool',[patternRow])));
    shortcuts.set('draw',button('手绘','✎',()=>setTool('draw','drawTool',[swatches,drawRow])));
    const eraserIcon='<svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21 19 7a3 3 0 0 1 4 0l5 5a3 3 0 0 1 0 4L16 28h-5l-4-4a2 2 0 0 1 0-3Z M12 15l11 11 M15 28h14"/></svg>';
    const eraser=button('橡皮擦',eraserIcon,()=>{
      if(!window.PotteryEconomyCatalog.isOwned('tool','ring-eraser')){if(!window.PotteryNavigate?.('./shop.html#pigments'))location.href='./shop.html#pigments';return;}
      const wasActive=tools.current()==='erase';closeTools();if(!wasActive)tools.select('erase');syncTools();
    });
    const owned=window.PotteryEconomyCatalog.isOwned('tool','ring-eraser');eraser.classList.toggle('tool-locked',!owned);eraser.title=owned?'擦除固定高度一圈的底色和花纹':'橡皮擦 · 去商店购买';shortcuts.set('erase',eraser);
    document.addEventListener('pottery:tool-change',syncTools);syncTools();
    button('清空装饰','↺',()=>{closeTools();document.getElementById('clearBands').click();});
    button('完成装饰','✓',()=>document.querySelector('.next-photo').click(),true);
  }else{
    const link=document.getElementById('decorationLink');
    const done=button('烧制完成，进入装饰','✓',()=>{if(link.getAttribute('aria-disabled')==='false')link.click();},true);
    const sync=()=>{done.disabled=link.getAttribute('aria-disabled')!=='false';};new MutationObserver(sync).observe(link,{attributes:true,attributeFilter:['aria-disabled']});sync();
  }
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeTools();});
}());
