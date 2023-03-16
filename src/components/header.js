import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import FoodOptions from './foodOptions.js';
import FoodShow from './foodShow.js';
import { fetch5Recipes } from '../actions';

const Header = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.recipes);
  const [restrictions, setRestrictions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showButton, setShowButton] = useState(true);

  const handleRestrictionsChange = (selectedOptions) => {
    setRestrictions(selectedOptions.map((option) => option.value).join(','));
  };

  const handleSubmit = (event) => {
    console.log('I am CLICKD');
    event.preventDefault();
    dispatch(fetch5Recipes(restrictions));
  };

  const handleTitleClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowButton(false);
  };

  const handleReset = () => {
    setSelectedRecipe(null);
    setShowButton(true);
  };

  const handleGoBack = () => {
    setShowButton(true);
  };

  return (
    <div>
      <div className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Pick A Random Recipe</h1>
        </div>
      </div>
      <form className="form-inline" onSubmit={handleSubmit}>
        <h4>Choose Recipe Restrictions</h4>
        <FoodOptions onRestrictionsChange={handleRestrictionsChange} />
        {showButton && (
          <button type="submit" className="btn btn-secondary">
            Get 5 Random Recipes
          </button>
        )}
      </form>
      {!selectedRecipe ? (
        <FoodShow
          recipes={recipes}
          onTitleClick={handleTitleClick}
          onGoBack={handleGoBack}
        />
      ) : (
        <div>
          <h2>{selectedRecipe.title}</h2>
          <ul>
            {selectedRecipe.extendedIngredients.map((ingredient) => {
              const uniqueKey = uuidv4();
              return <li key={uniqueKey}>{ingredient.original}</li>;
            })}
          </ul>
          <div>{selectedRecipe.instructions}</div>
          <a
            href={selectedRecipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Recipe Source
          </a>
          <button type="button" onClick={handleReset}>
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
