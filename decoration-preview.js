(function () {
  'use strict';
  const {createPotShape,createPotMesh,PotteryRenderer,createBand,validBand,appendBand,createPaint,validPaint,dabPaint,strokePaint,paintToCanvas,paintBands,eraseDecorationRing,layoutPatternTile,PAINT_ROWS,loadPatterns,renderTile,raycastPot,pickPotSurface,addSurfacePoint,validSurfaceStroke,drawSurfaceStrokes}=window.PotteryEngine;
  const flow=window.PotteryWorkflow,work=flow.requireStage('decorate');if(!work)return;
  const recipes=window.PotteryClaySamples;
  const economyCatalog=window.PotteryEconomyCatalog;
  const canvas=document.getElementById('potCanvas'),prompt=document.getElementById('stagePrompt');
  const swatches=document.getElementById('swatches'),widthInput=document.getElementById('bandWidth'),speedInput=document.getElementById('wheelSpeed');
  const palette=window.PotteryPigments.map(item=>({
    ...item,color:[1,3,5].map(offset=>parseInt(item.hex.slice(offset,offset+2),16)/255)
  }));
  const state={yaw:.30,pitch:.34,distance:5.85,targetY:1.02,lightAngle:.76,spin:0,turnRate:1.4};window.PotterySceneCamera=state;
  const sourceKey='clay-and-flame-e1-draft-v2',storageKey='clay-and-flame-e3-draft-v2';
  let shape=createPotShape(),recipeIndex=0,bands=[],paint=createPaint(),strokes=[],pigmentMarks=[],history=[],historyIndex=0;
  let sourceShape='',tool=null,pattern='wave',paletteIndex=0,mode='place',gesture=null,liveStroke=null,lastFrame=0,paintDirty=false,patternDirty=false;
  const assets={},catalog={};
  let fitPresets={...window.PotteryPatternFitPresets};
  try{fitPresets={...fitPresets,...(JSON.parse(localStorage.getItem('clay-and-flame-pattern-fit-v1')||'{}')||{})};}catch(_){}
  const patternGroupSelect=document.getElementById('patternGroup'),patternGroups=new Map(),patternGroupById=new Map([['wave','basic'],['petal','basic']]);
  function registerPatternGroup(id,label,panel){
    if(patternGroups.has(id))return;
    patternGroups.set(id,panel);
    const option=document.createElement('option');option.value=id;option.textContent=label;patternGroupSelect.append(option);
    panel.hidden=id!==patternGroupSelect.value;
  }
  function showPatternGroup(id){
    if(!patternGroups.has(id))return;
    patternGroupSelect.value=id;
    for(const [key,panel] of patternGroups){panel.hidden=key!==id;if(key===id&&panel.tagName==='DETAILS')panel.open=true;}
  }
  registerPatternGroup('basic','基础纹样',document.getElementById('basicPatterns'));
  registerPatternGroup('custom','我的花纹',document.getElementById('customPatterns'));
  registerPatternGroup('xiwang','汐湾原创',document.getElementById('originalPatterns'));
  document.getElementById('heritagePatterns').hidden=true;
  showPatternGroup('xiwang');
  patternGroupSelect.addEventListener('change',()=>showPatternGroup(patternGroupSelect.value));
  function choosePattern(id){
    if(economyCatalog.find('pattern',id)&&!economyCatalog.isOwned('pattern',id)){
      document.getElementById('assetStatus').textContent='请先在商店获得这款花纹';
      return;
    }
    pattern=id;tool='pattern';widthInput.max='800';widthInput.min='5';
    showPatternGroup(patternGroupById.get(id));
    catalog[id]?.loadAsset?.();
    const fit=fitPresets[id];
    const preferred=Number.isFinite(fit?.bandHeight)?fit.bandHeight/shape.heights[112]:fit?.bandWidth;
    if(Number.isFinite(preferred))widthInput.value=String(Math.round(Math.max(.005,Math.min(.8,preferred))*1000));
    else if(width()<.10)widthInput.value='150';
    updateControls();
  }
  function validShape(value) {
    return value&&Array.isArray(value.radii)&&Array.isArray(value.heights)&&value.radii.length===113&&value.heights.length===113&&
      value.radii.every(r=>Number.isFinite(r)&&r>=.13&&r<=1)&&value.heights.every((h,i)=>Number.isFinite(h)&&(i===0?Math.abs(h)<1e-6:h>value.heights[i-1]));
  }
  try {const draft=JSON.parse(localStorage.getItem(sourceKey)||'null');if(draft?.workId===work.workId&&validShape(draft?.shape)){
    shape=draft.shape;const found=recipes.findIndex(recipe=>recipe.id===draft.materialId);if(found>=0)recipeIndex=found;
  }else {flow.broken('找不到这件陶坯');return;}}catch(_){flow.broken('陶坯读取失败');return;}
  sourceShape=JSON.stringify(shape);
  try {
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(saved?.workId===work.workId&&saved?.sourceShape===sourceShape&&Array.isArray(saved.bands)&&saved.bands.every(validBand)&&validPaint(saved.paint)){
      bands=saved.bands;paint=Float32Array.from(saved.paint);
      if(Array.isArray(saved.strokes)&&saved.strokes.every(validSurfaceStroke))strokes=saved.strokes;
      if(Array.isArray(saved.pigmentMarks))pigmentMarks=saved.pigmentMarks.filter(mark=>typeof mark?.id==='string'&&Number.isFinite(mark.from)&&Number.isFinite(mark.to)&&Number.isFinite(mark.width));
      document.getElementById('draftState').textContent='已恢复装饰';
    }
  }catch(_){}
  function snapshot(){return {bands:bands.map(b=>({...b,color:[...b.color],erasedRanges:b.erasedRanges?.map(r=>[...r])})),paint:Array.from(paint),strokes:strokes.map(s=>({...s,color:[...s.color],points:s.points.map(p=>[...p]),erasedRanges:s.erasedRanges?.map(r=>[...r])})),pigmentMarks:pigmentMarks.map(mark=>({...mark}))};}
  history=[snapshot()];
  let renderer;
  try {renderer=new PotteryRenderer(canvas,createPotMesh(shape));}
  catch(error){const box=document.getElementById('renderError');box.hidden=false;box.textContent=`陶器装饰无法启动：${error.message}`;return;}
  const patternTexture=document.createElement('canvas');patternTexture.width=1024;patternTexture.height=1024;
  const paintTexture=document.createElement('canvas');paintTexture.width=1;paintTexture.height=PAINT_ROWS;
  function updatePattern(){paintBands(patternTexture,bands,assets);drawSurfaceStrokes(patternTexture,liveStroke?[...strokes,liveStroke]:strokes);renderer.setPatternCanvas(patternTexture);}
  function updatePaint(){paintToCanvas(paintTexture,paint);renderer.setPaintCanvas(paintTexture);paintDirty=false;}
  updatePaint();updatePattern();
  document.getElementById('materialName').textContent=recipes[recipeIndex].name;
  palette.forEach((item,index)=>{const button=document.createElement('button');button.type='button';button.style.setProperty('--swatch',item.hex);button.setAttribute('aria-label',item.name);button.disabled=!economyCatalog.isOwned('pigment',item.id);button.title=`${item.name} · ${item.price?`${item.price} 金币 · ${button.disabled?'去商店购买':'已拥有'}`:'基础色'}`;
    const preview=document.createElement('span');preview.className='swatch-preview';preview.setAttribute('aria-hidden','true');
    const name=document.createElement('span');name.className='swatch-name';name.textContent=item.name;button.append(preview,name);
    button.addEventListener('click',()=>{paletteIndex=index;updateControls();});swatches.appendChild(button);});
  function width(){return Number(widthInput.value)/1000;}
  function brushWidth(){return Math.max(.012,Math.min(.11,width()*1.72/shape.heights[112]));}
  function activePatternName(){return catalog[pattern]?.name||(pattern==='wave'?'连波':'花瓣');}
  function updateControls(){
    document.getElementById('colorTool').setAttribute('aria-pressed',String(tool==='color'));
    document.getElementById('patternTool').setAttribute('aria-pressed',String(tool==='pattern'));
    document.getElementById('drawTool').setAttribute('aria-pressed',String(tool==='draw'));
    document.getElementById('patternRow').hidden=tool!=='pattern';
    document.getElementById('drawRow').hidden=tool!=='draw';
    if(tool==='draw'&&strokes.length&&!gesture){smoothingInput.value=Math.round(strokes[strokes.length-1].smoothing*100);document.getElementById('smoothingValue').textContent=`${smoothingInput.value}%`;}
    document.querySelectorAll('[data-pattern]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pattern===pattern)));
    [...swatches.children].forEach((button,index)=>button.setAttribute('aria-pressed',String(index===paletteIndex)));
    document.getElementById('widthLabel').textContent=width()<.027?'极细':width()<.06?'细':width()<.12?'中':'宽';
    document.getElementById('toolDescription').textContent=tool==='color'?`底色 · ${palette[paletteIndex].name}`:tool==='draw'?`手绘 · ${palette[paletteIndex].name}`:`花纹 · ${activePatternName()}`;
    const edit=document.getElementById('editPattern');
    const customSelected=Array.isArray(catalog[pattern]?.strokes);
    edit.href=customSelected?`./pattern-studio.html?edit=${encodeURIComponent(pattern)}`:'./pattern-studio.html';
    edit.textContent=customSelected?'编辑选中花纹 ↗':'绘制新花纹 ↗';
    document.getElementById('bandCount').textContent=`底色 ${paint.some((v,i)=>i%4===3&&v>.02)?'已上色':'未上色'} · 花纹 ${bands.length} 圈 · 手绘 ${strokes.length} 笔`;
    document.getElementById('undo').disabled=historyIndex===0;document.getElementById('redo').disabled=historyIndex===history.length-1;
    document.getElementById('placeMode').setAttribute('aria-pressed',String(mode==='place'));
    document.getElementById('viewMode').setAttribute('aria-pressed',String(mode==='view'));
    document.dispatchEvent(new Event('pottery:tool-change'));
    prompt.textContent=!tool?'选择右侧工具开始装饰':tool==='erase'?'按住预览擦除环，上下移动，松手擦除':mode==='view'?'拖动陶器或空白处，转动视角':tool==='color'?'按住加深底色，上下滑动连续上色；换色可混合':tool==='draw'?'沿器身直接画线；降低转速更方便画局部纹样':'按住预览花纹，上下移动选位置，松手贴上';
  }
  function save(){try{localStorage.setItem(storageKey,JSON.stringify({workId:work.workId,sourceShape,bands,paint:Array.from(paint),strokes,pigmentMarks}));document.getElementById('draftState').textContent='自动保存';document.dispatchEvent(new Event('pottery:draft'));return true;}
    catch(_){document.getElementById('draftState').textContent='保存失败';return false;}}
  document.querySelector('.next-photo').addEventListener('click',event=>{event.preventDefault();try{if(!save())throw new Error('装饰保存失败，请检查浏览器空间');flow.advance(work.workId,'decorate','photo');if(!window.PotteryNavigate?.('./photo-studio.html'))location.href='./photo-studio.html';}catch(error){prompt.textContent=error.message;prompt.classList.remove('is-hidden');}});
  function commit(){history=history.slice(0,historyIndex+1);history.push(snapshot());if(history.length>31)history.shift();historyIndex=history.length-1;updateControls();save();}
  function restore(index){historyIndex=index;const item=history[index];bands=item.bands.map(b=>({...b,color:[...b.color]}));paint=Float32Array.from(item.paint);strokes=item.strokes.map(s=>({...s,color:[...s.color],points:s.points.map(p=>[...p]),erasedRanges:s.erasedRanges?.map(r=>[...r])}));pigmentMarks=item.pigmentMarks.map(mark=>({...mark}));updatePaint();updatePattern();updateControls();save();}
  function selectTool(next){
    if(gesture)release({pointerId:gesture.id},true);
    if(next==='erase'&&!economyCatalog.isOwned('tool','ring-eraser'))return false;
    tool=next;mode=next?'place':'view';renderer.setPreviewBand(null);
    if(next==='color'){widthInput.min='12';widthInput.max='110';if(width()<.012||width()>.11)widthInput.value='31';}
    if(next==='pattern'){widthInput.min='5';widthInput.max='800';if(width()<.10)widthInput.value='150';}
    if(next==='draw'){widthInput.min='3';widthInput.max='110';widthInput.value='9';}
    updateControls();prompt.classList.remove('is-hidden');
    document.dispatchEvent(new Event('pottery:tool-change'));return true;
  }
  window.PotteryDecorationTools={current:()=>tool,select:selectTool};
  document.addEventListener('pottery:tool-close',()=>selectTool(null));
  for(const [id,next] of [['colorTool','color'],['patternTool','pattern'],['drawTool','draw']])document.getElementById(id).addEventListener('click',()=>selectTool(next));
  document.querySelectorAll('[data-pattern]').forEach(button=>button.addEventListener('click',()=>{if(!economyCatalog.isOwned('pattern',button.dataset.pattern))return;choosePattern(button.dataset.pattern);}));
  widthInput.addEventListener('input',()=>{updateControls();updatePreview();});
  const smoothingInput=document.getElementById('smoothing');
  smoothingInput.addEventListener('input',()=>{
    document.getElementById('smoothingValue').textContent=`${smoothingInput.value}%`;
    if(strokes.length&&!gesture){strokes[strokes.length-1].smoothing=Number(smoothingInput.value)/100;updatePattern();}
  });
  smoothingInput.addEventListener('change',()=>{if(strokes.length&&!gesture)commit();});
  document.getElementById('undo').addEventListener('click',()=>{if(historyIndex>0)restore(historyIndex-1);});
  document.getElementById('redo').addEventListener('click',()=>{if(historyIndex<history.length-1)restore(historyIndex+1);});
  document.getElementById('clearBands').addEventListener('click',()=>{if(bands.length||strokes.length||paint.some((v,i)=>i%4===3&&v>.001)){bands=[];strokes=[];pigmentMarks=[];paint=createPaint();updatePaint();updatePattern();commit();}});
  function setMode(next){mode=next;renderer.setPreviewBand(null);updateControls();prompt.classList.remove('is-hidden');}
  document.getElementById('placeMode').addEventListener('click',()=>setMode('place'));
  document.getElementById('viewMode').addEventListener('click',()=>setMode('view'));
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)speedInput.value='0';
  function updateSpeed(){const value=Number(speedInput.value);state.turnRate=value*.032;document.getElementById('wheelSpeedValue').textContent=value===0?'停转':value<30?'慢速':value<75?'中速':'快速';}
  speedInput.addEventListener('input',updateSpeed);updateSpeed();

  function loadCustomPatterns(){
    for(const item of loadPatterns()){
      const tile=document.createElement('canvas');tile.width=1024;tile.height=512;
      renderTile(tile,item);assets[item.id]=tile;catalog[item.id]=item;
      const button=document.createElement('button');button.type='button';button.dataset.pattern=item.id;button.className='pattern-choice';
      const image=document.createElement('img');image.src=tile.toDataURL('image/png');image.alt='';
      const label=document.createElement('span');label.textContent=item.name;button.append(image,label);
      button.addEventListener('click',()=>choosePattern(item.id));
      document.getElementById('customPatterns').appendChild(button);
      patternGroupById.set(item.id,'custom');
    }
    const selected=new URLSearchParams(location.search).get('pattern');
    if(selected&&catalog[selected])choosePattern(selected);
    updatePattern();updateControls();
  }
  loadCustomPatterns();

  // The PNGs are UV tiles. Their horizontal edges already match, so one image
  // covers one circumference; the repeating motifs are inside that image.
  const cultureLabels={egypt:'埃及莲纹',china:'中国陶瓷',korea:'朝鲜粉青陶',iznik:'伊兹尼克',delft:'代尔夫特','british-slipware':'英国泥浆彩陶'};
  const expandedGroups=new Map();
  function expandedContainer(item){
    const label=item.cultureLabel||cultureLabels[item.cultureId]||'其他文化',id=`culture:${label}`;
    const root=document.getElementById('expandedPatterns');
    let group=expandedGroups.get(id);
    if(!group){
      group=document.createElement('details');group.dataset.culture=item.cultureId||'';group.className='culture-patterns';
      const title=document.createElement('summary');title.textContent=label;
      const grid=document.createElement('div');grid.className='pattern-grid';grid.setAttribute('role','group');grid.setAttribute('aria-label',title.textContent);
      group.append(title,grid);root.append(group);expandedGroups.set(id,group);registerPatternGroup(id,label,group);
    }
    patternGroupById.set(item.id,id);
    return group.querySelector('.pattern-grid');
  }
  async function loadCatalog(url,base,filter,expanded=false){
    const response=await fetch(url);if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const manifest=await response.json();
    for(const item of manifest.patterns.filter(filter)){
      if(expanded)fitPresets[item.id]=window.PotteryPatternFitPresets[item.id]||(Number.isFinite(item.bandHeight)?{bandHeight:item.bandHeight}:undefined);
      catalog[item.id]=item;
      const button=document.createElement('button');button.type='button';button.dataset.pattern=item.id;button.className='pattern-choice';
      const image=document.createElement('img');image.src=`${base}/${item.previewPng}`;image.alt='';image.loading='lazy';
      const label=document.createElement('span');label.textContent=item.name;button.append(image,label);
      const owned=economyCatalog.isOwned('pattern',item.id);
      button.disabled=!owned;
      if(!owned)label.textContent=`🔒 ${item.name}`;
      const price=economyCatalog.find('pattern',item.id)?.price||0;
      button.title=owned?item.name:`${item.name} · ${price} 金币 · 前往商店解锁`;
      button.setAttribute('aria-label',button.title);
      button.addEventListener('click',()=>choosePattern(item.id));
      const destination=expanded||item.id.startsWith('R')?expandedContainer(item):document.getElementById('originalPatterns');
      if(destination.id==='originalPatterns')patternGroupById.set(item.id,'xiwang');
      destination.appendChild(button);
      const asset=new Image();let loading=false;
      asset.onload=()=>{
        const fit=fitPresets[item.id];
        if(Number.isInteger(fit?.repeat)&&Number.isFinite(fit?.motifWidthU)){
          const fitted=document.createElement('canvas');fitted.width=1024;fitted.height=512;
          item.assetFit={nativeRepeat:item.repeatHint||1,repeat:fit.repeat,motifWidthU:fit.motifWidthU};
          layoutPatternTile(fitted,asset,item.assetFit.nativeRepeat,fit.repeat,fit.motifWidthU);
          assets[item.id]=fitted;
        }else assets[item.id]=asset;
        updatePattern();
        if(pattern===item.id)document.getElementById('assetStatus').textContent='纹样已载入';
      };
      asset.onerror=()=>{loading=false;document.getElementById('assetStatus').textContent=`${item.name}载入失败`;};
      item.loadAsset=()=>{if(loading||assets[item.id])return;loading=true;document.getElementById('assetStatus').textContent=`正在载入${item.name}…`;asset.src=`${base}/${item.colorPng}`;};
      if((!expanded&&owned)||bands.some(band=>band.assetId===item.id))item.loadAsset();
    }
    updateControls();
  }
  window.PotterySceneReady=Promise.allSettled([
    loadCatalog('./assets/patterns/manifest.json','./assets/patterns',item=>item.stage==='ring'),
    loadCatalog('./assets/heritage/patterns/manifest.json','./assets/heritage/patterns',item=>item.repeat===true),
    loadCatalog('./assets/expanded-patterns/manifest.json','./assets/expanded-patterns',()=>true,true),
    loadCatalog('./assets/order-patterns/manifest.json','./assets/order-patterns',item=>item.orderId===work.orderId||['accepted','replied'].includes(window.PotteryEngine.loadEconomy().orders?.[item.orderId]?.status),true)
  ]).then(results=>{if(results.some(result=>result.status==='rejected'))document.getElementById('assetStatus').textContent='部分纹样未加载，请用 localhost 打开页面';
    else document.getElementById('assetStatus').textContent='纹样已载入';
    const selected=new URLSearchParams(location.search).get('pattern');
    if(selected&&catalog[selected])choosePattern(selected);
  });

  function hitSurface(x,y){const rect=canvas.getBoundingClientRect();return raycastPot(shape,state,state.spin,x,y,rect.width,rect.height);}
  function hitPlace(x,y){const rect=canvas.getBoundingClientRect();const px=x*canvas.clientWidth/rect.width,py=y*canvas.clientHeight/rect.height;
    return pickPotSurface(shape,state,state.spin,px,py,canvas.clientWidth,canvas.clientHeight,point=>renderer.projectPoint(point,state),42);}
  const ERASER_HEIGHT=.10;
  function eraserWidth(){return ERASER_HEIGHT/shape.heights[112];}
  function updatePreview(){if(gesture?.kind==='pattern'||gesture?.kind==='erase')renderer.setPreviewBand({center:gesture.v,width:(gesture.kind==='erase'?eraserWidth():width())*.5,color:gesture.kind==='erase'?[.80,.96,1]:[1,.85,.53]});}
  function applyStroke(from,to,dt){strokePaint(paint,from,to,brushWidth(),palette[gesture.palette].color,dt);gesture.low=Math.min(gesture.low,from,to);gesture.high=Math.max(gesture.high,from,to);paintDirty=true;}
  canvas.addEventListener('pointerdown',event=>{if(gesture)return;const rect=canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    const surface=mode==='place'&&tool==='draw'?hitSurface(x,y):null;
    const place=mode==='place'&&tool&&tool!=='draw'?hitPlace(x,y):null;
    const kind=tool==='draw'?(surface?'draw':'view'):(place?tool:'view');
    gesture={id:event.pointerId,kind,v:place?.v,x:event.clientX,y:event.clientY,palette:paletteIndex,lastPaint:performance.now(),low:place?.v,high:place?.v,strokeWidth:brushWidth(),before:kind==='color'?snapshot():null};
    if(kind==='draw'){liveStroke={points:[],color:[...palette[paletteIndex].color],pigmentId:palette[paletteIndex].id,width:brushWidth(),smoothing:Number(smoothingInput.value)/100};addSurfacePoint(liveStroke.points,surface);updatePattern();}
    canvas.setPointerCapture(event.pointerId);if(gesture.kind==='color')applyStroke(gesture.v,gesture.v,24);updatePreview();prompt.classList.add('is-hidden');event.preventDefault();});
  canvas.addEventListener('pointermove',event=>{if(!gesture||event.pointerId!==gesture.id)return;
    if(gesture.kind==='draw'){
      gesture.x=event.clientX;gesture.y=event.clientY;
      const rect=canvas.getBoundingClientRect();
      if(addSurfacePoint(liveStroke.points,hitSurface(event.clientX-rect.left,event.clientY-rect.top)))patternDirty=true;
    }else if(gesture.kind==='color'||gesture.kind==='pattern'||gesture.kind==='erase'){
      const rect=canvas.getBoundingClientRect(),next=hitPlace(event.clientX-rect.left,event.clientY-rect.top);
      if(next){if(gesture.kind==='color'){const now=performance.now();applyStroke(gesture.v,next.v,Math.min(80,Math.max(16,now-gesture.lastPaint)));gesture.lastPaint=now;}
        gesture.v=next.v;updatePreview();}
    }else{const scale=window.PotteryUiScale||1;state.yaw-=(event.clientX-gesture.x)/scale*.012;state.pitch=Math.max(.18,Math.min(.58,state.pitch+(event.clientY-gesture.y)/scale*.005));gesture.x=event.clientX;gesture.y=event.clientY;}
    event.preventDefault();});
  function release(event,cancelled=false){if(!gesture||event.pointerId!==gesture.id)return;
    if(gesture.kind==='erase'){
      renderer.setPreviewBand(null);
      if(!cancelled&&economyCatalog.isOwned('tool','ring-eraser')){
        const erased=eraseDecorationRing(paint,bands,strokes,gesture.v,eraserWidth());bands=erased.bands;strokes=erased.strokes;
        updatePaint();updatePattern();commit();window.PotteryAudio.play('paint');
      }
    }else if(gesture.kind==='pattern'){
      renderer.setPreviewBand(null);
      if(!cancelled){if(economyCatalog.find('pattern',pattern)&&!economyCatalog.isOwned('pattern',pattern)){document.getElementById('assetStatus').textContent='请先在商店获得这款花纹';}
        else if(pattern in catalog&&!assets[pattern]){document.getElementById('assetStatus').textContent='纹样仍在加载，请稍后再贴';}
        else{const motifColor=pattern==='petal'?[.30,.39,.45]:[.72,.69,.55];const band=createBand({center:gesture.v,width:width(),kind:pattern==='petal'?'petal':'wave',assetId:pattern in catalog?pattern:null,color:motifColor});
          if(catalog[pattern]?.assetFit)band.assetFit={...catalog[pattern].assetFit};
          bands=appendBand(bands,band);updatePattern();commit();window.PotteryAudio.play('stamp');}}
    }else if(gesture.kind==='color'){
      if(cancelled){paint=Float32Array.from(gesture.before.paint);updatePaint();}
      else{pigmentMarks.push({id:palette[gesture.palette].id,from:gesture.low,to:gesture.high,width:gesture.strokeWidth});updatePaint();commit();window.PotteryAudio.play('paint');}
    }else if(gesture.kind==='draw'){
      const finished=liveStroke;liveStroke=null;
      if(!cancelled&&validSurfaceStroke(finished)){strokes.push(finished);updatePattern();commit();window.PotteryAudio.play('draw');}
      else updatePattern();
    }
    gesture=null;
  }
  canvas.addEventListener('pointerup',event=>release(event));canvas.addEventListener('pointercancel',event=>release(event,true));
  canvas.addEventListener('wheel',event=>{state.distance=Math.max(3.25,Math.min(5.3,state.distance+Math.sign(event.deltaY)*.20));event.preventDefault();},{passive:false});
  function frame(now){requestAnimationFrame(frame);if(document.hidden||now-lastFrame<27)return;const delta=Math.min(50,now-lastFrame||16);lastFrame=now;
    if(gesture?.kind==='color'){applyStroke(gesture.v,gesture.v,delta);if(paintDirty)updatePaint();}
    if(gesture?.kind==='draw'&&liveStroke){const rect=canvas.getBoundingClientRect();if(addSurfacePoint(liveStroke.points,hitSurface(gesture.x-rect.left,gesture.y-rect.top)))patternDirty=true;}
    if(patternDirty){updatePattern();patternDirty=false;}
    state.spin=(state.spin+delta*state.turnRate/1000)%(Math.PI*2);renderer.draw(1,state,state.lightAngle,recipes[recipeIndex],state.spin);
  }
  updateControls();requestAnimationFrame(frame);
}());
