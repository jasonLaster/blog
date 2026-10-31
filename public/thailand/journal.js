'use strict';
const $=selector=>document.querySelector(selector);
const el=(tag,className,text)=>{const n=document.createElement(tag);if(className)n.className=className;if(text!==undefined)n.textContent=text;return n;};
const dialog=$('#lightbox');
let activePhotos=[],activeIndex=0,lastTrigger=null;
function showPhoto(index){
 activeIndex=(index+activePhotos.length)%activePhotos.length;const p=activePhotos[activeIndex];
 $('#lightbox-image').src=p.src;$('#lightbox-image').alt=p.alt;
 $('#lightbox-caption').textContent=p.caption+(p.date?' · '+p.date:'');
 $('#lightbox-count').textContent=String(activeIndex+1).padStart(2,'0')+' / '+String(activePhotos.length).padStart(2,'0');
 $('#previous-photo').hidden=$('#next-photo').hidden=activePhotos.length<2;
}
function openViewer(photos,index,place,trigger){document.querySelectorAll('video').forEach(v=>v.pause());activePhotos=photos;lastTrigger=trigger;$('#lightbox-place').textContent=place;showPhoto(index);dialog.showModal();document.body.classList.add('modal-open');$('#close-lightbox').focus();}
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');$('#lightbox-image').removeAttribute('src');lastTrigger?.focus();});
$('#close-lightbox').addEventListener('click',()=>dialog.close());
$('#previous-photo').addEventListener('click',()=>showPhoto(activeIndex-1));
$('#next-photo').addEventListener('click',()=>showPhoto(activeIndex+1));
dialog.addEventListener('keydown',e=>{if(e.key==='Tab'){const buttons=[...dialog.querySelectorAll('button')].filter(b=>!b.hidden);const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(activeIndex+(e.key==='ArrowRight'?1:-1));}});
let touchStart=null;dialog.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});dialog.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchStart;if(touchStart!==null&&Math.abs(delta)>70)showPhoto(activeIndex+(delta<0?1:-1));touchStart=null;},{passive:true});
function outbound(text,url,cls=''){const a=el('a',cls,text+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function referencePhoto(ref,venue,index){return {id:'reference-'+venue.id+'-'+index,src:ref.src,thumb:ref.thumb||ref.src,alt:ref.alt||venue.title+' — reference photograph',caption:'Reference · '+(ref.caption||venue.title)+(ref.author?' · '+ref.author:''),href:ref.source,width:ref.width,height:ref.height,crop:ref.crop,reference:true};}
// Position the selected subject in the thumbnail rather than the image centre.
// Recalculate against the actual tile shape so portrait and landscape mosaics
// retain the same subject as their dimensions change.
const thumbnailCrops=new WeakMap();
const cropBreakpoint=window.matchMedia('(max-width: 800px)');
function cropThumbnail(img){
 const photo=thumbnailCrops.get(img),crop=photo?.crop;if(!crop)return;
 const mobile=cropBreakpoint.matches;
 const [x,y]=(mobile&&crop.mobileFocus)||crop.focus;
 const fit=(mobile&&crop.mobileFit)||crop.fit||'cover';img.style.objectFit=fit;
 if(fit==='contain'){img.style.objectPosition='50% 50%';return;}
 const w=photo.width||img.naturalWidth,h=photo.height||img.naturalHeight;
 const boxW=img.clientWidth,boxH=img.clientHeight;if(!w||!h||!boxW||!boxH)return;
 const scale=Math.max(boxW/w,boxH/h),overflowX=w*scale-boxW,overflowY=h*scale-boxH;
 const position=(focus,size,box,overflow)=>overflow>0.5?Math.max(0,Math.min(100,(size*focus/100-box/2)/overflow*100)):50;
 img.style.objectPosition=position(x,w*scale,boxW,overflowX)+'% '+position(y,h*scale,boxH,overflowY)+'%';
}
const thumbnailObserver=new ResizeObserver(entries=>entries.forEach(({target})=>cropThumbnail(target)));
cropBreakpoint.addEventListener('change',()=>document.querySelectorAll('.photo-button img').forEach(cropThumbnail));
function photoFigure(photo,photos,place,thumbnail=false){
 const figure=el('figure');const button=el('button','photo-button');button.type='button';button.setAttribute('aria-label','Open photograph: '+photo.alt);
 const img=el('img');img.src=thumbnail?(photo.thumb||photo.src):photo.src;img.alt=photo.alt;img.loading='lazy';img.decoding='async';
 if(photo.width&&photo.height){img.width=photo.width;img.height=photo.height;}
 if(photo.crop){thumbnailCrops.set(img,photo);img.dataset.cropReviewed='true';img.addEventListener('load',()=>cropThumbnail(img));thumbnailObserver.observe(img);}
 if(!thumbnail&&photo.thumb&&photo.width>600){img.srcset=photo.thumb+' '+Math.min(600,Math.round(600*photo.width/photo.height))+'w, '+photo.src+' '+photo.width+'w';img.sizes='(max-width: 800px) 88vw, 89vw';}
 button.append(img);const expand=el('span','expand-symbol','↗');expand.setAttribute('aria-hidden','true');button.append(expand);
 if(photo.reference)button.append(el('span','reference-badge','Reference'));
 button.addEventListener('click',()=>openViewer(photos,photos.indexOf(photo),place,button));
 const caption=el('figcaption');if(photo.href)caption.append(outbound(photo.caption,photo.href,'photo-place-link'));else caption.append(el('span','',photo.caption));if(photo.date)caption.append(el('span','photo-date',photo.date));
 figure.append(button,caption);return figure;
}
function videoFigure(v){
 const figure=el('figure','video-tile');figure.id='film-'+v.id;const player=el('video');player.controls=true;player.playsInline=true;player.preload='metadata';player.poster=v.poster;player.src=v.src;player.width=v.width;player.height=v.height;player.setAttribute('aria-label',v.caption);
 player.addEventListener('play',()=>{document.querySelectorAll('video').forEach(other=>{if(other!==player)other.pause();});});
 const caption=el('figcaption');caption.append(el('span','',v.caption),el('span','photo-date',v.time+' · '+v.durationLabel+' · original sound'));figure.append(player,caption);return figure;
}
function inlineGallery(photos,place,all=photos,compact=false,videos=[]){
 const section=el('section','inline-gallery'+(compact?' compact-gallery':''));section.setAttribute('aria-label',place+' photographs'+(videos.length?' and videos':''));
 const top=el('div','gallery-heading');top.append(el('span','',photos.length+' '+(photos.length===1?'photograph':'photographs')+(videos.length?' · '+videos.length+' '+(videos.length===1?'video':'videos'):'')),el('span','',videos.length?'Photos enlarge · videos play here':'Tap any image to enlarge ↗'));section.append(top);
 const grid=el('div','gallery-grid');let vi=0;photos.forEach((p,i)=>{grid.append(photoFigure(p,all,place,compact||i>2));if(videos.length&&i>=2&&i%2===0&&vi<videos.length)grid.append(videoFigure(videos[vi++]));});while(vi<videos.length)grid.append(videoFigure(videos[vi++]));section.append(grid);if(videos.length)section.classList.add('mixed-media');return section;
}
// Keep original public posts in their provider's frame, with attribution intact.
function referenceEmbeds(refs,place){
 const collection=el('div','reference-embeds');collection.setAttribute('aria-label',place+' reference photographs');
 refs.forEach(ref=>{const figure=el('figure','reference-embed');const frame=el('iframe');frame.src=ref.embedUrl;frame.title='Reference photograph: '+ref.caption+' · '+ref.author;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';frame.height='620';frame.setAttribute('allowfullscreen','');
 const caption=el('figcaption');caption.append(el('span','','Reference · '+ref.caption),outbound(ref.author+' · original post',ref.source));figure.append(frame,caption);collection.append(figure);});return collection;
}
window.addEventListener('message',event=>{
 if(event.origin!=='https://www.instagram.com')return;
 let message;try{message=JSON.parse(event.data);}catch{return;}
 if(message?.type!=='MEASURE')return;
 const height=message.details?.height;if(!Number.isFinite(height)||height<200||height>2000)return;
 for(const frame of document.querySelectorAll('.reference-embed iframe'))if(frame.contentWindow===event.source){frame.height=String(Math.ceil(height));break;}
});
function storyDetails(stop){
 const details=el('details','story-details');details.id='story-'+stop.id;details.append(el('summary','','Read the story & sources'));const prose=el('div','stop-prose');stop.paragraphs.forEach(p=>prose.append(el('p','',p)));if(stop.note)prose.append(el('p','evidence-note',stop.note));
 if(stop.sources?.length){const links=el('div','story-sources');stop.sources.forEach(s=>links.append(outbound(s.label,s.url)));prose.append(links);}details.append(prose);return details;
}
const kinds={stay:{label:'Stay',paths:['M3 18V7m18 11V7M3 13h18M6 13V9h5v4m2 0V9h5v4M3 18v2m18-2v2']},food:{label:'Food',paths:['M5 3v7m3-7v7M3 3v5a3 3 0 0 0 6 0V3M6 11v10M18 3c-3 3-3 8 0 9h2V3h-2Zm2 9v9']},shop:{label:'Shop',paths:['M4 9h16v12H4ZM3 9l2-6h14l2 6M8 21v-7h8v7M3 9c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0']},sight:{label:'Sight',paths:['M3 9l9-6 9 6H3Zm2 3v7m5-7v7m4-7v7m5-7v7M2 21h20']},nature:{label:'Nature',paths:['M12 3v10m-3-4 3 4 3-4M3 17c3-3 3 3 6 0s3 3 6 0 3 3 6 0M3 21c3-3 3 3 6 0s3 3 6 0 3 3 6 0']},ride:{label:'Ride',paths:['M8 17a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm16 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 17l5-9 5 9H4Zm10 0 5-11m-3 0h4M7 8h5']}};
function categoryLabel(stop){const k=kinds[stop.category]||kinds.sight;const label=el('span','stop-kind');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.4');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');k.paths.forEach(d=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);svg.append(p);});label.append(svg,el('span','',k.label));return label;}
function renderStop(stop,photoIndex,venues){
 const section=el('article','log-stop '+(stop.prominence||'standard')+'-stop');section.id=stop.id;section.setAttribute('aria-labelledby',stop.id+'-title');if(stop.headerRatio)section.style.setProperty('--header-ratio',stop.headerRatio);if(stop.mobileHeaderRatio)section.style.setProperty('--mobile-header-ratio',stop.mobileHeaderRatio);
 const v=venues[stop.venue],photos=stop.photoIds.map(id=>photoIndex.get(id)).filter(Boolean),refs=(v?.references||[]).map((r,i)=>referencePhoto(r,v,i)),all=[...photos,...refs];
 const hero=all.find(p=>p.id===stop.headerPhoto||p.src===stop.headerPhoto)||all[0];const compact=stop.prominence==='compact';
 const head=el('header','stop-heading');const kicker=el('div','stop-kicker');kicker.append(categoryLabel(stop),el('p','eyebrow stop-time',stop.time+' · '+(v?.region||'From the trip')));head.append(kicker);const title=el('h3','',stop.title);title.id=stop.id+'-title';head.append(title);
 const intro=el('div','stop-intro');intro.append(head);const text=el('p','stop-summary',stop.short||stop.paragraphs[0]);
 const links=el('div','stop-links');if(v?.map)links.append(outbound('Location',v.map));if(v?.official)links.append(outbound('Website',v.official));
 if(compact){intro.append(text,links);section.append(intro);if(all.length){const ordered=[hero,...all.filter(p=>p!==hero)],g=inlineGallery(ordered,stop.title,ordered,true,stop.videos||[]);g.id='gallery-'+stop.id;section.append(g);}}
 else {section.append(intro);const caption=el('div','stop-caption');caption.append(text,links);section.append(caption);if(all.length){const first=[hero];for(const id of stop.mosaicLead||[]){const p=all.find(x=>x.id===id||x.src===id);if(p&&!first.includes(p))first.push(p);}const ordered=[...first,...all.filter(p=>!first.includes(p))];const g=inlineGallery(ordered,stop.title,ordered,false,stop.videos||[]);g.id='gallery-'+stop.id;g.classList.add('image-collection',all.length<3?'paired-collection':'mosaic-collection');if(stop.layout==='landscape-led')g.classList.add('landscape-led');g.querySelector('figure')?.classList.add('lead-photo');section.append(g);}}

 if(v?.embeds?.length)section.append(referenceEmbeds(v.embeds,stop.title));
 section.append(storyDetails(stop));return section;
}
function renderDay(day,index,photoIndex,venues,continuation=false){
 const section=el('section','log-day');section.id=day.id;section.setAttribute('aria-labelledby',day.id+'-title');const header=el('header','day-header');
 const stamp=el('div','day-stamp');stamp.append(el('span','day-number',day.day),el('span','day-month','OCTOBER'));const heading=el('div','day-heading');heading.append(el('p','eyebrow',continuation?'LATER THAT DAY · CHIANG MAI':'DAY '+String(index+1).padStart(2,'0')+' / '+day.region));const h=el('h2','',day.title);h.id=day.id+'-title';heading.append(h);if(day.lede)heading.append(el('p','day-lede',day.lede));header.append(stamp,heading);section.append(header);
 if(day.notes){const notes=el('div','day-notes');day.notes.filter(n=>typeof n==='string').forEach(p=>notes.append(el('p','',p)));section.append(notes);}
 day.stops.forEach(s=>section.append(renderStop(s,photoIndex,venues)));return section;
}
function cityChapter(id,title,dates,tagline,number){
 const section=el('section','city-chapter city-'+id);section.id=id;section.setAttribute('aria-labelledby',id+'-title');const header=el('header','city-divider');const meta=el('div','city-meta');meta.append(el('p','eyebrow','CHAPTER '+number),el('span','',dates));const h=el('h2','',title);h.id=id+'-title';header.append(meta,h,el('p','city-tagline',tagline));section.append(header);return section;
}
function creditReference(ref,title){const p=el('p');p.append(document.createTextNode(title+' reference photograph — '+(ref.author||ref.rights||'See source')+'. '));if(ref.source)p.append(outbound('Source',ref.source));if(ref.license&&ref.licenseUrl)p.append(document.createTextNode(' · '),outbound(ref.license,ref.licenseUrl));else if(ref.rights)p.append(document.createTextNode(' · '+ref.rights));p.append(document.createTextNode('. Resized/compressed; display may crop.'));$('#credit-list').append(p);}
async function start(){
 const response=await fetch('/thailand/log.json');if(!response.ok)throw Error('Journal content unavailable');const data=await response.json(),photoIndex=new Map(data.photos.map(p=>[p.id,p]));
 const map={src:'/thailand/assets/illustrated-trip-map.webp',alt:'Illustrated orientation map of Bangkok and Chiang Mai, including Jim Thompson House, Nimman, Wat Pha Lat, Doi Suthep and Baan Tawai.',caption:'AI-illustrated orientation · approximate geography, not a route map'};$('#hero-image').src=map.src;$('#hero-image').alt=map.alt;$('#hero-caption').textContent=map.caption;$('#hero-button').addEventListener('click',()=>openViewer([map],0,'Bangkok & Chiang Mai',$('#hero-button')));
 const bangkok=cityChapter('bangkok','Bangkok','25–26 October','City evenings. Teak houses. A little looking around.','01'),chiangmai=cityChapter('chiang-mai','Chiang Mai','26–29 October','Forest temples, neighbourhood tables, and a day in wood.','02');$('#days').append(bangkok,chiangmai);
 data.days.forEach((day,i)=>{
  const tab=el('a','',day.day+' Oct');tab.href='#'+day.id;$('#day-nav').append(tab);
  if(day.day===26){const b={...day,title:'House and garden.',region:'Bangkok',lede:'A closer look at the house, garden and collection.',stops:day.stops.filter(s=>s.id==='jim-thompson')};bangkok.append(renderDay(b,i,photoIndex,data.venues));const c={...day,id:'day-26-chiangmai',title:'Arrival in Nimman.',region:'Chiang Mai',lede:'A new city, and the first northern base.',notes:[],stops:day.stops.filter(s=>s.id!=='jim-thompson')};chiangmai.append(renderDay(c,i,photoIndex,data.venues,true));}
  else (day.day<26?bangkok:chiangmai).append(renderDay(day,i,photoIndex,data.venues));
 });
 if(data.namedNote){const n=data.namedNote,box=$('#named-note');box.append(el('p','eyebrow',n.label));const h=el('h2','',n.title);h.id='named-note-title';box.append(h,el('p','named-note-short',n.short));const details=el('details','story-details');details.append(el('summary','','Read more'));const prose=el('div','stop-prose');n.paragraphs.forEach(p=>prose.append(el('p','',p)));details.append(prose);box.append(details);const links=el('div','stop-links');n.links.forEach(l=>links.append(outbound(l.label,l.url)));box.append(links);}else $('#named-note').hidden=true;
 if(data.visualDetails){const detailPhotos=data.visualDetails.photoIds.map(id=>photoIndex.get(id));$('#visual-details-description').textContent=data.visualDetails.description;const g=inlineGallery(detailPhotos,data.visualDetails.title);g.id='gallery-visual-details';g.classList.add('detail-collection');$('#visual-details-gallery').append(g);}else $('#visual-details').hidden=true;data.unplaced.forEach(group=>{const photos=group.photoIds.map(id=>photoIndex.get(id));const heading=el('h3','unplaced-day-title',group.title);const g=inlineGallery(photos,group.title);g.id='unplaced-'+group.day;$('#unplaced-galleries').append(heading,g);});if(!data.unplaced.length)$('#unplaced').hidden=true;
 const contextDetails=$('#context');let loaded=false;contextDetails.addEventListener('toggle',()=>{if(contextDetails.open&&!loaded){const views=(data.context||[]).map((c,i)=>referencePhoto(c,{id:'context',title:'The wider view'},i));views.forEach(p=>$('#context-grid').append(photoFigure(p,views,'The wider view')));loaded=true;}});
 Object.values(data.venues).forEach(v=>{(v.references||[]).forEach(r=>creditReference(r,v.title));(v.embeds||[]).forEach(r=>{const p=el('p');p.append(document.createTextNode(v.title+' reference photograph — '+r.author+'. '),outbound('Original post',r.source),document.createTextNode('. Shown through the original Instagram embed; copyright remains with the creator.'));$('#credit-list').append(p);});});(data.context||[]).forEach(c=>creditReference(c,c.caption));
 if(location.hash){const target=document.getElementById(location.hash.slice(1));if(target?.tagName==='DETAILS')target.open=true;requestAnimationFrame(()=>target?.scrollIntoView({behavior:'instant'}));}
 const navLinks=[...$('#day-nav').querySelectorAll('a')],logDays=[...document.querySelectorAll('.log-day')];let navPending=false;const updateNav=()=>{let active=logDays[0];for(const day of logDays)if(day.getBoundingClientRect().top<=140)active=day;navLinks.forEach(a=>{if(a.hash==='#'+active.id.replace('-chiangmai',''))a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});navPending=false;};window.addEventListener('scroll',()=>{if(!navPending){navPending=true;requestAnimationFrame(updateNav);}},{passive:true});updateNav();
}
window.journalReady=start();window.journalReady.catch(error=>{console.error(error);$('#hero-caption').textContent='The journal could not be loaded. Please refresh.';});
