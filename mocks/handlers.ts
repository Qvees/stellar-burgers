import {
  http, // модуль для мокирования сетевых запросов
  HttpResponse // класс ответа на запрос
} from 'msw';
import { TIngredientsResponse } from '../src/utils/burger-api';
import { TIngredient } from '../src/utils/types';

export const handlers = [
  http.get('https://norma.nomoreparties.space/api/ingredients', () =>
    HttpResponse.json([
      {
        _id: '643d69a5c3f7b9001cfa0941',
        name: 'Биокотлета из марсианской Магнолии',
        type: 'main',
        proteins: 100,
        fat: 150,
        carbohydrates: 50,
        calories: 200,
        price: 100,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 15,
        carbohydrates: 5,
        calories: 20,
        price: 10,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        _id: '643d69a5c3f7b9001cfa0943',
        name: 'Соус фирменный Space Sauce',
        type: 'sauce',
        proteins: 50,
        fat: 22,
        carbohydrates: 11,
        calories: 14,
        price: 80,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ])
  )
];
