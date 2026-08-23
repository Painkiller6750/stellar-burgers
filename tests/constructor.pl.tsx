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

    await addIngredient(page, bunName);
    await addIngredient(page, mainName);
    await addIngredient(page, sauceName);

    await expect(page.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(page.getByText(`${bunName} (низ)`)).toBeVisible();
    await expect(page.getByText(mainName).nth(1)).toBeVisible();
    await expect(page.getByText(sauceName).nth(1)).toBeVisible();
  });
  test('create the order, show its number and clean constructor', async ({
    context,
    page
  }) => {
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

    await addIngredient(page, bunName);
    await addIngredient(page, mainName);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal).toContainText(orderNumber);
    await expect(modal).toContainText('идентификатор заказа');
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();
  });

  test('open ingredient modal with clicked ingredient data then close it', async ({
    page
  }) => {
    await page.goto('/');

    await page
      .locator('li')
      .filter({ hasText: mainName })
      .getByRole('link')
      .click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Детали ингредиента');
    await expect(modal).toContainText(mainName);
    await expect(modal).toContainText('Калории, ккал');

    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();

    await page
      .locator('li')
      .filter({ hasText: bunName })
      .getByRole('link')
      .click();

    await expect(page.getByTestId('modal')).toContainText(bunName);
    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });
});
