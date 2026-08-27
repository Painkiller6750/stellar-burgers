import { expect, Page, test } from '@playwright/test';
import path from 'path';

const harPath = path.join(__dirname, 'hars/api.har');

const bunName = 'Краторная булка N-200i';
const mainName = 'Биокотлета из марсианской Магнолии';
const sauceName = 'Соус Spicy-X';
const orderNumber = '123456';

const addIngredient = async (page: Page, name: string) => {
  await page
    .locator('li')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();
};

test.describe('constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(harPath, { url: '**/api/**' });
  });

  test('add bun and filling from ingredients list to constructor', async ({
    page
  }) => {
    await page.goto('/');

    const constructorArea = page.getByTestId('constructor-area');
    const modal = page.getByTestId('modal');

    // 1. Сheck init state: the constructor is empty (placeholders are shown), modal is closed
    await expect(modal).toHaveCount(0);
    await expect(
      constructorArea.getByTestId('placeholder-bun-top')
    ).toBeVisible();
    await expect(
      constructorArea.getByTestId('placeholder-bun-bottom')
    ).toBeVisible();
    await expect(
      constructorArea.getByTestId('placeholder-filling')
    ).toBeVisible();

    // 2. add ingredients
    await addIngredient(page, bunName);
    await addIngredient(page, mainName);
    await addIngredient(page, sauceName);

    // 3. Check that the ingredients have appeared in the constructor
    await expect(constructorArea.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(constructorArea.getByText(`${bunName} (низ)`)).toBeVisible();
    await expect(constructorArea.getByText(mainName)).toBeVisible();
    await expect(constructorArea.getByText(sauceName)).toBeVisible();
  });

  test('create the order, show its number and clean constructor', async ({
    context,
    page
  }) => {
    // Auth (mock)
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer mockAccessToken',
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mockRefreshToken');
    });

    await page.goto('/');

    const constructorArea = page.getByTestId('constructor-area');
    const modal = page.getByTestId('modal');
    const modalOverlay = page.getByTestId('modal-overlay');

    // Init state: modal is closed, placeholders are here
    await expect(modal).toHaveCount(0);
    await expect(
      constructorArea.getByTestId('placeholder-bun-top')
    ).toBeVisible();
    await expect(
      constructorArea.getByTestId('placeholder-bun-bottom')
    ).toBeVisible();
    await expect(
      constructorArea.getByTestId('placeholder-filling')
    ).toBeVisible();

    // Create a burger
    await addIngredient(page, bunName);
    await addIngredient(page, mainName);

    // order it
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // The modal has appeared with the order number
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(orderNumber);
    await expect(modal).toContainText('идентификатор заказа');

    // After the order the constructor is empty (+smth is visible again)
    await expect(
      constructorArea.getByTestId('placeholder-bun-top')
    ).toBeVisible();
    await expect(
      constructorArea.getByTestId('placeholder-bun-bottom')
    ).toBeVisible();
    await expect(
      constructorArea.getByTestId('placeholder-filling')
    ).toBeVisible();

    // Close the modal
    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();
  });

  test('open ingredient modal with clicked ingredient data then close it', async ({
    page
  }) => {
    await page.goto('/');

    const modal = page.getByTestId('modal');
    const modalOverlay = page.getByTestId('modal-overlay');

    // Init state -modal is closed
    await expect(modal).toHaveCount(0);

    // Open modal by ingredients link
    await page
      .locator('li')
      .filter({ hasText: mainName })
      .getByRole('link')
      .click();

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Детали ингредиента');
    await expect(modal).toContainText(mainName);
    await expect(modal).toContainText('Калории, ккал');

    // Close using btn
    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();

    // Open and close using overlay again
    await page
      .locator('li')
      .filter({ hasText: bunName })
      .getByRole('link')
      .click();

    await expect(modal).toBeVisible();
    await expect(modal).toContainText(bunName);

    await modalOverlay.click({ position: { x: 10, y: 10 } });
    await expect(modal).not.toBeVisible();
  });
});
