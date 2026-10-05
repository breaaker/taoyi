// Scene music, ambience, foley variants, and small procedural interface cues.
(function () {
  'use strict';
  // Scene documents use the persistent mixer in app.html. Their navigation
  // replaces only the iframe, so the audio context and current music survive.
  if(window.parent!==window){
    try{
      const host=window.parent;
      if(host.PotteryShellHandoff&&host.PotteryAudio){
        window.PotteryAudio=host.PotteryAudio;
        document.addEventListener('pointerdown',()=>host.PotteryAudio.wake(),{passive:true});
        document.addEventListener('keydown',()=>host.PotteryAudio.wake());
        document.addEventListener('click',event=>{
          const target=event.target.closest?.('button,a,[role="button"]');
          if(target&&!target.disabled&&target.getAttribute('aria-disabled')!=='true')host.PotteryAudio.playUiIfIdle();
        });
        return;
      }
    }catch(error){console.warn('Persistent audio host unavailable',error);}
  }
  const KEY='clay-and-flame-sound-v1',VOLUME_KEY='clay-and-flame-volumes-v1';
  const AudioContextType=window.AudioContext||window.webkitAudioContext;
  const assets=window.PotteryAudioAssets||{music:{},ambience:{},randomAmbience:{},effects:{}};
  const sceneMusic={workshop:'workshop',material:'workshop',shape:'shape',kiln:'kiln',decorate:'decorate',pattern:'decorate',photo:'photo',letters:'letters',auction:'auction'};
  const sceneAmbience={shape:'wheel',kiln:'fire',auction:'crowd'};
  const sampleCue={clay:'clay',shape:'shape',paint:'brush',stamp:'brush',draw:'brush',ignite:'ignite',ceramic:'ceramic',camera:'camera',paper:'paper',envelope:'envelope',gavel:'gavel',coin:'coin'};
  const cues={ui:[[430,.075,.09]],select:[[510,.10,.018]],mode:[[390,.09,.018],[585,.16,.012,.055]],undo:[[520,.10,.013],[390,.16,.010,.055]],save:[[392,.20,.016],[494,.26,.013,.09],[587,.40,.011,.19]],complete:[[294,.22,.018],[440,.33,.015,.12],[587,.55,.013,.27]]};
  const volumes={music:1,ambience:1,effects:1};
  let enabled=false,context,mix,musicBus,ambienceBus,effectsBus,scene='workshop',intensity=0,kilnProgress=0;
  let activeMusic=null,activeAmbience=null,ambientTimer=null,duckTimer=null,lastCueAt=-Infinity;
  const buffers=new Map(),lastVariants=new Map(),preparedMedia=new Map(),sceneSamples=new Set();
  let sceneRevision=0;
  try{enabled=localStorage.getItem(KEY)==='on';}catch(_){}
  try{const saved=JSON.parse(localStorage.getItem(VOLUME_KEY)||'{}');for(const key of Object.keys(volumes))if(Number.isFinite(saved[key]))volumes[key]=Math.max(0,Math.min(1,saved[key]));}catch(_){}
  function save(){try{localStorage.setItem(KEY,enabled?'on':'off');}catch(_){}}
  function saveVolumes(){try{localStorage.setItem(VOLUME_KEY,JSON.stringify(volumes));}catch(_){}}
  function gain(value){const node=context.createGain();node.gain.value=value;return node;}
  function tone(frequency,at,duration,level,type='sine'){
    const oscillator=context.createOscillator(),envelope=gain(0);oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,at);
    envelope.gain.setValueAtTime(.0001,at);envelope.gain.exponentialRampToValueAtTime(Math.max(.0002,level),at+.018);
    envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);oscillator.connect(envelope).connect(effectsBus);
    oscillator.start(at);oscillator.stop(at+duration+.03);
  }
  function procedural(name){const at=context.currentTime+.012;for(const [frequency,duration,level,delay=0] of cues[name]||cues.select)tone(frequency,at+delay,duration,level,name==='ui'?'triangle':'sine');}
  function makeAudio(){
    if(!AudioContextType)return false;if(context)return true;
    try{
      context=new AudioContextType();mix=gain(0);mix.connect(context.destination);
      musicBus=gain(volumes.music*.70);musicBus.connect(mix);
      ambienceBus=gain(volumes.ambience*.48);ambienceBus.connect(mix);
      effectsBus=gain(volumes.effects);effectsBus.connect(mix);
      updateLevels();ambientTimer=setInterval(randomAmbient,2600);return true;
    }catch(error){console.warn('Audio mixer unavailable',error);context=null;return false;}
  }
  function updateLevels(){
    if(!context)return;const at=context.currentTime,active=enabled&&!document.hidden;
    mix.gain.setTargetAtTime(active?.82:0,at,.035);
    musicBus.gain.setTargetAtTime(volumes.music*.70,at,.06);
    ambienceBus.gain.setTargetAtTime(volumes.ambience*.48,at,.06);
    effectsBus.gain.setTargetAtTime(volumes.effects,at,.06);
    if(activeAmbience?.started)activeAmbience.node.gain.setTargetAtTime(scene==='kiln'?intensity:1,at,.25);
  }
  function desiredMusic(){return scene==='kiln'&&kilnProgress>=.72?'kiln_cool':sceneMusic[scene]||'workshop';}
  function retire(track,seconds=.32){
    if(!track||track.retired)return;track.retired=true;
    const at=context.currentTime;track.node.gain.cancelScheduledValues(at);
    track.node.gain.setValueAtTime(track.node.gain.value,at);
    track.node.gain.linearRampToValueAtTime(0,at+seconds);
    setTimeout(()=>{track.audio.pause();track.audio.removeAttribute('src');track.audio.load();track.source.disconnect();track.node.disconnect();},seconds*1000+150);
  }
  function activateTrack(track){
    track.audio.play().then(()=>{
      if(track.retired||(track.slot==='music'?activeMusic:activeAmbience)!==track){retire(track,.05);return;}
      if(track.started)return;track.started=true;
      const at=context.currentTime,target=track.slot==='ambience'&&scene==='kiln'?intensity:1;
      track.node.gain.cancelScheduledValues(at);track.node.gain.setValueAtTime(0,at);
      track.node.gain.linearRampToValueAtTime(target,at+(scene==='auction'?.16:.4));
    }).catch(error=>console.warn(`Audio track ${track.key} could not play`,error));
  }
  function startTrack(slot,key,entry,loop=true){
    const current=slot==='music'?activeMusic:activeAmbience;if(current?.key===key)return;
    // Retire the outgoing track now, even while the new media is buffering.
    retire(current,current?.started ? .32 : .05);
    if(slot==='music')activeMusic=null;else activeAmbience=null;
    if(!entry||!enabled||document.hidden){return;}
    const audio=preparedMedia.get(entry.path)||new Audio(entry.path);preparedMedia.delete(entry.path);audio.preload='auto';audio.loop=loop;
    const source=context.createMediaElementSource(audio),node=gain(0);source.connect(node).connect(slot==='music'?musicBus:ambienceBus);
    const track={key,audio,source,node,slot,started:false,retired:false};if(slot==='music')activeMusic=track;else activeAmbience=track;
    activateTrack(track);
  }
  function syncTracks(){
    if(!context)return;
    if(!enabled||document.hidden){startTrack('music',null,null);startTrack('ambience',null,null);return;}
    if(context.state!=='running')return;
    const musicKey=desiredMusic(),ambienceKey=sceneAmbience[scene];
    startTrack('music',musicKey,assets.music[musicKey]);startTrack('ambience',ambienceKey,assets.ambience[ambienceKey]);prefetchScene();
  }
  function bufferFor(entry){
    if(!entry)return Promise.reject(new Error('Missing audio entry'));
    if(!buffers.has(entry.path))buffers.set(entry.path,fetch(entry.path)
      .then(response=>{if(!response.ok)throw new Error(`${response.status} ${entry.path}`);return response.arrayBuffer();})
      .then(data=>context.decodeAudioData(data)).catch(error=>{buffers.delete(entry.path);throw error;}));
    return buffers.get(entry.path);
  }
  function choose(pool,key){
    if(!pool?.length)return null;const previous=lastVariants.get(key);let index=Math.floor(Math.random()*pool.length);
    if(pool.length>1&&index===previous)index=(index+1+Math.floor(Math.random()*(pool.length-1)))%pool.length;
    lastVariants.set(key,index);return pool[index];
  }
  async function sample(pool,key,level=1){
    if(!enabled||!context||document.hidden)return;const revision=sceneRevision,entry=choose(pool,key);if(!entry)return;
    try{
      const buffer=await bufferFor(entry);if(revision!==sceneRevision||!enabled||document.hidden||context.state!=='running')return;
      const source=context.createBufferSource(),node=gain(level);source.buffer=buffer;source.connect(node).connect(effectsBus);source.start();
      const voice={source,node};sceneSamples.add(voice);
      source.onended=()=>{sceneSamples.delete(voice);source.disconnect();node.disconnect();};
    }catch(error){console.warn(`Audio effect ${key} could not play`,error);}
  }
  function prepareMedia(entry){
    if(!entry||preparedMedia.has(entry.path)||activeMusic?.audio.src.endsWith(entry.path)||activeAmbience?.audio.src.endsWith(entry.path))return;
    const audio=new Audio(entry.path);audio.preload='auto';audio.load();preparedMedia.set(entry.path,audio);
  }
  function stopSceneSamples(){
    for(const voice of sceneSamples){
      const at=context.currentTime;voice.node.gain.cancelScheduledValues(at);
      voice.node.gain.setValueAtTime(voice.node.gain.value,at);voice.node.gain.linearRampToValueAtTime(0,at+.12);
      try{voice.source.stop(at+.13);}catch(_){}
    }
    sceneSamples.clear();
  }
  function prefetchScene(){
    if(scene==='photo'){prepareMedia(assets.music.auction);prepareMedia(assets.ambience.crowd);
      for(const key of ['gavel','coin'])for(const entry of assets.effects[key]||[])bufferFor(entry).catch(()=>{});
    }
    if(scene==='auction')prepareMedia(assets.music.auction_resolve);
    const keys=scene==='shape'?['clay','shape']:scene==='kiln'?['ignite']:scene==='decorate'||scene==='pattern'?['brush']:scene==='photo'?['camera']:scene==='letters'?['paper','envelope']:scene==='auction'?['gavel','coin']:[];
    for(const key of keys)for(const entry of assets.effects[key]||[])bufferFor(entry).catch(()=>{});
  }
  function randomAmbient(){
    if(!enabled||!context||context.state!=='running'||document.hidden||scene!=='kiln')return;
    if(kilnProgress>=.72||Math.random()>.22*Math.max(.2,intensity))return;
    sample(assets.randomAmbience.embers,'embers',.45);
  }
  function wake(){if(!enabled||document.hidden||!makeAudio())return Promise.resolve(false);updateLevels();return context.resume().then(()=>{syncTracks();for(const track of [activeMusic,activeAmbience])if(track?.audio.paused)activateTrack(track);return true;}).catch(()=>false);}
  function duckForGavel(){
    const at=context.currentTime;clearTimeout(duckTimer);
    musicBus.gain.setTargetAtTime(volumes.music*.30,at,.035);
    duckTimer=setTimeout(()=>musicBus.gain.setTargetAtTime(volumes.music*.70,context.currentTime,.18),650);
  }
  function play(name){
    if(name==='bid'||!enabled)return;
    if(!context||context.state!=='running'){const revision=sceneRevision;wake().then(ok=>{if(ok&&revision===sceneRevision)play(name);});return;}
    lastCueAt=performance.now();
    if(name==='photoReveal'){sample([assets.music.photo_reveal],'photoReveal',.55);return;}
    if(name==='auctionResolve'){startTrack('music','auction_resolve',assets.music.auction_resolve,false);return;}
    if(name==='embers'||name==='cooling'){sample(assets.randomAmbience[name],name,.5);return;}
    const key=sampleCue[name];if(key&&assets.effects[key]){if(key==='gavel')duckForGavel();sample(assets.effects[key],key);return;}procedural(name);
  }
  function playUiIfIdle(){if(performance.now()-lastCueAt>=80)play('ui');}
  function setScene(next){
    const target=sceneMusic[next]?next:'workshop';
    if(target!==scene){sceneRevision++;if(context)stopSceneSamples();clearTimeout(duckTimer);}
    scene=target;syncTracks();updateLevels();
  }
  function setIntensity(value){intensity=Math.max(0,Math.min(1,Number(value)||0));updateLevels();}
  function setKilnProgress(value){const previous=desiredMusic();kilnProgress=Math.max(0,Math.min(1,Number(value)||0));if(scene==='kiln'&&previous!==desiredMusic())syncTracks();}
  function setVolumes(next){if(!next||typeof next!=='object')return;for(const key of Object.keys(volumes))if(Number.isFinite(next[key]))volumes[key]=Math.max(0,Math.min(1,next[key]));saveVolumes();updateLevels();}
  function setEnabled(value){enabled=Boolean(value);save();if(enabled)wake();else {sceneRevision++;if(context)stopSceneSamples();syncTracks();}updateLevels();}
  document.addEventListener('pointerdown',wake,{passive:true});document.addEventListener('keydown',wake);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){syncTracks();updateLevels();context?.suspend().catch(()=>{});}else if(enabled)wake();});
  window.addEventListener('pagehide',()=>{if(ambientTimer)clearInterval(ambientTimer);activeMusic?.audio.pause();activeAmbience?.audio.pause();context?.suspend().catch(()=>{});});
  window.PotteryAudio={play,playUiIfIdle,wake,setScene,setIntensity,setKilnProgress,setEnabled,setVolumes,getVolumes:()=>({...volumes}),isEnabled:()=>enabled};
}());
