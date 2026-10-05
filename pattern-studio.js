(function () {
  'use strict';
  const {createPattern,validPattern,loadPatterns,savePattern,drawUnit,renderTile,generateThemeCandidates}=window.PotteryEngine;
  const draftKey='clay-and-flame-pattern-studio-draft-v1';
  const unit=document.getElementById('unitCanvas'),tile=document.getElementById('tileCanvas');
  const nameInput=document.getElementById('patternName'),ink=document.getElementById('inkColor'),sizeInput=document.getElementById('brushSize');
  const repeatInput=document.getElementById('repeatCount'),spacingInput=document.getElementById('spacing'),arrangementInput=document.getElementById('arrangement'),offsetInput=document.getElementById('offset');
  const message=document.getElementById('message'),saveState=document.getElementById('saveState');
  const editing=new URLSearchParams(location.search).get('edit');
  const library=loadPatterns();
  let pattern=library.find(item=>item.id===editing)||null;
  try{
    const draft=JSON.parse(localStorage.getItem(draftKey)||'null');
    if(validPattern(draft)&&(!editing||draft.id===editing))pattern=draft;
  }catch(_){}
  if(!pattern)pattern=createPattern();
  let history=[JSON.stringify(pattern)],historyIndex=0,tool='brush',gesture=null;
  let candidates=[],selectedCandidate=-1;
  nameInput.value=pattern.name;repeatInput.value=pattern.repeat;spacingInput.value=Math.round((pattern.spacing||0)*100);arrangementInput.value=pattern.arrangement;offsetInput.value=Math.round(pattern.offset*100);
  function setMessage(text){message.textContent=text;}
  function syncControls(){
    document.getElementById('sizeValue').textContent=sizeInput.value;
    document.getElementById('repeatValue').textContent=repeatInput.value;
    document.getElementById('spacingValue').textContent=`${spacingInput.value}%`;
    document.getElementById('offsetValue').textContent=`${Math.round(Number(offsetInput.value)*3.6)}°`;
    document.getElementById('undo').disabled=historyIndex===0;
    document.getElementById('redo').disabled=historyIndex===history.length-1;
    document.querySelectorAll('[data-tool]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tool===tool)));
  }
  function draw(){
    const ctx=unit.getContext('2d');ctx.clearRect(0,0,unit.width,unit.height);
    drawUnit(ctx,pattern,0,0,unit.width,unit.height);
    renderTile(tile,pattern);
    syncControls();
  }
  function draft(){
    try{localStorage.setItem(draftKey,JSON.stringify(pattern));saveState.textContent='草稿已保存';}
    catch(_){saveState.textContent='仅本次有效';setMessage('浏览器存储空间不足，当前花纹暂时只保留在此页面。');}
  }
  function commit(){history=history.slice(0,historyIndex+1);history.push(JSON.stringify(pattern));if(history.length>40)history.shift();historyIndex=history.length-1;draft();draw();}
  function restore(index){historyIndex=index;pattern=JSON.parse(history[index]);nameInput.value=pattern.name;repeatInput.value=pattern.repeat;spacingInput.value=Math.round((pattern.spacing||0)*100);arrangementInput.value=pattern.arrangement;offsetInput.value=Math.round(pattern.offset*100);draft();draw();}
  document.querySelectorAll('[data-tool]').forEach(button=>button.addEventListener('click',()=>{tool=button.dataset.tool;syncControls();}));
  document.getElementById('zoomToggle').addEventListener('click',event=>{
    const expanded=document.querySelector('.editor-frame').classList.toggle('zoomed');
    event.currentTarget.setAttribute('aria-pressed',String(expanded));
    event.currentTarget.textContent=expanded?'缩小画布':'放大画布';
  });
  sizeInput.addEventListener('input',syncControls);
  document.getElementById('undo').addEventListener('click',()=>{if(historyIndex>0)restore(historyIndex-1);});
  document.getElementById('redo').addEventListener('click',()=>{if(historyIndex<history.length-1)restore(historyIndex+1);});
  document.getElementById('clear').addEventListener('click',()=>{if(pattern.strokes.length){pattern.strokes=[];commit();}});
  function coordinates(event){const rect=unit.getBoundingClientRect();return [Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width)),Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height))];}
  unit.addEventListener('pointerdown',event=>{
    if(gesture)return;
    const point=coordinates(event);gesture={id:event.pointerId,stroke:{tool,color:ink.value,size:Number(sizeInput.value)/1000,points:[point]},previous:pattern.strokes.length};
    pattern.strokes.push(gesture.stroke);unit.setPointerCapture(event.pointerId);draw();event.preventDefault();
  });
  unit.addEventListener('pointermove',event=>{
    if(!gesture||gesture.id!==event.pointerId)return;
    const point=coordinates(event),points=gesture.stroke.points,last=points[points.length-1];
    if(tool==='brush'||tool==='erase'){
      if(Math.hypot((point[0]-last[0])*unit.width,(point[1]-last[1])*unit.height)>1.8)points.push(point);
    }else if(points.length===1)points.push(point);else points[1]=point;
    draw();event.preventDefault();
  });
  function finish(event,cancelled=false){
    if(!gesture||gesture.id!==event.pointerId)return;
    if(cancelled){pattern.strokes.length=gesture.previous;draw();}
    else{
      if(document.getElementById('symmetry').checked){
        const stroke=gesture.stroke;
        pattern.strokes.push({...stroke,points:stroke.points.map(([x,y])=>[1-x,y])});
      }
      commit();window.PotteryAudio.play('draw');
    }
    gesture=null;
  }
  unit.addEventListener('pointerup',event=>finish(event));unit.addEventListener('pointercancel',event=>finish(event,true));
  function applySettings(){
    pattern.name=nameInput.value.trim().slice(0,32)||'我的花纹';
    pattern.repeat=Number(repeatInput.value);pattern.spacing=Number(spacingInput.value)/100;pattern.arrangement=arrangementInput.value;pattern.offset=Number(offsetInput.value)/100;
    draft();draw();refreshCandidates();
  }
  for(const input of [nameInput,repeatInput,spacingInput,arrangementInput,offsetInput]){
    if(input!==nameInput)input.addEventListener('input',applySettings);
    input.addEventListener('change',()=>{applySettings();commit();});
  }
  function refreshCandidates(){
    const theme=document.getElementById('theme').value,density=Number(document.getElementById('density').value);
    document.getElementById('densityValue').textContent=String(density);
    candidates=generateThemeCandidates({theme,density,color:ink.value,repeat:pattern.repeat,arrangement:pattern.arrangement,spacing:pattern.spacing||0,offset:pattern.offset,id:pattern.id,name:pattern.name});
    selectedCandidate=-1;document.getElementById('applyTheme').disabled=true;
    const container=document.getElementById('themeCandidates');container.replaceChildren();
    candidates.forEach((candidate,index)=>{
      const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed','false');
      const preview=document.createElement('canvas');preview.width=512;preview.height=128;renderTile(preview,candidate);
      const label=document.createElement('span');label.textContent=candidate.label;button.append(preview,label);
      button.addEventListener('click',()=>{
        selectedCandidate=index;[...container.children].forEach((child,i)=>child.setAttribute('aria-pressed',String(i===index)));
        document.getElementById('applyTheme').disabled=false;
      });
      container.appendChild(button);
    });
  }
  document.getElementById('theme').addEventListener('change',refreshCandidates);
  document.getElementById('density').addEventListener('input',refreshCandidates);
  ink.addEventListener('input',refreshCandidates);
  document.getElementById('applyTheme').addEventListener('click',()=>{
    if(selectedCandidate<0)return;
    pattern.strokes.push(...candidates[selectedCandidate].strokes.map(stroke=>({...stroke,points:stroke.points.map(point=>[...point])})));
    commit();setMessage('候选已加入画布；可以继续绘制、擦除，或撤销这一步。');
  });
  document.getElementById('save').addEventListener('click',()=>{
    pattern.name=nameInput.value.trim().slice(0,32);
    if(!pattern.name){setMessage('请先给花纹起一个名字。');nameInput.focus();return;}
    if(!pattern.strokes.some(stroke=>stroke.tool!=='erase')){setMessage('画布还是空的，先画几笔再保存。');return;}
    try{savePattern(pattern);localStorage.removeItem(draftKey);location.href=`./decoration-preview.html?pattern=${encodeURIComponent(pattern.id)}`;}
    catch(error){setMessage(`保存失败：${error.name==='QuotaExceededError'?'浏览器空间不足':error.message}`);}
  });
  draw();refreshCandidates();
}());
