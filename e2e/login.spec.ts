import { test, expect } from '@playwright/test';

test('user can reach the AWS login page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForSelector('text=Log In', { timeout: 5000 });
  await page.click('text=Log In');
  // Wait for navigation to AWS login (Cognito) page
  await expect(page).toHaveURL(/amazoncognito|cognito/);
}); 