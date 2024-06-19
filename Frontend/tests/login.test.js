import {expect, test} from '@playwright/test';

test('Login page has not a Sidebar', async ({page}) => {
    await page.goto('/login');
    await expect(page.locator('aside')).not.toBeVisible();
});

