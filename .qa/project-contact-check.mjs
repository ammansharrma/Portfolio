import fs from 'node:fs';
import assert from 'node:assert/strict';
import { launch } from 'file:///C:/Users/ASUS/.codex/skills/awwwards/scripts/browser.mjs';

fs.mkdirSync('.shots/project-contact', { recursive: true });
const browser = await launch();
try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['phone', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4400/Portfolio/');
    await page.waitForTimeout(2600);
    const summary = page.locator('.project-index summary');
    await summary.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * .55));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `.shots/project-contact/${name}-projects.png` });
    await summary.click();
    assert(await page.locator('.project-index').evaluate(el => el.open));
    await summary.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.project-index').evaluate(el => el.open), false);
    await page.locator('#contact').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 85));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `.shots/project-contact/${name}-contact.png` });
    // Observe the final browser click event, then intercept the external protocol
    // so verification does not launch a desktop mail application.
    await page.evaluate(() => {
      window.mailClicks = [];
      window.addEventListener('click', event => {
        const anchor = event.target.closest('a[href^="mailto:"]');
        if (!anchor) return;
        window.mailClicks.push({ href: anchor.href, intercepted: event.defaultPrevented });
        event.preventDefault();
      });
    });
    await page.locator('#mail').click();
    await page.getByRole('link', { name: 'Email me', exact: true }).click();
    const clicks = await page.evaluate(() => window.mailClicks);
    assert.equal(clicks.length, 2);
    for (const click of clicks) {
      assert.equal(click.href, 'mailto:aamaansharrma6@gmail.com');
      assert.equal(click.intercepted, false);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ name, disclosure: 'pointer and keyboard passed', mailClicks: clicks, errors, overflow: false }));
    await page.close();
  }
} finally {
  await browser.close();
}
