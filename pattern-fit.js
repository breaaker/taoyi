(function () {
  'use strict';
  const E=window.PotteryEngine;
  const $=id=>document.getElementById(id);
  const controls={pattern:$('pattern'),shape:$('shape'),material:$('material'),repeat:$('repeat'),scale:$('scale'),height:$('height'),position:$('position')};
  const settingsKey='clay-and-flame-pattern-fit-v1';
  let saved={...window.PotteryPatternFitPresets};
  try{saved={...saved,...(JSON.parse(localStorage.getItem(settingsKey)||'{}')||{})};}catch(_){}
  const items=new Map();
  const canvas=$('pot'),patternCanvas=document.createElement('canvas');patternCanvas.width=1024;patternCanvas.height=1024;
  const tile=document.createElement('canvas');tile.width=1024;tile.height=512;
  const camera={yaw:.32,pitch:.32,distance:4.8,targetY:.83};
  let renderer,shape,spin=0,lastTime=performance.now(),drag=null;

  function current(){return items.get(controls.pattern.value);}
  function values(){return {repeat:Number(controls.repeat.value),motifWidthU:Number(controls.scale.value)/100,bandHeight:Number(controls.height.value)/100,center:Number(controls.position.value)/100};}
  function showValues(){const v=values();$('repeatOut').textContent=`${v.repeat} 次`;$('scaleOut').textContent=`所在周长 ${Math.round(v.motifWidthU*100)}%`;$('heightOut').textContent=`${v.bandHeight.toFixed(2)} 单位`;$('positionOut').textContent=`${Math.round(v.center*100)}%`;}
  function applyValues(item){
    item.loadImage?.();
    const fit=saved[item.id]||{};
    const native=item.nativeRepeat||item.pattern?.repeat||4;
    controls.repeat.value=fit.repeat||native;
    controls.scale.value=Math.round(100*(fit.motifWidthU??item.pattern?.motifWidthU??item.suggestedMotifWidthU??Math.min(1,1/native)));
    controls.height.value=Math.round(100*(fit.bandHeight??(fit.bandWidth?fit.bandWidth*shape.heights[112]:null)??(item.suggestedWidthV?item.suggestedWidthV*1.72:.18)));
    controls.position.value=Math.round(100*(fit.center??.55));
    showValues();updatePattern();
  }
  function category(item){return item.cultureLabel||'其他纹样';}
  function addOption(item){
    items.set(item.id,item);
    const categoryId=category(item);
    let group=controls.pattern.querySelector(`optgroup[data-group="${categoryId}"]`);
    if(!group){group=document.createElement('optgroup');group.label=categoryId;group.dataset.group=categoryId;controls.pattern.append(group);}
    const option=document.createElement('option');option.value=item.id;item.option=option;group.append(option);updateReviewStatus();
  }
  function needsReview(item){return item.type==='expanded'&&saved[item.id]?.reviewedAssetVersion!==item.assetVersion;}
  function updateReviewStatus(){
    const pending=[...items.values()].filter(needsReview);
    const uncalibrated=pending.filter(item=>!saved[item.id]).length;
    for(const item of items.values())if(item.option){
      item.option.textContent=`${item.id} · ${item.name}${needsReview(item)?' · 待复调':''}`;
      const group=controls.pattern.querySelector(`optgroup[data-group="${category(item)}"]`);
      if(needsReview(item)&&group&&!item.option.isConnected)group.append(item.option);
      if(!needsReview(item))item.option.remove();
    }
    $('reviewStatus').textContent=`本轮待复调 ${pending.length} 款（未调参 ${uncalibrated}，图样更新后待复核 ${pending.length-uncalibrated}）；调整后点“确认这组参数”。`;
    $('nextReview').disabled=!pending.length;
  }
  function updatePattern(){
    const item=current();if(!item||!renderer)return;
    const v=values();showValues();
    if(item.type==='custom')E.renderTile(tile,{...item.pattern,repeat:v.repeat,spacing:0,motifWidthU:v.motifWidthU});
    else if(item.image?.complete&&item.image.naturalWidth)E.layoutPatternTile(tile,item.image,item.nativeRepeat,v.repeat,v.motifWidthU);
    else return;
    E.paintBands(patternCanvas,[E.createBand({center:v.center,width:v.bandHeight/shape.heights[112],assetId:item.id})],{[item.id]:tile});
    renderer.setPatternCanvas(patternCanvas);
    const radius=shape.radii[Math.round(v.center*112)],height=shape.heights[112];
    const localSlope=Math.abs((shape.radii[Math.min(112,Math.round(v.center*112)+1)]-shape.radii[Math.max(0,Math.round(v.center*112)-1)])/(shape.heights[Math.min(112,Math.round(v.center*112)+1)]-shape.heights[Math.max(0,Math.round(v.center*112)-1)]));
    const curved=localSlope>.7?'这里曲面弯得较急，转到侧面检查图案。':'旋转陶器检查整圈和接缝。';
    $('message').textContent=`当前位置半径 ${radius.toFixed(2)}、器高 ${height.toFixed(2)}。${curved}`;
  }
  function changeShape(){
    shape=window.PotteryArtStandards.buildShape(controls.shape.value);
    renderer.updateGeometry(E.createPotMesh(shape));
    camera.targetY=shape.heights[112]*.47;camera.distance=Math.max(3.35,shape.heights[112]*2.65);
    updatePattern();
  }
  function save(silent=false){
    const item=current();if(!item)return;
    const order=[...items.keys()],savedIndex=order.indexOf(item.id);
    const v=values();saved[item.id]={...v};
    if(item.type==='expanded'&&!silent)saved[item.id].reviewedAssetVersion=item.assetVersion;
    try{
      if(item.type==='custom'){
        item.pattern={...item.pattern,repeat:v.repeat,spacing:0,motifWidthU:v.motifWidthU};
        E.savePattern(item.pattern);
      }
      localStorage.setItem(settingsKey,JSON.stringify(saved));
      updateReviewStatus();
      if(!silent){
        const pending=[...items.values()].filter(needsReview);
        const next=pending.find(candidate=>order.indexOf(candidate.id)>savedIndex)||pending[0];
        if(next){controls.pattern.value=next.id;applyValues(next);$('message').textContent=`${item.name}已确认，继续调整 ${next.name}。`;}
        else $('message').textContent='本轮花纹已全部确认。';
      }
    }catch(error){$('message').textContent=`保存失败：${error.message}`;}
  }
  function frame(now){
    const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;
    if(!drag)spin+=dt*.31;
    const recipe=window.PotteryClaySamples.find(item=>item.id===controls.material.value)||window.PotteryClaySamples[0];
    renderer.draw(1,camera,.85,recipe,spin,0,false,1.07);
    requestAnimationFrame(frame);
  }
  function initRenderer(){
    shape=window.PotteryArtStandards.buildShape(controls.shape.value);
    renderer=new E.PotteryRenderer(canvas,E.createPotMesh(shape),{preserveDrawingBuffer:true,standStyle:'limestone'});
    camera.targetY=shape.heights[112]*.47;camera.distance=Math.max(3.35,shape.heights[112]*2.65);
    requestAnimationFrame(frame);
  }
  canvas.addEventListener('pointerdown',event=>{drag={id:event.pointerId,x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);event.preventDefault();});
  canvas.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;spin-=(event.clientX-drag.x)*.012;camera.pitch=Math.max(.12,Math.min(.75,camera.pitch+(event.clientY-drag.y)*.004));drag.x=event.clientX;drag.y=event.clientY;event.preventDefault();});
  for(const type of ['pointerup','pointercancel'])canvas.addEventListener(type,event=>{if(drag?.id===event.pointerId)drag=null;});
  controls.pattern.addEventListener('change',()=>applyValues(current()));
  controls.shape.addEventListener('change',changeShape);
  for(const id of ['repeat','scale','height','position'])controls[id].addEventListener('input',()=>{updatePattern();save(true);});
  $('save').addEventListener('click',()=>save(false));
  $('nextReview').addEventListener('click',()=>{const pending=[...items.values()].filter(needsReview);if(!pending.length)return;const currentIndex=pending.findIndex(item=>item.id===controls.pattern.value);const next=pending[(currentIndex+1)%pending.length];controls.pattern.value=next.id;applyValues(next);});
  $('snapshot').addEventListener('click',()=>{const out=document.createElement('canvas');out.width=canvas.width;out.height=canvas.height;const ctx=out.getContext('2d');ctx.fillStyle='#314b3b';ctx.fillRect(0,0,out.width,out.height);ctx.drawImage(canvas,0,0);const link=document.createElement('a');link.download=`${controls.pattern.value}-fit.png`;link.href=out.toDataURL('image/png');link.click();});
  $('copy').addEventListener('click',async()=>{const item=current();const payload=JSON.stringify({patternId:item?.id,...values()},null,2);try{await navigator.clipboard.writeText(payload);$('message').textContent='参数已复制，可发给美术策划。';}catch(_){$('message').textContent=payload;}});
  $('exportFits').addEventListener('click',()=>{const file=new Blob([JSON.stringify(saved,null,2)],{type:'application/json'});const url=URL.createObjectURL(file),link=document.createElement('a');link.href=url;link.download='pattern-fit-presets.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  try{initRenderer();}catch(error){$('renderError').hidden=false;$('renderError').textContent=`3D 预览无法启动：${error.message}`;return;}
  const catalogs=[
    {url:'./assets/expanded-patterns/manifest.json',base:'./assets/expanded-patterns',type:'expanded',period:entry=>entry.repeatHint,path:entry=>entry.colorPng}
  ];
  Promise.allSettled(catalogs.map(async catalog=>{
    const response=await fetch(catalog.url,{cache:'no-store'});if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const manifest=await response.json();
    for(const entry of manifest.patterns){
      const image=new Image(),item={...entry,type:catalog.type,assetVersion:catalog.type==='expanded'?manifest.assetVersion:null,nativeRepeat:catalog.period(entry),image};addOption(item);
      image.onload=()=>{if(current()?.id===item.id)updatePattern();};
      item.loadImage=()=>{if(!image.src)image.src=`${catalog.base}/${catalog.path(entry)}`;};
    }
  })).then(results=>{
    const requested=new URLSearchParams(location.search).get('pattern');
    const pending=[...items.values()].filter(needsReview);
    controls.pattern.value=items.has(requested)&&needsReview(items.get(requested))?requested:pending[0]?.id||'';
    if(current())applyValues(current());else $('message').textContent='本轮花纹已全部确认。';
    if(results.some(result=>result.status==='rejected'))$('message').textContent='部分花纹目录未载入，请刷新页面。';
  });
}());
