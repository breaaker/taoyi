(function () {
  'use strict';
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t);};

  function kilnAt(progress) {
    const p=clamp(progress);
    const fireRise=smooth(.08,.43,p);
    const fireFall=1-smooth(.67,.94,p);
    const heat=fireRise*fireFall;
    const fired=smooth(.19,.83,p);
    const phase=p<.13?'预热':p<.36?'升温':p<.68?'烧成':p<.91?'冷却':'完成';
    return {
      progress:p,phase,fired,heat,
      glow:.10+.90*heat,
      sparks:heat*smooth(.18,.36,p),
      distortion:heat*.95
    };
  }

  window.PotteryEngine={...(window.PotteryEngine||{}),kilnAt};
}());
