import { combineReducers } from 'redux';
import recipeReducer from './recipeReducer';

const rootReducer = combineReducers({
  recipes: recipeReducer,
});

export default rootReducer;
