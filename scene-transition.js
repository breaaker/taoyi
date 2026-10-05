(function(){
  'use strict';
  const KEY='clay-and-flame-scene-handoff-v1';
  const scenes=new Set(['index','shaping-preview','kiln-preview','decoration-preview','photo-studio','auction','shop','orders']);
  const scene=document.body.dataset.gameScene;
  if(!scenes.has(scene))return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas=()=>document.getElementById(scene==='index'?'homeCanvas':scene==='auction'?'auctionPot':'potCanvas');
  const workId=()=>window.PotteryWorkflow?.current()?.workId||null;
  let captured=false;
  window.PotterySceneBounds=()=>{
    const result=bounds(canvas());
    if(!result)return null;
    const {image,...box}=result;return box;
  };
  function bounds(source){
    if(!source?.width||!source.height)return null;
    try{
      const factor=Math.min(1,680/Math.max(source.width,source.height));
      const w=Math.max(1,Math.round(source.width*factor)),h=Math.max(1,Math.round(source.height*factor)),sample=document.createElement('canvas');
      sample.width=w;sample.height=h;
      const potOnly=source.__potteryRenderer?.capturePotCanvas?.();
      const ctx=sample.getContext('2d',{willReadFrequently:true});ctx.drawImage(potOnly||source,0,0,w,h);
      const data=ctx.getImageData(0,0,w,h).data;
      let x0=w,y0=h,x1=0,y1=0;
      const rows=[];
      // Ignore tiny translucent antialiasing pixels; include the vessel and its stand.
      const step=3;
      for(let y=0;y<h;y+=step){let left=w,right=0;
        for(let x=0;x<w;x+=step){if(data[(y*w+x)*4+3]<35)continue;left=Math.min(left,x);right=Math.max(right,x);}
        rows[y]={left,right,width:right>=left?right-left:0};
        if(right>=left){x0=Math.min(x0,left);y0=Math.min(y0,y);x1=Math.max(x1,right);y1=Math.max(y1,y);}
      }
      if(x1<=x0||y1<=y0)return null;
      // The wheel belongs to the set. Keep only the vessel in the shared handoff.
      if(!potOnly&&['index','shaping-preview','decoration-preview','photo-studio'].includes(scene)){
        let previous=Infinity,cut=0;
        for(let y=Math.ceil((y0+(y1-y0)*.52)/step)*step;y<y1;y+=step){
          const width=rows[y]?.width||0;if(!width)continue;
          if(width>previous*1.48&&width-previous>Math.max(20,w*.045)){cut=y;break;}
          previous=Math.min(previous*1.06,width);
        }
        if(cut&&cut>y0+(y1-y0)*.53){y1=cut-step;x0=w;x1=0;
          for(let y=y0;y<=y1;y+=step){const row=rows[y];if(row?.width){x0=Math.min(x0,row.left);x1=Math.max(x1,row.right);}}
        }
      }
      const pad=step*3;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(w,x1+pad);y1=Math.min(h,y1+pad);
      const rect=source.getBoundingClientRect();
      const crop=document.createElement('canvas'),ratio=Math.min(1,960/Math.max(x1-x0,y1-y0));
      crop.width=Math.ceil((x1-x0)*ratio);crop.height=Math.ceil((y1-y0)*ratio);
      crop.getContext('2d').drawImage(sample,x0,y0,x1-x0,y1-y0,0,0,crop.width,crop.height);
      return {image:crop.toDataURL('image/webp',.88),x:(rect.left+x0/w*rect.width)/innerWidth,y:(rect.top+y0/h*rect.height)/innerHeight,w:((x1-x0)/w*rect.width)/innerWidth,h:((y1-y0)/h*rect.height)/innerHeight};
    }catch(_){return null;}
  }
  function payload(){
    const shot=bounds(canvas());if(!shot)return null;
    const camera=window.PotterySceneCamera;
    const pose=camera?{yaw:camera.yaw,pitch:camera.pitch,spin:camera.spin||0}:null;
    return {...shot,scene,pose,workId:workId(),at:Date.now()};
  }
  window.PotterySceneSnapshot=payload;
  function save(){
    if(reduced||captured||window.PotterySceneNavigating)return;
    const data=payload();if(!data)return;
    try{sessionStorage.setItem(KEY,JSON.stringify(data));}catch(_){}
    try{if(parent!==window)parent.PotteryShellHandoff?.start(data);}catch(_){}
    captured=true;
  }
  function navigate(path){
    let shell;try{shell=parent!==window?parent.PotteryShellHandoff:null;}catch(_){return false;}
    if(!shell?.navigate)return false;
    let destination;try{destination=new URL(path,location.href).pathname.split('/').pop();}catch(_){}
    // Shop and letters have no receiving pot. Let the entire source scene
    // slide away, and avoid a costly canvas readback on the click path.
    const data=reduced||['shop.html','orders.html'].includes(destination)?null:payload();
    captured=true;
    shell.navigate(path,data).then(ok=>{if(!ok){captured=false;location.href=path;}});
    return true;
  }
  window.PotteryNavigate=navigate;
  window.PotteryCaptureScene=save;
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link||link.hasAttribute('download')||link.target||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const url=new URL(link.href,location.href);
    if(url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search)return;
    if(navigate(link.href))event.preventDefault();
  },{capture:true});
  addEventListener('pagehide',save,{capture:true});
  async function targetReady(){
    const reveal=()=>document.documentElement.classList.remove('scene-loading');
    let old;try{old=JSON.parse(sessionStorage.getItem(KEY)||'null');sessionStorage.removeItem(KEY);}catch(_){reveal();return;}
    if(reduced||!old||old.scene===scene||Date.now()-old.at>9000){reveal();return;}
    const current=workId();
    if(old.workId!==current||(!current&&old.scene!=='index')){reveal();return;}
    const camera=window.PotterySceneCamera;
    if(camera&&old.pose){
      if(Number.isFinite(old.pose.yaw))camera.yaw=old.pose.yaw;
      if(Number.isFinite(old.pose.pitch))camera.pitch=old.pose.pitch;
      if(Number.isFinite(old.pose.spin))camera.spin=old.pose.spin;
    }
    const shell=parent!==window?parent.PotteryShellHandoff:null;
    if(shell){
      reveal();
      if(window.PotterySceneReady)await Promise.race([Promise.resolve(window.PotterySceneReady).catch(()=>{}),new Promise(resolve=>setTimeout(resolve,4000))]);
      let tries=0;
      function finishShell(){
        const target=canvas(),box=bounds(target);
        if(!box){if(++tries<120)requestAnimationFrame(finishShell);else shell.cancel();return;}
        if(shell.finish(box)){
          target.classList.add('vessel-arriving');
          document.body.classList.add('scene-arriving');
          setTimeout(()=>{target.classList.remove('vessel-arriving');document.body.classList.remove('scene-arriving');},590);
        }
      }
      requestAnimationFrame(finishShell);
      return;
    }
    const image=document.createElement('img');image.src=old.image;image.alt='';image.className='vessel-handoff';
    image.style.cssText=`left:${old.x*100}vw;top:${old.y*100}dvh;width:${old.w*100}vw;height:${old.h*100}dvh`;
    const backdrop=document.createElement('div');backdrop.className='scene-handoff-backdrop';
    const oldImage={'index':'studio-wide.png','shaping-preview':'studio-wide.png','kiln-preview':'kiln-wide.png','decoration-preview':'studio-wide.png','photo-studio':'photo-wide.png','auction':'auction-wide.png'}[old.scene];
    backdrop.style.backgroundImage=`url('./assets/${oldImage}')`;
    document.body.append(backdrop,image);
    canvas()?.classList.add('vessel-arriving');
    reveal();
    if(window.PotterySceneReady){
      await Promise.race([Promise.resolve(window.PotterySceneReady).catch(()=>{}),new Promise(resolve=>setTimeout(resolve,4000))]);
    }
    let tries=0;
    function frame(){
      const target=canvas(),box=bounds(target);
      if(!box){if(++tries<120)requestAnimationFrame(frame);else{target?.classList.remove('vessel-arriving');image.remove();backdrop.remove();}return;}
      document.body.classList.add('scene-arriving');
      target.classList.add('vessel-arriving');
      const duration=760;
      backdrop.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-11vw)'}],{duration,easing:'cubic-bezier(.22,.65,.2,1)',fill:'forwards'});
      image.animate([{left:`${old.x*100}vw`,top:`${old.y*100}dvh`,width:`${old.w*100}vw`,height:`${old.h*100}dvh`,opacity:1},{left:`${box.x*100}vw`,top:`${box.y*100}dvh`,width:`${box.w*100}vw`,height:`${box.h*100}dvh`,opacity:1,offset:.78},{left:`${box.x*100}vw`,top:`${box.y*100}dvh`,width:`${box.w*100}vw`,height:`${box.h*100}dvh`,opacity:0}],{duration,easing:'cubic-bezier(.22,.65,.2,1)',fill:'forwards'}).finished.finally(()=>{target.classList.remove('vessel-arriving');document.body.classList.remove('scene-arriving');image.remove();backdrop.remove();});
      setTimeout(()=>target.classList.remove('vessel-arriving'),duration-170);
    }
    requestAnimationFrame(frame);
  }
  if(document.readyState==='complete')targetReady();else addEventListener('load',targetReady,{once:true});
})();
