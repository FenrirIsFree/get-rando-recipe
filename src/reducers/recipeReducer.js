import { FETCH_5RECIPES } from '../actions';

const initialState = {
  recipes: [],
};

// eslint-disable-next-line default-param-last
const recipeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_5RECIPES:
      return {
        ...state,
        recipes: action.payload.data.recipes,
      };
    default:
      return state;
  }
};

export default recipeReducer;
