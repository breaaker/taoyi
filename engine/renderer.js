(function () {
  'use strict';

  const VERTEX = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aUv;
    attribute float aZone;
    uniform mat4 uViewProjection;
    uniform vec4 uSurface;
    uniform float uWheelSpin;
    varying vec3 vWorld;
    varying vec3 vLocal;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec2 vClayUv;
    varying float vZone;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float cylNoise(vec2 uv, float around, float high) {
      vec2 p = vec2(uv.x*around,uv.y*high);
      vec2 i = floor(p), f = fract(p);
      f = f*f*(3.0-2.0*f);
      float x0=mod(i.x,around), x1=mod(i.x+1.0,around);
      return mix(mix(hash(vec2(x0,i.y)),hash(vec2(x1,i.y)),f.x),
                 mix(hash(vec2(x0,i.y+1.0)),hash(vec2(x1,i.y+1.0)),f.x),f.y);
    }
    void main() {
      // The outer lip and the wall share the same displacement at their seam.
      float body = (1.0-step(1.05,aZone))*smoothstep(0.02,0.12,aUv.y);
      vec2 clayUv=vec2(aUv.x,aPosition.y/1.72);
      float handUnevenness = 1.35*(cylNoise(clayUv,12.0,28.0)-0.5)+0.7*(cylNoise(clayUv,29.0,64.0)-0.5);
      vec3 radial = vec3(aPosition.x,0.0,aPosition.z)/max(length(aPosition.xz),0.0001);
      vec3 position = aPosition + radial*uSurface.x*handUnevenness*body;
      float turnCos=cos(uWheelSpin),turnSin=sin(uWheelSpin);
      vLocal = position;
      vWorld = vec3(turnCos*position.x-turnSin*position.z,position.y,turnSin*position.x+turnCos*position.z);
      vNormal = vec3(turnCos*aNormal.x-turnSin*aNormal.z,aNormal.y,turnSin*aNormal.x+turnCos*aNormal.z);
      vUv = aUv;
      vClayUv = clayUv;
      vZone = aZone;
      gl_Position = uViewProjection * vec4(vWorld, 1.0);
    }`;

  const FRAGMENT = `
    precision highp float;
    varying vec3 vWorld;
    varying vec3 vLocal;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec2 vClayUv;
    varying float vZone;
    uniform vec3 uCamera;
    uniform vec3 uKey;
    uniform float uFireProgress;
    uniform vec3 uWetColor;
    uniform vec3 uFiredColor;
    uniform vec4 uTexture;
    uniform vec4 uSurface;
    uniform float uKilnHeat;
    uniform float uHideStand;
    uniform float uHideVessel;
    uniform float uStandStyle;
    uniform float uLightStrength;
    uniform sampler2D uPaint;
    uniform sampler2D uPattern;
    uniform float uPaintEnabled;
    uniform float uPatternEnabled;
    uniform vec4 uPreviewBand;
    uniform vec3 uPreviewColor;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float cylNoise(vec2 uv, float around, float high) {
      vec2 p = vec2(uv.x*around,uv.y*high);
      vec2 i = floor(p), f = fract(p);
      f = f*f*(3.0-2.0*f);
      float x0=mod(i.x,around), x1=mod(i.x+1.0,around);
      return mix(mix(hash(vec2(x0,i.y)),hash(vec2(x1,i.y)),f.x),
                 mix(hash(vec2(x0,i.y+1.0)),hash(vec2(x1,i.y+1.0)),f.x),f.y);
    }
    void main() {
      if (uHideStand > 0.5 && vZone > 2.5) discard;
      if (uHideVessel > 0.5 && vZone < 2.5) discard;
      vec3 viewDir = normalize(uCamera-vWorld);
      vec3 n = normalize(vNormal);
      float footFade = smoothstep(0.08,0.25,vLocal.y);
      float striation = footFade*2.0*(cylNoise(vClayUv,14.0,96.0)-.5);
      // Wrap every texture around the actual vessel circumference. A planar
      // projection compresses the pattern at two sides and stretches it at two.
      float fineGrain = cylNoise(vClayUv,180.0,560.0);
      float granule = cylNoise(vClayUv,96.0,220.0);
      float raisedGrain = smoothstep(0.60,0.78,granule);
      float mottling = cylNoise(vClayUv,24.0,65.0);
      float poreLarge = smoothstep(0.60,0.77,cylNoise(vClayUv,27.0,67.0));
      float poreFine = smoothstep(0.65,0.82,granule);
      float grit = smoothstep(0.59,0.77,fineGrain);
      float stone = smoothstep(0.65,0.81,mottling);
      float surfaceMask = 1.0-step(2.5,vZone);
      float fired = smoothstep(0.0,1.0,uFireProgress);
      float wet = 1.0-fired;
      float gloss = fired*uTexture.z;
      vec3 pigment = mix(uWetColor,uFiredColor,fired);
      float textureAmount = wet*uTexture.x*(0.21*(mottling-.5)+0.16*(granule-.5)+0.08*(fineGrain-.5)+0.012*striation)
                          + fired*uTexture.y*(0.14*(granule-.5)+0.11*(fineGrain-.5)+0.08*(mottling-.5)+0.003*striation);
      pigment *= 1.0+textureAmount;
      pigment *= 1.0-wet*uTexture.x*0.018*max(-striation,0.0);
      pigment *= 1.0-(wet*uTexture.x*0.075+fired*uTexture.y*0.07)*raisedGrain;
      pigment += fired*vec3(0.03,0.015,0.005)*cylNoise(vClayUv,8.0,22.0);
      float pores = surfaceMask*uSurface.y*(0.19*poreLarge+0.11*poreFine);
      float grains = surfaceMask*uSurface.z*(0.13*stone+0.055*grit);
      pigment *= 1.0-fired*pores;
      pigment += fired*grains*vec3(0.60,0.55,0.45);
      if (vZone > 1.5) pigment *= 0.62;
      else if (vZone > 0.5) pigment *= mix(1.0,0.62,smoothstep(1.0,1.1,vZone));
      if (vZone < 0.5) {
        if (uPaintEnabled > 0.5) {
          vec4 underpaint=texture2D(uPaint,vec2(0.5,vUv.y));
          pigment=mix(pigment,underpaint.rgb,underpaint.a*0.92);
        }
        if (uPatternEnabled > 0.5) {
          vec4 pattern=texture2D(uPattern,vUv);
          pigment=mix(pigment,pattern.rgb,pattern.a);
        }
        if (uPreviewBand.z > 0.5) {
          float distanceToBand=abs(vUv.y-uPreviewBand.x);
          float preview=1.0-smoothstep(uPreviewBand.y*0.74,uPreviewBand.y,distanceToBand);
          pigment=mix(pigment,uPreviewColor,preview*0.73);
        }
      }
      if (vZone > 2.5) {
        float radius=length(vWorld.xz);
        if(uStandStyle>0.5){
          float top=smoothstep(.48,.82,n.y);
          vec2 topUv=vec2(vLocal.x,vLocal.z)*.48+.5;
          vec2 sideUv=vec2(atan(vLocal.z,vLocal.x)/6.2831853+.5,vLocal.y*2.7+.5);
          vec2 stoneUv=mix(sideUv,topUv,top);
          float stoneGrain=cylNoise(stoneUv,145.0,145.0)-.5;
          float veins=cylNoise(stoneUv,43.0,47.0)-.5;
          float contact=1.0-smoothstep(.29,.70,length(vWorld.xz-vec2(.06,-.03)));
          pigment=vec3(.68,.65,.59)*(1.0+.065*stoneGrain+.045*veins);
          pigment*=mix(.76,1.0,top);
          pigment*=1.0-top*.46*contact;
          pigment*=1.0-.08*smoothstep(.82,.90,radius);
        }else{
          float localAngle=atan(vLocal.z,vLocal.x);
          float notchAngle=abs(atan(sin(localAngle-.45),cos(localAngle-.45)));
          float outerRing=smoothstep(.57,.64,radius)*(1.0-smoothstep(.72,.77,radius));
          float turningGrain=.035*cos(9.0*localAngle)+.018*cos(17.0*localAngle+1.2);
          float notch=(1.0-smoothstep(.035,.13,notchAngle))*outerRing;
          pigment=vec3(0.26,0.28,0.24)*(0.8+0.16*smoothstep(0.15,0.76,radius)+outerRing*turningGrain);
          pigment+=vec3(.16,.13,.07)*notch;
        }
      }

      // Fine throwing grooves bend the highlight without making the silhouette noisy.
      vec3 radial = vec3(vWorld.x,0.0,vWorld.z)/max(length(vWorld.xz),0.0001);
      n = normalize(n + radial*((wet*0.017*uTexture.w+fired*0.004)*striation
                    + (wet*uTexture.x*0.055+fired*uTexture.y*0.075)*(granule-.5)
                    + surfaceMask*(uSurface.y*(-0.13*poreLarge-0.07*poreFine)+uSurface.z*(0.12*stone+0.05*grit))));
      vec3 keyDir = normalize(uKey);
      vec3 fillDir = normalize(vec3(-uKey.x*0.72,0.46,-uKey.z*0.8));
      float key = smoothstep(-0.16,0.74,dot(n,keyDir));
      float fill = smoothstep(-0.22,0.70,dot(n,fillDir));
      float sky = 0.5+0.5*n.y;
      vec3 illumination = vec3(0.31,0.32,0.30) +
                          vec3(1.07,0.91,0.74)*key*0.74*uLightStrength +
                          vec3(0.37,0.48,0.51)*fill*0.34*uLightStrength +
                          vec3(0.08,0.10,0.11)*sky;
      illumination *= 1.0-0.47*uHideStand;
      vec3 linearColor = pow(max(pigment,vec3(0.0)),vec3(2.2))*illumination;
      vec3 fireLeft=vec3(-0.86,0.22,0.74)-vWorld;
      vec3 fireRight=vec3(0.86,0.20,0.74)-vWorld;
      float leftLight=max(dot(n,normalize(fireLeft)),0.0)/(0.45+0.42*dot(fireLeft,fireLeft));
      float rightLight=max(dot(n,normalize(fireRight)),0.0)/(0.45+0.42*dot(fireRight,fireRight));
      float kilnLight=uKilnHeat*(leftLight+rightLight);
      linearColor += pow(max(pigment,vec3(0.0)),vec3(2.2))*vec3(1.60,0.49,0.11)*kilnLight;
      // Fire below the shelf cannot directly light an upward-facing lip.
      // The hot arch and walls return warm diffuse light into that hemisphere,
      // so the lip and inner wall share the body's gently flickering firelight.
      float cavityBounce = uKilnHeat*surfaceMask*(0.055+0.19*sky)
                         /(1.0+0.18*vWorld.y*vWorld.y);
      linearColor += pow(max(pigment,vec3(0.0)),vec3(2.2))*vec3(1.25,0.43,0.13)*cavityBounce;

      float keyPower = mix(12.0,mix(7.0,72.0,uTexture.z),fired);
      float moisture = 0.65+0.35*cylNoise(vClayUv,10.0,24.0);
      float specStrength = 0.11*moisture*wet + fired*(1.0-0.9*uSurface.w)*0.075/(0.7+0.5*uTexture.y) + 0.64*gloss;
      vec3 halfVector = normalize(keyDir+viewDir);
      float spec = pow(max(dot(n,halfVector),0.0),keyPower)*specStrength;
      vec3 fillHalf = normalize(fillDir+viewDir);
      spec += pow(max(dot(n,fillHalf),0.0),22.0)*(0.026*wet+0.025*fired*(1.0-uSurface.w)+0.17*gloss);
      float fresnel = pow(1.0-max(dot(n,viewDir),0.0),3.0);
      spec += fresnel*(0.018*wet+0.014*fired*(1.0-uSurface.w)+0.13*gloss);
      if (vZone > 2.5) spec *= uStandStyle>0.5?0.20:0.12;
      else if (vZone > 1.5) spec *= 0.37;
      else if (vZone > 0.5) spec *= mix(1.0,0.37,smoothstep(1.0,1.1,vZone));
      linearColor += mix(vec3(1.0,0.91,0.78),vec3(1.0,0.59,0.32),uHideStand*uKilnHeat)*spec*uLightStrength;
      vec3 finalColor = pow(max(linearColor,vec3(0.0)),vec3(1.0/2.2));
      gl_FragColor = vec4(finalColor,1.0);
    }`;

  function normalize(v) {
    const length = Math.hypot(...v);
    return v.map(x => x / (length || 1));
  }
  function cross(a,b) {
    return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  }
  function dot(a,b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
  function perspective(fov,aspect,near,far) {
    const f=1/Math.tan(fov/2);
    return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)/(near-far),-1, 0,0,2*far*near/(near-far),0];
  }
  function lookAt(eye,target) {
    const z=normalize(eye.map((x,i)=>x-target[i]));
    const x=normalize(cross([0,1,0],z));
    const y=cross(z,x);
    return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
      -dot(x,eye),-dot(y,eye),-dot(z,eye),1];
  }
  function multiply(a,b) {
    const out=new Array(16).fill(0);
    for(let col=0;col<4;col++)for(let row=0;row<4;row++)for(let k=0;k<4;k++)out[col*4+row]+=a[k*4+row]*b[col*4+k];
    return out;
  }

  class PotteryRenderer {
    constructor(canvas,geometry,options={}) {
      this.canvas=canvas;this.geometry=geometry;
      // Scene handoff captures the displayed vessel during a page transition.
      const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:options.preserveDrawingBuffer===true});
      if(!gl) throw new Error('此设备未提供 WebGL');
      this.gl=gl;
      function shader(type,source) {
        const handle=gl.createShader(type);
        gl.shaderSource(handle,source);
        gl.compileShader(handle);
        if(!gl.getShaderParameter(handle,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(handle));
        return handle;
      }
      const program=gl.createProgram();
      gl.attachShader(program,shader(gl.VERTEX_SHADER,VERTEX));
      gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FRAGMENT));
      gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      this.program=program;
      this.attributes=['aPosition','aNormal','aUv','aZone'].map(name=>gl.getAttribLocation(program,name));
      this.uniforms=Object.fromEntries(['uViewProjection','uCamera','uKey','uFireProgress','uWetColor','uFiredColor','uTexture','uSurface','uWheelSpin','uKilnHeat','uHideStand','uHideVessel','uStandStyle','uLightStrength','uPaint','uPattern','uPaintEnabled','uPatternEnabled','uPreviewBand','uPreviewColor'].map(name=>[name,gl.getUniformLocation(program,name)]));
      this.standStyle=options.standStyle==='limestone'?1:0;
      this.canvas.__potteryRenderer=this;
      this.paintTexture=this.createLayerTexture();
      this.patternTexture=this.createLayerTexture();
      this.paintEnabled=false;
      this.patternEnabled=false;
      this.previewBand=null;
      const vbo=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
      gl.bufferData(gl.ARRAY_BUFFER,geometry.vertices,gl.STATIC_DRAW);
      const ibo=gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,geometry.indices,gl.STATIC_DRAW);
      this.vbo=vbo;this.ibo=ibo;this.indexCount=geometry.indices.length;
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    }

    resize() {
      const rect=this.canvas.getBoundingClientRect();
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const w=Math.max(1,Math.round(rect.width*dpr));
      const h=Math.max(1,Math.round(rect.height*dpr));
      if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}
    }

    updateGeometry(geometry) {
      if(geometry.indices.length!==this.indexCount)throw new Error('陶器网格拓扑已改变');
      this.geometry=geometry;
      const gl=this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
      gl.bufferData(gl.ARRAY_BUFFER,geometry.vertices,gl.DYNAMIC_DRAW);
    }

    createLayerTexture() {
      const gl=this.gl,texture=gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      return texture;
    }

    uploadLayer(texture,canvas,unit) {
      const gl=this.gl;
      gl.activeTexture(unit);
      gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,canvas);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    }
    setPaintCanvas(canvas) {this.paintCanvas=canvas;this.uploadLayer(this.paintTexture,canvas,this.gl.TEXTURE0);this.paintEnabled=true;}
    setPatternCanvas(canvas) {this.patternCanvas=canvas;this.uploadLayer(this.patternTexture,canvas,this.gl.TEXTURE1);this.patternEnabled=true;}
    setDecorationCanvas(canvas) {this.setPatternCanvas(canvas);}

    setPreviewBand(band) { this.previewBand=band; }

    projectPoint(point,camera) {
      const target=[0,camera.targetY??.92,0];
      const eye=[Math.sin(camera.yaw)*camera.distance,target[1]+Math.sin(camera.pitch)*camera.distance,Math.cos(camera.yaw)*camera.distance];
      const aspect=this.canvas.clientWidth/this.canvas.clientHeight;
      const vp=multiply(perspective(36*Math.PI/180,aspect,.1,20),lookAt(eye,target));
      const [x,y,z]=point;
      const w=vp[3]*x+vp[7]*y+vp[11]*z+vp[15];
      return {x:(.5+.5*(vp[0]*x+vp[4]*y+vp[8]*z+vp[12])/w)*this.canvas.clientWidth,
        y:(.5-.5*(vp[1]*x+vp[5]*y+vp[9]*z+vp[13])/w)*this.canvas.clientHeight};
    }

    draw(fireProgress,camera,lightAngle,recipe,wheelSpin=0,kilnHeat=0,hideStand=false,lightStrength=1,hideVessel=false) {
      if(window.PotterySceneTransitioning)return;
      this.lastDrawArgs=[fireProgress,camera,lightAngle,recipe,wheelSpin,kilnHeat,hideStand,lightStrength];
      this.resize();
      const gl=this.gl;
      const aspect=this.canvas.width/this.canvas.height;
      const target=[0,camera.targetY??.92,0];
      const eye=[Math.sin(camera.yaw)*camera.distance,target[1]+Math.sin(camera.pitch)*camera.distance,Math.cos(camera.yaw)*camera.distance];
      const view=lookAt(eye,target);
      const projection=perspective(36*Math.PI/180,aspect,.1,20);
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.program);
      gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo);
      const sizes=[3,3,2,1], offsets=[0,12,24,32];
      this.attributes.forEach((attribute,i)=>{gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,sizes[i],gl.FLOAT,false,36,offsets[i]);});
      const u=this.uniforms;
      gl.uniformMatrix4fv(u.uViewProjection,false,new Float32Array(multiply(projection,view)));
      gl.uniform3fv(u.uCamera,new Float32Array(eye));
      gl.uniform3f(u.uKey,Math.cos(lightAngle)*.7,.83,Math.sin(lightAngle)*.7);
      gl.uniform1f(u.uFireProgress,fireProgress);
      gl.uniform3fv(u.uWetColor,recipe.wet);
      gl.uniform3fv(u.uFiredColor,recipe.fired);
      gl.uniform4fv(u.uTexture,recipe.texture);
      gl.uniform4fv(u.uSurface,recipe.surface);
      gl.uniform1f(u.uWheelSpin,wheelSpin);
      gl.uniform1f(u.uKilnHeat,kilnHeat);
      gl.uniform1f(u.uHideStand,hideStand?1:0);
      gl.uniform1f(u.uHideVessel,hideVessel?1:0);
      gl.uniform1f(u.uStandStyle,this.standStyle);
      gl.uniform1f(u.uLightStrength,lightStrength);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D,this.paintTexture);
      gl.uniform1i(u.uPaint,0);
      gl.uniform1f(u.uPaintEnabled,this.paintEnabled?1:0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D,this.patternTexture);
      gl.uniform1i(u.uPattern,1);
      gl.uniform1f(u.uPatternEnabled,this.patternEnabled?1:0);
      const preview=this.previewBand;
      gl.uniform4f(u.uPreviewBand,preview?.center||0,preview?.width||0,preview?1:0,0);
      gl.uniform3fv(u.uPreviewColor,new Float32Array(preview?.color||[1,.85,.51]));
      gl.drawElements(gl.TRIANGLES,this.indexCount,gl.UNSIGNED_SHORT,0);
    }
    capturePotCanvas(target){
      if(!this.lastDrawArgs)return null;
      const original=this.lastDrawArgs.slice(),args=original.slice();args[6]=true;
      this.draw(...args);
      const copy=target||document.createElement('canvas');
      if(copy.width!==this.canvas.width)copy.width=this.canvas.width;
      if(copy.height!==this.canvas.height)copy.height=this.canvas.height;
      copy.getContext('2d').drawImage(this.canvas,0,0);
      this.draw(...original);
      return copy;
    }
    drawStandOnly(){
      if(!this.lastDrawArgs)return false;
      const original=this.lastDrawArgs.slice(),args=original.slice();args[8]=true;
      this.draw(...args);
      this.lastDrawArgs=original;
      return true;
    }
  }

  window.PotteryEngine = { ...(window.PotteryEngine || {}), PotteryRenderer };
}());
