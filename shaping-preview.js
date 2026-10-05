(function () {
  'use strict';
  const {createClayBlank,createPotMesh,cloneShape,shapeFromGesture,PotteryRenderer,pickPotSurface}=window.PotteryEngine;
  const recipes=window.PotteryClaySamples;
  const economyCatalog=window.PotteryEconomyCatalog;
  const flow=window.PotteryWorkflow;
  let active=flow.current();
  const acceptedOrderId=()=>Object.entries(window.PotteryEngine.loadEconomy().orders||{}).find(([,order])=>order?.status==='accepted')?.[0]||null;
  if(!active){const requested=new URLSearchParams(location.search).get('purpose'),orderId=acceptedOrderId();active=flow.start(recipes[0].id,requested==='order'&&orderId?'order':'free',orderId);}
  if(active&&active.stage!=='shape'){flow.requireStage('shape');return;}
  const canvas=document.getElementById('potCanvas');
  const band=document.getElementById('touchBand');
  const prompt=document.getElementById('stagePrompt');
  const materialSelect=document.getElementById('materialSelect');
  const initial=createClayBlank();
  // Keep the previous draft intact; its broad brush could produce a bad rim.
  const storageKey='clay-and-flame-e1-draft-v2';
  const state={yaw:.32,pitch:.27,distance:5.85,targetY:1.02,lightAngle:.8,spin:0,turnRate:1.76};window.PotterySceneCamera=state;
  const makeWorkId=()=>`W${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  let workId=active?.workId||makeWorkId(),shape=cloneShape(initial),materialIndex=0,mode='shape',gesture=null,meshDirty=false;
  let history=[cloneShape(shape)],historyIndex=0;

  function validShape(candidate) {
    if(!candidate||!Array.isArray(candidate.radii)||!Array.isArray(candidate.heights)||candidate.radii.length!==113||candidate.heights.length!==113)return false;
    if(Math.abs(candidate.heights[0])>1e-6||candidate.heights[112]<.50||candidate.heights[112]>2.70)return false;
    for(let i=0;i<113;i++){
      if(!Number.isFinite(candidate.radii[i])||candidate.radii[i]<.13||candidate.radii[i]>1)return false;
      if(!Number.isFinite(candidate.heights[i])||(i&&candidate.heights[i]<=candidate.heights[i-1]))return false;
    }
    return true;
  }
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(active&&saved?.workId===active.workId&&validShape(saved?.shape)){
      const clayMass=Number.isFinite(saved.shape.clayMass)?saved.shape.clayMass:initial.clayMass;
      shape=cloneShape({...saved.shape,clayMass});workId=typeof saved.workId==='string'?saved.workId:workId;
      if(Array.isArray(saved.history)&&saved.history.length>0&&saved.history.length<=31&&saved.history.every(validShape)&&
        Number.isInteger(saved.historyIndex)&&saved.historyIndex>=0&&saved.historyIndex<saved.history.length&&
        JSON.stringify(saved.history[saved.historyIndex])===JSON.stringify(saved.shape)){
        history=saved.history.map(entry=>cloneShape({...entry,clayMass}));historyIndex=saved.historyIndex;
      }else history=[cloneShape(shape)];
      const found=recipes.findIndex(recipe=>recipe.id===saved.materialId);
      if(found>=0)materialIndex=found;
      document.getElementById('draftState').textContent='已恢复草稿';
    }
  } catch(_) { document.getElementById('draftState').textContent='本次试玩'; }

  let renderer;
  try { renderer=new PotteryRenderer(canvas,createPotMesh(shape)); }
  catch(error){const box=document.getElementById('renderError');box.hidden=false;box.textContent=`陶器塑形无法启动：${error.message}`;return;}

  recipes.forEach((recipe,index)=>{
    const item=economyCatalog.find('material',recipe.id),owned=economyCatalog.isOwned('material',recipe.id);
    const option=new Option(owned?recipe.name:`${recipe.name} · 商店 ${item.price} 金币`,String(index));
    option.disabled=!owned&&index!==materialIndex;materialSelect.add(option);
  });
  materialSelect.value=String(materialIndex);
  const speedInput=document.getElementById('wheelSpeed');
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)speedInput.value='0';
  function updateSpeed() {
    const value=Number(speedInput.value);
    state.turnRate=value*.032;
    document.getElementById('wheelSpeedValue').textContent=value===0?'停转':value<30?'慢速':value<75?'中速':'快速';
    document.getElementById('wheelStatus').textContent=value===0?'湿泥 · 转盘已停':'湿泥 · 转盘旋转中';
  }
  speedInput.addEventListener('input',updateSpeed);
  updateSpeed();
  function saveDraft() {
    try {localStorage.setItem(storageKey,JSON.stringify({shape,history,historyIndex,materialId:recipes[materialIndex].id,workId}));document.getElementById('draftState').textContent='自动保存';document.dispatchEvent(new Event('pottery:draft'));}
    catch(_) {document.getElementById('draftState').textContent='本次试玩';}
  }
  function updateUi() {
    document.getElementById('materialName').textContent=recipes[materialIndex].name;
    const high=Math.round(shape.heights[112]/initial.heights[112]*100);
    const wide=Math.round(Math.max(...shape.radii)/Math.max(...initial.radii)*100);
    document.getElementById('shapeMetrics').textContent=`器高 ${high}% · 器宽 ${wide}%`;
    document.getElementById('undo').disabled=historyIndex===0;
    document.getElementById('redo').disabled=historyIndex===history.length-1;
  }
  function setMode(next) {
    mode=next;
    document.getElementById('shapeMode').setAttribute('aria-pressed',next==='shape'?'true':'false');
    document.getElementById('viewMode').setAttribute('aria-pressed',next==='view'?'true':'false');
    prompt.textContent=next==='shape'?'按住陶器任意位置，左右推拉、上下拉伸':'拖动陶器或空白处，转动视角';
    prompt.classList.remove('is-hidden');
  }
  function pushHistory() {
    history=history.slice(0,historyIndex+1);
    history.push(cloneShape(shape));
    if(history.length>31)history.shift();
    historyIndex=history.length-1;
    saveDraft();updateUi();
  }
  function restore(index) {
    historyIndex=index;
    shape=cloneShape(history[index]);
    meshDirty=true;updateUi();saveDraft();
  }
  materialSelect.addEventListener('change',()=>{const next=Number(materialSelect.value);if(!economyCatalog.isOwned('material',recipes[next].id)){materialSelect.value=String(materialIndex);return;}materialIndex=next;if(flow.current())flow.patch(workId,{materialId:recipes[next].id});updateUi();saveDraft();window.PotteryAudio.play('clay');});
  const purposeButtons=[...document.querySelectorAll('.purpose-choices [data-purpose]')];
  function syncPurpose(){const purpose=flow.current()?.purpose||'free';purposeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.purpose===purpose)));document.body.classList.toggle('workflow-free',purpose==='free');
    const id=acceptedOrderId(),name=window.PotteryOrderRegistry?.get(id)?.customer.name;
    if(name)document.querySelector('.purpose-choices [data-purpose="order"]').textContent=`${name}订单`;}
  window.PotterySetPurpose=purpose=>{if(!['free','order'].includes(purpose))return false;
    if(purpose==='order'&&!acceptedOrderId())return false;
    flow.patch(workId,{purpose,orderId:purpose==='order'?acceptedOrderId():null});syncPurpose();document.dispatchEvent(new Event('pottery:purpose'));window.PotteryAudio.play('mode');return true;};
  purposeButtons.forEach(button=>button.addEventListener('click',()=>{if(!window.PotterySetPurpose(button.dataset.purpose))location.href='./orders.html';}));
  syncPurpose();
  window.addEventListener('DOMContentLoaded',syncPurpose,{once:true});
  document.getElementById('shapeMode').addEventListener('click',()=>{setMode('shape');window.PotteryAudio.play('mode');});
  document.getElementById('viewMode').addEventListener('click',()=>{setMode('view');window.PotteryAudio.play('mode');});
  document.getElementById('undo').addEventListener('click',()=>{if(historyIndex>0){restore(historyIndex-1);window.PotteryAudio.play('undo');}});
  document.getElementById('redo').addEventListener('click',()=>{if(historyIndex<history.length-1){restore(historyIndex+1);window.PotteryAudio.play('undo');}});
  document.getElementById('resetShape').addEventListener('click',()=>{
    shape=cloneShape(initial);if(!economyCatalog.isOwned('material',recipes[materialIndex].id)){materialIndex=0;materialSelect.value='0';}meshDirty=true;pushHistory();window.PotteryAudio.play('clay');
    prompt.textContent='器型已重置，可以按「撤销」恢复';prompt.classList.remove('is-hidden');
  });
  document.querySelector('.next-step').addEventListener('click',event=>{event.preventDefault();try{flow.advance(workId,'shape','kiln');if(!window.PotteryNavigate?.('./kiln-preview.html'))location.href='./kiln-preview.html';}catch(error){prompt.textContent=error.message;prompt.classList.remove('is-hidden');}});

  function hitVessel(x,y) {
    const hit=pickPotSurface(shape,state,state.spin,x,y,canvas.clientWidth,canvas.clientHeight,point=>renderer.projectPoint(point,state),52);
    if(!hit)return null;
    let anchor=0,best=Infinity;
    for(let i=0;i<shape.heights.length;i++){
      const difference=Math.abs(shape.heights[i]-hit.y);
      if(difference<best){best=difference;anchor=i;}
    }
    const center=renderer.projectPoint([0,hit.y,0],state);
    return {anchor,side:x<center.x?-1:1,y:hit.y};
  }
  function updateTouchBand() {
    if(gesture?.kind!=='shape')return;
    const width=canvas.clientWidth,height=canvas.clientHeight;
    band.setAttribute('viewBox',`0 0 ${width} ${height}`);
    const anchor=gesture.hit.anchor,radius=shape.radii[anchor]+.012,y=shape.heights[anchor];
    const project=angle=>renderer.projectPoint([Math.sin(angle)*radius,y,Math.cos(angle)*radius],state);
    const halfPath=(start,end)=>{
      let path='';
      for(let i=0;i<=48;i++){
        const point=project(state.yaw+start+(end-start)*i/48);
        path+=`${i?'L':'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
      }
      return path;
    };
    band.querySelector('.touch-band-front').setAttribute('d',halfPath(-Math.PI/2,Math.PI/2));
    band.querySelector('.touch-band-rear').setAttribute('d',halfPath(Math.PI/2,3*Math.PI/2));
  }
  canvas.addEventListener('pointerdown',event=>{
    if(gesture)return;
    const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*canvas.clientWidth/rect.width,y=(event.clientY-rect.top)*canvas.clientHeight/rect.height;
    const hit=mode==='shape'?hitVessel(x,y):null;
    gesture={id:event.pointerId,kind:hit?'shape':'view',x:event.clientX,y:event.clientY,base:hit?cloneShape(shape):null,hit,moved:false};
    canvas.setPointerCapture(event.pointerId);
    if(hit){updateTouchBand();band.classList.add('is-visible');}
    prompt.classList.add('is-hidden');
    event.preventDefault();
  });
  canvas.addEventListener('pointermove',event=>{
    if(!gesture||event.pointerId!==gesture.id)return;
    const scale=window.PotteryUiScale||1,dx=(event.clientX-gesture.x)/scale,dy=(event.clientY-gesture.y)/scale;
    if(Math.hypot(dx,dy)>2)gesture.moved=true;
    if(gesture.kind==='shape'){
      shape=shapeFromGesture(gesture.base,{anchor:gesture.hit.anchor,dx,dy,side:gesture.hit.side});
      meshDirty=true;updateUi();
    }else{
      state.yaw-=dx*.012;
      state.pitch=Math.max(.12,Math.min(.58,state.pitch+dy*.005));
      gesture.x=event.clientX;gesture.y=event.clientY;
    }
    event.preventDefault();
  });
  function release(event,cancelled=false) {
    if(!gesture||event.pointerId!==gesture.id)return;
    if(gesture.kind==='shape'){
      band.classList.remove('is-visible');
      if(cancelled){shape=gesture.base;meshDirty=true;updateUi();}
      else if(gesture.moved){pushHistory();window.PotteryAudio.play('shape');}
    }
    gesture=null;
  }
  canvas.addEventListener('pointerup',event=>release(event));
  canvas.addEventListener('pointercancel',event=>release(event,true));
  canvas.addEventListener('wheel',event=>{state.distance=Math.max(3.15,Math.min(8.5,state.distance+Math.sign(event.deltaY)*.20));event.preventDefault();},{passive:false});

  let lastFrame=0;
  function frame(now) {
    requestAnimationFrame(frame);
    if(document.hidden||now-lastFrame<27)return;
    const delta=Math.min(50,now-lastFrame||16);lastFrame=now;
    state.spin=(state.spin+delta*state.turnRate/1000)%(Math.PI*2);
    if(meshDirty){renderer.updateGeometry(createPotMesh(shape));meshDirty=false;}
    renderer.draw(0,state,state.lightAngle,recipes[materialIndex],state.spin);
    updateTouchBand();
  }
  updateUi();saveDraft();requestAnimationFrame(frame);
}());
