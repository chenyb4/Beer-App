import {expect, test} from '@playwright/test';

test('Administration page has a Sidebar', async ({page}) => {
    await page.goto('/administration');
    await page.screenshot({ path: 'administration-page.png' });
    await expect(page.locator('aside')).toBeVisible({ timeout: 5000 });
});

