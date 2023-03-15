import React from 'react';
import PropTypes from 'prop-types';

const FoodShow = ({ recipes }) => (
  <div>
    {recipes.map((recipe) => (
      <div key={recipe.id}>
        <h3>{recipe.title}</h3>
      </div>
    ))}
  </div>
);

FoodShow.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FoodShow;
