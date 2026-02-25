import { test, expect } from "@playwright/test";

test("sign-in page renders login form", async ({ page }) => {
  await page.goto("/sign-in");

  await expect(
    page.getByRole("heading", { name: /login to flickzo/i })
  ).toBeVisible();

  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();

  await expect(page.getByRole("button", { name: /^login$/i })).toBeVisible();
});
