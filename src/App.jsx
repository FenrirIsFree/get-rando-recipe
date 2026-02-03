import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import FoodOptions from './components/FoodOptions';
import RecipeCard from './components/RecipeCard';
import MealPlanner from './components/MealPlanner';
import DayPicker from './components/DayPicker';
import ShoppingList from './components/ShoppingList';
import RecipeHistory from './components/RecipeHistory';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const fetchRecipes = async (restrictions) => {
  if (!API_KEY) {
    throw new Error('API key not configured. Please add VITE_SPOONACULAR_API_KEY to your .env file');
  }
  
  // Parse restrictions into API parameters
  const params = new URLSearchParams({
    apiKey: API_KEY,
    number: '24', // Fetch more to account for client-side filtering
    addRecipeInformation: 'true',
    fillIngredients: 'true',
    sort: 'random',
  });
  
  // Map our filter values to API parameters
  const dietFilters = [];
  const intoleranceFilters = [];
  let requireHealthy = false;
  let requireBudget = false;
  
  if (restrictions) {
    const tags = restrictions.split(',');
    tags.forEach((tag) => {
      switch (tag) {
        case 'vegetarian':
        case 'vegan':
        case 'pescetarian':
        case 'ketogenic':
        case 'paleolithic':
        case 'primal':
        case 'whole30':
        case 'lacto-vegetarian':
        case 'ovo-vegetarian':
          dietFilters.push(tag);
          break;
        case 'gluten-free':
          intoleranceFilters.push('gluten');
          break;
        case 'dairy-free':
          intoleranceFilters.push('dairy');
          break;
        case 'very-healthy':
          requireHealthy = true;
          break;
        case 'cheap':
          requireBudget = true;
          break;
        default:
          break;
      }
    });
  }
  
  if (dietFilters.length > 0) {
    params.set('diet', dietFilters.join(','));
  }
  if (intoleranceFilters.length > 0) {
    params.set('intolerances', intoleranceFilters.join(','));
  }
  
  const { data } = await axios.get(
    `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`
  );
  
  // Client-side filtering to ensure accuracy
  let recipes = data.results || [];
  
  // Filter: must have source URL
  recipes = recipes.filter((recipe) => recipe.sourceUrl);
  
  // Filter: Very Healthy (health score >= 75)
  if (requireHealthy) {
    recipes = recipes.filter((recipe) => recipe.healthScore >= 75);
  }
  
  // Filter: Budget Friendly (price per serving <= $3.00 = 300 cents)
  if (requireBudget) {
    recipes = recipes.filter((recipe) => recipe.pricePerServing <= 300);
  }
  
  return recipes.slice(0, 6);
};

// localStorage helpers
const getFromStorage = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Get dark mode preference
const getDarkMode = () => {
  const saved = localStorage.getItem('recipeApp_darkMode');
  if (saved !== null) return JSON.parse(saved);
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

function App() {
  const [restrictions, setRestrictions] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [favorites, setFavorites] = useState(() => getFromStorage('recipeApp_favorites', []));
  const [mealPlan, setMealPlan] = useState(() => getFromStorage('recipeApp_mealPlan', {}));
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(getDarkMode);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [recipeToAdd, setRecipeToAdd] = useState(null);
  const [showMealPlanner, setShowMealPlanner] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [recipeHistory, setRecipeHistory] = useState(() => getFromStorage('recipeApp_history', []));

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveToStorage('recipeApp_darkMode', darkMode);
  }, [darkMode]);

  // Save meal plan when it changes
  useEffect(() => {
    saveToStorage('recipeApp_mealPlan', mealPlan);
  }, [mealPlan]);

  // Save favorites when they change
  useEffect(() => {
    saveToStorage('recipeApp_favorites', favorites);
  }, [favorites]);

  // Save history when it changes
  useEffect(() => {
    saveToStorage('recipeApp_history', recipeHistory);
  }, [recipeHistory]);

  // Helper to add to history
  const addToHistory = (recipe, action) => {
    setRecipeHistory((prev) => {
      const now = Date.now();
      const existingIndex = prev.findIndex((entry) => entry.recipe.id === recipe.id);
      
      if (existingIndex !== -1) {
        // Update existing entry
        const existing = prev[existingIndex];
        const updatedEntry = {
          ...existing,
          actions: existing.actions.includes(action) 
            ? existing.actions 
            : [...existing.actions, action],
          timestamps: { ...existing.timestamps, [action]: now },
          lastActivity: now,
        };
        // Move to top
        const filtered = prev.filter((_, i) => i !== existingIndex);
        return [updatedEntry, ...filtered].slice(0, 100);
      }
      
      // Create new entry
      const entry = {
        recipe: {
          id: recipe.id,
          title: recipe.title,
          image: recipe.image,
          servings: recipe.servings,
          readyInMinutes: recipe.readyInMinutes,
        },
        actions: [action],
        timestamps: { [action]: now },
        lastActivity: now,
      };
      return [entry, ...prev].slice(0, 100);
    });
  };

  const clearHistory = () => {
    setRecipeHistory([]);
  };

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
    addToHistory(recipe, 'viewed');
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  const toggleFavorite = (recipe) => {
    const isFav = favorites.some((fav) => fav.id === recipe.id);
    if (isFav) {
      setFavorites(favorites.filter((fav) => fav.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
      addToHistory(recipe, 'favorited');
    }
  };

  const isFavorite = (recipe) => favorites.some((fav) => fav.id === recipe.id);

  // Meal planning functions
  const handleAddToMealPlan = (recipe) => {
    setRecipeToAdd(recipe);
    setShowDayPicker(true);
  };

  const handleSelectDay = (dateKey, servings) => {
    if (recipeToAdd) {
      // Check if recipe is already on this day
      const existingMeals = mealPlan[dateKey] || [];
      const alreadyAdded = existingMeals.some((meal) => meal.id === recipeToAdd.id);
      
      if (alreadyAdded) {
        alert('This recipe is already planned for this day!');
        return;
      }
      
      // Add recipe with planned servings
      const recipeWithServings = {
        ...recipeToAdd,
        plannedServings: servings,
        originalServings: recipeToAdd.servings || 1,
      };
      
      setMealPlan((prev) => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), recipeWithServings],
      }));
      addToHistory(recipeToAdd, 'planned');
      setShowDayPicker(false);
      setRecipeToAdd(null);
    }
  };

  const handleRemoveMeal = (dateKey, recipeId) => {
    setMealPlan((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((meal) => meal.id !== recipeId),
    }));
  };

  const getMealCount = () => {
    return Object.values(mealPlan).reduce((acc, meals) => acc + meals.length, 0);
  };

  const displayRecipes = showFavorites ? favorites : recipes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Day Picker Modal */}
      {showDayPicker && (
        <DayPicker
          onSelectDay={handleSelectDay}
          onClose={() => {
            setShowDayPicker(false);
            setRecipeToAdd(null);
          }}
          defaultServings={recipeToAdd?.servings || 2}
        />
      )}

      {/* Shopping List Modal */}
      {showShoppingList && (
        <ShoppingList
          mealPlan={mealPlan}
          onClose={() => setShowShoppingList(false)}
        />
      )}

      {/* Recipe History Modal */}
      {showHistory && (
        <RecipeHistory
          history={recipeHistory}
          onViewRecipe={(recipe) => {
            setShowHistory(false);
            handleRecipeClick(recipe);
          }}
          onClearHistory={clearHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center">
              🍳 Pick A Random Recipe
            </h1>
            <div className="flex-1 flex justify-end gap-2">
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 rounded-lg transition-colors duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Recipe history"
                title="Recipe History"
              >
                📜
              </button>
              <button
                onClick={() => setShowShoppingList(true)}
                className="p-2 rounded-lg transition-colors duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                aria-label="Shopping list"
                title="Shopping List"
              >
                🛒
              </button>
              <button
                onClick={() => setShowMealPlanner(!showMealPlanner)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  showMealPlanner
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label="Toggle meal planner"
              >
                📅 {getMealCount() > 0 && <span className="text-xs">({getMealCount()})</span>}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
            Discover new meals based on your dietary preferences
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Meal Planner Section */}
        {showMealPlanner && (
          <div className="mb-8">
            <MealPlanner
              mealPlan={mealPlan}
              onRemoveMeal={handleRemoveMeal}
              onViewRecipe={handleRecipeClick}
            />
          </div>
        )}

        {/* Search Form */}
        {!selectedRecipe && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Choose Recipe Restrictions
            </h2>
            <FoodOptions onRestrictionsChange={handleRestrictionsChange} isDark={darkMode} />
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 dark:disabled:bg-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
                  '🎲 Get Random Recipes'
                )}
              </button>
              
              {favorites.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                    showFavorites 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
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
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error.message}
          </div>
        )}

        {/* Recipe Detail View */}
        {selectedRecipe ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
            {selectedRecipe.image && (
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {selectedRecipe.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToMealPlan(selectedRecipe)}
                    className="text-2xl hover:scale-110 transition-transform"
                    title="Add to meal plan"
                  >
                    📅
                  </button>
                  <button
                    onClick={() => toggleFavorite(selectedRecipe)}
                    className="text-2xl hover:scale-110 transition-transform"
                    title={isFavorite(selectedRecipe) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite(selectedRecipe) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedRecipe.vegetarian && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">🥬 Vegetarian</span>
                )}
                {selectedRecipe.vegan && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">🌱 Vegan</span>
                )}
                {selectedRecipe.glutenFree && (
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full text-sm">🌾 Gluten-Free</span>
                )}
                {selectedRecipe.dairyFree && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm">🥛 Dairy-Free</span>
                )}
                {selectedRecipe.veryHealthy && (
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-sm">💪 Very Healthy</span>
                )}
                {selectedRecipe.cheap && (
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm">💰 Budget</span>
                )}
                {selectedRecipe.healthScore != null && (
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedRecipe.healthScore >= 75
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>💪 Health: {selectedRecipe.healthScore}/100</span>
                )}
                {selectedRecipe.pricePerServing != null && (
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedRecipe.pricePerServing <= 300
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>💵 ${(selectedRecipe.pricePerServing / 100).toFixed(2)}/serving</span>
                )}
                {selectedRecipe.readyInMinutes && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm">⏱️ {selectedRecipe.readyInMinutes} min</span>
                )}
                {selectedRecipe.servings && (
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-sm">🍽️ {selectedRecipe.servings} servings</span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Ingredients</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {selectedRecipe.extendedIngredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-orange-500">•</span>
                    {ingredient.original}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">Instructions</h3>
              <div 
                className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: selectedRecipe.instructions || '<p>No instructions available.</p>' 
                }}
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  ← Back to Results
                </button>
                <button
                  onClick={() => handleAddToMealPlan(selectedRecipe)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  📅 Add to Meal Plan
                </button>
                <a
                  href={selectedRecipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-center"
                >
                  View Original →
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* Recipe Grid */
          displayRecipes && displayRecipes.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                {showFavorites ? '❤️ Your Favorites' : '🍽️ Your Recipes'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onClick={() => handleRecipeClick(recipe)}
                    onToggleFavorite={() => toggleFavorite(recipe)}
                    onAddToMealPlan={() => handleAddToMealPlan(recipe)}
                    isFavorite={isFavorite(recipe)}
                  />
                ))}
              </div>
            </div>
          )
        )}

        {/* Empty State */}
        {!isLoading && !selectedRecipe && !displayRecipes?.length && !showFavorites && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-6xl mb-4">🍳</p>
            <p>Select your preferences and click the button to discover recipes!</p>
          </div>
        )}

        {showFavorites && favorites.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-6xl mb-4">💔</p>
            <p>No favorites yet. Click the heart on recipes you love!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
        Built with React & Spoonacular API
      </footer>
    </div>
  );
}

export default App;
