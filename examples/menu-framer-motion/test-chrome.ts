import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { test } from "../test-utils.ts";

const getMenuButton = (page: Page) =>
  page.getByRole("button", { name: "Options" });

const getMenu = (page: Page) => page.getByRole("menu");

test("show/hide with click", async ({ page }) => {
  test.info().snapshotSuffix = "";
  await page.setViewportSize({ width: 480, height: 480 });
  await expect(getMenu(page)).not.toBeVisible();
  await getMenuButton(page).click();
  await expect(getMenu(page)).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(500);
  expect(await page.screenshot()).toMatchSnapshot();
});
