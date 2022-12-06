import { test, expect } from '@playwright/test';

const baseUrl = 'https://a.hr.dmerej.info/';

test('home link navigate to home page', async ({ page }) => {
  await page.goto(baseUrl);

  const homeLink = page.getByRole('link', {name: 'Home'});

  await expect(homeLink).toHaveAttribute('href', '/');

  await homeLink.click();

  await expect(page).toHaveURL(baseUrl);
});
