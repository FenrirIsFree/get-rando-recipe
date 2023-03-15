import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FoodOptions from './foodOptions.js';
import { fetch5Recipes } from '../actions';

const Header = () => {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.recipes);
  const [restrictions, setRestrictions] = useState([]);

  const handleRestrictionsChange = (selectedOptions) => {
    setRestrictions(selectedOptions.map((option) => option.value).join(','));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(fetch5Recipes(restrictions));
  };

  return (
    <div>
      <div className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">Pick A Random Recipe</h1>
        </div>
        <form className="form-inline" onSubmit={handleSubmit}>
          <h4>Choose Recipe Restrictions</h4>
          <FoodOptions onRestrictionsChange={handleRestrictionsChange} />
          <button type="submit" className="btn btn-secondary">
            Get 5 Random Recipes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
