(function () {
  'use strict';
  const {createPotShape,createPotMesh,PotteryRenderer,validBand,validPaint,paintBands,paintToCanvas,PAINT_ROWS,loadPatterns,renderTile,validSurfaceStroke,drawSurfaceStrokes,composePhoto,createPhoto,loadAlbum,savePhoto,loadEconomy,patternAssetPath,fittedPatternAsset}=window.PotteryEngine;
  const flow=window.PotteryWorkflow,work=flow.requireStage('photo');if(!work)return;
  const recipes=window.PotteryClaySamples;
  const canvas=document.getElementById('potCanvas'),shutter=document.getElementById('shutter'),status=document.getElementById('status');
  const albumOrderLink=document.getElementById('albumOrderLink');
  if(albumOrderLink)albumOrderLink.textContent=`✉ ${window.PotteryEngine.orderContent()?.customer.name||'客人'}的来信 →`;
  const photoDialog=document.getElementById('photoDialog');
  const backdropImage=new Image();backdropImage.src='./assets/photo-studio-empty.jpg';
  const camera={yaw:.3,pitch:.34,distance:6.1,targetY:1.02,spin:0};window.PotterySceneCamera=camera;
  let shape=createPotShape(),materialIndex=0,bands=[],strokes=[],pigmentMarks=[],paint=new Float32Array(PAINT_ROWS*4),workId=work.workId,ready=false,pending=null,gesture=null;
  function validShape(value){return value&&Array.isArray(value.radii)&&Array.isArray(value.heights)&&value.radii.length===113&&value.heights.length===113&&value.radii.every(r=>Number.isFinite(r)&&r>=.13&&r<=1)&&value.heights.every((h,i)=>Number.isFinite(h)&&(i===0?Math.abs(h)<1e-6:h>value.heights[i-1]));}
  try{
    const saved=JSON.parse(localStorage.getItem('clay-and-flame-e1-draft-v2')||'null');
    if(saved?.workId!==work.workId||!validShape(saved?.shape))throw new Error('陶坯不属于当前作品');
    shape=saved.shape;const index=recipes.findIndex(recipe=>recipe.id===saved.materialId);if(index>=0)materialIndex=index;
    const decoration=JSON.parse(localStorage.getItem('clay-and-flame-e3-draft-v2')||'null');
    if(decoration?.workId===work.workId&&decoration?.sourceShape===JSON.stringify(shape)&&Array.isArray(decoration.bands)&&decoration.bands.every(validBand)&&validPaint(decoration.paint)){
      bands=decoration.bands;paint=Float32Array.from(decoration.paint);
      if(Array.isArray(decoration.strokes)&&decoration.strokes.every(validSurfaceStroke))strokes=decoration.strokes;
      if(Array.isArray(decoration.pigmentMarks))pigmentMarks=decoration.pigmentMarks;
      document.getElementById('sourceNote').textContent='已沿用这件陶器的器型与装饰';
    }else throw new Error('装饰数据不属于当前作品');
  }catch(error){flow.broken(error.message);return;}
  document.getElementById('materialName').textContent=recipes[materialIndex].name;
  let renderer;
  try{renderer=new PotteryRenderer(canvas,createPotMesh(shape,{photoStand:true}),{preserveDrawingBuffer:true,standStyle:'limestone'});}
  catch(error){const box=document.getElementById('renderError');box.hidden=false;box.textContent=`取景台无法启动：${error.message}`;return;}
  const paintCanvas=document.createElement('canvas');paintCanvas.width=1;paintCanvas.height=PAINT_ROWS;
  paintToCanvas(paintCanvas,paint);renderer.setPaintCanvas(paintCanvas);
  const patternCanvas=document.createElement('canvas');patternCanvas.width=1024;patternCanvas.height=1024;
  const assets={};
  function updatePattern(){paintBands(patternCanvas,bands,assets);drawSurfaceStrokes(patternCanvas,strokes);renderer.setPatternCanvas(patternCanvas);}
  updatePattern();
  function loadImage(id,fit){return new Promise((resolve,reject)=>{
    const path=patternAssetPath(id);if(!path){reject(new Error(`纹样 ${id} 不在工坊目录`));return;}
    const image=new Image();image.onload=()=>{assets[id]=fittedPatternAsset(image,fit);resolve();};image.onerror=()=>reject(new Error(`纹样 ${id} 加载失败`));
    image.src=path;
  });}
  async function loadAssets(){
    shutter.disabled=true;status.textContent='载入作品纹样…';
    const required=[...new Set(bands.map(b=>b.assetId).filter(Boolean))];
    const custom=new Map(loadPatterns().map(item=>[item.id,item]));
    const tasks=[];let missing=false;
    for(const id of required){
      if(custom.has(id)){
        const item=custom.get(id);
        const tile=document.createElement('canvas');tile.width=1024;tile.height=512;renderTile(tile,item);assets[id]=tile;
      }else tasks.push(loadImage(id,bands.find(b=>b.assetId===id)?.assetFit));
    }
    tasks.push(new Promise(resolve=>{if(backdropImage.complete)resolve();else{backdropImage.onload=resolve;backdropImage.onerror=resolve;}}));
    const results=await Promise.allSettled(tasks);
    missing=missing||results.some(result=>result.status==='rejected');
    updatePattern();
    if(missing){status.textContent='有纹样缺失，请先回装饰页检查';return;}
    ready=true;shutter.disabled=false;status.textContent='可以拍照';
  }
  window.PotterySceneReady=loadAssets();
  let lightAngle=135*Math.PI/180,lightStrength=1.14,lastFrame=0;const background='dusk';
  function draw(){renderer.draw(1,camera,lightAngle,recipes[materialIndex],camera.spin,0,false,lightStrength);}
  const direction=document.getElementById('lightDirection'),strength=document.getElementById('lightStrength'),zoom=document.getElementById('zoom');
  zoom.value=String(Math.round(camera.distance*100));
  direction.addEventListener('input',()=>{lightAngle=Number(direction.value)*Math.PI/180;document.getElementById('lightDirectionValue').textContent=`${direction.value}°`;});
  strength.addEventListener('input',()=>{lightStrength=Number(strength.value)/100;document.getElementById('lightStrengthValue').textContent=`${strength.value}%`;});
  zoom.addEventListener('input',()=>{camera.distance=Number(zoom.value)/100;document.getElementById('zoomValue').textContent=camera.distance<3.6?'近景':camera.distance>4.4?'远景':'标准';});
  canvas.addEventListener('pointerdown',event=>{if(gesture)return;gesture={id:event.pointerId,x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);event.preventDefault();});
  canvas.addEventListener('pointermove',event=>{if(!gesture||event.pointerId!==gesture.id)return;
    const scale=window.PotteryUiScale||1;
    camera.yaw-=(event.clientX-gesture.x)/scale*.012;
    camera.pitch=Math.max(.12,Math.min(.68,camera.pitch+(event.clientY-gesture.y)/scale*.005));
    gesture.x=event.clientX;gesture.y=event.clientY;event.preventDefault();
  });
  for(const name of ['pointerup','pointercancel'])canvas.addEventListener(name,event=>{if(gesture?.id===event.pointerId)gesture=null;});
  canvas.addEventListener('wheel',event=>{camera.distance=Math.max(3.2,Math.min(6.5,camera.distance+Math.sign(event.deltaY)*.18));zoom.value=String(Math.round(camera.distance*100));event.preventDefault();},{passive:false});
  function frame(now){requestAnimationFrame(frame);if(document.hidden||now-lastFrame<27)return;lastFrame=now;draw();}
  requestAnimationFrame(frame);
  const captureSheet=document.getElementById('captureSheet'),captureImage=document.getElementById('captureImage');
  shutter.addEventListener('click',()=>{
    if(!ready)return;
    try{
      draw();
      const output=document.createElement('canvas');output.width=720;output.height=900;
      composePhoto(output,canvas,background,backdropImage);
      const dataUrl=output.toDataURL('image/jpeg',.92);
      const radii=shape.radii,body=radii.slice(7,-7),mean=body.reduce((sum,r)=>sum+r,0)/body.length;
      const form=Math.max(0,Math.min(1,1-body.reduce((sum,r,i)=>sum+(i?Math.abs(r-body[i-1]):0),0)/body.length/Math.max(.2,mean)*4));
      const coverage=Array.from(paint).filter((value,index)=>index%4===3&&value>.04).length/PAINT_ROWS;
      const profile=[0,.25,.45,.7,.87,1].map(t=>shape.radii[Math.round(t*112)]);
      const paleTop=Array.from({length:PAINT_ROWS},(_,i)=>i).filter(i=>i/PAINT_ROWS>.81&&i/PAINT_ROWS<.94&&paint[i*4+3]>.08&&paint[i*4]>.7&&paint[i*4+1]>.65).length/(PAINT_ROWS*.13);
      const usedPigmentIds=[...new Set([...pigmentMarks.map(mark=>mark.id),...bands.map(band=>band.pigmentId),...strokes.map(stroke=>stroke.pigmentId)].filter(Boolean))];
      const pigments=usedPigmentIds.map(id=>{
        const item=window.PotteryEconomyCatalog.find('pigment',id);if(!item)return null;
        const rgb=[1,3,5].map(offset=>parseInt(item.hex.slice(offset,offset+2),16)/255);
        const marks=pigmentMarks.filter(mark=>mark.id===id);
        let visible=0;
        for(let row=0;row<PAINT_ROWS;row++){
          const v=(row+.5)/PAINT_ROWS,i=row*4;
          if(paint[i+3]<.04||!marks.some(mark=>v>=mark.from-mark.width&&v<=mark.to+mark.width))continue;
          const difference=rgb.reduce((sum,channel,c)=>sum+Math.abs(channel-paint[i+c]),0);
          if(difference<.48)visible++;
        }
        const bandArea=bands.filter(band=>!band.assetId&&band.pigmentId===id).reduce((sum,band)=>sum+band.width*.8,0);
        const strokeArea=strokes.filter(stroke=>stroke.pigmentId===id).reduce((sum,stroke)=>sum+Math.min(.08,stroke.points.length*stroke.width*.01)*window.PotteryEngine.decorationVisibleFraction(stroke,Math.min(...stroke.points.map(p=>p[1]))-stroke.width*.5,Math.max(...stroke.points.map(p=>p[1]))+stroke.width*.5),0);
        return {id,coverage:window.PotteryEconomyCatalog.isOwned('pigment',id)?Math.min(1,visible/PAINT_ROWS+bandArea+strokeArea):0};
      }).filter(Boolean);
      const patterns=[...new Set(bands.map(band=>band.assetId||band.kind))].map(id=>({
        id,width:Math.max(...bands.filter(band=>(band.assetId||band.kind)===id).map(band=>band.width*window.PotteryEngine.decorationVisibleFraction(band))),
        legacy:!window.PotteryEconomyCatalog.isOwned('pattern',id)
      })).filter(use=>!use.legacy||Number.isFinite(window.PotteryEconomyCatalog.find('pattern',use.id)?.bandHeight));
      pending=createPhoto({title:document.getElementById('workTitle').value,dataUrl,background,materialId:recipes[materialIndex].id,camera,lightAngle,lightStrength,craft:{economyVersion:4,materialOwned:window.PotteryEconomyCatalog.isOwned('material',recipes[materialIndex].id),workId,orderId:work.orderId,profile113:window.PotteryEngine.sampleShape(shape),bandProfile:bands.map(b=>({...b})),height:shape.heights[112],profile,form,coverage,paleTop,paintProfile:window.PotteryEngine.paintProfile(paint),bands:bands.length,strokes:strokes.length,pigments,patterns}});
      flow.advance(work.workId,'photo','finish',{photoId:pending.id});
      try{savePhoto(pending);}catch(error){flow.revisit(work.workId,'photo');throw error;}
      const failedOrder=work.purpose==='order'&&!window.PotteryEngine.grade(window.PotteryEngine.scoreCraft(pending.craft,pending.materialId));
      if(failedOrder)flow.patch(work.workId,{purpose:'free',failedOrder:true});
      captureImage.src=dataUrl;
      document.getElementById('captureNext').textContent=failedOrder?'轻触照片 · 送往拍卖':work.purpose==='order'?'轻触照片 · 寄给客人':'轻触照片 · 进入拍卖';
      document.getElementById('captureMessage').textContent=failedOrder?'这件作品未达到订单要求。拍卖后可以用新的泥胚再做一次。':'';
      ready=false;shutter.disabled=true;captureSheet.hidden=false;window.PotteryAudio.play('camera');window.PotteryAudio.play('photoReveal');
    }catch(error){status.textContent=`拍照失败：${error.message}`;}
  });
  document.getElementById('saveCapture').addEventListener('click',()=>{
    if(!pending)return;
    window.PotteryAudio.play('save');
    const destination=flow.current()?.purpose==='order'?`./orders.html?photo=${encodeURIComponent(pending.id)}`:`./auction.html?photo=${encodeURIComponent(pending.id)}`;
    if(!window.PotteryNavigate?.(destination))location.href=destination;
  });
  function renderAlbum(){
    const album=loadAlbum(),sales=loadEconomy().sales,list=document.getElementById('album');list.replaceChildren();
    document.getElementById('albumCount').textContent=`${album.length} 张`;
    for(const photo of [...album].reverse()){
      const button=document.createElement('button');button.type='button';button.className='album-card';
      const image=document.createElement('img');image.src=photo.dataUrl;image.alt=photo.title;image.loading='lazy';
      const title=document.createElement('span');title.setAttribute('data-i18n','off');title.textContent=photo.title;
      const date=document.createElement('small');date.textContent=new Date(photo.createdAt).toLocaleDateString('zh-CN');
      button.append(image,title,date);button.addEventListener('click',()=>{
        document.getElementById('viewPhoto').src=photo.dataUrl;document.getElementById('viewTitle').textContent=photo.title;
        const link=document.getElementById('downloadSaved');link.href=photo.dataUrl;link.download=`${photo.title}.jpg`;photoDialog.showModal();
      });
      const card=document.createElement('div');card.className='album-item';card.appendChild(button);
      const sale=document.createElement('a');sale.className='album-sale';sale.href=`./auction.html?photo=${encodeURIComponent(photo.id)}`;const sold=window.PotteryEngine.saleForPhoto(photo,{sales});sale.textContent=sold?`已成交 · ${sold.amount} 金币 →`:'送往拍卖场 →';card.appendChild(sale);list.appendChild(card);
    }
  }
  document.getElementById('closeDialog').addEventListener('click',()=>photoDialog.close());
  renderAlbum();
}());
