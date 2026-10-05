(function () {
  'use strict';
  const catalog=window.PotteryOrderCatalog;
  const capabilities=window.PotteryCapabilities;
  const economy=window.PotteryEconomyCatalog;
  if(!catalog||!capabilities||!economy)throw new Error('订单目录、工具能力和数值表必须先加载');

  const get=id=>catalog.orders.find(order=>order.id===id)||null;
  function missingSupplies(order,state=window.PotteryEngine.loadEconomy()){
    const required=[['material',order.reference?.materialId||order.materialAccess?.materialId],...(order.reference?.decoration?.pigmentIds||[]).map(id=>['pigment',id]),...(order.reference?.decoration?.patternIds||[]).filter(id=>id!=='solid-ring').map(id=>['pattern',id])];
    return required.filter(([kind,id])=>!economy.isOwned(kind,id,state)).map(([kind,id])=>({...economy.find(kind,id),kind}));
  }
  function canAccept(order,state=window.PotteryEngine.loadEconomy()){
    const material=order?.materialAccess;
    return capabilities.canPlay(order)&&material?.status==='ready'&&
      missingSupplies(order,state).length===0&&
      ['basic','close','excellent'].every(tier=>Number.isSafeInteger(economy.orderReward(order.id,tier)));
  }
  const playable=(state=window.PotteryEngine.loadEconomy())=>catalog.orders.filter(order=>canAccept(order,state));
  window.PotteryOrderRegistry={get,canAccept,playable,missingSupplies};
}());
