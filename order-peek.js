(function () {
  'use strict';
  const E=window.PotteryEngine;
  let panel=null,shownOrder=null;
  function update(){
    const work=window.PotteryWorkflow?.current();
    const orders=E.loadEconomy().orders||{};
    const id=work?.orderId||E.activeOrderId?.();
    const visible=work?.purpose==='order'&&orders[id]?.status==='accepted';
    if(!visible){if(panel)panel.hidden=true;return;}
    if(!panel){
      panel=document.createElement('aside');panel.className='order-peek-panel';panel.setAttribute('aria-label','订单参照照片');
      panel.innerHTML='<div class="order-peek-photo"><img class="order-reference-image" alt="订单陶器参照照。单指移动，双指缩放"></div>';
      document.body.append(panel);
      window.PotteryReferenceViewer.mountOrderReference(panel.querySelector('img'),{floating:panel,orderId:id});
      shownOrder=id;
    }
    if(shownOrder!==id){panel.querySelector('img').src=E.getReferencePhoto(id);shownOrder=id;}
    panel.hidden=false;
  }
  document.addEventListener('pottery:purpose',update);
  window.addEventListener('storage',update);
  update();
}());
