import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

const FoodShow = ({ recipes, onTitleClick }) => {
  const handleKeyDown = (event, recipe) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onTitleClick(recipe);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col title-view">
          {recipes.map((recipe) => {
            const uniqueKey = uuidv4();
            return (
              <div key={uniqueKey}>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => onTitleClick(recipe)}
                  onKeyDown={(event) => handleKeyDown(event, recipe)}
                >
                  <h3>{recipe.title}</h3>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

FoodShow.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  onTitleClick: PropTypes.func.isRequired,
};

export default FoodShow;
