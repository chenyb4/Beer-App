import {expect, test} from '@playwright/test';
test.beforeEach(async ({  context }) => {
    await context.addCookies([
        { name: 'authToken', value: 'random', path: '/', domain: 'localhost' }
    ]);
});
test('Transaction history page has a Sidebar', async ({page}) => {
    await page.goto('/transaction_history');
    await expect(page.locator('aside')).toBeVisible();
});

