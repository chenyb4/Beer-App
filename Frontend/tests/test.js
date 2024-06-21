import { expect, test } from '@playwright/test';
test.beforeEach(async ({  context }) => {
	await context.addCookies([
		{ name: 'authToken', value: 'random', path: '/', domain: 'localhost' }
	]);
});

test('Homepage page has a Sidebar', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('aside')).toBeVisible();
});

test('Redirect to login', async ({page,context}) => {
	await context.addCookies([
		{ name: 'authToken', value: '', path: '/', domain: 'localhost' }
	]);
	await page.goto('/');
	await expect(page).toHaveURL('http://localhost:4173/login?status=302');
});