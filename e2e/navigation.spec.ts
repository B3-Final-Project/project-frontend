import { expect, test } from '@playwright/test';

test('user can log in and navigate to the profile creation page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForSelector('text=Log In', { timeout: 5000 });
  await page.click('text=Log In');

  // Wait for username input and fill it
  await page.waitForSelector('input[placeholder="Enter username"]', { timeout: 10000 });
  await page.fill('input[placeholder="Enter username"]', 'test@user.com');
  await page.keyboard.press('Enter');

  // Wait for password input and fill it
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.fill('input[type="password"]', 'ajf1DVJ*mpn_qjx@yjd');
  await page.keyboard.press('Enter');

  // Wait for redirect to main page (adjust URL as needed)
  await page.waitForURL('http://localhost:3000/', { timeout: 15000 });

  // Home
  await expect(page).toHaveURL(/localhost:3000/);

  await page.waitForTimeout(3000);

  // Wait for profile button to be visible
  await page.waitForSelector('text=Profile', { timeout: 10000 });
  // Navigate to Profile
  await page.click('text=Profile');
  await page.waitForURL('http://localhost:3000/profile/create/welcome', { timeout: 15000 });
  await expect(page).toHaveURL('/profile/create/welcome');
}); 