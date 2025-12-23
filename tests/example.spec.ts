import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  
  // Check that the page loads and has a title
  await expect(page).toHaveTitle(/.+/);
  
  // Check that the page is visible
  await expect(page.locator('body')).toBeVisible();
});
