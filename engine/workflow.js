(function () {
  'use strict';
  const KEY='clay-and-flame-active-work-v1';
  const SHAPE_KEY='clay-and-flame-e1-draft-v2';
  const DECOR_KEY='clay-and-flame-e3-draft-v2';
  const stages=['shape','kiln','decorate','photo','finish'];
  function current(){
    try{const value=JSON.parse(localStorage.getItem(KEY)||'null');
      return value&&/^W[a-z0-9-]{5,40}$/i.test(value.workId)&&stages.includes(value.stage)&&typeof value.materialId==='string'&&['free','order'].includes(value.purpose)?value:null;
    }catch(_){return null;}
  }
  function start(materialId,purpose='free',orderId=null){
    if(typeof materialId!=='string'||!materialId||!['free','order'].includes(purpose))throw new Error('请选择泥料和作品用途');
    const work={workId:`W${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,materialId,purpose,orderId:purpose==='order'?orderId:null,stage:'shape',startedAt:Date.now()};
    localStorage.setItem(KEY,JSON.stringify(work));localStorage.removeItem(SHAPE_KEY);localStorage.removeItem(DECOR_KEY);return work;
  }
  function advance(workId,from,to,extra={}){
    const work=current();if(!work||work.workId!==workId||work.stage!==from||stages.indexOf(to)!==stages.indexOf(from)+1)throw new Error('请先完成当前作品的上一步');
    const next={...work,...extra,stage:to};localStorage.setItem(KEY,JSON.stringify(next));return next;
  }
  function patch(workId,changes){
    const work=current();if(!work||work.workId!==workId)throw new Error('作品已不在工作台');
    const next={...work,...changes,workId:work.workId,stage:work.stage};localStorage.setItem(KEY,JSON.stringify(next));return next;
  }
  function revisit(workId,stage){
    const work=current();if(!work||work.workId!==workId||!['decorate','photo'].includes(stage)||stages.indexOf(stage)>stages.indexOf(work.stage))throw new Error('无法返回这一步');
    const next={...work,stage};localStorage.setItem(KEY,JSON.stringify(next));return next;
  }
  function finish(workId){
    const work=current();if(!work||work.workId!==workId||work.stage!=='finish')throw new Error('当前没有可交付的作品');
    localStorage.removeItem(KEY);localStorage.removeItem(SHAPE_KEY);localStorage.removeItem(DECOR_KEY);
  }
  function broken(message){
    document.body.classList.add('workflow-blocked');
    const main=document.createElement('main');main.className='workflow-gate';
    const title=document.createElement('h1');title.textContent=message;
    const restart=document.createElement('button');restart.type='button';restart.textContent='清理中断的作品，重新制作 →';
    restart.addEventListener('click',()=>{start('warm-earth','free');if(!window.PotteryNavigate?.('./shaping-preview.html'))location.href='./shaping-preview.html';});
    main.append(title,restart);document.body.replaceChildren(main);
  }
  const routes={shape:'shaping-preview.html',kiln:'kiln-preview.html',decorate:'decoration-preview.html',photo:'photo-studio.html'};
  function requireStage(stage){
    const work=current();if(work?.stage===stage){window.addEventListener?.('storage',event=>{if(event.key===KEY&&current()?.workId!==work.workId)location.replace('./index.html');});return work;}
    const destination=work?.stage==='finish'?(work.purpose==='order'?'orders.html':'auction.html')+`?photo=${encodeURIComponent(work.photoId||'')}`:work?routes[work.stage]:'index.html';
    location.replace(`./${destination}`);
    return null;
  }
  window.PotteryWorkflow={KEY,SHAPE_KEY,DECOR_KEY,current,start,patch,revisit,advance,finish,requireStage,broken};
}());
