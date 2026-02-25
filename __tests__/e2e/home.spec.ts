import { test, expect } from "@playwright/test";

test("home page shows hero heading and CTA", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /architect cinematic stories with ai/i,
    })
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /create your first video/i })
  ).toBeVisible();
});
