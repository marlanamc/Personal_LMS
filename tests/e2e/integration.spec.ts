import { expect, test } from "@playwright/test";

const USERNAME = process.env.E2E_USERNAME || "marlie";
const PASSWORD = process.env.E2E_PASSWORD || "password123";

test.describe("integration: auth and API wiring", () => {
  test("login to dashboard shows content", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill(USERNAME);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test("protected API returns 401 when unauthenticated", async ({ request }) => {
    const response = await request.get("/api/gamification/stats", { failOnStatusCode: false });
    expect(response.status()).toBe(401);
  });
});

test.describe("integration: activity completion to gamification", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill(USERNAME);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  });

  test("complete flashcard activity shows points toast", async ({ page }) => {
    await page.goto("/activity/spanish-vocab-greetings");
    await expect(page.getByRole("button", { name: /flip/i })).toBeVisible({ timeout: 10000 });

    const numCards = 15;
    for (let i = 0; i < numCards; i++) {
      await page.getByRole("button", { name: /flip/i }).click();
      await page.getByRole("button", { name: /next card/i }).click();
    }

    await expect(page.getByText(/\+[0-9]+\s*points!/i)).toBeVisible({ timeout: 5000 });
  });
});
