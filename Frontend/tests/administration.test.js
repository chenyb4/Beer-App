import { expect, test } from '@playwright/test';

test.beforeEach(async ({  context }) => {
    await context.addCookies([
        { name: 'authToken', value: 'random', path: '/', domain: 'localhost' }
    ]);
});

test('Administration page has a Sidebar', async ({ page }) => {
    // Navigate to the administration page
    await page.goto('/administration');

    try {
        // Check if the sidebar is visible
        await expect(page.locator('aside')).toBeVisible();
    } catch (error) {
        // Capture a screenshot if the test fails
        await page.screenshot({ path: 'screenshot.png' });
        // Re-throw the error to ensure the test still fails
        throw error;
    }
});
