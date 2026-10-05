(function () {
  'use strict';
  const {createPotShape,createPotMesh,PotteryRenderer,kilnAt}=window.PotteryEngine;
  const flow=window.PotteryWorkflow,work=flow.requireStage('kiln');if(!work)return;
  const recipes=window.PotteryClaySamples;
  const potCanvas=document.getElementById('potCanvas');
  const fireCanvas=document.getElementById('fireCanvas');
  const fire=fireCanvas.getContext('2d');
  const progressInput=document.getElementById('progress');
  const progressText=document.getElementById('progressText');
  const playButton=document.getElementById('playPause');
  const recipeSelect=document.getElementById('materialSelect');
  const sourceNote=document.getElementById('sourceNote');
  const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const platform=window.PotteryPlatformPose;
  const camera={yaw:0,pitch:.2,distance:7.9,targetY:.84,spin:0};window.PotterySceneCamera=camera;
  let renderer;
  let shape=createPotShape(),recipeIndex=0,progress=Number(work.kilnProgress)||0,playing=true,lastFrame=0;
  window.PotteryAudio.setKilnProgress(progress);
  if(progress<.01)window.PotteryAudio.play('ignite');
  const flameImage=new Image();
  flameImage.src='./assets/kiln-flame.png';
  let kilnLayout={footY:0,flames:[],flameSize:90};
  function positionKiln(){
    const bounds=fireCanvas.getBoundingClientRect(),w=bounds.width,h=bounds.height;
    const ellipse=platform.ellipse('kiln-wide.png');
    const image={w:1672,h:941,flames:[[592,631],[1057,631]]};
    camera.pitch=platform.pitch(ellipse);
    camera.yaw=0;
    const scale=Math.max(w/image.w,h/image.h),left=(w-image.w*scale)/2,top=(h-image.h*scale)/2;
    const map=([x,y])=>({x:left+x*scale,y:top+y*scale});
    const flameSize=Math.min(90,Math.max(42,scale*88));
    const flames=image.flames.map(point=>{
      const flame=map(point),clearance=Math.min(flame.x,w-flame.x);
      return {...flame,visibility:Math.max(0,Math.min(1,clearance/(flameSize*.85)))};
    });
    const footCenter=platform.map(ellipse,w,h);
    kilnLayout={footX:footCenter.x,footY:footCenter.y,flames,flameSize};
    if(renderer){
      const targetWidth=ellipse.rx*2*scale*.68,targetHeight=h*.36;
      function sizeAt(distance){
        camera.distance=distance;
        let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
        for(let i=0;i<shape.radii.length;i+=7)for(let a=0;a<8;a++){
          const angle=a*Math.PI/4,p=renderer.projectPoint([shape.radii[i]*Math.cos(angle),shape.heights[i],shape.radii[i]*Math.sin(angle)],camera);
          minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
        }
        return {width:maxX-minX,height:maxY-minY};
      }
      let low=7.9,high=18;
      for(let i=0;i<16;i++){const middle=(low+high)/2,size=sizeAt(middle);if(size.width>targetWidth||size.height>targetHeight)low=middle;else high=middle;}
      camera.distance=high;
    }
    // Align the actual projected foot, including camera pitch and canvas aspect.
    const foot=renderer?.projectPoint([0,0,0],camera)||{x:w*.5,y:h*.67};
    potCanvas.style.top=`${kilnLayout.footY-foot.y}px`;
    potCanvas.style.left=`${kilnLayout.footX-foot.x}px`;
    const frame=document.getElementById('gameFrame'),scene=document.querySelector('.scene');
    for(const layer of [frame,scene]){
      if(!layer)continue;
      layer.style.setProperty('--kiln-foot-y',`${kilnLayout.footY}px`);
      layer.style.setProperty('--kiln-foot-x',`${kilnLayout.footX}px`);
      layer.style.setProperty('--kiln-flame-left',`${kilnLayout.flames[0].x}px`);
      layer.style.setProperty('--kiln-flame-right',`${kilnLayout.flames[1].x}px`);
    }
  }
  positionKiln();requestAnimationFrame(positionKiln);
  window.addEventListener('pottery:frame-ready',positionKiln,{once:true});
  window.addEventListener('resize',positionKiln,{passive:true});

  function validShape(value) {
    return value&&Array.isArray(value.radii)&&Array.isArray(value.heights)&&
      value.radii.length===113&&value.heights.length===113&&
      value.radii.every(r=>Number.isFinite(r)&&r>=.13&&r<=1)&&
      value.heights.every((h,i)=>Number.isFinite(h)&&(i===0?Math.abs(h)<1e-6:h>value.heights[i-1]));
  }
  try {
    const draft=JSON.parse(localStorage.getItem('clay-and-flame-e1-draft-v2')||'null');
    if(draft?.workId===work.workId&&validShape(draft?.shape)){
      shape=draft.shape;
      const found=recipes.findIndex(recipe=>recipe.id===draft.materialId);
      if(found>=0)recipeIndex=found;
      sourceNote.textContent='已放入你在 E1 塑形的陶坯';
    } else {flow.broken('找不到这件陶坯');return;}
  } catch(_) {flow.broken('找不到这件陶坯');return;}

  try {renderer=new PotteryRenderer(potCanvas,createPotMesh(shape));}
  catch(error){const box=document.getElementById('renderError');box.hidden=false;box.textContent=`窑火画面无法启动：${error.message}`;return;}
  positionKiln();
  recipes.forEach((recipe,index)=>recipeSelect.add(new Option(recipe.name,String(index))));
  recipeSelect.value=String(recipeIndex);
  recipeSelect.disabled=true;

  function syncUi() {
    const k=kilnAt(progress);
    progressInput.value=String(Math.round(progress*100));
    progressText.value=`${Math.round(progress*100).toString().padStart(2,'0')}%`;
    document.getElementById('phaseName').textContent=k.phase;
    document.getElementById('temperature').textContent=k.phase==='完成'?'窑火退去 · 陶坯已成':k.phase==='预热'?'窑温缓缓升起':k.phase==='冷却'?'余烬尚温 · 等待冷却':'火光照亮器壁';
    document.getElementById('backglow').style.opacity=String((.07+.72*k.glow)*Math.max(...kilnLayout.flames.map(flame=>flame.visibility),0));
    document.getElementById('kilnContact').style.opacity='0';
    document.querySelectorAll('.phase-list span').forEach(item=>item.classList.toggle('active',item.textContent===k.phase));
    const decorationLink=document.getElementById('decorationLink');
    const ready=progress>=.99;
    decorationLink.classList.toggle('is-locked',!ready);
    decorationLink.setAttribute('aria-disabled',String(!ready));
    playButton.textContent=playing?'烧制中':progress>=1?'烧制完成':'继续烧制';
  }
  progressInput.disabled=true;playButton.disabled=true;document.getElementById('replay').disabled=true;
  document.getElementById('decorationLink').addEventListener('click',event=>{event.preventDefault();if(progress<.99)return;try{flow.advance(work.workId,'kiln','decorate');if(!window.PotteryNavigate?.('./decoration-preview.html'))location.href='./decoration-preview.html';}catch(error){sourceNote.textContent=error.message;}});

  function resizeCanvas(canvas,context) {
    const box=canvas.getBoundingClientRect();
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const width=Math.max(1,Math.round(box.width*dpr));
    const height=Math.max(1,Math.round(box.height*dpr));
    if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
    context.setTransform(dpr,0,0,dpr,0,0);
    return {width:box.width,height:box.height,dpr};
  }
  function drawFire(k,now) {
    const {width:w,height:h}=resizeCanvas(fireCanvas,fire);
    fire.clearRect(0,0,w,h);
    if(k.heat<.008)return;
    const t=now*.001;
    fire.save();
    fire.globalCompositeOperation='screen';
    for(const [index,flame] of kilnLayout.flames.entries()){
      if(flame.visibility<=0)continue;
      const side=index===0?-1:1,x=flame.x,base=flame.y,size=kilnLayout.flameSize;
      const bed=fire.createRadialGradient(x,base,1,x,base,size*1.1);
      bed.addColorStop(0,`rgba(255,172,83,${.20*k.heat*flame.visibility})`);
      bed.addColorStop(.52,`rgba(216,72,26,${.08*k.heat*flame.visibility})`);
      bed.addColorStop(1,'rgba(180,45,17,0)');
      fire.fillStyle=bed;fire.beginPath();fire.ellipse(x,base,size*1.1,size*.55,0,0,Math.PI*2);fire.fill();
      if(!flameImage.complete||!flameImage.naturalWidth)continue;
      for(let layer=0;layer<2;layer++){
        const height=size*(layer?.67:1)*(0.84+.12*Math.sin(t*(2.1+layer*.35)+side*1.8));
        const width=height*(layer?.56:.50);
        fire.save();fire.translate(x+(layer?side*size*.12:0),base+3);
        fire.rotate(Math.sin(t*(1.75+layer*.33)+side*2.2)*.055);
        fire.scale(side<0?1:-1,1);
        fire.globalAlpha=k.heat*flame.visibility*(layer?.25:.54);
        fire.drawImage(flameImage,-width*.5,-height,width,height);
        fire.restore();
      }
    }
    fire.restore();
  }
  function frame(now) {
    requestAnimationFrame(frame);
    if(document.hidden){lastFrame=now;return;}
    if(now-lastFrame<27)return;
    const dt=Math.min(50,now-lastFrame||16);lastFrame=now;
    if(playing){progress=Math.min(1,progress+dt/21000);window.PotteryAudio.setKilnProgress(progress);window.PotteryAudio.setIntensity(kilnAt(progress).heat);if(progress>=1)playing=false;if(Math.floor(progress*20)!==Math.floor((progress-dt/21000)*20)||progress>=1)flow.patch(work.workId,{kilnProgress:progress});syncUi();}
    const k=kilnAt(progress);
    const flicker=reducedMotion?1:.84+.16*Math.sin(now*.021)+.07*Math.sin(now*.047);
    document.getElementById('backglow').style.opacity=String((.07+.72*k.glow)*flicker*Math.max(...kilnLayout.flames.map(flame=>flame.visibility),0));
    renderer.draw(k.fired,camera,.75,recipes[recipeIndex],camera.spin,k.heat*flicker,true);
    drawFire(k,now);
  }
  syncUi();requestAnimationFrame(frame);
}());
