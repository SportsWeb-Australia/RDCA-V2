const {chromium}=require('playwright');const fs=require('fs');
const B='https://rdca-sportsweb-version2.vercel.app';
(async()=>{
const br=await chromium.launch();const out={};
for(const [label,vp,mobile] of [['desktop',{width:1440,height:900},false],['mobile',{width:390,height:844},true]]){
  const ctx=await br.newContext({viewport:vp,isMobile:mobile,hasTouch:mobile});
  const p=await ctx.newPage();const r={};
  await p.goto(B+'/index.html',{waitUntil:'networkidle',timeout:60000});
  r.horizontalScroll=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  r.scrollW=await p.evaluate(()=>document.documentElement.scrollWidth);
  r.innerW=await p.evaluate(()=>window.innerWidth);
  // nav + mobile menu on a shared-chrome page
  await p.goto(B+'/clubs.html',{waitUntil:'networkidle',timeout:60000});
  r.navLinks=await p.evaluate(()=>document.querySelectorAll('.nav-link').length);
  r.burgerPresent=await p.evaluate(()=>!!document.querySelector('[class*=burger],[class*=hamburger],[data-menu],.mob-toggle,[class*=mob]'));
  r.mobMenuLinks=await p.evaluate(()=>document.querySelectorAll('.mob-link').length);
  r.footerLinks=await p.evaluate(()=>document.querySelectorAll('.f-link').length);
  // keyboard focus
  r.focusable=await p.evaluate(()=>document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])').length);
  r.skipLink=await p.evaluate(()=>!!document.querySelector('a[href^="#"][class*=skip],.skip-link'));
  r.imgsNoAlt=await p.evaluate(()=>[...document.querySelectorAll('img')].filter(i=>!i.hasAttribute('alt')||i.alt.trim()==='').length);
  r.imgsTotal=await p.evaluate(()=>document.querySelectorAll('img').length);
  r.h1count=await p.evaluate(()=>document.querySelectorAll('h1').length);
  r.langAttr=await p.evaluate(()=>document.documentElement.lang||'(none)');
  r.viewportMeta=await p.evaluate(()=>{const m=document.querySelector('meta[name=viewport]');return m?m.content:'(none)'});
  // forms
  await p.goto(B+'/register.html',{waitUntil:'networkidle',timeout:60000});
  r.registerFields=await p.evaluate(()=>document.querySelectorAll('form input,form select,form textarea').length);
  r.registerAction=await p.evaluate(()=>{const f=document.querySelector('form');return f?(f.getAttribute('action')||'(none)'):'(no form)'});
  r.registerRequired=await p.evaluate(()=>document.querySelectorAll('form [required]').length);
  await p.goto(B+'/contact.html',{waitUntil:'networkidle',timeout:60000});
  r.contactAction=await p.evaluate(()=>{const f=document.querySelector('form');return f?(f.getAttribute('action')||'(none)'):'(no form)'});
  out[label]=r;await ctx.close();
}
// 404
const ctx=await br.newContext();const p=await ctx.newPage();
const resp=await p.goto(B+'/no-such-page-zzz',{timeout:30000}).catch(()=>null);
out.notFound={status:resp?resp.status():null,text:(await p.evaluate(()=>document.body.innerText).catch(()=>'')).slice(0,160)};
fs.writeFileSync('functional.json',JSON.stringify(out,null,1));
console.log(JSON.stringify(out,null,1));
await br.close();})();
