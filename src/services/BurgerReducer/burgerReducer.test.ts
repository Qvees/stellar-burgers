import { describe, expect, it } from '@jest/globals';
import burgerReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  initialState
} from './BurgerReducer';

// id который дается рандомно при добавление заказа в конструктор
let id: string | null = null;

describe('burgerReducer', () => {

  it('проверяем добвление ингредиента в конструктор', () => {
    const ingredient = {
      _id: '123',
      name: 'котлета',
      type: 'main',
      price: 1.5,
      proteins: 10,
      fat: 15,
      carbohydrates: 20,
      calories: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    };
    const nextState = burgerReducer(initialState, addIngredient(ingredient));
    id = nextState.constructorItems.ingredients[0]?.id;
    expect(nextState.constructorItems.ingredients).toContainEqual(
      expect.objectContaining({ _id: '123' })
    );
  });

  it('проверяем удаление ингредиента из конструктора', () => {
    const ingredientToRemove = {
      id: id!,
      _id: '123',
      name: 'котлета',
      type: 'main',
      proteins: 10,
      fat: 15,
      price: 100,
      carbohydrates: 20,
      calories: 100,
      image: '',
      image_large: '',
      image_mobile: ''
    };
    const stateWithIngredient = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [ingredientToRemove]
      }
    };
    const nextState = burgerReducer(
      stateWithIngredient,
      removeIngredient({
        id: id!,
        _id: '123',
        name: 'котлета',
        type: 'main',
        proteins: 10,
        fat: 15,
        price: 100,
        carbohydrates: 20,
        calories: 100,
        image: '',
        image_large: '',
        image_mobile: ''
      })
    );
    expect(nextState.constructorItems.ingredients).not.toContainEqual([
      ingredientToRemove
    ]);
  });

  it('перемещение ингредиента вверх', () => {
    const ingredients = [
      { id: '1', name: 'котлета', type: 'main', price: 50 },
      { id: '2', name: 'сыр', type: 'main', price: 10 },
      { id: '3', name: 'соус', type: 'souce', price: 1.5 }
    ];
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients
      }
    };
    const nextState = burgerReducer(stateWithIngredients, moveIngredientUp(1)); // перемещаем вверх второй ингредиент
    expect(nextState.constructorItems.ingredients[0]).toEqual(ingredients[1]); // второй ингредиент должен стать первым
    expect(nextState.constructorItems.ingredients[1]).toEqual(ingredients[0]); // первый ингредиент должен стать вторым
    expect(nextState.constructorItems.ingredients[2]).toEqual(ingredients[2]); // третий ингредиент должен остаться на своем месте
  });

  it('перемещение ингредиента вниз', () => {
    const ingredients = [
      { id: '1', name: 'котлета', type: 'main', price: 50 },
      { id: '2', name: 'сыр', type: 'main', price: 10 },
      { id: '3', name: 'соус', type: 'souce', price: 1.5 }
    ];
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients
      }
    };
    const nextState = burgerReducer(
      stateWithIngredients,
      moveIngredientDown(0) // перемещаем первый ингредиент вниз
    );
    expect(nextState.constructorItems.ingredients[0]).toEqual(ingredients[1]); // первый ингредиент должен стать вторым
    expect(nextState.constructorItems.ingredients[1]).toEqual(ingredients[0]); // второй ингредиент должен стать первым
    expect(nextState.constructorItems.ingredients[2]).toEqual(ingredients[2]); // Третий ингредиент должен остаться на своем месте
  });
});
