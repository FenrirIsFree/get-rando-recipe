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
    <div>
      {recipes.map((recipe) => {
        const uniqueKey = uuidv4();
        return (
          <div key={uniqueKey}>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              onClick={() => onTitleClick(recipe)}
              onKeyDown={(event) => handleKeyDown(event, recipe)}
            >
              <h3>{recipe.title}</h3>
            </button>
          </div>
        );
      })}
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
