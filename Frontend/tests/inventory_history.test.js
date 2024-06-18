import {expect, test} from '@playwright/test';

test('Inventory history page has a Sidebar', async ({page}) => {
    await page.goto('/inventory_history');
    await expect(page.locator('aside')).toBeVisible();
});

