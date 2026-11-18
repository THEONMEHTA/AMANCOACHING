import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('four routes and active question pass automated accessibility checks',async({page})=>{
 for(const path of ['/','/book','/privacy','/leadership-quiz']){
  await page.goto(path);
  if(path==='/leadership-quiz')await page.getByRole('button',{name:'Start my snapshot'}).click();
  const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(scan.violations.map(v=>[v.id,v.nodes.map(n=>n.target)]),path).toEqual([]);
 }
});
for(const width of [320,390,768,1024,1440])test('responsive layout at '+width,async({page})=>{
 await page.setViewportSize({width,height:844});await page.goto('/');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 for(const link of await page.locator('.hero .actions a').all()){const box=await link.boundingBox();expect(box.y+box.height).toBeLessThan(844);}
 await page.goto('/leadership-quiz');await page.getByRole('button',{name:'Start my snapshot'}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('keyboard navigation, skip, mobile menu, reduced motion and question announcements',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 await page.locator('.menu summary').focus();await page.keyboard.press('Enter');await expect(page.locator('.menu')).toHaveAttribute('open','');await page.keyboard.press('Escape');await expect(page.locator('.menu summary')).toBeFocused();
 expect(await page.locator('.portrait-frame').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await page.goto('/leadership-quiz');await page.getByRole('button',{name:'Start my snapshot'}).focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{name:/Question 1 of 15/})).toBeFocused();await page.keyboard.press('Tab');await page.keyboard.press('Space');await page.keyboard.press('ArrowRight');await page.keyboard.press('Tab');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:/Question 2 of 15/})).toBeFocused();
});
