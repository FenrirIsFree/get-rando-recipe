import React from 'react';
import PropTypes from 'prop-types';

const RecipeCard = ({ recipe, onClick, onToggleFavorite, isFavorite, isDark }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      {recipe.image && (
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
            onClick={onClick}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 p-2 rounded-full transition-colors duration-200"
          >
            <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
          </button>
        </div>
      )}
      <div className="p-4" onClick={onClick}>
        <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
          {recipe.title}
        </h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.readyInMinutes && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
              ⏱️ {recipe.readyInMinutes} min
            </span>
          )}
          {recipe.vegetarian && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
              🥬 Veg
            </span>
          )}
          {recipe.vegan && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
              🌱 Vegan
            </span>
          )}
          {recipe.glutenFree && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">
              🌾 GF
            </span>
          )}
          {recipe.dairyFree && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
              🥛 DF
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
  isDark: PropTypes.bool,
};

export default RecipeCard;
