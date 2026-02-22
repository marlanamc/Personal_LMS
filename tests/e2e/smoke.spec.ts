// @ts-nocheck
import { expect, test } from "@playwright/test";

const TEST_USERNAME = process.env.E2E_USERNAME || "marlie";
const TEST_PASSWORD = process.env.E2E_PASSWORD || "password123";

async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill(TEST_USERNAME);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/);
}

test("smoke: login and dashboard renders", async ({ page }) => {
  await login(page);
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/Marlie LMS|Dashboard|Welcome/i).first()).toBeVisible();
});

test("smoke: spanish and coding guides open", async ({ page }) => {
  await login(page);
  await page.goto("/dashboard/activities");

  const spanishLink = page
    .locator('a[href^="/activity/"]')
    .filter({ hasText: /spanish/i })
    .first();
  await expect(spanishLink).toBeVisible();
  await spanishLink.click();
  await expect(page).toHaveURL(/\/activity\//);
  await expect(page.getByRole("main").first()).toBeVisible();

  await page.goto("/dashboard/activities");
  const codingLink = page
    .locator('a[href^="/activity/"]')
    .filter({ hasText: /coding|javascript|typescript/i })
    .first();
  await expect(codingLink).toBeVisible();
  await codingLink.click();
  await expect(page).toHaveURL(/\/activity\//);
  await expect(page.getByRole("main").first()).toBeVisible();
});
