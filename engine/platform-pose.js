(function(){
  'use strict';
  const key='pottery-platform-ellipses-v1';
  const defaults={
    'kiln-wide.png':{x:835,y:606,rx:185,ry:28},
    'auction-wide.png':{x:858,y:553,rx:186,ry:48}
  };
  function ellipse(file){
    let saved;
    try{saved=JSON.parse(localStorage.getItem(key)||'{}')[file];}catch(_){}
    return saved&&['x','y','rx','ry'].every(name=>Number.isFinite(saved[name]))&&saved.rx>12&&saved.ry>10
      ?saved:defaults[file];
  }
  function pitch(point){
    // The platform is a horizontal circle. Its projected minor/major-axis
    // ratio is sin(camera elevation); use the same elevation for the vessel.
    return Math.asin(Math.min(.55,Math.max(.10,point.ry/point.rx)));
  }
  function map(point,width,height){
    const scale=Math.max(width/1672,height/941);
    return {x:(width-1672*scale)/2+point.x*scale,
      y:(height-941*scale)/2+point.y*scale,scale};
  }
  window.PotteryPlatformPose={ellipse,pitch,map};
})();
