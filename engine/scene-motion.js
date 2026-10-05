(function(root){
  'use strict';
  const lerp=(a,b,t)=>a+(b-a)*t;
  const angle=(a,b,t)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*t;
  function interpolate(from,to,t){
    const camera={};
    for(const key of ['yaw','pitch','distance','targetY','spin']){
      const a=from.camera[key]??(key==='targetY'?.92:0),b=to.camera[key]??a;
      camera[key]=['yaw','spin'].includes(key)?angle(a,b,t):lerp(a,b,t);
    }
    const rect={};for(const key of ['left','top','width','height'])rect[key]=lerp(from.rect[key],to.rect[key],t);
    return {camera,rect,fireProgress:lerp(from.fireProgress,to.fireProgress,t),lightAngle:angle(from.lightAngle,to.lightAngle,t),kilnHeat:lerp(from.kilnHeat,to.kilnHeat,t),lightStrength:lerp(from.lightStrength,to.lightStrength,t)};
  }
  root.PotterySceneMotion={interpolate};
})(typeof window==='undefined'?module.exports:window);
