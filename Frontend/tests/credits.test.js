import {expect, test} from '@playwright/test';

test('Credits page has a Sidebar', async ({page}) => {
    await page.goto('/credits');
    await expect(page.locator('aside')).toBeVisible();
});

