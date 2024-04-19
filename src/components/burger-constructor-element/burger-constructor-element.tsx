import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { removeIngredient } from '../Reducers/BurgerReducer/BurgerReducer';
import { useSelector, useDispatch } from 'react-redux';
import {
  moveIngredientUp,
  moveIngredientDown
} from '../Reducers/BurgerReducer/BurgerReducer';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveUp = () => {
      dispatch(moveIngredientUp(index));
    };

    const handleMoveDown = () => {
      dispatch(moveIngredientDown(index));
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
