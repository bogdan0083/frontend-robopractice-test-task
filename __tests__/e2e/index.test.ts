import {expect, test} from "@playwright/test"

// test.describe.configure({ mode: "parallel" })

test("renders frontpage", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})
  await expect(page).toHaveTitle(/redmadrobot frontend challenge/gi);
});

test("renders main heading", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})
  await expect(page.locator("h1")).toHaveText(/redmadrobot frontend challenge/gi);
});
