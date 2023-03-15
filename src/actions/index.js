import axios from 'axios';

export const FETCH_5RECIPES = 'FETCH_5RECIPES';

const API_KEY = '5b779ee665774b02bd67a479f75f6780';

export function fetch5Recipes(restrictions) {
  const request = axios.get(
    `https://api.spoonacular.com/recipes/random?number=5&tags=${restrictions}&apiKey=${API_KEY}`
  );

  return {
    type: FETCH_5RECIPES,
    payload: request,
  };
}
