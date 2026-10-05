(function () {
  'use strict';
  document.body.dataset.gameScene=location.pathname.split('/').pop().replace('.html','')||'index';
  const frame=document.createElement('div');
  frame.id='gameFrame';
  frame.setAttribute('aria-label','泥与火游戏画面');
  const children=[...document.body.children].filter(node=>node.tagName!=='SCRIPT');
  document.body.append(frame);
  children.forEach(node=>frame.append(node));
  if(new URLSearchParams(location.search).has('anchors')){
    const scene=document.body.dataset.gameScene;
    const anchor=scene==='kiln-preview'?['--kiln-foot-x','--kiln-foot-y','窑内石板 · 器足']:scene==='auction'?['--auction-foot-x','--auction-foot-y','拍卖台 · 器足']:scene==='photo-studio'?['--photo-foot-x','--photo-foot-y','拍照 · 器足']:scene==='index'?['--home-foot-x','--home-foot-y','首页转台 · 器足']:['shaping-preview','decoration-preview'].includes(scene)?['--studio-foot-x','--studio-foot-y','转台 · 器足']:null;
    if(anchor){const mark=document.createElement('div');mark.className='scene-anchor';mark.dataset.label=anchor[2];mark.style.left=`var(${anchor[0]})`;mark.style.top=`var(${anchor[1]})`;mark.textContent='+';frame.append(mark);}
  }
  const frameObserver=new MutationObserver(records=>{
    for(const record of records)for(const node of record.addedNodes){
      if(node.nodeType===1&&node!==frame&&node.tagName!=='SCRIPT'&&node.parentNode===document.body)frame.append(node);
    }
  });
  if(document.body instanceof Node)frameObserver.observe(document.body,{childList:true});
  // The scene fills the viewport. Canvas gestures use CSS pixels directly.
  window.PotteryUiScale=1;
  function alignAuction(){
    if(document.body.dataset.gameScene!=='auction')return;
    const w=frame.clientWidth,h=frame.clientHeight;
    const source={w:1672,h:941,x:858,y:553,file:'auction-wide.png'};
    try{
      const ellipse=JSON.parse(localStorage.getItem('pottery-platform-ellipses-v1')||'{}')[source.file];
      if(Number.isFinite(ellipse?.x)&&Number.isFinite(ellipse?.y)){source.x=ellipse.x;source.y=ellipse.y;}
      else {const point=JSON.parse(localStorage.getItem('pottery-scene-anchors-v2')||'{}')[source.file];if(Number.isFinite(point?.y))source.y=point.y;}
    }catch(_){}
    const scale=Math.max(w/source.w,h/source.h);
    const footY=(h-source.h*scale)/2+source.y*scale,footX=(w-source.w*scale)/2+source.x*scale;
    frame.style.setProperty('--auction-foot-y',`${footY}px`);
    frame.style.setProperty('--auction-foot-x',`${footX}px`);
    window.PotteryAuctionStage?.alignPot?.();
  }
  alignAuction();window.addEventListener('resize',alignAuction,{passive:true});
  window.dispatchEvent(new Event('pottery:frame-ready'));
})();
