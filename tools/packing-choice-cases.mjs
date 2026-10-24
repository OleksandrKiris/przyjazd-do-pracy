import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';

// Runs only inside the caller's authorized Actions-owned browser/origin fixture.
export async function packingChoiceCases({browserContext,url,output,report,installed,exactCache,config}) {
  assert.equal(process.env.GITHUB_ACTIONS,'true');
  const labels=JSON.parse(await readFile(new URL('./fixtures/packing-choice.json',import.meta.url),'utf8'));
  assert.deepEqual(Object.keys(labels).sort(),Object.keys(config.languages).sort());
  report.packingChoiceResults=[];report.packingChoiceCaptures=[];
  async function capture(page,width,lang,mode) {
    const target=page.locator('.packing-choice');await target.scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>{const r=document.querySelector('.packing-choice').getBoundingClientRect(),key=[scrollX,scrollY,r.x,r.y,r.width,r.height].map(n=>Math.round(n*100)/100).join(':');if(window.__packingShot?.key!==key)window.__packingShot={key,since:performance.now()};return performance.now()-window.__packingShot.since>180;},null,{polling:'raf',timeout:3000});
    const measure=()=>page.evaluate(()=>{const r=document.querySelector('.packing-choice').getBoundingClientRect(),help=document.getElementById('packingChoiceHelp')?.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:help?Math.max(r.bottom,help.bottom):r.bottom,scrollX,scrollY};});
    const before=await measure(),vp=page.viewportSize(),clip={x:Math.floor(before.left)-6,y:Math.floor(before.top)-6,width:Math.ceil(before.right)-Math.floor(before.left)+12,height:Math.ceil(before.bottom)-Math.floor(before.top)+12};
    assert(clip.x>=0&&clip.y>=0&&clip.x+clip.width<=vp.width&&clip.y+clip.height<=vp.height,'Entire chooser/focus/help must fit');
    const file=`packing-choice-${width}-${lang}-${mode}.png`,bytes=await page.screenshot({clip}),after=await measure();assert(Object.keys(before).every(k=>Math.abs(before[k]-after[k])<0.1),'Chooser moved during capture');await writeFile(join(output,file),bytes);report.packingChoiceCaptures.push({width,lang,mode,file,before,after,clip,stable:true});
  }
  for(const width of [320,1280]) for(const lang of Object.keys(labels)) {
    const {ctx,blocked}=await browserContext(width),page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    try {
      await page.goto(url+`?lang=${lang}&location=ryczywol&pack=choose`);
      const select=page.locator('#packingChoice'),expected=labels[lang];await select.waitFor();
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      assert.deepEqual(await select.locator('option').allTextContents(),expected.slice(1,6));
      assert.equal(await page.locator('label[for="packingChoice"]').innerText(),expected[0]);assert.equal(await page.locator('#packingChoiceHint').innerText(),expected[6]);
      assert.equal(await select.getAttribute('aria-describedby'),'packingChoiceHint');assert.equal(await select.inputValue(),'');assert.equal(await page.locator('.packing-list input').count(),0);
      await page.evaluate(()=>document.fonts.ready);await select.scrollIntoViewIfNeeded();await select.focus();
      await page.waitForFunction(()=>{const n=document.getElementById('packingChoice'),s=getComputedStyle(n);return document.activeElement===n&&s.outlineWidth==='3px'&&s.outlineStyle==='solid'&&s.outlineOffset==='2px';},null,{polling:'raf',timeout:3000});
      const focus=await select.evaluate(n=>{const s=getComputedStyle(n);return {active:document.activeElement===n,width:s.outlineWidth,style:s.outlineStyle,offset:s.outlineOffset};});assert.deepEqual(focus,{active:true,width:'3px',style:'solid',offset:'2px'});
      await capture(page,width,lang,'choose');
      // Actual native select keyboard interaction, followed by checkbox Tab/Space.
      await select.press('ArrowDown');await page.waitForFunction(()=>document.getElementById('packingChoice').value==='ukraine');assert.equal(await select.evaluate(n=>n===document.activeElement),true);
      assert.equal(new URL(page.url()).searchParams.get('pack'),'ukraine');await select.press('Tab');assert.equal(await page.locator('.packing-list input').first().evaluate(n=>n===document.activeElement),true);await page.keyboard.press('Space');assert.equal(await page.locator('.packing-list input').first().isChecked(),true);await select.focus();await capture(page,width,lang,'ukraine');
      for(const key of ['poland','caucasus']) {
        await select.selectOption(key);assert.equal(await select.evaluate(n=>n===document.activeElement),true);
        assert.equal(await page.locator('.packing-list input').count(),config.packs[key].en.length);assert.equal(await page.locator('.packing-list input').first().isChecked(),false);
        await page.locator('.packing-list input').first().check();await select.focus();await capture(page,width,lang,key);
      }
      const saved=await page.evaluate(()=>localStorage.getItem('primserv.arrival.packing.v1'));
      await select.selectOption('other');assert.equal(await page.locator('.packing-list input').count(),0);assert.equal(await page.locator('#packingChoiceHelp').innerText(),expected[7]);assert.equal(await page.evaluate(()=>localStorage.getItem('primserv.arrival.packing.v1')),saved);await capture(page,width,lang,'other');
      await select.selectOption('ukraine');assert.equal(await page.locator('.packing-list input').first().isChecked(),true);
      const away=lang==='en'?'ru':'en';await page.locator('#topLanguageSelect').selectOption(away);await page.locator('#topLanguageSelect').selectOption(lang);assert.equal(await select.inputValue(),'ukraine');assert.equal(await page.locator('.packing-list input').first().isChecked(),true);
      await page.locator('[data-location="bogatynia"]').click();assert.equal(await select.inputValue(),'ukraine');assert.equal(await page.locator('.packing-list input').first().isChecked(),true);
      await page.reload();await select.waitFor();assert.equal(await select.inputValue(),'ukraine');assert.equal(await page.locator('.packing-list input').first().isChecked(),true);assert.equal(await page.evaluate(()=>localStorage.getItem('primserv.arrival.packing.v1')),saved);
      await installed(page);const cache=await exactCache(page);await ctx.setOffline(true);await page.reload();await select.waitFor();assert.equal(await page.locator('html').getAttribute('lang'),lang);assert.equal(await select.inputValue(),'ukraine');
      for(const key of ['poland','caucasus','ukraine']) {await select.selectOption(key);assert.equal(await page.locator('.packing-list input').first().isChecked(),true);}
      await select.selectOption('other');assert.equal(await page.locator('#packingChoiceHelp').innerText(),expected[7]);await select.selectOption('');assert.equal(await page.locator('.packing-list input').count(),0);assert.equal(new URL(page.url()).searchParams.get('pack'),'choose');
      assert.equal(await page.evaluate(()=>localStorage.getItem('primserv.arrival.packing.v1')),saved);
      const storage=JSON.parse(saved);assert.deepEqual(Object.keys(storage).sort(),['lists','version']);assert.deepEqual(Object.keys(storage.lists).sort(),['caucasus','poland','ukraine']);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);assert.deepEqual(blocked,[]);assert.deepEqual(errors,[]);
      report.packingChoiceResults.push({width,lang,status:'passed',variants:5,actualKeyboardSelectAndCheckbox:true,focusRestored:true,separateMarksAllThree:true,otherDoesNotInventList:true,languageLocationReloadPreserved:true,offlineAllChoicesAndMarks:true,exactCacheEntries:cache.length,choiceNotStoredWithMarks:true,noDelivery:true});
    }catch(e){await page.screenshot({path:join(output,`failure-packing-choice-${width}-${lang}.png`)}).catch(()=>{});throw e;}finally{await ctx.close();}
  }
  assert.equal(report.packingChoiceResults.length,18);assert.equal(report.packingChoiceCaptures.length,90);
}
