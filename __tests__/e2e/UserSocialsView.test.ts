import { expect, test } from '@playwright/test'





test.describe.configure({ mode: 'parallel' })

test('renders UserSocialsView', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('data-testid=UserSocialsView')).toBeVisible()
})

test('renders header row', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  const expected = [
    'Users',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    'Monthly',
  ]
  await expect(
    await page.locator('data-testid=UserSocialsView >> th').allTextContents(),
  ).toEqual(expected)
})

test("renders table first row", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})
  const expected = [
    'Adolph Torphy', '04:54', '00:57',
    '05:30', '01:21', '00:48',
    "04:38", "05:54", "05:57",
    '03:09', '05:01', '01:57',
    '04:45', '0', '03:53',
    '03:50', '02:58', '04:32',
    '01:08', '00:42', '03:57',
    '05:28', '00:55', '02:54',
    '02:56', '00:54', '01:31',
    '03:32', '01:55', '06:05',
    '06:10', '02:36', '100:47'
  ]

  await expect(await page.locator("data-testid=UserSocialsView >> tbody tr:visible").first().locator("td").allTextContents()).toEqual(expected)
})

test("renders pagination", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})

  await expect(await page.locator("data-testid=UserSocialsView >> .ant-pagination")).toBeVisible()
})

test("pagination next page click works correctly", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})
  let expectedSecondPageFirstRow = [
    "Brady Kozey", "05:14", "05:34",
    "03:30", "05:52", "00:53",
    "0", "04:33", "0",
    "01:04", "06:25", "04:36",
    "0", "02:51", "00:51",
    "0", "01:30", "02:41",
    "00:16", "00:53", "02:15",
    "05:10", "01:56", "04:51",
    "01:01", "00:44", "04:40",
    "03:59", "04:55", "03:40",
    "01:04", "0", "80:58",
  ]

  const paginationLocator = await page.locator("data-testid=UserSocialsView >> .ant-pagination")
  const socialsViewLocator = await page.locator("data-testid=UserSocialsView")

  await paginationLocator.locator('.ant-pagination-next').click()

  await expect(await socialsViewLocator.locator("tbody tr:visible").first().locator("td").allTextContents()).toEqual(expectedSecondPageFirstRow)
})

test("filters users on type input change", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})
  let expectedLastRow = [
    "Alvina Cormier", "05:07", "0",
    "01:01", "02:59", "02:24",
    "02:51", "02:00", "04:06",
    "06:08", "02:47", "06:09",
    "01:23", "05:21", "05:27",
    "02:59", "01:02", "05:11",
    "03:50", "01:35", "05:03",
    "02:58", "04:37", "05:08",
    "0", "0", "01:33",
    "03:38", "01:52", "0",
    "05:31", "05:56", "98:36",
  ]


  const socialsViewLocator = await page.locator("data-testid=UserSocialsView")
  await page.locator("data-testid=UserSocialsView >> data-testid=SearchInput").type('vi')

  await page.waitForTimeout(100)

  await expect(await socialsViewLocator.locator("tbody tr:visible").elementHandles()).toHaveLength(3)
  await expect(await socialsViewLocator.locator("tbody tr:visible").first().locator('td').allTextContents()).toEqual(expectedLastRow)
})

test("sort users by fullname", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})
  let expectedBeforeSort = [
    "Adolph Torphy",
    "Alanna Hintz",
    "Alex Wilderman",
    "Allie Homenick",
    "Alvah Dach",
    "Alvina Cormier",
    "Angelo Dietrich",
    "Anthony Hodkiewicz",
    "Arnold McGlynn",
    "Ashley Herman",
    "Bernardo Lynch",
    "Bernhard Wolf",
  ]

  let expectedAfterSort = [
    "Vincent Olson",
    "Vicente Streich",
    "Verda Jakubowski",
    "Uriel Jerde",
    "Tristin Pfannerstill",
    "Timmothy Schmidt",
    "Talia Okuneva",
    "Simeon Hirthe",
    "Shirley Beatty",
    "Rosemarie Blanda",
    "Roosevelt Padberg",
    "Rita Rempel",
  ]

  const socialsViewLocator = await page.locator("data-testid=UserSocialsView")
  const namesLocator = await socialsViewLocator.locator("tr:visible >> td:nth-child(1)")

  await expect(await namesLocator.allTextContents()).toEqual(expectedBeforeSort)

  await socialsViewLocator.locator("text=Users").click()
  await page.waitForTimeout(100)

  await expect(await namesLocator.allTextContents()).toEqual(expectedAfterSort)

  // Revert back to ascending order
  await socialsViewLocator.locator("text=Users").click()
  await page.waitForTimeout(100)

  await expect(await namesLocator.allTextContents()).toEqual(expectedBeforeSort)
})

test("sort users by first day", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})

  let expectedBeforeSort = [
    "04:54", "02:24", "0",
    "04:27", "0", "05:07",
    "06:18", "05:00", "0",
    "01:55", "01:24", "02:19",
  ]

  let expectedAfterSortAscending = [
    "0", "0", "0",
    "0", "0", "0",
    "00:43", "00:44", "01:02",
    "01:09", "01:10", "01:24",
  ]

  const expectedAfterSortDescending = [
    "06:27", "06:18", "06:13",
    "06:12", "06:10", "06:02",
    "06:00", "05:58", "05:39",
    "05:34", "05:31", "05:27",
  ]

  const socialsViewLocator = await page.locator("data-testid=UserSocialsView")
  const namesLocator = await socialsViewLocator.locator("tr:visible >> td:nth-child(2)")

  await expect(await namesLocator.allTextContents()).toEqual(expectedBeforeSort)

  // trigger ascending order
  await socialsViewLocator.locator("tr:visible >> th:nth-child(2)").click()
  await expect(await namesLocator.allTextContents()).toEqual(expectedAfterSortAscending)

  // trigger descending order
  await socialsViewLocator.locator("tr:visible >> th:nth-child(2)").click()
  await page.waitForTimeout(100)

  await expect(await namesLocator.allTextContents()).toEqual(expectedAfterSortDescending)

  // trigger unsorted
  await socialsViewLocator.locator("tr:visible >> th:nth-child(2)").click()
  await page.waitForTimeout(100)

  await expect(await namesLocator.allTextContents()).toEqual(expectedBeforeSort)
})

test("sort users by monthly total", async ({page}) => {
  await page.goto("/", {waitUntil: "networkidle"})

  let expectedBeforeSort = [
    "100:47",
    "93:35",
    "98:3",
    "106:18",
    "80:27",
    "98:36",
    "110:10",
    "99:12",
    "93:23",
    "86:23",
    "83:44",
    "77:7",
  ]

  let expectedAfterSortAscending = [
    '77:7',
    '77:57',
    '80:27',
    '80:58',
    '82:10',
    '82:28',
    '83:44',
    '84:23',
    '85:2',
    '86:23',
    '87:5',
    '89:6',
  ]

  const expectedAfterSortDescending = [
    '124:8',
    '116:16',
    '116:0',
    '115:39',
    '113:18',
    '113:3',
    '112:5',
    '111:25',
    '111:22',
    '110:53',
    '110:52',
    '110:17',
  ]

  const socialsViewLocator = await page.locator('data-testid=UserSocialsView')
  const namesLocator = await socialsViewLocator.locator(
    'tr:visible >> td:last-of-type',
  )

  await expect(await namesLocator.allTextContents()).toEqual(expectedBeforeSort)

  // trigger ascending order
  await socialsViewLocator.locator('tr:visible >> th:last-of-type').click()
  await expect(await namesLocator.allTextContents()).toEqual(
    expectedAfterSortAscending,
  )

  // trigger descending order
  await socialsViewLocator.locator("tr:visible >> th:last-of-type").click()
  await page.waitForTimeout(100)

  await expect(await namesLocator.allTextContents()).toEqual(expectedAfterSortDescending)

  // trigger unsorted
  await socialsViewLocator.locator("tr:visible >> th:last-of-type").click()
  await page.waitForTimeout(100)

  await expect(await namesLocator.allTextContents()).toEqual(expectedBeforeSort)
})