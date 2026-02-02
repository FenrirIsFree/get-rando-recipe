import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import FoodOptions from './components/foodOptions';
import RecipeCard from './components/RecipeCard';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const fetchRecipes = async (restrictions) => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add VITE_SPOONACULAR_API_KEY to your .env file');
  }
  const { data } = await axios.get(
    `https://api.spoonacular.com/recipes/random?number=5&tags=${restrictions}&apiKey=${API_KEY}`
  );
  return data.recipes;
};

// Get favorites from localStorage
const getFavorites = () => {
  const saved = localStorage.getItem('recipeApp_favorites');
  return saved ? JSON.parse(saved) : [];
};

// Save favorites to localStorage
const saveFavorites = (favorites) => {
  localStorage.setItem('recipeApp_favorites', JSON.stringify(favorites));
};

function App() {
  const [restrictions, setRestrictions] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [favorites, setFavorites] = useState(getFavorites);
  const [showFavorites, setShowFavorites] = useState(false);

  const { data: recipes, isLoading, error, refetch } = useQuery({
    queryKey: ['recipes', restrictions],
    queryFn: () => fetchRecipes(restrictions),
    enabled: shouldFetch,
  });

  const handleRestrictionsChange = (selectedOptions) => {
    setRestrictions(selectedOptions?.map((option) => option.value).join(',') || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShouldFetch(true);
    setShowFavorites(false);
    if (shouldFetch) {
      refetch();
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  const toggleFavorite = (recipe) => {
    const isFavorite = favorites.some((fav) => fav.id === recipe.id);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== recipe.id);
    } else {
      newFavorites = [...favorites, recipe];
    }
    
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (recipe) => favorites.some((fav) => fav.id === recipe.id);

  const displayRecipes = showFavorites ? favorites : recipes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            🍳 Pick A Random Recipe
          </h1>
          <p className="text-gray-500 text-center mt-2">
            Discover new meals based on your dietary preferences
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Form */}
        {!selectedRecipe && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Choose Recipe Restrictions
            </h2>
            <FoodOptions onRestrictionsChange={handleRestrictionsChange} />
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  '🎲 Get 5 Random Recipes'
                )}
              </button>
              
              {favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    showFavorites 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ❤️ Favorites ({favorites.length})
                </button>
              )}
            </div>
          </form>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error.message}
          </div>
        )}

        {/* Recipe Detail View */}
        {selectedRecipe ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {selectedRecipe.image && (
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedRecipe.title}
                </h2>
                <button
                  onClick={() => toggleFavorite(selectedRecipe)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {isFavorite(selectedRecipe) ? '❤️' : '🤍'}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedRecipe.vegetarian && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">🥬 Vegetarian</span>
                )}
                {selectedRecipe.vegan && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">🌱 Vegan</span>
                )}
                {selectedRecipe.glutenFree && (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">🌾 Gluten-Free</span>
                )}
                {selectedRecipe.readyInMinutes && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">⏱️ {selectedRecipe.readyInMinutes} min</span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-3">Ingredients</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {selectedRecipe.extendedIngredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <span className="text-orange-500">•</span>
                    {ingredient.original}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-700 mb-3">Instructions</h3>
              <div 
                className="text-gray-600 prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: selectedRecipe.instructions || '<p>No instructions available.</p>' 
                }}
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  ← Back to Results
                </button>
                <a
                  href={selectedRecipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
                >
                  View Original Recipe →
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Recipe Grid */
          displayRecipes && displayRecipes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                {showFavorites ? '❤️ Your Favorites' : '🍽️ Your Recipes'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={() => handleRecipeClick(recipe)}
                    onToggleFavorite={() => toggleFavorite(recipe)}
                    isFavorite={isFavorite(recipe)}
                  />
                ))}
              </div>
            </div>
          )
        )}

        {/* Empty State */}
        {!isLoading && !selectedRecipe && !displayRecipes?.length && !showFavorites && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-6xl mb-4">🍳</p>
            <p>Select your preferences and click the button to discover recipes!</p>
          </div>
        )}

        {showFavorites && favorites.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-6xl mb-4">💔</p>
            <p>No favorites yet. Click the heart on recipes you love!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm">
        Built with React & Spoonacular API
      </footer>
    </div>
  );
}

export default App;
