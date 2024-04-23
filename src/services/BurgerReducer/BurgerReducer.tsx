import {
  createSlice,
  createAsyncThunk,
  Reducer,
  PayloadAction,
  createAction,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { error } from 'console';
import { randomUUID } from 'crypto';
import { IngredientDetails } from 'src/components/ingredient-details';
import { RootState } from 'src/services/store';

export interface ConstructorState {
  isLoading: boolean;
  ingredients: TIngredient[];
  constructorItems: any;
}

const initialState: ConstructorState = {
  isLoading: false,
  ingredients: [],
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  }
};

export const fetchBurgerData = createAsyncThunk(
  'burger/fetchBurgerData',
  async function () {
    const response = await getIngredientsApi();
    return response;
  }
);

const randomId = () => self.crypto.randomUUID();

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    // Добавление булочки
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.constructorItems.bun = { ...action.payload };
    },
    // Добавление ингредиента
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TIngredient>) => {
        if (payload.type === 'bun') {
          state.constructorItems.bun = { ...payload };
        } else {
          state.constructorItems.ingredients.push({
            ...payload
          });
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: randomId() }
      })
    },
    // Удаление ингредиента
    removeIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: { id: string }) => item.id !== payload.id
        );
    },
    clearConstructor: (state) => {
      state.constructorItems.ingredients = [];
      state.constructorItems.bun = {};
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const index = action.payload;
      if (index > 0 && index < ingredients.length) {
        const newIngredients = [...ingredients];
        [newIngredients[index], newIngredients[index - 1]] = [
          newIngredients[index - 1],
          newIngredients[index]
        ];
        state.constructorItems.ingredients = newIngredients;
      }
    },
    // Перемещение ингредиента вниз
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const { ingredients } = state.constructorItems;
      const index = action.payload;
      if (index >= 0 && index < ingredients.length - 1) {
        [ingredients[index], ingredients[index + 1]] = [
          ingredients[index + 1],
          ingredients[index]
        ];
      }
    }
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getIngredients: (state) => state.constructorItems.ingredients,
    getIngredient: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBurgerData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBurgerData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
    builder.addCase(fetchBurgerData.rejected, (state, action) => {
      state.isLoading = false;
    });
  }
});

export default burgerSlice.reducer;
export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  clearConstructor
} = burgerSlice.actions;
export const { getConstructorItems, getIngredients, getIngredient } =
  burgerSlice.selectors;
