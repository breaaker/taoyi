(function () {
  'use strict';

  // A capability is marked ready only after its tool, geometry, renderer,
  // save/restore path, photo and order scoring all work with one pottery piece.
  const entries=Object.freeze({
    'wheel-shape':Object.freeze({id:'wheel-shape',stage:'shape',ready:true}),
    'surface-color':Object.freeze({id:'surface-color',stage:'decorate',ready:true}),
    'pattern-band':Object.freeze({id:'pattern-band',stage:'decorate',ready:true}),
    'surface-drawing':Object.freeze({id:'surface-drawing',stage:'decorate',ready:true}),
    'photo':Object.freeze({id:'photo',stage:'photo',ready:true}),
    'handle':Object.freeze({id:'handle',stage:'shape',ready:false}),
    'lid':Object.freeze({id:'lid',stage:'shape',ready:false}),
    'piercing':Object.freeze({id:'piercing',stage:'shape',ready:false})
  });

  const get=id=>entries[id]||null;
  const isReady=id=>!!get(id)?.ready;
  function missing(required){
    if(!Array.isArray(required))return ['invalid-capability-list'];
    return [...new Set(required.filter(id=>typeof id!=='string'||!isReady(id)))];
  }
  function canPlay(order){
    return !!order&&order.status==='playable'&&typeof order.id==='string'&&
      missing(order.requiredCapabilities||[]).length===0&&
      order.reference?.status==='ready'&&order.scoring?.status==='ready';
  }

  window.PotteryCapabilities={entries,get,isReady,missing,canPlay};
}());
