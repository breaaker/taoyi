(function () {
  'use strict';
  const ALBUM_KEY='clay-and-flame-photo-album-v1';
  const palettes={
    dusk:{top:'#24352d',middle:'#35463a',bottom:'#111d18',glow:'#adb59c'},
    linen:{top:'#c2b59d',middle:'#ddd1b8',bottom:'#9c907c',glow:'#fff7e2'},
    slate:{top:'#343e43',middle:'#526169',bottom:'#1b282d',glow:'#b4cbd1'}
  };
  function validPhoto(photo){
    return !!photo&&typeof photo.id==='string'&&/^F[a-z0-9-]{5,32}$/.test(photo.id)&&
      typeof photo.title==='string'&&photo.title.length>0&&photo.title.length<=50&&
      Number.isFinite(photo.createdAt)&&photo.createdAt>0&&
      typeof photo.dataUrl==='string'&&/^data:image\/(jpeg|png);base64,/.test(photo.dataUrl)&&
      typeof photo.background==='string'&&!!palettes[photo.background];
  }
  function loadAlbum(){try{const value=JSON.parse(localStorage.getItem(ALBUM_KEY)||'[]');return Array.isArray(value)?value.filter(validPhoto):[];}catch(_){return [];}}
  function savePhoto(photo){
    if(!validPhoto(photo))throw new Error('照片内容无效');
    const album=loadAlbum();album.push(photo);
    localStorage.setItem(ALBUM_KEY,JSON.stringify(album));
    return album;
  }
  function createPhoto({title,dataUrl,background,materialId,camera,lightAngle,lightStrength,craft}){
    return {id:`F${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,title:title.trim().slice(0,50)||'未命名陶器',createdAt:Date.now(),dataUrl,background,materialId,
      camera:{yaw:camera.yaw,pitch:camera.pitch,distance:camera.distance},lightAngle,lightStrength,craft};
  }
  function composePhoto(output,potCanvas,background,backdropImage){
    const ctx=output.getContext('2d'),W=output.width,H=output.height,palette=palettes[background]||palettes.dusk;
    const wash=ctx.createLinearGradient(0,0,0,H);
    wash.addColorStop(0,palette.top);wash.addColorStop(.58,palette.middle);wash.addColorStop(1,palette.bottom);
    ctx.fillStyle=wash;ctx.fillRect(0,0,W,H);
    const halo=ctx.createRadialGradient(W*.48,H*.37,W*.02,W*.48,H*.37,W*.66);
    halo.addColorStop(0,palette.glow+'80');halo.addColorStop(1,palette.glow+'00');
    ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);
    if(backdropImage?.naturalWidth&&backdropImage?.naturalHeight){
      const scale=Math.max(W/backdropImage.naturalWidth,H/backdropImage.naturalHeight)*1.1;
      const width=backdropImage.naturalWidth*scale,height=backdropImage.naturalHeight*scale;
      ctx.drawImage(backdropImage,(W-width)/2,0,width,height);
    }
    // The live viewport is much taller than 4:5 on phones. Keep its pixels square.
    const sourceWidth=potCanvas.width||W,sourceHeight=potCanvas.height||H;
    const scale=Math.min(W/sourceWidth,H/sourceHeight);
    const width=sourceWidth*scale,height=sourceHeight*scale;
    ctx.drawImage(potCanvas,(W-width)/2,(H-height)/2,width,height);
    const vignette=ctx.createRadialGradient(W*.5,H*.45,W*.29,W*.5,H*.45,W*.83);
    vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,'#00000055');
    ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
    return output;
  }
  window.PotteryEngine={...(window.PotteryEngine||{}),ALBUM_KEY,PHOTO_BACKGROUNDS:palettes,validPhoto,loadAlbum,savePhoto,createPhoto,composePhoto};
}());
