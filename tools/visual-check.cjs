'use strict';
// Existing Chrome only. Isolated project profile, local page requests only, no installs.
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const output = path.join(root,'preview','browser-'+new Date().toISOString().replace(/[:.]/g,'-'));
const previewRoot = path.resolve(process.argv[2] || 'preview/2026-09-16T08-37-46-758Z');
const baseURL = 'http://127.0.0.1:' + Number(process.argv[3] || 4000);
const browser = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const delay = ms => new Promise(resolve => setTimeout(resolve,ms));
async function main() {
  assert(fs.existsSync(browser),'Existing Chrome is required; no downloads permitted');
  fs.mkdirSync(output,{recursive:true});
  const profile = path.join(output,'profile'); fs.mkdirSync(profile);
  const child = spawn(browser,[
    '--headless=new','--disable-gpu','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1',
    '--user-data-dir='+profile,'--disk-cache-dir='+path.join(output,'cache'),'--crash-dumps-dir='+path.join(output,'crashes'),
    '--disable-breakpad','--disable-crash-reporter','--no-first-run','--no-default-browser-check',
    '--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions',
    '--disable-features=OptimizationHints,MediaRouter,AutofillServerCommunication','--enable-logging=stderr',
    'about:blank'
  ],{windowsHide:true,env:{...process.env,TEMP:output,TMP:output},stdio:['ignore','ignore','pipe']});
  let socket;
  try {
    const endpoint = await new Promise((resolve,reject) => {
      let stderr = ''; const timer = setTimeout(() => reject(new Error('Chrome startup timeout')),15000);
      child.on('error',error => {clearTimeout(timer);reject(error);});
      child.stderr.on('data',data => { stderr += data; const m = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/); if(m){clearTimeout(timer);resolve(m[1]);} });
    });
    socket = new WebSocket(endpoint);
    await new Promise((resolve,reject) => {socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
    let counter = 0; const pending = new Map(); const errors = []; const blocked = new Set();
    function send(method,params={},sessionId) { return new Promise((resolve,reject) => {const id=++counter;const timer=setTimeout(() => {pending.delete(id);reject(new Error('CDP timeout: '+method));},15000);pending.set(id,{resolve,reject,timer});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));}); }
    socket.addEventListener('message',async e => {
      const data = JSON.parse(e.data);
      if(data.id && pending.has(data.id)){const p=pending.get(data.id);clearTimeout(p.timer);pending.delete(data.id);data.error?p.reject(new Error(JSON.stringify(data.error))):p.resolve(data.result);}
      if(data.method==='Runtime.exceptionThrown') errors.push(data.params.exceptionDetails.text+' '+(data.params.exceptionDetails.exception?.description||''));
      if(data.method==='Fetch.requestPaused') {
        const url=data.params.request.url;
        const local=url.startsWith(baseURL+'/')||url.startsWith('data:');
        if(!local)blocked.add(url);
        try{await send(local?'Fetch.continueRequest':'Fetch.failRequest',{requestId:data.params.requestId,...(!local?{errorReason:'BlockedByClient'}:{})},data.sessionId);}catch(_){}
      }
    });
    const {targetId}=await send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
    const cdp=(method,params) => send(method,params,sessionId);
    await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Fetch.enable',{patterns:[{urlPattern:'*'}]});
    async function evaluate(expression){const result=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;}
    const pages=[['home','/',1440,1000],['home-mobile','/',390,844],['resume','/about/',1440,1100],['study','/study/',1440,1000]];
    assert(previewRoot.startsWith(path.join(root,'preview')+path.sep));
    const index=JSON.parse(fs.readFileSync(path.join(previewRoot,'content-index.json'),'utf8'));
    const articleURL=index.posts.find(p=>p.title.includes('一个RAG系统的完整')).url;
    pages.push(['article',articleURL,1440,1000],['article-mobile',articleURL,390,844],['resume-mobile','/about/',390,844]);
    const checks=[];
    for(const [name,route,width,height] of pages){
      await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<500});
      await cdp('Page.navigate',{url:baseURL+route});await delay(1000);
      const check=await evaluate(`({theme:document.documentElement.dataset.theme,type:document.documentElement.dataset.gfPage,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,nav:document.querySelectorAll('.gf-nav').length})`);
      assert.equal(check.nav,1);assert(check.scrollWidth<=check.width+1,'Horizontal overflow: '+name);checks.push({name,...check});
      if(name==='home')assert(await evaluate(`document.querySelector('.gf-home').getBoundingClientRect().width>=innerWidth-10`),'Homepage must be full width');
      if(name==='article')assert(await evaluate(`getComputedStyle(document.getElementById('aside-content')).display!=='none'`),'Desktop article TOC must be visible');
      if(name==='article-mobile')assert(await evaluate(`getComputedStyle(document.querySelector('.gf-mobile-toc')).display!=='none'`),'Mobile article TOC must be visible');
      if(name==='home-mobile'){
        await evaluate(`document.querySelector('.gf-menu').click()`);
        assert(await evaluate(`document.querySelector('.gf-menu').getAttribute('aria-expanded')==='true'`));
        await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
        assert(await evaluate(`document.querySelector('.gf-menu').getAttribute('aria-expanded')==='false'`));
      }
      const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(shot.data,'base64'),{flag:'wx'});
      if(name==='resume'||name==='study'){
        const prefix=name==='resume'?'about':'study';
        assert(await evaluate(`Math.abs(document.querySelector('.gf-content-landscape').getBoundingClientRect().height-innerHeight)<2`),'Page background fills viewport');
        assert((await evaluate(`getComputedStyle(document.querySelector('.gf-content-landscape')).backgroundImage`)).includes(prefix+'-light-v1.jpg'));
        await evaluate(`gfTheme.set('dark')`);
        await delay(350);
        assert((await evaluate(`getComputedStyle(document.querySelector('.gf-content-landscape')).backgroundImage`)).includes(prefix+'-dark-v1.jpg'));
        const dark=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,name+'-dark.png'),Buffer.from(dark.data,'base64'),{flag:'wx'});
        await evaluate(`gfTheme.set('auto')`);
      }
    }
    // Real-browser search, theme override and PJAX navigation.
    await evaluate(`document.querySelector('[data-search]').click();document.querySelector('#gf-query').value='RAG';document.querySelector('#gf-query').dispatchEvent(new Event('input'));`);await delay(500);
    assert(await evaluate(`document.querySelectorAll('.gf-search-item').length>0`),'Search must return results');
    await evaluate(`document.querySelector('[data-close-search]').click();gfTheme.set('dark');`);
    assert.equal(await evaluate(`document.documentElement.dataset.theme`),'dark');
    await evaluate(`gfTheme.set('auto');window.pjax.loadUrl('/');`);await delay(1000);
    assert.equal(await evaluate(`document.documentElement.dataset.theme`),'light');
    await evaluate(`window.pjax.loadUrl('/about/');`);await delay(1000);
    assert.equal(await evaluate(`document.documentElement.dataset.theme`),'light');
    assert.equal(await evaluate(`document.querySelectorAll('.gf-nav').length`),1);
    await evaluate(`window.pjax.loadUrl('/')`);await delay(600);
    assert.equal(await evaluate(`document.querySelectorAll('.gf-brand').length`),0);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('#content-inner')).animationName`),'none');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.gf-project')).backdropFilter`),'none');
    assert(await evaluate(`Math.abs(document.querySelector('.gf-landscape').getBoundingClientRect().height-innerHeight)<2`),'Landscape stays viewport-sized');
    await evaluate(`window.dispatchEvent(new Event('scroll'))`);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.gf-mist')).animationPlayState`),'paused');
    await delay(250);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.gf-mist')).animationPlayState`),'running');
    assert(await evaluate(`document.querySelector('.gf-nav').getBoundingClientRect().width<1000`));
    const motionStart=await evaluate(`getComputedStyle(document.querySelector('.gf-mist')).transform`);await delay(1200);
    assert.notEqual(await evaluate(`getComputedStyle(document.querySelector('.gf-mist')).transform`),motionStart,'Clouds should actually move');
    assert.equal(await evaluate(`document.querySelector('[data-motion]').textContent`),'动态：开');
    await evaluate(`gfTheme.set('light')`);
    assert((await evaluate(`getComputedStyle(document.querySelector('.gf-landscape')).backgroundImage`)).includes('morning-shanshui-v2.jpg'));
    const lightShot = await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(output,'home-light.png'),Buffer.from(lightShot.data,'base64'),{flag:'wx'});
    await evaluate(`gfTheme.set('dark')`);
    assert.equal(await evaluate(`document.querySelectorAll('.gf-light-cycle,.gf-motion-settings,.gf-mist svg').length`),0,'Rejected scene layers are absent');
    await evaluate(`document.querySelector('[data-motion]').click()`);
    assert.equal(await evaluate(`document.querySelector('[data-motion]').textContent`),'动态：关');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.gf-mist')).animationPlayState`),'paused');
    await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await evaluate(`document.querySelector('[data-motion]').click();gfTheme.set('dark');window.pjax.loadUrl(${JSON.stringify(index.posts.find(p=>p.title.startsWith('001.')).url)})`);await delay(800);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('#card-toc .toc-content')).scrollbarWidth`),'none');
    assert.equal(await evaluate(`getComputedStyle(document.documentElement).scrollbarColor`),'rgb(255, 255, 255) rgba(0, 0, 0, 0)');
    assert(await evaluate(`document.querySelectorAll('.gf-reading-card').length>0`));
    await evaluate(`document.querySelector('.gf-related').scrollIntoView({block:'center',behavior:'instant'})`);await delay(250);
    const darkShot=await cdp('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,'dark-reading-footer.png'),Buffer.from(darkShot.data,'base64'),{flag:'wx'});
    await evaluate(`gfTheme.set('auto')`);
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await evaluate(`window.pjax.loadUrl('/')`);await delay(1000);
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('.gf-mist')).animationName`),'none');
    const report={output,checks,errors,blockedExternalRequests:[...blocked],search:true,pjax:true};
    fs.writeFileSync(path.join(output,'browser-report.json'),JSON.stringify(report,null,2),{flag:'wx'});console.log(JSON.stringify(report));
    assert.equal(errors.length,0,'Browser script errors');
  } finally {if(socket){try{socket.send(JSON.stringify({id:999999,method:'Browser.close'}));}catch(_){}socket.close();}child.kill();}
}
main().catch(error => {console.error(error);process.exitCode=1;});
