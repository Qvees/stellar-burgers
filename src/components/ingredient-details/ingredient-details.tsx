import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import {
  getIngredient,
  getConstructorItems,
  getIngredients
} from '../Reducers/BurgerReducer/BurgerReducer';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { RootState } from 'src/services/store';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const ingredients = useSelector(getIngredient);
  const { id } = useParams();

  const ingredientData = ingredients.find((item) => item._id === id);
  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
