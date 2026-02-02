import axios from 'axios';

export const FETCH_5RECIPES = 'FETCH_5RECIPES';

const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

export function fetch5Recipes(restrictions) {
  if (!API_KEY) {
    console.error('Missing REACT_APP_SPOONACULAR_API_KEY in environment variables');
    return {
      type: FETCH_5RECIPES,
      payload: Promise.reject(new Error('API key not configured')),
    };
  }

  const request = axios.get(
    `https://api.spoonacular.com/recipes/random?number=5&tags=${restrictions}&apiKey=${API_KEY}`
  );

  return {
    type: FETCH_5RECIPES,
    payload: request,
  };
}
