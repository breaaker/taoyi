(function () {
  'use strict';
  function mountOrderReference(image,{floating=null,orderId}={}){
    const area=image.parentElement,pointers=new Map();
    let x=0,y=0,scale=1,base=null,last=null;
    try{image.src=window.PotteryEngine.getReferencePhoto(orderId);}
    catch(error){image.alt=`参照照片生成失败：${error.message}`;image.hidden=true;area.dataset.error='无法生成三维参照照片';return;}
    const draw=()=>{
      if(floating===area){area.style.setProperty('--reference-x',`${x}px`);area.style.setProperty('--reference-y',`${y}px`);area.style.setProperty('--reference-scale',String(scale));}
      else (floating||image).style.transform=`translate(${x}px,${y}px) scale(${scale})`;
    };
    const metric=()=>{const points=[...pointers.values()],center={x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2};return {center,distance:Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)};};
    area.addEventListener('pointerdown',event=>{
      if(event.target!==image&&event.target!==area)return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});area.setPointerCapture(event.pointerId);
      if(pointers.size===2){const m=metric();base={...m,x,y,scale};last=null;}else last={x:event.clientX,y:event.clientY};
      event.preventDefault();
    });
    area.addEventListener('pointermove',event=>{
      if(!pointers.has(event.pointerId))return;
      pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
      const uiScale=window.PotteryUiScale||1;
      if(pointers.size>=2&&base){const m=metric();scale=Math.max(floating ? .5 : 1,Math.min(4,base.scale*m.distance/Math.max(1,base.distance)));x=base.x+(m.center.x-base.center.x)/uiScale;y=base.y+(m.center.y-base.center.y)/uiScale;}
      else if(last){x+=(event.clientX-last.x)/uiScale;y+=(event.clientY-last.y)/uiScale;last={x:event.clientX,y:event.clientY};}
      if(floating){
        draw();
        // Keep a small reachable part of the frame inside the viewport,
        // independently of the photo's zoom level.
        const rect=floating.getBoundingClientRect(),margin=32;
        const dx=Math.max(margin-rect.right,Math.min(innerWidth-margin-rect.left,0));
        const dy=Math.max(margin-rect.bottom,Math.min(innerHeight-margin-rect.top,0));
        x+=dx/uiScale;y+=dy/uiScale;
      }else{
        const bound=area.clientWidth*scale*.65,vertical=area.clientHeight*scale*.65;
        x=Math.max(-bound,Math.min(bound,x));y=Math.max(-vertical,Math.min(vertical,y));
      }
      draw();event.preventDefault();
    });
    const release=event=>{pointers.delete(event.pointerId);base=null;last=[...pointers.values()][0]||null;};
    area.addEventListener('pointerup',release);area.addEventListener('pointercancel',release);
    area.addEventListener('wheel',event=>{scale=Math.max(floating ? .5 : 1,Math.min(4,scale+(event.deltaY<0?.16:-.16)));draw();event.preventDefault();},{passive:false});
    area.addEventListener('dblclick',()=>{x=0;y=0;scale=1;draw();});
  }
  window.PotteryReferenceViewer={mountOrderReference};
}());
