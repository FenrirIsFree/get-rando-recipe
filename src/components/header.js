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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRestrictionsChange = (selectedOptions) => {
    setRestrictions(selectedOptions.map((option) => option.value).join(','));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await dispatch(fetch5Recipes(restrictions));
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      console.error('Recipe fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowButton(false);
  };

  const handleReset = () => {
    setSelectedRecipe(null);
    setShowButton(true);
  };

  const cleanInstructions = (html) => {
    if (!html) return 'No instructions available.';
    return html.replace(/<\/?ol>|<\/?li>/g, '');
  };

  return (
    <div>
      <div className="jumbotron text-center bg-light py-4 mb-4">
        <div className="container">
          <h1 className="jumbotron-heading">🍳 Pick A Random Recipe</h1>
          <p className="text-muted">Discover new meals based on your dietary preferences</p>
        </div>
      </div>

      <form className="form-inline container mb-4" onSubmit={handleSubmit}>
        <h4>Choose Recipe Restrictions</h4>
        <FoodOptions onRestrictionsChange={handleRestrictionsChange} />
        
        {showButton && (
          <div className="container mt-3">
            <div className="row justify-content-md-center">
              <div className="col-auto">
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading...
                    </>
                  ) : (
                    'Get 5 Random Recipes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {error && (
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      {!selectedRecipe ? (
        <FoodShow recipes={recipes} onTitleClick={handleTitleClick} />
      ) : (
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">{selectedRecipe.title}</h2>
                  
                  <h5 className="mt-4">Ingredients</h5>
                  <ul className="list-group list-group-flush mb-4">
                    {selectedRecipe.extendedIngredients?.map((ingredient) => {
                      const uniqueKey = uuidv4();
                      return (
                        <li key={uniqueKey} className="list-group-item">
                          {ingredient.original}
                        </li>
                      );
                    })}
                  </ul>
                  
                  <h5>Instructions</h5>
                  <p>{cleanInstructions(selectedRecipe.instructions)}</p>
                  
                  <div className="d-flex gap-2 mt-4">
                    <a
                      href={selectedRecipe.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary"
                    >
                      View Original Recipe
                    </a>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleReset}
                    >
                      ← Back to Results
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
