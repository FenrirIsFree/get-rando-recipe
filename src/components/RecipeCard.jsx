import React from 'react';

const RecipeCard = ({ recipe, onClick, onToggleFavorite, isFavorite }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
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
            className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors duration-200"
          >
            <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
          </button>
        </div>
      )}
      <div className="p-4" onClick={onClick}>
        <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
          {recipe.title}
        </h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.readyInMinutes && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              ⏱️ {recipe.readyInMinutes} min
            </span>
          )}
          {recipe.vegetarian && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
              🥬 Veg
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
