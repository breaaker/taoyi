(function () {
  'use strict';
  const {createPotMesh,PotteryRenderer}=window.PotteryEngine;
  const cameras=[];
  const state={yaw:.33,pitch:.34,distance:3.66,lightAngle:45*Math.PI/180,fireProgress:1,spin:0};
  const recipes=window.PotteryClaySamples;
  const mesh=createPotMesh();
  const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const errorBox=document.getElementById('renderError');
  try {
    document.querySelectorAll('.pot-view').forEach(canvas=>{
      const renderer=new PotteryRenderer(canvas,mesh);
      cameras.push({canvas,renderer,recipeIndex:Number(canvas.dataset.recipe),visible:true});
    });
  } catch(error) {
    errorBox.hidden=false;
    errorBox.textContent=`三维样片未能启动：${error.message}`;
    return;
  }
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{const view=cameras.find(item=>item.canvas===entry.target);if(view)view.visible=entry.isIntersecting;});
    },{rootMargin:'40px'});
    cameras.forEach(view=>observer.observe(view.canvas));
  }
  let lastFrame=0;
  function frame(now) {
    requestAnimationFrame(frame);
    if(document.hidden||now-lastFrame<27)return;
    const delta=Math.min(50,now-lastFrame||16);lastFrame=now;
    if(!reducedMotion)state.spin=(state.spin+delta*.0014)%(Math.PI*2);
    cameras.forEach(view=>{if(view.visible)view.renderer.draw(state.fireProgress,state,state.lightAngle,recipes[view.recipeIndex],state.spin);});
  }
  requestAnimationFrame(frame);

  const fireInput=document.getElementById('fireProgress');
  function updateCard(view,index) {
    const recipe=recipes[view.recipeIndex];
    document.getElementById(`name${index}`).textContent=recipe.name;
    document.getElementById(`tag${index}`).textContent=`${recipe.tag} · ${recipe.subtitle}`;
    document.getElementById(`description${index}`).textContent=state.fireProgress===0?recipe.wetDescription:state.fireProgress===1?recipe.firedDescription:`${recipe.name}正在烧成；颜色、颗粒与光泽逐渐改变。`;
    document.getElementById(`feelL${index}`).textContent=recipe.feel[0];
    document.getElementById(`feelR${index}`).textContent=recipe.feel[1];
    view.canvas.setAttribute('aria-label',`${recipe.name}三维视图，可拖动旋转`);
  }
  function updateFireProgress() {
    state.fireProgress=Number(fireInput.value)/100;
    document.getElementById('fireValue').textContent=state.fireProgress===0?'湿泥':state.fireProgress===1?'已烧成':`窑火中 ${fireInput.value}%`;
    cameras.forEach(updateCard);
  }
  cameras.forEach((view,index)=>{
    const select=document.getElementById(`recipe${index}`);
    recipes.forEach((recipe,recipeIndex)=>select.add(new Option(`${recipe.name} · ${recipe.subtitle}`,String(recipeIndex))));
    select.value=String(view.recipeIndex);
    select.addEventListener('change',()=>{view.recipeIndex=Number(select.value);updateCard(view,index);});
  });
  fireInput.addEventListener('input',updateFireProgress);
  updateFireProgress();

  let drag=null;
  cameras.forEach(({canvas})=>{
    canvas.addEventListener('pointerdown',event=>{
      if(drag)return;
      drag={id:event.pointerId,x:event.clientX,y:event.clientY};
      canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    canvas.addEventListener('pointermove',event=>{
      if(!drag||event.pointerId!==drag.id)return;
      // Camera orbit runs opposite to the apparent pottery rotation: invert it
      // so the surface follows the finger (left drag turns the pot clockwise).
      state.yaw-=(event.clientX-drag.x)*.012;
      state.pitch=Math.max(.22,Math.min(.66,state.pitch+(event.clientY-drag.y)*.006));
      drag.x=event.clientX;drag.y=event.clientY;
      event.preventDefault();
    });
    const release=event=>{if(drag&&drag.id===event.pointerId)drag=null;};
    canvas.addEventListener('pointerup',release);
    canvas.addEventListener('pointercancel',release);
    canvas.addEventListener('wheel',event=>{state.distance=Math.max(2.9,Math.min(4.65,state.distance+Math.sign(event.deltaY)*.19));event.preventDefault();},{passive:false});
  });
  const lightInput=document.getElementById('lightAngle');
  lightInput.addEventListener('input',()=>{
    state.lightAngle=Number(lightInput.value)*Math.PI/180;
    document.getElementById('lightValue').textContent=`${lightInput.value}°`;
  });
  document.getElementById('zoomIn').addEventListener('click',()=>{state.distance=Math.max(2.9,state.distance-.28);});
  document.getElementById('zoomOut').addEventListener('click',()=>{state.distance=Math.min(4.65,state.distance+.28);});
  document.getElementById('resetView').addEventListener('click',()=>{
    Object.assign(state,{yaw:.33,pitch:.34,distance:3.66,lightAngle:45*Math.PI/180});
    lightInput.value='45';document.getElementById('lightValue').textContent='45°';
  });
}());
