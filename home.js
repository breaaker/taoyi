(function(){
  'use strict';
  const flow=window.PotteryWorkflow,engine=window.PotteryEngine,recipes=window.PotteryClaySamples,economy=window.PotteryEconomyCatalog;
  const home=document.getElementById('home'),canvas=document.getElementById('homeCanvas'),start=document.getElementById('start');
  const work=flow.current();let shape=engine.createClayBlank(),recipe=recipes[0];
  if(work){try{const draft=JSON.parse(localStorage.getItem(flow.SHAPE_KEY)||'null');if(draft?.workId===work.workId&&draft.shape?.radii?.length===113)shape=draft.shape;}catch(_){}
    recipe=recipes.find(item=>item.id===work.materialId)||recipe;
    start.querySelector('b').textContent=work.stage==='finish'?(work.purpose==='order'?'寄出这件作品':'进入拍卖'):'继续制作';}
  let renderer;try{renderer=new engine.PotteryRenderer(canvas,engine.createPotMesh(shape));}
  catch(error){document.getElementById('homeError').hidden=false;document.getElementById('homeError').textContent=`三维陶坯无法显示：${error.message}`;}
  async function restoreDecoration(){
    if(!renderer||!work||!['photo','finish','decorate'].includes(work.stage))return;
    let draft;
    try{draft=JSON.parse(localStorage.getItem(flow.DECOR_KEY)||'null');}catch(_){return;}
    if(draft?.workId!==work.workId||!engine.validPaint(draft.paint)||!Array.isArray(draft.bands)||!draft.bands.every(engine.validBand))return;
    const paint=document.createElement('canvas');paint.width=1;paint.height=engine.PAINT_ROWS;
    engine.paintToCanvas(paint,Float32Array.from(draft.paint));renderer.setPaintCanvas(paint);
    const pattern=document.createElement('canvas');pattern.width=1024;pattern.height=1024;
    const assets={},custom=new Map(engine.loadPatterns().map(item=>[item.id,item]));
    await Promise.all([...new Set(draft.bands.map(band=>band.assetId).filter(Boolean))].map(async id=>{
      if(custom.has(id)){const tile=document.createElement('canvas');tile.width=1024;tile.height=512;engine.renderTile(tile,custom.get(id));assets[id]=tile;return;}
      const path=engine.patternAssetPath(id);if(!path)return;
      const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=path;});
      assets[id]=engine.fittedPatternAsset(image,draft.bands.find(band=>band.assetId===id)?.assetFit);
    }));
    engine.paintBands(pattern,draft.bands,assets);
    const strokes=Array.isArray(draft.strokes)&&draft.strokes.every(engine.validSurfaceStroke)?draft.strokes:[];
    engine.drawSurfaceStrokes(pattern,strokes);renderer.setPatternCanvas(pattern);
  }
  window.PotterySceneReady=restoreDecoration().catch(()=>{});
  const camera={yaw:.2,pitch:.28,distance:4.15,targetY:.71,spin:0};window.PotterySceneCamera=camera;let last=0;
  function draw(now){requestAnimationFrame(draw);if(!renderer||document.hidden||now-last<30)return;const dt=last?Math.min(50,now-last):30;last=now;camera.spin+=dt*.0007;renderer.draw(work&&work.stage!=='shape'?1:0,camera,.76,recipe,camera.spin,0,false);}
  requestAnimationFrame(draw);
  const routes={shape:'shaping-preview.html',kiln:'kiln-preview.html',decorate:'decoration-preview.html',photo:'photo-studio.html'};
  start.addEventListener('click',()=>{start.disabled=true;
    try{const current=flow.current();const destination=current?.stage==='finish'?(current.purpose==='order'?'orders.html':'auction.html')+`?photo=${encodeURIComponent(current.photoId||'')}`:current?routes[current.stage]:'shaping-preview.html';
      if(!current){const material=recipes.find(item=>economy.isOwned('material',item.id))||recipes[0];flow.start(material.id,'free');}
      if(!window.PotteryNavigate?.('./'+destination))location.href='./'+destination;
      setTimeout(()=>{if(document.body.isConnected&&location.pathname.endsWith('/index.html')){home.classList.remove('is-starting');start.disabled=false;}},6000);
    }catch(error){home.classList.remove('is-starting');start.disabled=false;document.getElementById('homeError').hidden=false;document.getElementById('homeError').textContent=error.message;}
  });
  const settings=document.getElementById('settingsDialog'),audio=window.PotteryAudio;
  document.getElementById('settingsOpen').addEventListener('click',()=>{
    document.getElementById('audioEnabled').checked=audio.isEnabled();
    const levels=audio.getVolumes();
    for(const key of ['music','ambience','effects']){
      const control=document.getElementById(`${key}Volume`);
      control.value=String(Math.round(levels[key]*100));control.nextElementSibling.value=`${control.value}%`;
    }
    document.getElementById('gameLanguage').value=window.PotteryI18n?.locale()||'zh-CN';
    settings.showModal();
  });
  document.getElementById('settingsClose').addEventListener('click',()=>settings.close());
  settings.addEventListener('click',event=>{if(event.target===settings)settings.close();});
  document.getElementById('audioEnabled').addEventListener('change',event=>audio.setEnabled(event.target.checked));
  for(const key of ['music','ambience','effects'])document.getElementById(`${key}Volume`).addEventListener('input',event=>{
    audio.setVolumes({[key]:Number(event.target.value)/100});event.target.nextElementSibling.value=`${event.target.value}%`;
  });
  document.getElementById('gameLanguage').addEventListener('change',event=>window.PotteryI18n?.setLocale(event.target.value));
}());
