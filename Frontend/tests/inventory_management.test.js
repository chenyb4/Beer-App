import {expect, test} from '@playwright/test';

test('Inventory management page has a Sidebar', async ({page}) => {
    await page.goto('/inventory_management');
    await expect(page.locator('aside')).toBeVisible();
});

