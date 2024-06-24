import { expect, test } from '@playwright/test';

test('User can login', async ({ page }) => {
	await page.goto('/login'); // Adjust the URL to your development server

	// Fill in the username and password
	await expect(page.locator('input[name="username"]')).toBeVisible();
	await page.fill('input[name="username"]', 'dummy');
	await expect(page.locator('input[name="password"]')).toBeVisible();
	await page.fill('input[name="password"]', 'password');

});
