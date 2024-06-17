import { expect, test } from '@playwright/test';

test('Homepage page has a Sidebar', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('aside')).toBeVisible();
});
