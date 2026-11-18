import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function completeQuiz(page, indexes = [2, 2, 1, 2, 3, 0]) {
  await page.getByRole('button', { name: 'Start my snapshot' }).click();
  for (let i = 0; i < 6; i++) {
    await expect(page.getByRole('button', { name: i === 5 ? 'Get my report' : 'Next question', exact: false })).toBeDisabled();
    await page.getByRole('radio').nth(indexes[i]).check();
    await page.getByRole('button', { name: i === 5 ? 'Get my report' : 'Next question', exact: false }).click();
  }
}
async function stubForms(page, handler) {
  await page.route('http://127.0.0.1:5173/api/leads', route => route.request().method() === 'POST' ? handler(route) : route.continue());
}

test('six questions, no-email report, PDF download and retake work end to end', async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/'); await completeQuiz(page);
  await page.getByRole('button', { name: 'View without sharing details' }).click();
  await expect(page.getByRole('heading', { name: 'Create more ownership in your team', exact: true })).toBeVisible();
  await expect(page.getByText('Your details have not been submitted.', { exact: false })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my report' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('aman-leadership-snapshot.pdf');
  expect((await readFile(await file.path())).subarray(0, 4).toString()).toBe('%PDF');
  await page.getByRole('button', { name: 'Retake the quiz' }).click();
  await expect(page.getByText('Question 1 of 6', { exact: true })).toBeVisible();
  await expect(page.getByRole('radio').first()).not.toBeChecked();
  expect(errors).toEqual([]);
});

test('lead submission is explicit, optional marketing defaults off and payload is correct', async ({ page }) => {
  const submissions = [];
  await stubForms(page, route => { submissions.push(new URLSearchParams(JSON.parse(route.request().postData()))); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ok:true,emailSent:false}) }); });
  await page.goto('/'); await completeQuiz(page);
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.getByLabel('Your name', { exact: true }).first().fill('QA Visitor');
  await page.getByLabel('Email address', { exact: true }).first().fill('qa@visitor.invalid');
  await page.getByRole('button', { name: 'Get my report', exact: false }).click();
  await expect(page.getByText('Your details have been saved privately.', { exact: false })).toBeVisible();
  expect(submissions).toHaveLength(1);
  expect(submissions[0].get('form-name')).toBe('leadership-snapshot');
  expect(submissions[0].get('email')).toBe('qa@visitor.invalid');
  expect(submissions[0].get('marketing-consent')).toBe('no');
  expect(submissions[0].get('focus')).toBe('Delegation & ownership');
  expect(JSON.parse(submissions[0].get('answers')).delegation).toBe(3);
});

test('failed submission preserves the form and leaves report access available', async ({ page }) => {
  await stubForms(page, route => route.fulfill({ status: 503, body: 'Test fixture: unavailable' }));
  await page.goto('/'); await completeQuiz(page);
  await page.getByLabel('Your name', { exact: true }).first().fill('QA Visitor');
  await page.getByLabel('Email address', { exact: true }).first().fill('qa@visitor.invalid');
  await page.getByRole('button', { name: 'Get my report', exact: false }).click();
  await expect(page.locator('#lead-status')).toContainText('could not save');
  await expect(page.locator('#lead-name')).toHaveValue('QA Visitor');
  await page.getByRole('button', { name: 'View without sharing details' }).click();
  await expect(page.getByRole('button', { name: 'Download my report' })).toBeVisible();
});

test('back navigation retains responses and privacy dialog supports escape', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start my snapshot' }).click();
  await page.getByRole('radio').nth(2).check(); await page.getByRole('button', { name: 'Next question' }).click();
  await page.getByRole('button', { name: '← Back', exact: true }).click();
  await expect(page.getByRole('radio').nth(2)).toBeChecked();
  await page.getByRole('button', { name: 'Privacy & your data', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible(); await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('discovery request posts correct form and confirms request without claiming a booking', async ({ page }) => {
  let payload;
  await stubForms(page, route => { payload = new URLSearchParams(JSON.parse(route.request().postData())); return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ok:true,emailSent:false}) }); });
  await page.goto('/#contact');
  await page.locator('#contact-name').fill('QA Visitor'); await page.locator('#contact-email').fill('qa@visitor.invalid');
  await page.locator('#contact-message').fill('A test enquiry for the automated test fixture only.');
  await page.locator('#contact-form button[type="submit"]').click();
  await expect(page.locator('#contact-status')).toContainText('call is not yet booked');
  expect(payload.get('form-name')).toBe('discovery-request');
});

for (const width of [320, 390, 768, 820, 1024, 1440]) {
  test(`responsive layout and quiz report fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 1000 ? 900 : 1024 });
    await page.goto('/'); await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const menu = page.locator('.nav__toggle');
    if (await menu.isVisible()) { const box = await menu.boundingBox(); expect(box.x + box.width).toBeLessThanOrEqual(width); }
    const images = await page.locator('main img').evaluateAll(images => images.map(img => ({ complete: img.complete, width: img.naturalWidth })));
    expect(images.every(i => i.complete && i.width > 0)).toBe(true);
    await completeQuiz(page); await page.getByRole('button', { name: 'View without sharing details' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Download my report' })).toBeVisible();
  });
}

test('deployed content-security policy permits the quiz and PDF download', async ({ page }) => {
  const { readFile } = await import('node:fs/promises');
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  const policy = config.headers[0].headers.find(header => header.key === 'Content-Security-Policy').value;
  await page.route('http://127.0.0.1:5173/', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), 'Content-Security-Policy': policy } });
  });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/'); await completeQuiz(page);
  await page.getByRole('button', { name: 'View without sharing details' }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download my report' }).click();
  expect((await downloaded).suggestedFilename()).toBe('aman-leadership-snapshot.pdf');
  expect(errors).toEqual([]);
});
