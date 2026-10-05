(function () {
  'use strict';
  const catalog=window.PotteryEconomyCatalog,engine=window.PotteryEngine;
  const message=document.getElementById('message');
  const clayColors={'warm-earth':'#b9a389','red-earth':'#a9674d','coarse-earthenware':'#87634c',stoneware:'#8b8980',porcelain:'#ddd8c9'};
  const patternMeta=new Map(),heritageGroups={R01:'朝鲜粉青陶',R02:'土耳其伊兹尼克',R03:'荷兰代尔夫特',R04:'英国泥浆彩陶',R05:'中国景德镇'};
  const patternGroup=item=>patternMeta.get(item.id)?.cultureLabel||heritageGroups[item.id]||'汐湾原创';
  function render(){
    const state=engine.loadEconomy(),completed=catalog.salesCount(state);
    document.getElementById('balance').textContent=state.balance.toLocaleString('zh-CN');
    document.getElementById('progress').textContent=`已成交 ${completed} 件不同作品 · 当前余额 ${state.balance} 金币`;
    for(const [type,items] of Object.entries({material:catalog.materials,pigment:[...catalog.pigments,...catalog.tools.map(item=>({...item,shopType:'tool'}))],pattern:catalog.patterns})){
      const grid=document.querySelector(`[data-category="${type}"]`);grid.replaceChildren();
      const groups=new Map();
      for(const item of items){
        if(item.hideFromShop)continue;
        let destination=grid;
        if(type==='pattern'){
          const label=patternGroup(item);
          if(!groups.has(label)){
            const section=document.createElement('div');section.className='shop-pattern-group';
            const heading=document.createElement('h3');heading.textContent=label;
            const cards=document.createElement('div');cards.className='grid';section.append(heading,cards);grid.append(section);groups.set(label,cards);
          }
          destination=groups.get(label);
        }
        const purchaseType=item.shopType||type;
        const owned=catalog.isOwned(purchaseType,item.id,state),locked=completed<item.gate;
        const card=document.createElement('article');card.className=`card${owned?' owned':''}${locked?' locked':''}`;
        if(item.hex||type==='material'){
          const swatch=document.createElement('div');swatch.className='swatch';swatch.style.setProperty('--swatch',item.hex||clayColors[item.id]);swatch.setAttribute('aria-hidden','true');card.appendChild(swatch);
        }else if(type==='pattern'){
          const preview=document.createElement('img');preview.className='pattern-preview';preview.src=patternMeta.get(item.id)?.previewPng?`./assets/expanded-patterns/${patternMeta.get(item.id).previewPng}`:/^[WR]\d{2}$/.test(item.id)?`./assets/${item.id[0]==='R'?'heritage/patterns':'patterns'}/previews/${item.id}.png`:item.id==='wave'?'./assets/patterns/builtin-wave.svg':'./assets/patterns/builtin-petal.svg';preview.alt='';card.appendChild(preview);
        }
        if(item.shopType==='tool'){const icon=document.createElement('div');icon.className='shop-tool-icon';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 32 32"><path d="M7 21 19 7a3 3 0 0 1 4 0l5 5a3 3 0 0 1 0 4L16 28h-5l-4-4a2 2 0 0 1 0-3Z M12 15l11 11 M15 28h14"/></svg>';card.append(icon);}
        const name=document.createElement('strong');name.textContent=item.name;card.appendChild(name);
        const note=document.createElement('small');note.textContent=item.description|| (owned?'永久拥有':locked?`成交 ${item.gate} 件作品后开放`:`作品使用后可提升拍卖估价 · 参考贡献 ${item.value} 金币`);card.appendChild(note);
        const button=document.createElement('button');button.type='button';button.textContent=owned?'已拥有':locked?`${item.price} 金币 · 未开放`:`${item.price} 金币 · 解锁`;
        button.disabled=owned||locked;button.addEventListener('click',()=>{
          try{const result=catalog.purchase(purchaseType,item.id);message.textContent=result.alreadyOwned?'已经拥有':`已获得${item.name}，剩余 ${result.balance} 金币`;render();}
          catch(error){message.textContent=error.message;}
        });card.appendChild(button);destination.appendChild(card);
      }
    }
  }
  render();
  fetch('./assets/expanded-patterns/manifest.json').then(response=>response.ok?response.json():null).then(manifest=>{for(const item of manifest?.patterns||[])patternMeta.set(item.id,item);render();}).catch(()=>{});
}());
