import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '../../utils-types';

interface ConstructorState {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
    orderRequest: boolean;
    orderModalData: TOrder | null;
}

const initialState: ConstructorState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
};

const constructorSlice = createSlice({
    name: 'constructor',
    initialState,
    reducers: {
        addBun: (state, action: { payload: TConstructorIngredient }) => {
            state.bun = action.payload;
        },
        removeBun: (state) => {
            state.bun = null;
        },
        addIngredient: (state, action: { payload: TConstructorIngredient }) => {
            state.ingredients.push(action.payload);
        },
        removeIngredientAt: (state, action: { payload: number }) => {
            state.ingredients.splice(action.payload, 1);
        },
        moveIngredientUp: (state, action: { payload: number }) => {
            const index = action.payload;
            if (index > 0) {
                [state.ingredients[index], state.ingredients[index - 1]] =
                    [state.ingredients[index - 1], state.ingredients[index]];
            }
        },
        moveIngredientDown: (state, action: { payload: number }) => {
            const index = action.payload;
            if (index < state.ingredients.length - 1) {
                [state.ingredients[index], state.ingredients[index + 1]] =
                    [state.ingredients[index + 1], state.ingredients[index]];
            }
        },
        setOrderRequest: (state, action: { payload: boolean }) => {
            state.orderRequest = action.payload;
        },
        setOrderModalData: (state, action: { payload: TOrder | null }) => {
            state.orderModalData = action.payload;
        },
    },
});

export default constructorSlice.reducer;
export const {
    addBun,
    removeBun,
    addIngredient,
    removeIngredientAt,
    moveIngredientUp,
    moveIngredientDown,
    setOrderRequest,
    setOrderModalData,
} = constructorSlice.actions;
