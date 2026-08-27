import ingredientsReducer, { fetchIngredients } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  }
];

describe('ingredients reducer', () => {
  test('return init state for any unknown action and undefined state', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
  });

  test('process fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('requestId')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });
  test('process fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(new Error('Network error'), 'requestId')
    );

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Network error'
    });
  });
  test('process fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      {
        ingredients: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled(mockIngredients, 'requestId')
    );

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });
});
