import { expect, test } from '@playwright/test';

test('Administration page has a Sidebar', async ({ page }) => {
	await page.goto('/administration');
	await expect(page.getByRole('navigation')).toBeVisible();
});
