import { expect, test } from "@playwright/test";

test("smoke: login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /Marlie LMS/i })).toBeVisible();
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});

test("smoke: protected routes redirect to login", async ({ page }) => {
  await page.goto("/dashboard/activities");
  await expect(page).toHaveURL(/\/login/);

  await page.goto("/activity/spanish-present-tense-guide");
  await expect(page).toHaveURL(/\/login/);
});
