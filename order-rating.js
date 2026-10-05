(function () {
  'use strict';
  const E=window.PotteryEngine,flow=window.PotteryWorkflow;
  if(!E?.currentDraftScore||!flow)return;
  const panel=document.createElement('aside');
  panel.className='order-rating';
  panel.setAttribute('aria-label','当前作品与订单的相似度');
  panel.innerHTML='<span class="order-rating-title">订单相似度</span><span class="order-rating-shape"></span><span class="order-rating-decoration"></span>';
  document.body.append(panel);
  function stars(value){return `${'★'.repeat(value)}${'☆'.repeat(5-value)}`;}
  function update(){
    const active=flow.current();
    panel.hidden=active?.purpose!=='order'||!['shape','decorate'].includes(active.stage);
    if(panel.hidden)return;
    const score=E.currentDraftScore();
    panel.querySelector('.order-rating-shape').textContent=`器型 ${stars(score?.shape||0)}`;
    panel.querySelector('.order-rating-decoration').textContent=`装饰 ${stars(score?.decoration||0)}`;
  }
  document.addEventListener('pottery:draft',update);
  document.addEventListener('pottery:purpose',update);
  update();
}());
