(function(){
  'use strict';
  if(location.protocol==='file:'){location.replace('./index.html');return;}
  const allowed=new Set(['index.html','shop.html','shaping-preview.html','kiln-preview.html','decoration-preview.html','pattern-studio.html','photo-studio.html','orders.html','auction.html','engine-preview.html']);
  const sceneImage={'index':'studio-wide.png','shaping-preview':'studio-wide.png','kiln-preview':'kiln-wide.png','decoration-preview':'studio-wide.png','photo-studio':'photo-wide.png','auction':'auction-wide.png'};
  let frame=document.getElementById('potteryStage'),busy=false,handoff=null;
  function valid(url){return url.origin===location.origin&&allowed.has(url.pathname.split('/').pop());}
  function sync(target){
    try{const inner=new URL(target.contentWindow.location.href);if(!valid(inner))return;
      const page=inner.pathname.split('/').pop()+inner.search+inner.hash;
      history.replaceState(null,'','./app.html?page='+encodeURIComponent(page));
      document.title=target.contentDocument.title||'泥与火';
    }catch(_){}
  }
  function overlay(old){
    if(!old?.image)return null;
    const image=document.createElement('img');image.src=old.image;image.alt='';image.className='shell-vessel';
    image.style.cssText=`left:${old.x*100}vw;top:${old.y*100}dvh;width:${old.w*100}vw;height:${old.h*100}dvh;will-change:transform,opacity;transform-origin:top left`;
    document.body.append(image);return image;
  }
  function liveOverlay(sourceCanvas,targetCanvas){
    const source=sourceCanvas?.__potteryRenderer,target=targetCanvas?.__potteryRenderer;
    if(!source?.geometry||!source.lastDrawArgs||!target?.lastDrawArgs||!window.PotteryEngine?.PotteryRenderer)return null;
    const snapshot=(canvas,renderer)=>{
      const args=renderer.lastDrawArgs,rect=canvas.getBoundingClientRect();
      return {rect:{left:rect.left,top:rect.top,width:rect.width,height:rect.height},camera:{...args[1],spin:args[4]},fireProgress:args[0],lightAngle:args[2],recipe:args[3],kilnHeat:args[5]||0,lightStrength:args[7]??1};
    };
    const from=snapshot(sourceCanvas,source),to=snapshot(targetCanvas,target);
    // Keep the vessel's rotation; only its viewing camera changes between sets.
    to.camera.spin=from.camera.spin;
    const layer=document.createElement('canvas');layer.className='shell-vessel';
    layer.style.cssText='z-index:1005;will-change:transform;pointer-events:none';document.body.append(layer);
    let renderer;
    try{renderer=new window.PotteryEngine.PotteryRenderer(layer,source.geometry);}
    catch(error){layer.remove();console.warn('Live vessel transition unavailable',error);return null;}
    if(target.paintCanvas||source.paintCanvas)renderer.setPaintCanvas(target.paintCanvas||source.paintCanvas);
    if(target.patternCanvas||source.patternCanvas)renderer.setPatternCanvas(target.patternCanvas||source.patternCanvas);
    let stopped=false;
    const paint=t=>{
      const pose=window.PotterySceneMotion.interpolate(from,to,t),rect=pose.rect;
      layer.style.left=rect.left+'px';layer.style.top=rect.top+'px';layer.style.width=rect.width+'px';layer.style.height=rect.height+'px';
      renderer.draw(pose.fireProgress,pose.camera,pose.lightAngle,to.recipe,pose.camera.spin,pose.kilnHeat,true,pose.lightStrength);
    };
    paint(0);
    layer.start=(duration)=>{
      const begin=performance.now();
      function step(now){
        if(stopped)return;
        const t=duration?Math.min(1,(now-begin)/duration):1;
        paint(1-(1-t)**3);
        if(t<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    layer.finish=()=>{paint(1);const camera=targetCanvas.ownerDocument.defaultView.PotterySceneCamera;if(camera)camera.spin=to.camera.spin;};
    layer.stop=()=>{stopped=true;};
    layer.dispose=()=>{stopped=true;renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();layer.remove();};
    return layer;
  }
  function fadeControls(doc,enter){
    doc.body.classList.add(enter?'scene-controls-enter':'scene-controls-leave');
  }
  async function navigate(path,source=null){
    if(busy)return false;
    let url;try{url=new URL(path,frame.contentWindow.location.href);}catch(_){return false;}
    if(!valid(url))return false;
    busy=true;
    const old=frame,next=document.createElement('iframe');
    next.className='pottery-scene-frame';next.title='泥与火游戏画面';next.allow='autoplay';
    next.style.cssText='z-index:2;opacity:0;pointer-events:none;transform:translateX(100%)';
    document.body.append(next);
    try{
      // DOMContentLoaded follows the page scripts, while load waits for every
      // catalogue thumbnail and reference image. Do not stall the transition on images.
      await new Promise((resolve,reject)=>{
        let poll,timeout;
        const done=()=>{clearInterval(poll);clearTimeout(timeout);resolve();};
        const fail=error=>{clearInterval(poll);clearTimeout(timeout);reject(error);};
        next.addEventListener('error',fail,{once:true});
        next.src=url.pathname+url.search+url.hash;
        poll=setInterval(()=>{try{if(next.contentDocument?.readyState!=='loading'&&next.contentDocument?.URL===url.href)done();}catch(_){}},20);
        timeout=setTimeout(()=>fail(new Error('Scene did not become ready')),4500);
      });
      const readiness=next.contentWindow.PotterySceneReady;
      if(readiness&&url.pathname.split('/').pop()!=='decoration-preview.html')await Promise.race([Promise.resolve(readiness).catch(()=>{}),new Promise(resolve=>setTimeout(resolve,1200))]);
      // Final camera and calibrated canvas placement are measured before motion begins.
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const oldCanvas=old.contentDocument.querySelector('#homeCanvas,#potCanvas,#auctionPot');
      const newCanvas=next.contentDocument.querySelector('#homeCanvas,#potCanvas,#auctionPot');
      const targetShot=next.contentWindow.PotterySceneSnapshot?.()||null;
      const target=targetShot||next.contentWindow.PotterySceneBounds?.()||null;
      const oldScene=old.contentDocument.body.dataset.gameScene;
      const nextScene=next.contentDocument.body.dataset.gameScene;
      const sameBackdrop=sceneImage[oldScene]&&sceneImage[oldScene]===sceneImage[nextScene];
      const nextWorkId=next.contentWindow.PotteryWorkflow?.current()?.workId;
      const sameWork=source?.workId&&source.workId===nextWorkId;
      // The first click creates the work after the home vessel was rendered.
      // It is still the same clay blank and should travel into shaping.
      const firstWork=source?.scene==='index'&&!source.workId&&!!nextWorkId&&url.pathname.endsWith('/shaping-preview.html');
      // Pages without a vessel keep the old pot inside its moving scene.
      // A detached handoff image would stop in mid-screen, then vanish.
      const vessel=(sameWork||firstWork)?(liveOverlay(oldCanvas,newCanvas)||(targetShot?.image?overlay(source):null)):null;
      const arriving=vessel?.tagName==='CANVAS'?null:vessel&&targetShot?.image?overlay({...targetShot,x:source.x,y:source.y,w:source.w,h:source.h}):null;
      if(vessel)vessel.style.zIndex='1005';
      if(arriving)arriving.style.zIndex='1004';
      if(vessel){
        if(oldCanvas&&!oldCanvas.__potteryRenderer?.drawStandOnly())oldCanvas.style.visibility='hidden';
        // A WebGL framebuffer is not a visibility lock. Keep the receiver
        // hidden until the moving vessel has reached its final pose and the
        // destination has rendered a fresh frame, even if stand-only succeeds.
        if(newCanvas)newCanvas.style.opacity='0';
      }
      old.contentWindow.PotterySceneTransitioning=true;
      if(vessel)next.contentWindow.PotterySceneTransitioning=true;
      fadeControls(old.contentDocument,false);fadeControls(next.contentDocument,true);
      if(sameBackdrop)next.style.transform='translateX(0)';
      else next.style.opacity='1';
      const duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:780;
      const easing='cubic-bezier(.333333,1,.666667,1)';
      const outgoing=old.animate(sameBackdrop?[{opacity:1},{opacity:1}]:[{transform:'translateX(0)'},{transform:'translateX(-100%)'}],{duration,easing,fill:'forwards'});
      const incoming=next.animate(sameBackdrop?[{opacity:0},{opacity:1}]:[{transform:'translateX(100%)'},{transform:'translateX(0)'}],{duration,easing,fill:'forwards'});
      if(vessel?.start){vessel.start(duration);}
      else if(vessel){
        const finish=target||{x:source.x,y:source.y,w:source.w,h:source.h};
        const dx=(finish.x-source.x)*innerWidth,dy=(finish.y-source.y)*innerHeight;
        const sx=finish.w/source.w,sy=finish.h/source.h;
        const from='translate3d(0,0,0) scale(1,1)';
        const to=`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`;
        const motion={duration,easing,fill:'forwards'};
        vessel.animate([{transform:from},{transform:to}],motion);
        if(arriving)vessel.animate([{opacity:1},{opacity:1,offset:.30},{opacity:0,offset:.68},{opacity:0}],{duration,fill:'forwards'});
        arriving?.animate([{transform:from},{transform:to}],motion);
        // Keep the live target hidden until its iframe has stopped moving.
        // Otherwise the moving canvas and the fixed handoff image separate.
      }
      await Promise.race([Promise.all([outgoing.finished,incoming.finished]),new Promise(resolve=>setTimeout(resolve,duration+450))]);
      old.contentWindow.PotterySceneNavigating=true;
      vessel?.finish?.();vessel?.stop?.();
      old.remove();
      next.contentDocument.body.classList.remove('scene-controls-enter');
      next.getAnimations().forEach(animation=>animation.cancel());
      next.style.cssText='';next.id='potteryStage';next.className='pottery-scene-frame';frame=next;
      if(vessel){
        const camera=next.contentWindow.PotterySceneCamera;
        if(!vessel?.start&&camera&&Number.isFinite(targetShot?.pose?.spin))camera.spin=targetShot.pose.spin;
        next.contentWindow.PotterySceneTransitioning=false;
        await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        const revealDuration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:120;
        const reveal=newCanvas?.style.opacity==='0'?newCanvas.animate([{opacity:0},{opacity:1}],{duration:revealDuration,fill:'forwards'}):null;
        const fade=(arriving||vessel).animate([{opacity:1},{opacity:0}],{duration:revealDuration,fill:'forwards'});
        if(revealDuration)await Promise.allSettled([reveal?.finished,fade?.finished].filter(Boolean));
        if(newCanvas)newCanvas.style.opacity='';
      }
      if(vessel?.dispose)vessel.dispose();else vessel?.remove();arriving?.remove();
      sync(frame);
      busy=false;return true;
    }catch(error){
      old.getAnimations().forEach(animation=>animation.cancel());
      old.contentWindow.PotterySceneTransitioning=false;
      next.contentWindow.PotterySceneTransitioning=false;
      old.contentDocument?.body.classList.remove('scene-controls-leave');
      const oldCanvas=old.contentDocument?.querySelector('#homeCanvas,#potCanvas,#auctionPot');if(oldCanvas)oldCanvas.style.visibility='';
      const oldRenderer=oldCanvas?.__potteryRenderer;
      if(oldRenderer?.lastDrawArgs)oldRenderer.draw(...oldRenderer.lastDrawArgs);
      old.contentDocument?.querySelector('#homeCanvas,#potCanvas,#auctionPot')?.classList.remove('vessel-arriving');
      next.remove();document.querySelectorAll('.shell-vessel').forEach(node=>node.remove());busy=false;console.warn('Scene transition failed',error);return false;
    }
  }
  // Direct loads and older links still have an image handoff as a fallback.
  function start(old){
    if(!old?.image||!sceneImage[old.scene])return;
    handoff?.remove();
    const backdrop=document.createElement('div');backdrop.className='shell-backdrop';
    backdrop.style.backgroundImage=`url('./assets/${sceneImage[old.scene]}')`;
    const vessel=overlay(old);document.body.append(backdrop);if(vessel)document.body.append(vessel);
    const timeout=setTimeout(()=>handoff?.remove(),7000);
    handoff={old,backdrop,vessel,remove(){clearTimeout(timeout);backdrop.remove();vessel?.remove();handoff=null;}};
  }
  function finish(box){
    if(!handoff||!box)return false;
    const {old,backdrop,vessel}=handoff,duration=760;
    backdrop.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(-11vw)'}],{duration,fill:'forwards'});
    vessel?.animate([{left:`${old.x*100}vw`,top:`${old.y*100}dvh`,width:`${old.w*100}vw`,height:`${old.h*100}dvh`},{left:`${box.x*100}vw`,top:`${box.y*100}dvh`,width:`${box.w*100}vw`,height:`${box.h*100}dvh`}],{duration,fill:'forwards'}).finished.finally(()=>handoff?.remove());
    return true;
  }
  window.PotteryShellHandoff={navigate,start,finish,cancel:()=>handoff?.remove()};
  const raw=new URLSearchParams(location.search).get('page')||'index.html',initial=new URL(raw,location.href);
  frame.src=valid(initial)?initial.pathname+initial.search+initial.hash:'./index.html';
  frame.addEventListener('load',()=>sync(frame));
})();
