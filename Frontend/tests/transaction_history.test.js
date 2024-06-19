import {expect, test} from '@playwright/test';

test('Transaction history page has a Sidebar', async ({page}) => {
    await page.goto('/transaction_history');
    await expect(page.locator('aside')).toBeVisible();
});

