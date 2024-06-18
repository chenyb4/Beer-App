import {expect, test} from '@playwright/test';

test('Drinks page has a Sidebar', async ({page}) => {
    await page.goto('/drinks');
    await expect(page.locator('aside')).toBeVisible();
});

